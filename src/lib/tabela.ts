import "server-only";
import podaci from "../../data/tabela.json";
import { TAKMICENJE } from "./klub";

// data/tabela.json puni scripts/osvezi-podatke.mjs (GitHub Action, sredom i vikendom).
export type RedTabele = {
  poz: number; tim: string; grad: string;
  ut: number; pob: number; pbp: number; prp: number; por: number;
  dg: number; pg: number; gr: number; bod: number;
};
export type Tabela = { redovi: RedTabele[]; azurirano: string };

export function ucitajTabelu(): Tabela {
  return { redovi: podaci.redovi as RedTabele[], azurirano: podaci.azurirano };
}

export function jeNasKlub(tim: string) {
  return tim.toLowerCase() === TAKMICENJE.nazivUTabeli.toLowerCase();
}
