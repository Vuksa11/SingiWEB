import "server-only";
import fs from "node:fs";
import path from "node:path";

// Slobodne stranice (npr. Mlađe kategorije) — Markdown u content/stranice/.
export type Stranica = { naslov: string; uvod: string; slika: string | null; telo: string };

export function parsirajStranicu(sirovo: string): Stranica {
  const m = sirovo.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  if (m) for (const l of m[1].split(/\r?\n/)) { const i = l.indexOf(":"); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }
  return { naslov: meta.naslov ?? "", uvod: meta.uvod ?? "", slika: meta.slika || null, telo: m ? m[2] : sirovo };
}

export function napraviStranicu(s: Stranica) {
  const red = (x: string) => x.replace(/[\r\n]+/g, " ").trim();
  return ["---", `naslov: ${red(s.naslov)}`, `uvod: ${red(s.uvod)}`, ...(s.slika ? [`slika: ${red(s.slika)}`] : []), "---", "", s.telo.trim(), ""].join("\n");
}

export function ucitajStranicu(ime: string): Stranica | null {
  const f = path.join(process.cwd(), "content", "stranice", `${ime}.md`);
  return fs.existsSync(f) ? parsirajStranicu(fs.readFileSync(f, "utf8")) : null;
}
