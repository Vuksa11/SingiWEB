import type { Metadata } from "next";
import ZaglavljeStrane from "@/components/zaglavlje-strane";
import TabelaLige from "@/components/tabela-lige";
import { ucitajTabelu } from "@/lib/tabela";
import { TAKMICENJE } from "@/lib/klub";

export const metadata: Metadata = { title: "Tabela" };

export default function TabelaStrana() {
  const tabela = ucitajTabelu();
  return (
    <>
      <ZaglavljeStrane kicker={`${TAKMICENJE.naziv} · ${TAKMICENJE.sezona}`} naslov="Tabela lige" />
      <section className="bg-navy-900 pb-20">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-7">
          <TabelaLige tabela={tabela} puna />
          <p className="mt-5 text-[13px] leading-relaxed text-white/40">
            OU – odigrane utakmice · P – pobede · I – izgubljene · DG/PG – dati/primljeni golovi · GR – gol-razlika.
            <br />
            Izvor: <a href={`${TAKMICENJE.srbijasportLigaUrl}/standings`} className="underline">srbijasport.net</a> · osvežava se sredom i vikendom, poslednji put{" "}
            {new Date(tabela.azurirano).toLocaleString("sr-Latn-RS", { timeZone: "Europe/Belgrade", dateStyle: "short", timeStyle: "short" })}.
          </p>
        </div>
      </section>
    </>
  );
}
