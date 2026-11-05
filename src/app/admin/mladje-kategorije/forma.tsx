"use client";

import { useActionState, useState } from "react";
import { markdownUBlokove, type Blok } from "@/lib/blokovi";
import BlokEditor from "@/components/admin/blok-editor";
import IzborSlike from "@/components/admin/izbor-slike";
import { oznaka, polje, dugmeGlavno } from "@/components/admin/ui";
import { sacuvajStranicuAkcija } from "./akcije";

type Pocetno = { naslov: string; uvod: string; slika: string | null; telo: string };

export default function FormaStranice({ pocetno }: { pocetno: Pocetno }) {
  const [stanje, akcija, uToku] = useActionState(sacuvajStranicuAkcija, undefined);
  const [naslovna, setNaslovna] = useState(pocetno.slika ?? "");
  const [blokovi, setBlokovi] = useState<Blok[]>(() => markdownUBlokove(pocetno.telo));

  return (
    <form action={akcija} className="mt-8 grid gap-7">
      <input type="hidden" name="naslovna" value={naslovna} />
      <input type="hidden" name="blokovi" value={JSON.stringify(blokovi)} />
      <label className="grid gap-1.5">
        <span className={oznaka}>Naslov stranice</span>
        <input name="naslov" defaultValue={pocetno.naslov || "Mlađe kategorije"} className={`${polje} text-[18px] font-semibold`} />
      </label>
      <label className="grid gap-1.5">
        <span className={oznaka}>Uvod <span className="normal-case tracking-normal text-navy-800/40">(rečenica ispod naslova)</span></span>
        <input name="uvod" defaultValue={pocetno.uvod} className={polje} placeholder="npr. Škola vaterpola i takmičarske ekipe od 8 do 18 godina." />
      </label>
      <div className="grid gap-1.5">
        <span className={oznaka}>Velika slika na vrhu <span className="normal-case tracking-normal text-navy-800/40">(nije obavezna)</span></span>
        <IzborSlike vrednost={naslovna} promena={setNaslovna} maxStrana={1800} odnos="aspect-[21/9]" />
      </div>
      <div className="grid gap-1.5">
        <span className={oznaka}>Sadržaj stranice</span>
        <BlokEditor blokovi={blokovi} promena={setBlokovi} />
      </div>
      {stanje?.greska && <p className="rounded-[8px] bg-red-600/10 px-4 py-3 text-[15px] font-semibold text-red-600">{stanje.greska}</p>}
      <div><button disabled={uToku} className={dugmeGlavno}>{uToku ? "Čuvam…" : "Sačuvaj stranicu"}</button></div>
    </form>
  );
}
