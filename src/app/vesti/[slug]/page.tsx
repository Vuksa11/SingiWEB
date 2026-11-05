import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { jednaVest, sveVesti, formatDatum } from "@/lib/vesti";

export function generateStaticParams() {
  return sveVesti().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const v = jednaVest((await params).slug);
  return v ? { title: v.naslov, description: v.sazetak } : {};
}

export default async function VestStrana({ params }: { params: Promise<{ slug: string }> }) {
  const v = jednaVest((await params).slug);
  if (!v) notFound();
  return (
    <article>
      <header className="bg-navy-900 staze-tamne">
        <div className="mx-auto max-w-[900px] px-5 pb-12 pt-14 sm:px-7">
          <Link href="/vesti" className="font-cond text-[14px] font-bold uppercase tracking-[.16em] text-white/50 hover:text-white">← Sve vesti</Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="bg-red-600 px-3 py-1 font-cond text-[12px] font-bold uppercase tracking-[.18em]">{v.kategorija}</span>
            <span className="font-cond text-[14px] font-semibold uppercase tracking-[.16em] text-white/50">{formatDatum(v.datum)}</span>
          </div>
          <h1 className="display mt-4 text-[44px] sm:text-[64px]">{v.naslov}</h1>
          {v.sazetak && <p className="mt-5 text-[19px] leading-relaxed text-white/60">{v.sazetak}</p>}
        </div>
      </header>
      {v.slika && (
        <div className="relative mx-auto aspect-[16/9] max-w-[1100px]">
          <Image src={v.slika} alt="" fill className="object-cover" />
        </div>
      )}
      <div className="bg-cream-100 py-14 text-navy-800">
        <div className="clanak mx-auto max-w-[760px] px-5 sm:px-7" dangerouslySetInnerHTML={{ __html: v.html }} />
      </div>
    </article>
  );
}
