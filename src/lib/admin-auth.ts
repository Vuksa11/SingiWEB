import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Prijava za admin panel: jedna lozinka (ADMIN_LOZINKA) za urednika vesti.
// Kolačić sadrži rok važenja potpisan sa ADMIN_TAJNA (HMAC), pa se ne može lažirati.
const KOLACIC = "singi_admin";
const TRAJANJE_S = 60 * 60 * 24 * 30; // 30 dana

function tajna() {
  const t = process.env.ADMIN_TAJNA;
  if (!t || t.length < 32) throw new Error("ADMIN_TAJNA nije podešena (min. 32 znaka)");
  return t;
}

const potpis = (s: string) => crypto.createHmac("sha256", tajna()).update(s).digest("hex");

function jednako(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function adminPodesen() {
  return Boolean(process.env.ADMIN_LOZINKA && process.env.ADMIN_TAJNA && process.env.GITHUB_TOKEN);
}

export function proveriLozinku(unos: string) {
  const prava = process.env.ADMIN_LOZINKA;
  return Boolean(prava) && jednako(unos, prava!);
}

export async function prijavi() {
  const istice = Math.floor(Date.now() / 1000) + TRAJANJE_S;
  const vrednost = `${istice}.${potpis(String(istice))}`;
  (await cookies()).set(KOLACIC, vrednost, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TRAJANJE_S,
  });
}

export async function odjavi() {
  (await cookies()).delete(KOLACIC);
}

export async function jePrijavljen() {
  const v = (await cookies()).get(KOLACIC)?.value;
  if (!v) return false;
  const [istice, sig] = v.split(".");
  if (!istice || !sig || Number(istice) < Date.now() / 1000) return false;
  try {
    return jednako(sig, potpis(istice));
  } catch {
    return false;
  }
}

/** Za stranice i akcije admina: ako nije prijavljen, šalje na prijavu. */
export async function zahtevajAdmina() {
  if (!(await jePrijavljen())) redirect("/admin/prijava");
}
