"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Vest } from "@/lib/vesti";
import { KATEGORIJE } from "@/lib/markdown";
import { markdownUBlokove, type Blok } from "@/lib/blokovi";
import BlokEditor from "@/components/admin/blok-editor";
import IzborSlike from "@/components/admin/izbor-slike";
import { oznaka, polje, dugmeGlavno } from "@/components/admin/ui";
import { sacuvajVestAkcija } from "./akcije";

const danas = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Belgrade" });

export default function FormaVesti({ pocetna }: { pocetna?: Vest }) {
  const [stanje, akcija, uToku] = useActionState(sacuvajVestAkcija, undefined);
  const [naslovna, setNaslovna] = useState(pocetna?.slika ?? "");
  const [blokovi, setBlokovi] = useState<Blok[]>(() => (pocetna ? markdownUBlokove(pocetna.telo) : [{ tip: "tekst", tekst: "" }]));

  return (
    <form action={akcija} className="mt-8 grid gap-7">
      <input type="hidden" name="slug" value={pocetna?.slug ?? ""} />
      <input type="hidden" name="naslovna" value={naslovna} />
      <input type="hidden" name="blokovi" value={JSON.stringify(blokovi)} />

      <label className="grid gap-1.5">
        <span className={oznaka}>Naslov</span>
        <input name="naslov" required minLength={5} defaultValue={pocetna?.naslov} className={`${polje} text-[18px] font-semibold`} placeholder="npr. Singidunum savladao Taš na Tašmajdanu" />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className={oznaka}>Datum</span>
          <input name="datum" type="date" required defaultValue={pocetna?.datum ?? danas()} className={polje} />
        </label>
        <label className="grid gap-1.5">
          <span className={oznaka}>Kategorija</span>
          <select name="kategorija" defaultValue={pocetna?.kategorija ?? KATEGORIJE[0]} className={polje}>
            {[...new Set([...KATEGORIJE, ...(pocetna ? [pocetna.kategorija] : [])])].map((k) => <option key={k}>{k}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-1.5">
        <span className={oznaka}>Naslovna slika <span className="normal-case tracking-normal text-navy-800/40">(nije obavezna)</span></span>
        <div className="max-w-[560px]"><IzborSlike vrednost={naslovna} promena={setNaslovna} /></div>
      </div>

      <label className="grid gap-1.5">
        <span className={oznaka}>Kratak opis <span className="normal-case tracking-normal text-navy-800/40">(vidi se na kartici vesti)</span></span>
        <input name="sazetak" maxLength={220} defaultValue={pocetna?.sazetak} className={polje} placeholder="Jedna rečenica o čemu je vest." />
      </label>

      <div className="grid gap-1.5">
        <span className={oznaka}>Tekst vesti</span>
        <BlokEditor blokovi={blokovi} promena={setBlokovi} />
      </div>

      {stanje?.greska && <p className="rounded-[8px] bg-red-600/10 px-4 py-3 text-[15px] font-semibold text-red-600">{stanje.greska}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={uToku} className={dugmeGlavno}>{uToku ? "Objavljujem…" : pocetna ? "Sačuvaj izmene" : "Objavi vest"}</button>
        <Link href="/admin/vesti" className="px-3 font-cond text-[15px] font-bold uppercase tracking-[.16em] text-navy-800/50 hover:text-navy-800">Otkaži</Link>
      </div>
    </form>
  );
}
