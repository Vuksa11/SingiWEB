import { zahtevajAdmina } from "@/lib/admin-auth";
import { AdminNaslov } from "@/components/admin/ui";
import FormaVesti from "../forma";

export default async function NovaVest() {
  await zahtevajAdmina();
  return (
    <div className="mx-auto max-w-[900px] px-5 py-14 sm:px-7">
      <AdminNaslov nazad={{ href: "/admin/vesti", tekst: "Sve vesti" }} naslov="Nova vest" />
      <FormaVesti />
    </div>
  );
}
