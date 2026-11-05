"use server";

import { redirect } from "next/navigation";
import { proveriLozinku, prijavi, odjavi } from "@/lib/admin-auth";

export type Stanje = { greska?: string } | undefined;

export async function prijavaAkcija(_: Stanje, fd: FormData): Promise<Stanje> {
  if (!proveriLozinku(String(fd.get("lozinka") ?? ""))) {
    await new Promise((r) => setTimeout(r, 1200)); // usporava pogađanje lozinke
    return { greska: "Pogrešna lozinka." };
  }
  await prijavi();
  redirect("/admin");
}

export async function odjavaAkcija() {
  await odjavi();
  redirect("/admin/prijava");
}

