import type { Metadata } from "next";
import Image from "next/image";
import ZaglavljeStrane from "@/components/zaglavlje-strane";
import { ucitajEkipu, GRUPE, type Clan } from "@/lib/ekipa";
import { TAKMICENJE } from "@/lib/klub";

export const metadata: Metadata = { title: "Prvi tim" };

export default function Ekipa() {
  const ekipa = ucitajEkipu();
  const grupe = (Object.keys(GRUPE) as Clan["grupa"][]).map((g) => ({ g, clanovi: ekipa.filter((c) => c.grupa === g) })).filter((x) => x.clanovi.length);

  return (
    <>
      <ZaglavljeStrane kicker={`${TAKMICENJE.naziv} · ${TAKMICENJE.sezona}`} naslov="Prvi tim" />
      <section className="plavi-sjaj min-h-[50vh] py-14">
        <div className="mx-auto max-w-[1328px] px-5 sm:px-7">
          {grupe.length === 0 && <p className="py-10 text-center text-[17px] text-white/60">Spisak ekipe uskoro.</p>}
          {grupe.map(({ g, clanovi }) => (
            <div key={g} className="mb-14 last:mb-0">
              <h2 className="display mb-6 text-[36px] sm:text-[44px]">{GRUPE[g]}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {clanovi.map((c) => <KarticaClana key={c.id} c={c} />)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function KarticaClana({ c }: { c: Clan }) {
  return (
    <div className="kartica-sjaj group relative overflow-hidden rounded-[12px] bg-navy-800 ring-1 ring-white/10">
      <div className="relative aspect-[4/5] bg-gradient-to-b from-navy-700 to-navy-900">
        {c.slika ? (
          <Image src={c.slika} alt={c.ime} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <Image src="/grb.png" alt="" width={90} height={90} className="rounded-full opacity-20" />
          </div>
        )}
        {c.broj !== null && (
          <span className="display absolute left-3 top-2 text-[64px] text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,.5)]">{c.broj}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="font-cond text-[12px] font-bold uppercase tracking-[.18em] text-red-300">{c.pozicija}</div>
          <div className="display mt-1 text-[24px] sm:text-[28px]">{c.ime}</div>
        </div>
      </div>
    </div>
  );
}
