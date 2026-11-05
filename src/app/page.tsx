import Link from "next/link";
import Image from "next/image";
import NaslovSekcije from "@/components/naslov-sekcije";
import VestKartica from "@/components/vest-kartica";
import TabelaLige from "@/components/tabela-lige";
import { sveVesti } from "@/lib/vesti";
import { ucitajTabelu, jeNasKlub } from "@/lib/tabela";
import { sledecaUtakmica, poslednjiRezultat, formatTermin, mesto } from "@/lib/utakmice";
import { KLUB, TAKMICENJE } from "@/lib/klub";

export const revalidate = 3600;

export default function Pocetna() {
  const vesti = sveVesti().slice(0, 3);
  const tabela = ucitajTabelu();
  const sledeca = sledecaUtakmica();
  const poslednja = poslednjiRezultat();
  const nas = tabela.redovi.find((r) => jeNasKlub(r.tim));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-900 staze-tamne">
        <div className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 opacity-[.07] lg:block">
          <Image src="/grb.png" alt="" width={720} height={720} priority />
        </div>
        <div className="relative mx-auto max-w-[1328px] px-5 pb-16 pt-16 sm:px-7 sm:pb-24 sm:pt-24">
          <div className="kicker text-red-300">{TAKMICENJE.naziv} · Sezona {TAKMICENJE.sezona}</div>
          <h1 className="display mt-4 text-[64px] sm:text-[104px] lg:text-[136px]">
            Vaterpolo<br />klub <span className="text-red-600">{KLUB.ime}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-white/60">
            Klub iz {KLUB.grad === "Beograd" ? "Beograda" : KLUB.grad} — prvi tim, mlađe kategorije i škola vaterpola.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/raspored" className="rounded-[7px] bg-red-600 px-6 py-3.5 font-cond text-[16px] font-bold uppercase tracking-[.16em] hover:bg-red-500">Raspored utakmica</Link>
            <Link href="/vesti" className="rounded-[7px] border border-white/20 px-6 py-3.5 font-cond text-[16px] font-bold uppercase tracking-[.16em] hover:bg-white/6">Najnovije vesti</Link>
          </div>
        </div>

        {/* Traka: sledeća utakmica / poslednji rezultat / pozicija */}
        <div className="relative border-t border-white/8 bg-navy-950/70">
          <div className="mx-auto grid max-w-[1328px] divide-white/8 px-5 sm:px-7 md:grid-cols-3 md:divide-x">
            <TrakaStavka naslov="Sledeća utakmica">
              {sledeca ? (
                <>
                  <div className="display text-[28px]">{sledeca.domacin} <span className="text-red-600">vs</span> {sledeca.gost}</div>
                  <div className="mt-1 text-[14px] text-white/55">
                    {(() => { const t = formatTermin(sledeca.datum); return `${t.dan} ${t.datum}${t.vreme ? ` · ${t.vreme}` : ""} · ${mesto(sledeca)}`; })()}
                  </div>
                </>
              ) : <div className="text-white/50">Raspored uskoro</div>}
            </TrakaStavka>
            <TrakaStavka naslov="Poslednji rezultat">
              {poslednja ? (
                <>
                  <div className="display text-[28px]">{poslednja.domacin} <span className="text-red-600">{poslednja.rezultat}</span> {poslednja.gost}</div>
                  <div className="mt-1 text-[14px] text-white/55">{poslednja.kolo}. kolo</div>
                </>
              ) : <div className="text-white/50">—</div>}
            </TrakaStavka>
            <TrakaStavka naslov="Pozicija na tabeli">
              {nas ? (
                <>
                  <div className="display text-[44px] text-red-600">{nas.poz}.<span className="ml-3 text-[28px] text-white">{nas.bod} bod.</span></div>
                  <div className="mt-1 text-[14px] text-white/55">{nas.ut} utakmica · {nas.pob} pobeda</div>
                </>
              ) : <div className="text-white/50">—</div>}
            </TrakaStavka>
          </div>
        </div>
      </section>

      {/* VESTI */}
      <section className="bg-cream-100 py-20 staze-svetle">
        <div className="mx-auto max-w-[1328px] px-5 sm:px-7">
          <NaslovSekcije kicker="Iz kluba" naslov="Vesti" link={{ href: "/vesti", tekst: "Sve vesti" }} svetla />
          {vesti.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr]">
              {vesti.map((v, i) => <VestKartica key={v.slug} vest={v} velika={i === 0} />)}
            </div>
          ) : <p className="text-navy-800/60">Još nema vesti.</p>}
        </div>
      </section>

      {/* TABELA */}
      <section className="bg-navy-900 py-20">
        <div className="mx-auto grid max-w-[1328px] gap-12 px-5 sm:px-7 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <NaslovSekcije kicker={`${TAKMICENJE.naziv} ${TAKMICENJE.sezona}`} naslov="Tabela lige" link={{ href: "/tabela", tekst: "Puna tabela" }} />
            <TabelaLige tabela={tabela} />
            <p className="mt-4 text-[13px] text-white/35">
              Izvor: <a href={`${TAKMICENJE.srbijasportLigaUrl}/standings`} className="underline">srbijasport.net</a>
            </p>
          </div>
          <div className="grid content-start gap-3 sm:grid-cols-2 lg:mt-[118px]">
            <Stat broj={nas ? `${nas.poz}.` : "—"} opis="Mesto na tabeli" istaknut />
            <Stat broj={nas ? String(nas.pob) : "—"} opis="Pobeda" />
            <Stat broj={nas ? String(nas.dg) : "—"} opis="Datih golova" />
            <Stat broj={nas ? String(nas.ut) : "—"} opis="Odigranih utakmica" />
            <a href={TAKMICENJE.srbijasportKlubUrl} className="rounded-[10px] border border-white/12 p-5 font-cond text-[15px] font-bold uppercase tracking-[.16em] hover:bg-white/5 sm:col-span-2">
              Svi rezultati →
            </a>
          </div>
        </div>
      </section>

      {/* KLUB */}
      <section id="klub" className="bg-cream-100 py-20 text-navy-800">
        <div className="mx-auto grid max-w-[1328px] gap-6 px-5 sm:px-7 md:grid-cols-3">
          <div className="md:col-span-3"><NaslovSekcije kicker="Postani deo tima" naslov="Klub" svetla /></div>
          <KlubKartica naslov="Prvi tim" tekst={`Seniorska ekipa u ${TAKMICENJE.naziv === "Prva A liga" ? "Prvoj A ligi" : TAKMICENJE.naziv} Srbije.`} />
          <KlubKartica naslov="Mlađe kategorije" tekst="Kadeti, juniori i pioniri — takmičenja i redovni treninzi tokom cele godine." />
          <KlubKartica naslov="Škola vaterpola" tekst="Upis dece tokom cele godine. Javi se za probni trening." link={{ href: "#kontakt", tekst: "Kontakt" }} />
        </div>
      </section>
    </>
  );
}

