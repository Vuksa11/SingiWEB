import Link from "next/link";
import Grb from "./grb";
import { KLUB } from "@/lib/klub";

const STAVKE = [
  { href: "/vesti", tekst: "Vesti" },
  { href: "/raspored", tekst: "Raspored" },
  { href: "/tabela", tekst: "Tabela" },
  { href: "/#klub", tekst: "Klub" },
  { href: "/#kontakt", tekst: "Kontakt" },
];

export default function Zaglavlje() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-navy-900/92 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-[1328px] items-center gap-6 px-5 sm:px-7">
        <Link href="/" className="flex items-center gap-3">
          <Grb size={42} />
          <span className="leading-none">
            <span className="block font-cond text-[11px] font-semibold uppercase tracking-[.28em] text-red-300">VK</span>
            <span className="block font-cond text-[22px] font-bold uppercase tracking-wide">{KLUB.ime}</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {STAVKE.map((s) => (
            <Link key={s.href} href={s.href} className="font-cond text-[15px] font-semibold uppercase tracking-[.16em] text-white/75 transition-colors hover:text-white">
              {s.tekst}
            </Link>
          ))}
        </nav>
        <details className="relative ml-auto md:hidden">
          <summary className="cursor-pointer list-none rounded-[7px] border border-white/15 px-3 py-2 font-cond text-[13px] font-bold uppercase tracking-[.14em]">Meni</summary>
          <div className="absolute right-0 mt-2 w-48 rounded-[9px] border border-white/10 bg-navy-800 p-2 shadow-xl">
            {STAVKE.map((s) => (
              <Link key={s.href} href={s.href} className="block rounded px-3 py-2.5 font-cond text-[15px] font-semibold uppercase tracking-[.14em] hover:bg-white/6">
                {s.tekst}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
