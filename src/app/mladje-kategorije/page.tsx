import type { Metadata } from "next";
import Image from "next/image";
import ZaglavljeStrane from "@/components/zaglavlje-strane";
import { ucitajStranicu } from "@/lib/stranice";
import { uHtml } from "@/lib/markdown";

export const metadata: Metadata = { title: "Mlađe kategorije" };

export default function MladjeKategorije() {
  const s = ucitajStranicu("mladje-kategorije");
  return (
    <>
      <ZaglavljeStrane kicker="Škola vaterpola i omladinski pogon" naslov={s?.naslov || "Mlađe kategorije"} opis={s?.uvod} />
      {s?.slika && (
        <div className="relative mx-auto aspect-[21/9] max-w-[1328px] overflow-hidden">
          <Image src={s.slika} alt="" fill className="object-cover" priority />
        </div>
      )}
      <section className="bg-cream-100 py-14 text-navy-800">
        <div className="clanak mx-auto max-w-[820px] px-5 sm:px-7" dangerouslySetInnerHTML={{ __html: uHtml(s?.telo ?? "") }} />
      </section>
    </>
  );
}
