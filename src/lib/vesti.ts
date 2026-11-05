import "server-only";
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

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

function parsiraj(slug: string, sirovo: string): Vest {
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
  return { ...v, html: marked.parse(v.telo, { async: false }) as string };
}

const MESECI = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
export function formatDatum(iso: string) {
  const [g, m, d] = iso.split("-").map(Number);
  return `${d}. ${MESECI[m - 1]} ${g}.`;
}
