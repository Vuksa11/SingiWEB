import type { Metadata } from "next";
import ListaVesti from "@/components/lista-vesti";
import { sveVesti } from "@/lib/vesti";

export const metadata: Metadata = { title: "Vesti" };

export default function Vesti() {
  return <ListaVesti vesti={sveVesti()} strana={1} />;
}
