import Link from "next/link";
import type { Tabela } from "@/lib/tabela";
import { jeNasKlub } from "@/lib/tabela";
import { TAKMICENJE } from "@/lib/klub";

// Sažeta tabela za bočnu kolonu početne strane.
export default function MiniTabela({ tabela }: { tabela: Tabela }) {
  return (
    <div className="overflow-hidden rounded-[10px] bg-white text-navy-800 shadow-[0_1px_0_rgba(15,29,53,.06)]">
      <div className="flex items-baseline justify-between bg-navy-800 px-4 py-3 text-white">
        <span className="font-cond text-[17px] font-bold uppercase tracking-wide">Tabela</span>
        <span className="font-cond text-[11px] font-semibold uppercase tracking-[.18em] text-white/50">{TAKMICENJE.naziv} {TAKMICENJE.sezona}</span>
      </div>
      <table className="w-full font-cond text-[14px] tabular-nums">
        <thead>
          <tr className="text-[10.5px] uppercase tracking-[.16em] text-navy-800/40">
            <th className="w-10 py-2 pl-4 text-left font-semibold">#</th>
            <th className="py-2 text-left font-semibold">Klub</th>
            <th className="w-9 py-2 text-right font-semibold">OU</th>
            <th className="w-12 py-2 pr-4 text-right font-semibold">Bod</th>
          </tr>
        </thead>
        <tbody>
          {tabela.redovi.map((r) => {
            const nas = jeNasKlub(r.tim);
            return (
              <tr key={r.tim} className={`border-t border-navy-800/6 ${nas ? "bg-red-600 text-white" : ""}`}>
                <td className={`py-1.5 pl-4 ${nas ? "font-bold" : "text-navy-800/40"}`}>{r.poz}</td>
                <td className="py-1.5 font-semibold uppercase tracking-wide">{r.tim}</td>
                <td className={`py-1.5 text-right ${nas ? "" : "text-navy-800/55"}`}>{r.ut}</td>
                <td className="py-1.5 pr-4 text-right font-bold">{r.bod}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link href="/tabela" className="block border-t border-navy-800/8 px-4 py-3 font-cond text-[13px] font-bold uppercase tracking-[.16em] text-red-600 hover:bg-cream-100">
        Puna tabela →
      </Link>
    </div>
  );
}
