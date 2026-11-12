import Link from "next/link";
import { zahtevajAdmina } from "@/lib/admin-auth";
import { procitajFajl, adminSlika } from "@/lib/github";
import { parsirajEkipu, sortiraj, GRUPE, type Clan } from "@/lib/ekipa";
import { AdminNaslov, Obavestenje } from "@/components/admin/ui";

export default async function AdminEkipa({ searchParams }: { searchParams: Promise<{ sacuvano?: string; obrisano?: string }> }) {
  await zahtevajAdmina();
  const sp = await searchParams;
  const ekipa = sortiraj(parsirajEkipu((await procitajFajl("data/igraci.json")) ?? "{}"));

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-7">
      <AdminNaslov nazad={{ href: "/admin", tekst: "Uređivanje sajta" }} naslov="Prvi tim" opis="Klikni na člana da ga izmeniš, ili na karticu sa plusom da dodaš novog." />
      {sp.sacuvano && <Obavestenje>Sačuvano. Na sajtu se vidi za 1–2 minuta.</Obavestenje>}
      {sp.obrisano && <Obavestenje>Član je uklonjen. Sa sajta nestaje za 1–2 minuta.</Obavestenje>}

      {(Object.keys(GRUPE) as Clan["grupa"][]).map((g) => (
        <div key={g} className="mt-10">
          <h2 className="display mb-4 text-[30px]">{GRUPE[g]}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {ekipa.filter((c) => c.grupa === g).map((c) => (
              <Link key={c.id} href={`/admin/ekipa/${c.id}`} className="group overflow-hidden rounded-[10px] bg-white shadow-sm ring-1 ring-navy-800/8 hover:ring-red-600">
                <div className="relative aspect-[4/5] bg-navy-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {c.slika ? <img src={adminSlika(c.slika)} alt="" className="h-full w-full object-cover object-top" /> : <div className="grid h-full place-items-center text-[13px] text-white/40">bez slike</div>}
                  {c.broj !== null && <span className="display absolute left-2 top-1 text-[36px] text-white [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">{c.broj}</span>}
                </div>
                <div className="p-3">
                  <div className="truncate font-cond text-[16px] font-bold uppercase">{c.ime}</div>
                  <div className="truncate text-[13px] text-navy-800/50">{c.pozicija || "—"}</div>
                </div>
              </Link>
            ))}
            <Link href={`/admin/ekipa/nov?grupa=${g}`} className="grid aspect-[4/5] place-items-center rounded-[10px] border-2 border-dashed border-navy-800/20 bg-white/50 text-center hover:border-red-600 hover:bg-white">
              <span className="grid place-items-center gap-2">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-navy-800 text-[30px] leading-none text-white">+</span>
                <span className="font-cond text-[14px] font-bold uppercase tracking-[.12em] text-navy-800/60">Dodaj {g === "igraci" ? "igrača" : "člana štaba"}</span>
              </span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
