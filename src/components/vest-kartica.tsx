import Link from "next/link";
import Image from "next/image";
import type { Vest } from "@/lib/vesti";
import { formatDatum } from "@/lib/vesti";

export default function VestKartica({ vest, velika = false }: { vest: Vest; velika?: boolean }) {
  return (
    <Link href={`/vesti/${vest.slug}`} className="group flex flex-col overflow-hidden rounded-[10px] bg-white text-navy-800 shadow-[0_1px_0_rgba(15,29,53,.06)] transition-transform hover:-translate-y-0.5">
      <div className={`relative ${velika ? "aspect-[16/9]" : "aspect-[16/10]"} overflow-hidden bg-navy-800 staze-tamne`}>
        {vest.slika ? (
          <Image src={vest.slika} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <Image src="/grb.png" alt="" width={velika ? 120 : 80} height={velika ? 120 : 80} className="rounded-full opacity-25" />
          </div>
        )}
        <span className="absolute left-0 top-4 bg-red-600 px-3 py-1 font-cond text-[12px] font-bold uppercase tracking-[.18em] text-white">{vest.kategorija}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="font-cond text-[13px] font-semibold uppercase tracking-[.16em] text-navy-800/45">{formatDatum(vest.datum)}</div>
        <h3 className={`mt-2 font-cond font-bold uppercase leading-[1.02] ${velika ? "text-[30px] sm:text-[36px]" : "text-[23px]"}`}>{vest.naslov}</h3>
        {vest.sazetak && <p className="mt-3 text-[15px] leading-relaxed text-navy-800/65">{vest.sazetak}</p>}
        <span className="mt-auto pt-4 font-cond text-[14px] font-bold uppercase tracking-[.16em] text-red-600">Pročitaj →</span>
      </div>
    </Link>
  );
}
