import Link from "next/link";

export default function NaslovSekcije({ kicker, naslov, link, svetla = false }: { kicker: string; naslov: string; link?: { href: string; tekst: string }; svetla?: boolean }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className={`kicker ${svetla ? "text-red-600" : "text-red-300"}`}>{kicker}</div>
        <h2 className={`display mt-2 text-[44px] sm:text-[60px] ${svetla ? "text-navy-800" : "text-white"}`}>{naslov}</h2>
      </div>
      {link && (
        <Link href={link.href} className={`border-b-2 border-red-600 pb-1 font-cond text-[15px] font-bold uppercase tracking-[.16em] ${svetla ? "text-navy-800" : "text-white"}`}>
          {link.tekst} →
        </Link>
      )}
    </div>
  );
}
