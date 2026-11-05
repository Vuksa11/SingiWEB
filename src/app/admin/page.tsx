import Link from "next/link";
import { zahtevajAdmina, adminPodesen } from "@/lib/admin-auth";
import { odjavaAkcija } from "./akcije";
import { AdminNaslov, dugmeSporedno } from "@/components/admin/ui";

const DELOVI = [
  { href: "/admin/vesti", naslov: "Vesti", opis: "Piši nove vesti, menjaj i briši stare.", ikona: "✎" },
  { href: "/admin/ekipa", naslov: "Prvi tim", opis: "Igrači i stručni štab — imena, brojevi, slike.", ikona: "◉" },
  { href: "/admin/mladje-kategorije", naslov: "Mlađe kategorije", opis: "Tekst i slike na stranici za mlađe kategorije.", ikona: "★" },
];

export default async function Admin() {
  if (!adminPodesen()) return <p className="mx-auto max-w-xl px-5 py-24">Admin nije podešen (vidi README).</p>;
  await zahtevajAdmina();
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-14 sm:px-7">
      <AdminNaslov
        naslov="Uređivanje sajta"
        opis="Izaberi šta menjaš. Sve što sačuvaš pojavi se na sajtu za minut-dva."
        desno={<form action={odjavaAkcija}><button className={dugmeSporedno}>Odjava</button></form>}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {DELOVI.map((d) => (
          <Link key={d.href} href={d.href} className="group rounded-[12px] border-l-4 border-red-600 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-[22px] text-white group-hover:bg-red-600">{d.ikona}</div>
            <h2 className="display mt-4 text-[30px]">{d.naslov}</h2>
            <p className="mt-2 text-[15px] text-navy-800/60">{d.opis}</p>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-[14px] text-navy-800/45">Tabela i raspored utakmica se osvežavaju sami sa srbijasport.net — njih ne treba dirati.</p>
    </div>
  );
}
