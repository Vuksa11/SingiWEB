import Link from "next/link";
import { zahtevajAdmina } from "@/lib/admin-auth";
import { listaFajlova, procitajFajl } from "@/lib/github";
import { parsiraj, formatDatum } from "@/lib/vesti";
import { AdminNaslov, Obavestenje, dugmeSporedno } from "@/components/admin/ui";
import ObrisiDugme from "@/components/admin/obrisi-dugme";
import { obrisiVestAkcija } from "./akcije";

export default async function AdminVesti({ searchParams }: { searchParams: Promise<{ sacuvano?: string; obrisano?: string }> }) {
  await zahtevajAdmina();
  const sp = await searchParams;
  // Čita direktno iz GitHub-a, pa vidi i vesti koje Vercel još objavljuje.
  const fajlovi = (await listaFajlova("content/vesti")).filter((f) => f.endsWith(".md"));
  const vesti = (await Promise.all(fajlovi.map(async (f) => {
    const slug = f.replace(/\.md$/, "");
    const s = await procitajFajl(`content/vesti/${f}`);
    return s ? parsiraj(slug, s) : null;
  }))).filter((v) => v !== null).sort((a, b) => b.datum.localeCompare(a.datum));

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-14 sm:px-7">
      <AdminNaslov nazad={{ href: "/admin", tekst: "Uređivanje sajta" }} naslov="Vesti"
        desno={<Link href="/admin/vesti/nova" className="rounded-[8px] bg-red-600 px-5 py-3 font-cond text-[15px] font-bold uppercase tracking-[.16em] text-white hover:bg-red-500">+ Nova vest</Link>} />
      {sp.sacuvano && <Obavestenje>Vest je sačuvana.</Obavestenje>}
      {sp.obrisano && <Obavestenje>Vest je obrisana.</Obavestenje>}
      <div className="mt-8 overflow-hidden rounded-[10px] bg-white">
        {vesti.length === 0 && <p className="p-6 text-navy-800/60">Još nema vesti. Klikni „+ Nova vest".</p>}
        {vesti.map((v) => (
          <div key={v.slug} className="flex flex-col gap-3 border-b border-navy-800/8 p-4 last:border-0 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
            <div className="min-w-0 flex-1">
              <div className="font-cond text-[12px] font-semibold uppercase tracking-[.14em] text-navy-800/45">{formatDatum(v.datum)} · {v.kategorija}</div>
              <div className="mt-0.5 truncate font-cond text-[19px] font-bold uppercase">{v.naslov}</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href={`/vesti/${v.slug}`} target="_blank" className={dugmeSporedno}>Pogledaj</Link>
              <Link href={`/admin/vesti/${v.slug}`} className={dugmeSporedno}>Izmeni</Link>
              <ObrisiDugme akcija={obrisiVestAkcija} id={v.slug} pitanje={`Obrisati vest „${v.naslov}"?`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
