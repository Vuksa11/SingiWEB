import "server-only";
import fs from "node:fs";
import path from "node:path";
import { uHtml } from "./markdown";
export { KATEGORIJE } from "./markdown";

// Vesti su Markdown fajlovi u content/vesti/. Nova vest = novi .md fajl
// (može i direktno preko GitHub web editora) → Vercel sam objavi posle commita.
//
// Zaglavlje fajla:
// ---
// naslov: Singidunum savladao ...
// datum: 2026-11-01
// kategorija: Prvi tim
// slika: /vesti/naziv-slike.jpg      (opciono, fajl ide u public/vesti/)
// sazetak: Jedna rečenica za karticu.
// ---

export type Vest = {
  slug: string;
  naslov: string;
  datum: string;
  kategorija: string;
  slika: string | null;
  sazetak: string;
  telo: string; // markdown
};

const FOLDER = path.join(process.cwd(), "content", "vesti");

export function parsiraj(slug: string, sirovo: string): Vest {
  const m = sirovo.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  if (m) {
    for (const linija of m[1].split(/\r?\n/)) {
      const i = linija.indexOf(":");
      if (i > 0) meta[linija.slice(0, i).trim()] = linija.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return {
    slug,
    naslov: meta.naslov ?? slug,
    datum: meta.datum ?? "1970-01-01",
    kategorija: meta.kategorija ?? "Klub",
    slika: meta.slika || null,
    sazetak: meta.sazetak ?? "",
    telo: m ? m[2] : sirovo,
  };
}

export function sveVesti(): Vest[] {
  if (!fs.existsSync(FOLDER)) return [];
  return fs
    .readdirSync(FOLDER)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parsiraj(f.replace(/\.md$/, ""), fs.readFileSync(path.join(FOLDER, f), "utf8")))
    .sort((a, b) => b.datum.localeCompare(a.datum));
}

export function jednaVest(slug: string): (Vest & { html: string }) | null {
  const fajl = path.join(FOLDER, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(fajl)) return null;
  const v = parsiraj(slug, fs.readFileSync(fajl, "utf8"));
  return { ...v, html: uHtml(v.telo) };
}

/** Pravi sadržaj .md fajla iz polja forme (sve u jednom redu, bez prelamanja zaglavlja). */
export function napraviMarkdown(v: Omit<Vest, "slug">) {
  const red = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
  return [
    "---",
    `naslov: ${red(v.naslov)}`,
    `datum: ${red(v.datum)}`,
    `kategorija: ${red(v.kategorija)}`,
    ...(v.slika ? [`slika: ${red(v.slika)}`] : []),
    `sazetak: ${red(v.sazetak)}`,
    "---",
    "",
    v.telo.replace(/\r\n/g, "\n").trim(),
    "",
  ].join("\n");
}

/** "Singidunum savladao Bečej!" → "singidunum-savladao-becej" */
export function napraviSlug(naslov: string) {
  const mapa: Record<string, string> = { č: "c", ć: "c", š: "s", đ: "dj", ž: "z", Č: "c", Ć: "c", Š: "s", Đ: "dj", Ž: "z" };
  return naslov
    .replace(/[čćšđžČĆŠĐŽ]/g, (z) => mapa[z])
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "vest";
}


const MESECI = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
export function formatDatum(iso: string) {
  const [g, m, d] = iso.split("-").map(Number);
  return `${d}. ${MESECI[m - 1]} ${g}.`;
}
