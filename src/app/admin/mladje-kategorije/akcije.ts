"use server";

import { redirect } from "next/navigation";
import { zahtevajAdmina } from "@/lib/admin-auth";
import { napraviCommit, procitajFajl, type Promena } from "@/lib/github";
import { parsirajStranicu, napraviStranicu } from "@/lib/stranice";
import { blokoviUMarkdown, type Blok } from "@/lib/blokovi";
import { jeNovaSlika, slikaUFajl, sacuvajSlikeIzBlokova, obrisaneSlike, slikeUMarkdownu } from "@/lib/slike-server";
import type { Stanje } from "../akcije";

const FAJL = "content/stranice/mladje-kategorije.md";

export async function sacuvajStranicuAkcija(_: Stanje, fd: FormData): Promise<Stanje> {
  await zahtevajAdmina();
  const naslov = String(fd.get("naslov") ?? "").trim() || "Mlađe kategorije";
  const uvod = String(fd.get("uvod") ?? "").trim();
  const naslovna = String(fd.get("naslovna") ?? "");
  let blokovi: Blok[];
  try {
    blokovi = JSON.parse(String(fd.get("blokovi") ?? "[]"));
  } catch {
    return { greska: "Sadržaj nije ispravan." };
  }

  try {
    const promene: Promena[] = [];
    let slika: string | null = naslovna || null;
    if (jeNovaSlika(naslovna)) {
      const r = slikaUFajl(naslovna, "mladje-kategorije", "naslovna");
      slika = r.url;
      promene.push(r.promena);
    }
    const sacuvano = sacuvajSlikeIzBlokova(blokovi, "mladje-kategorije", "slika");
    promene.push(...sacuvano.promene);
    const telo = blokoviUMarkdown(sacuvano.blokovi);

    const staro = await procitajFajl(FAJL);
    if (staro) {
      const s = parsirajStranicu(staro);
      promene.push(...obrisaneSlike([...(s.slika ? [s.slika] : []), ...slikeUMarkdownu(s.telo)], [...(slika ? [slika] : []), ...slikeUMarkdownu(telo)]));
    }
    promene.push({ putanja: FAJL, sadrzajBase64: Buffer.from(napraviStranicu({ naslov, uvod, slika, telo }), "utf8").toString("base64") });
    await napraviCommit("Izmena stranice: Mlađe kategorije", promene);
  } catch (e) {
    console.error("[admin] mlađe kategorije:", e);
    return { greska: "Čuvanje nije uspelo. Ako si dodao mnogo slika odjednom, sačuvaj ih u dva puta." };
  }
  redirect("/admin/mladje-kategorije?sacuvano=1");
}
