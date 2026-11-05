import Link from "next/link";
import VestKartica from "@/components/vest-kartica";
import ZaglavljeStrane from "@/components/zaglavlje-strane";
import type { Vest } from "@/lib/vesti";

export const PO_STRANI = 12;

export function brojStrana(ukupno: number) {
  return Math.max(1, Math.ceil(ukupno / PO_STRANI));
}

const urlStrane = (n: number) => (n === 1 ? "/vesti" : `/vesti/strana/${n}`);

export default function ListaVesti({ vesti, strana }: { vesti: Vest[]; strana: number }) {
  const ukupnoStrana = brojStrana(vesti.length);
  const prikaz = vesti.slice((strana - 1) * PO_STRANI, strana * PO_STRANI);

  return (
    <>
      <ZaglavljeStrane kicker="Iz kluba" naslov="Vesti" opis={ukupnoStrana > 1 ? `Strana ${strana} od ${ukupnoStrana}` : undefined} />
      <section className="plavi-sjaj min-h-[60vh] py-14">
        <div className="mx-auto grid max-w-[1328px] gap-5 px-5 sm:grid-cols-2 sm:px-7 lg:grid-cols-3">
          {prikaz.map((v) => <VestKartica key={v.slug} vest={v} />)}
        </div>
        {ukupnoStrana > 1 && <Paginacija strana={strana} ukupno={ukupnoStrana} />}
      </section>
    </>
  );
}

function Paginacija({ strana, ukupno }: { strana: number; ukupno: number }) {
  // Prikaži prvu, poslednju i susede trenutne strane; ostalo zameni sa "…".
  const brojevi: (number | "…")[] = [];
  for (let n = 1; n <= ukupno; n++) {
    if (n === 1 || n === ukupno || Math.abs(n - strana) <= 1) brojevi.push(n);
    else if (brojevi.at(-1) !== "…") brojevi.push("…");
  }
  const dugme = "inline-flex h-11 min-w-11 items-center justify-center gap-1 whitespace-nowrap rounded-[8px] px-3 font-cond text-[16px] font-bold uppercase tracking-[.12em] transition-colors";

  return (
    <nav aria-label="Strane vesti" className="mx-auto mt-12 flex max-w-[1328px] flex-wrap items-center justify-center gap-2 px-5">
      {strana > 1 ? (
        <Link href={urlStrane(strana - 1)} className={`${dugme} border border-white/25 hover:bg-white hover:text-navy-800`}>← <span className="ml-1 hidden sm:inline">Novije</span></Link>
      ) : null}
      {brojevi.map((n, i) =>
        n === "…" ? (
          <span key={`t${i}`} className="px-1 text-white/40">…</span>
        ) : n === strana ? (
          <span key={n} aria-current="page" className={`${dugme} bg-red-600 text-white`}>{n}</span>
        ) : (
          <Link key={n} href={urlStrane(n)} className={`${dugme} border border-white/25 hover:bg-white hover:text-navy-800`}>{n}</Link>
        ),
      )}
      {strana < ukupno ? (
        <Link href={urlStrane(strana + 1)} className={`${dugme} border border-white/25 hover:bg-white hover:text-navy-800`}><span className="mr-1 hidden sm:inline">Starije</span> →</Link>
      ) : null}
    </nav>
  );
}
