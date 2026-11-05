import Link from "next/link";

export const oznaka = "font-cond text-[13px] font-bold uppercase tracking-[.16em] text-navy-800/60";
export const polje = "w-full rounded-[8px] border border-navy-800/20 bg-white px-4 py-3 text-[16px] outline-none focus:border-red-600";
export const dugmeGlavno = "rounded-[8px] bg-red-600 px-7 py-3.5 font-cond text-[16px] font-bold uppercase tracking-[.16em] text-white hover:bg-red-500 disabled:opacity-60";
export const dugmeSporedno = "rounded-[7px] border border-navy-800/15 bg-white px-3.5 py-2 font-cond text-[13px] font-bold uppercase tracking-[.14em] hover:bg-cream-200";

export function AdminNaslov({ nazad, naslov, opis, desno }: { nazad?: { href: string; tekst: string }; naslov: string; opis?: string; desno?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {nazad && <Link href={nazad.href} className="font-cond text-[14px] font-bold uppercase tracking-[.16em] text-navy-800/50 hover:text-navy-800">← {nazad.tekst}</Link>}
        <h1 className="display mt-2 text-[44px] sm:text-[52px]">{naslov}</h1>
        {opis && <p className="mt-1 max-w-xl text-[15px] text-navy-800/60">{opis}</p>}
      </div>
      {desno}
    </div>
  );
}

export function Obavestenje({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 rounded-[8px] bg-green-700 px-5 py-3.5 text-[15px] font-semibold text-white">{children} Na sajtu će se videti za 1–2 minuta.</div>;
}