function TrakaStavka({ naslov, children }: { naslov: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/8 py-6 md:border-b-0 md:px-7 md:first:pl-0">
      <div className="kicker mb-2 text-[11px] text-white/40">{naslov}</div>
      {children}
    </div>
  );
}

function Stat({ broj, opis, istaknut = false }: { broj: string; opis: string; istaknut?: boolean }) {
  return (
    <div className={`rounded-[10px] p-5 ${istaknut ? "bg-red-600" : "border border-white/10 bg-navy-800"}`}>
      <div className="display text-[52px]">{broj}</div>
      <div className={`mt-1 font-cond text-[13px] font-semibold uppercase tracking-[.18em] ${istaknut ? "text-white/85" : "text-white/50"}`}>{opis}</div>
    </div>
  );
}

function KlubKartica({ naslov, tekst, link }: { naslov: string; tekst: string; link?: { href: string; tekst: string } }) {
  return (
    <div className="rounded-[10px] border-l-4 border-red-600 bg-white p-7">
      <h3 className="display text-[34px]">{naslov}</h3>
      <p className="mt-3 text-[16px] leading-relaxed text-navy-800/65">{tekst}</p>
      {link && <a href={link.href} className="mt-4 inline-block font-cond text-[14px] font-bold uppercase tracking-[.16em] text-red-600">{link.tekst} →</a>}
    </div>
  );
}
