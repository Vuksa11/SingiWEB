import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListaVesti, { brojStrana } from "@/components/lista-vesti";
import { sveVesti } from "@/lib/vesti";

export const dynamicParams = false;

export function generateStaticParams() {
  const ukupno = brojStrana(sveVesti().length);
  return Array.from({ length: Math.max(0, ukupno - 1) }, (_, i) => ({ broj: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ broj: string }> }): Promise<Metadata> {
  return { title: `Vesti — strana ${(await params).broj}` };
}

export default async function StranaVesti({ params }: { params: Promise<{ broj: string }> }) {
  const n = Number((await params).broj);
  const vesti = sveVesti();
  if (!Number.isInteger(n) || n < 2 || n > brojStrana(vesti.length)) notFound();
  return <ListaVesti vesti={vesti} strana={n} />;
}
