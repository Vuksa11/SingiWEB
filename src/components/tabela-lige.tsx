import type { Tabela } from "@/lib/tabela";
import { jeNasKlub } from "@/lib/tabela";

export default function TabelaLige({ tabela, puna = false }: { tabela: Tabela; puna?: boolean }) {
  const kolone = puna
    ? (["ut", "pob", "por", "dg", "pg", "gr", "bod"] as const)
    : (["ut", "pob", "por", "gr", "bod"] as const);
  const nazivi: Record<string, string> = { ut: "OU", pob: "P", por: "I", dg: "DG", pg: "PG", gr: "GR", bod: "Bod" };

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-cond text-[14px] tabular-nums sm:text-[16px]">
        <thead>
          <tr className="border-b border-white/12 text-[12px] uppercase tracking-[.2em] text-white/45">
            <th className="w-8 py-3 text-left font-semibold sm:w-10">#</th>
            <th className="py-3 text-left font-semibold">Klub</th>
            {kolone.map((k) => (
              <th key={k} className={`w-9 py-3 text-right font-semibold sm:w-12 ${k === "dg" || k === "pg" ? "hidden sm:table-cell" : ""}`}>{nazivi[k]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabela.redovi.map((r) => {
            const nas = jeNasKlub(r.tim);
            return (
              <tr key={r.tim} className={`border-b border-white/6 ${nas ? "bg-red-600 text-white" : ""}`}>
                <td className={`py-2.5 pl-2 font-bold ${nas ? "" : "text-white/45"}`}>{r.poz}</td>
                <td className="py-2.5 text-[15px] font-bold uppercase tracking-wide sm:text-[17px]">
                  {r.tim}
                  {puna && <span className={`ml-2 hidden sm:inline text-[13px] font-medium normal-case tracking-normal ${nas ? "text-white/80" : "text-white/40"}`}>{r.grad}</span>}
                </td>
                {kolone.map((k) => (
                  <td key={k} className={`py-2.5 pr-2 text-right ${k === "dg" || k === "pg" ? "hidden sm:table-cell " : ""}${k === "bod" ? "text-[18px] font-bold" : nas ? "" : "text-white/75"}`}>
                    {k === "gr" && r.gr > 0 ? `+${r.gr}` : r[k]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
