import { notFound } from "next/navigation";
import { zahtevajAdmina } from "@/lib/admin-auth";
import { procitajFajl } from "@/lib/github";
import { parsiraj } from "@/lib/vesti";
import { AdminNaslov } from "@/components/admin/ui";
import FormaVesti from "../forma";

export default async function IzmeniVest({ params }: { params: Promise<{ slug: string }> }) {
  await zahtevajAdmina();
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const s = await procitajFajl(`content/vesti/${slug}.md`);
  if (!s) notFound();
  return (
    <div className="mx-auto max-w-[900px] px-5 py-14 sm:px-7">
      <AdminNaslov nazad={{ href: "/admin/vesti", tekst: "Sve vesti" }} naslov="Izmena vesti" />
      <FormaVesti pocetna={parsiraj(slug, s)} />
    </div>
  );
}
