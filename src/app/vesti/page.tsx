import type { Metadata } from "next";
import VestKartica from "@/components/vest-kartica";
import { sveVesti } from "@/lib/vesti";
import ZaglavljeStrane from "@/components/zaglavlje-strane";

export const metadata: Metadata = { title: "Vesti" };

export default function Vesti() {
  const vesti = sveVesti();
  return (
    <>
      <ZaglavljeStrane kicker="Iz kluba" naslov="Vesti" />
      <section className="bg-cream-100 py-14 staze-svetle">
        <div className="mx-auto grid max-w-[1328px] gap-5 px-5 sm:grid-cols-2 sm:px-7 lg:grid-cols-3">
          {vesti.map((v) => <VestKartica key={v.slug} vest={v} />)}
        </div>
      </section>
    </>
  );
}
