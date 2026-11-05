"use client";

import { useRef, useState } from "react";
import type { Blok } from "@/lib/blokovi";
import IzborSlike from "./izbor-slike";

const NOVI: Record<Blok["tip"], () => Blok> = {
  tekst: () => ({ tip: "tekst", tekst: "" }),
  podnaslov: () => ({ tip: "podnaslov", tekst: "" }),
  slika: () => ({ tip: "slika", url: "", opis: "" }),
};

/** "+" dugme koje otvara izbor: Tekst / Podnaslov / Slika. */
function Plus({ dodaj, istaknut = false }: { dodaj: (t: Blok["tip"]) => void; istaknut?: boolean }) {
  const [otvoren, setOtvoren] = useState(false);
  const izbor = (t: Blok["tip"]) => { dodaj(t); setOtvoren(false); };
  const opcija = "rounded-[7px] bg-white px-4 py-2.5 font-cond text-[14px] font-bold uppercase tracking-[.12em] text-navy-800 shadow-sm ring-1 ring-navy-800/10 hover:bg-navy-800 hover:text-white";
  return (
    <div className={`flex items-center justify-center gap-2 ${istaknut ? "py-3" : "py-1"}`}>
      {otvoren ? (
        <>
          <button type="button" className={opcija} onClick={() => izbor("tekst")}>¶ Tekst</button>
          <button type="button" className={opcija} onClick={() => izbor("podnaslov")}>H Podnaslov</button>
          <button type="button" className={opcija} onClick={() => izbor("slika")}>▣ Slika</button>
          <button type="button" className="px-2 text-[20px] text-navy-800/40 hover:text-navy-800" onClick={() => setOtvoren(false)} aria-label="Zatvori">×</button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setOtvoren(true)}
          title="Dodaj tekst, podnaslov ili sliku"
          className={
            istaknut
              ? "flex items-center gap-2 rounded-full bg-navy-800 px-5 py-2.5 font-cond text-[15px] font-bold uppercase tracking-[.14em] text-white hover:bg-red-600"
              : "grid h-7 w-7 place-items-center rounded-full bg-navy-800/10 text-[18px] leading-none text-navy-800/60 opacity-60 hover:bg-red-600 hover:text-white hover:opacity-100"
          }
        >
          {istaknut ? <><span className="text-[20px] leading-none">+</span> Dodaj sadržaj</> : "+"}
        </button>
      )}
    </div>
  );
}

function PoljeTeksta({ vrednost, promena, podnaslov }: { vrednost: string; promena: (v: string) => void; podnaslov?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  function obavij(pre: string, posle: string, primer: string) {
    const t = ref.current!;
    const { selectionStart: a, selectionEnd: b } = t;
    const oznaceno = vrednost.slice(a, b) || primer;
    promena(vrednost.slice(0, a) + pre + oznaceno + posle + vrednost.slice(b));
    requestAnimationFrame(() => { t.focus(); t.setSelectionRange(a + pre.length, a + pre.length + oznaceno.length); });
  }
  if (podnaslov) {
    return (
      <input value={vrednost} onChange={(e) => promena(e.target.value)} placeholder="Podnaslov"
        className="w-full rounded-[8px] border border-navy-800/15 bg-white px-4 py-3 font-cond text-[24px] font-bold uppercase outline-none focus:border-red-600" />
    );
  }
  return (
    <div className="rounded-[8px] border border-navy-800/15 bg-white focus-within:border-red-600">
      <div className="flex gap-1 border-b border-navy-800/8 px-2 py-1.5">
        <button type="button" title="Podebljano" onClick={() => obavij("**", "**", "podebljano")} className="rounded px-2.5 py-1 text-[14px] font-bold hover:bg-cream-200">B</button>
        <button type="button" title="Kurziv" onClick={() => obavij("*", "*", "kurziv")} className="rounded px-2.5 py-1 text-[14px] italic hover:bg-cream-200">I</button>
        <button type="button" title="Link" onClick={() => { const u = prompt("Adresa linka (npr. https://...)"); if (u) obavij("[", `](${u})`, "tekst linka"); }} className="rounded px-2.5 py-1 text-[13px] font-semibold underline hover:bg-cream-200">Link</button>
      </div>
      <textarea
        ref={ref}
        value={vrednost}
        onChange={(e) => { promena(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }}
        rows={4}
        placeholder="Piši ovde…"
        className="block w-full resize-none rounded-b-[8px] px-4 py-3 text-[16px] leading-relaxed outline-none"
      />
    </div>
  );
}

/** Editor sadržaja: lista blokova, "+" između blokova i na kraju, strelice za pomeranje. */
export default function BlokEditor({ blokovi, promena }: { blokovi: Blok[]; promena: (b: Blok[]) => void }) {
  const ubaci = (i: number, tip: Blok["tip"]) => promena([...blokovi.slice(0, i), NOVI[tip](), ...blokovi.slice(i)]);
  const izmeni = (i: number, b: Blok) => promena(blokovi.map((x, j) => (j === i ? b : x)));
  const obrisi = (i: number) => promena(blokovi.filter((_, j) => j !== i));
  const pomeri = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= blokovi.length) return;
    const n = [...blokovi];
    [n[i], n[j]] = [n[j], n[i]];
    promena(n);
  };
  const malo = "grid h-8 w-8 place-items-center rounded-[6px] bg-white text-[15px] text-navy-800/70 ring-1 ring-navy-800/10 hover:bg-navy-800 hover:text-white disabled:opacity-25 disabled:hover:bg-white disabled:hover:text-navy-800/70";

  return (
    <div className="rounded-[12px] bg-cream-200/60 p-3 sm:p-4">
      {blokovi.length === 0 && <p className="py-4 text-center text-[15px] text-navy-800/50">Prazno. Klikni „Dodaj sadržaj" da dodaš tekst ili sliku.</p>}
      {blokovi.map((b, i) => (
        <div key={i}>
          {i > 0 && <Plus dodaj={(t) => ubaci(i, t)} />}
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <div className="mb-1 font-cond text-[11px] font-bold uppercase tracking-[.18em] text-navy-800/35">
                {b.tip === "tekst" ? "Tekst" : b.tip === "podnaslov" ? "Podnaslov" : "Slika"}
              </div>
              {b.tip === "slika" ? (
                <div className="grid gap-2">
                  <IzborSlike vrednost={b.url} promena={(url) => izmeni(i, { ...b, url })} />
                  <input value={b.opis} onChange={(e) => izmeni(i, { ...b, opis: e.target.value })} placeholder="Opis slike (nije obavezno)"
                    className="rounded-[8px] border border-navy-800/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-red-600" />
                </div>
              ) : (
                <PoljeTeksta vrednost={b.tekst} podnaslov={b.tip === "podnaslov"} promena={(tekst) => izmeni(i, { ...b, tekst })} />
              )}
            </div>
            <div className="flex flex-col gap-1 pt-5">
              <button type="button" className={malo} onClick={() => pomeri(i, -1)} disabled={i === 0} title="Pomeri gore">↑</button>
              <button type="button" className={malo} onClick={() => pomeri(i, 1)} disabled={i === blokovi.length - 1} title="Pomeri dole">↓</button>
              <button type="button" className={`${malo} hover:!bg-red-600 hover:!text-white`} onClick={() => obrisi(i)} title="Obriši">×</button>
            </div>
          </div>
        </div>
      ))}
      <Plus dodaj={(t) => ubaci(blokovi.length, t)} istaknut />
    </div>
  );
}
