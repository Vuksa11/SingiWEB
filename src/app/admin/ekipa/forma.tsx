"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Clan } from "@/lib/ekipa";
import IzborSlike from "@/components/admin/izbor-slike";
import { oznaka, polje, dugmeGlavno } from "@/components/admin/ui";
import { sacuvajClanaAkcija } from "./akcije";

export default function FormaClana({ pocetni, grupa, pozicije }: { pocetni?: Clan; grupa: Clan["grupa"]; pozicije: string[] }) {
  const [stanje, akcija, uToku] = useActionState(sacuvajClanaAkcija, undefined);
  const [slika, setSlika] = useState(pocetni?.slika ?? "");
  const [g, setG] = useState<Clan["grupa"]>(pocetni?.grupa ?? grupa);

  return (
    <form action={akcija} className="mt-8 grid gap-8 sm:grid-cols-[260px_1fr]">
      <input type="hidden" name="id" value={pocetni?.id ?? ""} />
      <input type="hidden" name="slika" value={slika} />
      <input type="hidden" name="grupa" value={g} />

      <div className="grid content-start gap-1.5">
        <span className={oznaka}>Slika</span>
        <IzborSlike vrednost={slika} promena={setSlika} maxStrana={1000} odnos="aspect-[4/5]" tekst="Dodaj sliku" />
        <span className="text-[13px] text-navy-800/45">Najbolje uspravna slika, lice u gornjem delu.</span>
      </div>

      <div className="grid content-start gap-6">
        <div className="grid gap-1.5">
          <span className={oznaka}>Grupa</span>
          <div className="flex gap-2">
            {([["igraci", "Igrač"], ["strucni-stab", "Stručni štab"]] as const).map(([v, t]) => (
              <button key={v} type="button" onClick={() => setG(v)}
                className={`rounded-[8px] px-4 py-2.5 font-cond text-[15px] font-bold uppercase tracking-[.12em] ${g === v ? "bg-navy-800 text-white" : "bg-white text-navy-800/60 ring-1 ring-navy-800/15"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <label className="grid gap-1.5">
          <span className={oznaka}>Ime i prezime</span>
          <input name="ime" required defaultValue={pocetni?.ime} className={`${polje} text-[18px] font-semibold`} placeholder="npr. Marko Marković" />
        </label>
        <div className="grid gap-6 sm:grid-cols-[140px_1fr]">
          {g === "igraci" ? (
            <label className="grid gap-1.5">
              <span className={oznaka}>Broj kape</span>
              <input name="broj" type="number" min={1} max={99} defaultValue={pocetni?.broj ?? ""} className={polje} placeholder="npr. 7" />
            </label>
          ) : <input type="hidden" name="broj" value="" />}
          <label className="grid gap-1.5">
            <span className={oznaka}>{g === "igraci" ? "Pozicija" : "Uloga"}</span>
            <input name="pozicija" list="pozicije" defaultValue={pocetni?.pozicija} className={polje} placeholder={g === "igraci" ? "npr. Golman" : "npr. Glavni trener"} />
            <datalist id="pozicije">{pozicije.map((p) => <option key={p} value={p} />)}</datalist>
          </label>
        </div>

        {stanje?.greska && <p className="rounded-[8px] bg-red-600/10 px-4 py-3 text-[15px] font-semibold text-red-600">{stanje.greska}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={uToku} className={dugmeGlavno}>{uToku ? "Čuvam…" : "Sačuvaj"}</button>
          <Link href="/admin/ekipa" className="px-3 font-cond text-[15px] font-bold uppercase tracking-[.16em] text-navy-800/50 hover:text-navy-800">Otkaži</Link>
        </div>
      </div>
    </form>
  );
}
