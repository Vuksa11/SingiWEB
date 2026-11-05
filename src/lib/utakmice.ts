import "server-only";
import podaci from "../../data/utakmice.json";
import { KLUB } from "./klub";

// data/utakmice.json puni scripts/osvezi-podatke.mjs (GitHub Action, vikendom).
export type Utakmica = {
  kolo: number;
  datum: string; // ISO sa zonom
  domacin: string;
  gost: string;
  grad: string;
  rezultat: string | null;
  link: string | null;
};

export function sveUtakmice(): Utakmica[] {
  return [...(podaci.utakmice as Utakmica[])].sort((a, b) => a.datum.localeCompare(b.datum));
}

export const kodKuce = (u: Utakmica) => u.domacin === KLUB.ime;
export const mesto = (u: Utakmica) => (kodKuce(u) ? KLUB.bazen : u.grad);

/** Prva neodigrana od danas (uključujući danas). */
export function sledecaUtakmica(sada = new Date()): Utakmica | null {
  const danas = danUBeogradu(sada);
  return sveUtakmice().find((u) => !u.rezultat && danUBeogradu(new Date(u.datum)) >= danas) ?? null;
}

export function poslednjiRezultat(): Utakmica | null {
  return sveUtakmice().filter((u) => u.rezultat).at(-1) ?? null;
}

// Vercel radi u UTC-u, pa sve formatiramo eksplicitno za Beograd.
const ZONA = "Europe/Belgrade";
function delovi(d: Date) {
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: ZONA, weekday: "short", day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return Object.fromEntries(f.formatToParts(d).map((p) => [p.type, p.value]));
}
function danUBeogradu(d: Date) {
  const p = delovi(d);
  return `${p.year}-${p.month.padStart(2, "0")}-${p.day.padStart(2, "0")}`;
}

const DANI: Record<string, string> = { Mon: "Ponedeljak", Tue: "Utorak", Wed: "Sreda", Thu: "Četvrtak", Fri: "Petak", Sat: "Subota", Sun: "Nedelja" };
export function formatTermin(iso: string) {
  const p = delovi(new Date(iso));
  const vreme = `${p.hour}:${p.minute}`;
  return {
    dan: DANI[p.weekday],
    datum: `${Number(p.day)}.${Number(p.month)}.`,
    vreme: vreme === "00:00" ? null : vreme, // 00:00 = satnica još nije objavljena
  };
}
