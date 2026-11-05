import "server-only";
import fs from "node:fs";
import path from "node:path";

export type Clan = {
  id: string;
  ime: string;
  broj: number | null; // broj kape
  pozicija: string; // npr. Golman, Centar, Krilo, Glavni trener
  grupa: "igraci" | "strucni-stab";
  slika: string | null;
};

export const GRUPE: Record<Clan["grupa"], string> = { igraci: "Igrači", "strucni-stab": "Stručni štab" };
export const POZICIJE = ["Golman", "Centar", "Bek", "Krilo", "Spoljni", "Univerzalac", "Glavni trener", "Pomoćni trener", "Kondicioni trener", "Fizioterapeut"];

export function parsirajEkipu(json: string): Clan[] {
  try {
    return (JSON.parse(json).igraci ?? []) as Clan[];
  } catch {
    return [];
  }
}

export function sortiraj(clanovi: Clan[]) {
  return [...clanovi].sort((a, b) => (a.broj ?? 999) - (b.broj ?? 999) || a.ime.localeCompare(b.ime, "sr"));
}

export function ucitajEkipu(): Clan[] {
  return sortiraj(parsirajEkipu(fs.readFileSync(path.join(process.cwd(), "data", "igraci.json"), "utf8")));
}
