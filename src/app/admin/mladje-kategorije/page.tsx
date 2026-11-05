import Link from "next/link";
import { zahtevajAdmina } from "@/lib/admin-auth";
import { procitajFajl } from "@/lib/github";
import { parsirajStranicu } from "@/lib/stranice";
import { AdminNaslov, Obavestenje, dugmeSporedno } from "@/components/admin/ui";
import FormaStranice from "./forma";

export default async function AdminMladje({ searchParams }: { searchParams: Promise<{ sacuvano?: string }> }) {
  await zahtevajAdmina();
  const sp = await searchParams;
  const s = parsirajStranicu((await procitajFajl("content/stranice/mladje-kategorije.md")) ?? "");
  return (
    <div className="mx-auto max-w-[900px] px-5 py-14 sm:px-7">
      <AdminNaslov nazad={{ href: "/admin", tekst: "Uređivanje sajta" }} naslov="Mlađe kategorije"
        desno={<Link href="/mladje-kategorije" target="_blank" className={dugmeSporedno}>Pogledaj stranicu</Link>} />
      {sp.sacuvano && <Obavestenje>Stranica je sačuvana.</Obavestenje>}
      <FormaStranice pocetno={s} />
    </div>
  );
}
