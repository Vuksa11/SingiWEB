"use client";

import { useRef, useState } from "react";
import { usePrikazSlike } from "./raw-baza";

/** Smanjuje sliku u pregledaču (telefon pošalje i 10 MB) i vraća JPEG data URL. */
export async function smanjiSliku(fajl: File, maxStrana = 1400, kvalitet = 0.8): Promise<string> {
  const bitmapa = await createImageBitmap(fajl);
  const faktor = Math.min(1, maxStrana / Math.max(bitmapa.width, bitmapa.height));
  const platno = document.createElement("canvas");
  platno.width = Math.round(bitmapa.width * faktor);
  platno.height = Math.round(bitmapa.height * faktor);
  platno.getContext("2d")!.drawImage(bitmapa, 0, 0, platno.width, platno.height);
  return platno.toDataURL("image/jpeg", kvalitet);
}

/**
 * Polje za sliku: klik ili prevlačenje fajla. Prikazuje sliku, dugmad "Promeni" i "Ukloni".
 * vrednost = postojeća putanja (/slike/...) ili nova slika (data:...), "" = bez slike.
 */
export default function IzborSlike({
  vrednost,
  promena,
  maxStrana = 1400,
  odnos = "aspect-[16/9]",
  tekst = "Klikni ili prevuci sliku ovde",
}: {
  vrednost: string;
  promena: (v: string) => void;
  maxStrana?: number;
  odnos?: string;
  tekst?: string;
}) {
  const ulaz = useRef<HTMLInputElement>(null);
  const [radi, setRadi] = useState(false);
  const [greska, setGreska] = useState("");
  const [prevlaci, setPrevlaci] = useState(false);
  const prikaz = usePrikazSlike();

  async function obradi(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setGreska("To nije slika.");
    setGreska("");
    setRadi(true);
    try {
      promena(await smanjiSliku(f, maxStrana));
    } catch {
      setGreska("Ova slika ne može da se učita. Probaj JPG ili PNG.");
    } finally {
      setRadi(false);
    }
  }

  return (
    <div>
      <input ref={ulaz} type="file" accept="image/*" className="hidden" onChange={(e) => { obradi(e.target.files?.[0]); e.target.value = ""; }} />
      {vrednost ? (
        <div className={`group relative overflow-hidden rounded-[10px] bg-navy-800 ${odnos}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={prikaz(vrednost)} alt="" className="h-full w-full object-cover" />
          <div className="absolute right-2 top-2 flex gap-1.5">
            <button type="button" onClick={() => ulaz.current?.click()} className="rounded-[6px] bg-white px-3 py-1.5 font-cond text-[13px] font-bold uppercase tracking-[.1em] text-navy-800 shadow">Promeni</button>
            <button type="button" onClick={() => promena("")} className="rounded-[6px] bg-white px-3 py-1.5 font-cond text-[13px] font-bold uppercase tracking-[.1em] text-red-600 shadow">Ukloni</button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ulaz.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setPrevlaci(true); }}
          onDragLeave={() => setPrevlaci(false)}
          onDrop={(e) => { e.preventDefault(); setPrevlaci(false); obradi(e.dataTransfer.files?.[0]); }}
          className={`grid w-full place-items-center rounded-[10px] border-2 border-dashed ${odnos} ${prevlaci ? "border-red-600 bg-red-600/5" : "border-navy-800/20 bg-white hover:border-navy-800/40"}`}
        >
          <span className="grid place-items-center gap-2 p-4 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-[26px] leading-none text-white">+</span>
            <span className="font-cond text-[15px] font-bold uppercase tracking-[.12em] text-navy-800/60">{radi ? "Učitavam…" : tekst}</span>
          </span>
        </button>
      )}
      {greska && <p className="mt-1.5 text-[14px] text-red-600">{greska}</p>}
    </div>
  );
}
