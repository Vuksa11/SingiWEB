import type { Metadata } from "next";
import ZaglavljeStrane from "@/components/zaglavlje-strane";
import { sveUtakmice, formatTermin, kodKuce, mesto } from "@/lib/utakmice";
import { TAKMICENJE } from "@/lib/klub";

export const metadata: Metadata = { title: "Raspored i rezultati" };
export const revalidate = 3600; // samo da se "sledeća utakmica" pomera s datumom; podaci se ne vuku odavde

export default function Raspored() {
  const utakmice = sveUtakmice();
  const sada = Date.now();
  return (
    <>
      <ZaglavljeStrane kicker={`${TAKMICENJE.naziv} · ${TAKMICENJE.sezona}`} naslov="Raspored" opis="Sve utakmice prvog tima u sezoni. Rezultati se osvežavaju sredom i vikendom." />
      <section className="bg-navy-900 pb-20">
        <div className="mx-auto grid max-w-[1100px] gap-2.5 px-5 sm:px-7">
          {utakmice.map((u) => {
            const t = formatTermin(u.datum);
            const kod = kodKuce(u);
            const Omotac = u.link ? "a" : "div";
            return (
              <Omotac
                key={`${u.kolo}-${u.domacin}`}
                {...(u.link ? { href: u.link, target: "_blank", rel: "noopener" } : {})}
                className={`grid grid-cols-[86px_1fr] items-center gap-5 rounded-[10px] border border-white/8 bg-navy-800 p-5 transition-colors hover:bg-navy-700 sm:grid-cols-[110px_1fr_auto] ${u.rezultat ? "" : "border-l-4 border-l-red-600"}`}
              >
                <div>
                  <div className="font-cond text-[12px] font-semibold uppercase tracking-[.16em] text-white/45">{t.dan}</div>
                  <div className="display text-[38px]">{t.datum}</div>
                </div>
                <div className="min-w-0">
                  <div className="font-cond text-[12px] font-semibold uppercase tracking-[.18em] text-red-300">
                    {u.kolo}. kolo · {t.vreme ?? "satnica naknadno"} · {mesto(u)}
                  </div>
                  <div className="mt-1 font-cond text-[24px] font-bold uppercase leading-tight sm:text-[28px]">
                    {u.domacin} <span className="text-white/35">–</span> {u.gost}
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                  {u.rezultat ? (
                    <span className="display text-[40px] text-red-600">{u.rezultat}</span>
                  ) : (
                    <span className="font-cond text-[14px] font-bold uppercase tracking-[.16em] text-white/50">
                      {new Date(u.datum).getTime() + 36e5 * 24 < sada ? "Rezultat uskoro" : "Najava"}
                    </span>
                  )}
                  <span className={`rounded px-2.5 py-1 font-cond text-[12px] font-bold uppercase tracking-[.16em] ${kod ? "bg-red-600" : "border border-white/20 text-white/70"}`}>
                    {kod ? "Kod kuće" : "Gostovanje"}
                  </span>
                </div>
              </Omotac>
            );
          })}
        </div>
      </section>
    </>
  );
}
