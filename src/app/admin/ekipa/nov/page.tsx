import { zahtevajAdmina } from "@/lib/admin-auth";
import { POZICIJE } from "@/lib/ekipa";
import { AdminNaslov } from "@/components/admin/ui";
import FormaClana from "../forma";

export default async function NovClan({ searchParams }: { searchParams: Promise<{ grupa?: string }> }) {
  await zahtevajAdmina();
  const grupa = (await searchParams).grupa === "strucni-stab" ? "strucni-stab" : "igraci";
  return (
    <div className="mx-auto max-w-[900px] px-5 py-14 sm:px-7">
      <AdminNaslov nazad={{ href: "/admin/ekipa", tekst: "Prvi tim" }} naslov={grupa === "igraci" ? "Novi igrač" : "Novi član štaba"} />
      <FormaClana grupa={grupa} pozicije={POZICIJE} />
    </div>
  );
}
