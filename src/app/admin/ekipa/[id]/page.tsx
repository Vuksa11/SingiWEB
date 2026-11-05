import { notFound } from "next/navigation";
import { zahtevajAdmina } from "@/lib/admin-auth";
import { procitajFajl } from "@/lib/github";
import { parsirajEkipu, POZICIJE } from "@/lib/ekipa";
import { AdminNaslov } from "@/components/admin/ui";
import ObrisiDugme from "@/components/admin/obrisi-dugme";
import FormaClana from "../forma";
import { obrisiClanaAkcija } from "../akcije";

export default async function IzmeniClana({ params }: { params: Promise<{ id: string }> }) {
  await zahtevajAdmina();
  const { id } = await params;
  const clan = parsirajEkipu((await procitajFajl("data/igraci.json")) ?? "{}").find((c) => c.id === id);
  if (!clan) notFound();
  return (
    <div className="mx-auto max-w-[900px] px-5 py-14 sm:px-7">
      <AdminNaslov nazad={{ href: "/admin/ekipa", tekst: "Prvi tim" }} naslov={clan.ime}
        desno={<ObrisiDugme akcija={obrisiClanaAkcija} id={clan.id} pitanje={`Ukloniti ${clan.ime} iz ekipe?`} tekst="Ukloni iz ekipe" />} />
      <FormaClana pocetni={clan} grupa={clan.grupa} pozicije={POZICIJE} />
    </div>
  );
}
