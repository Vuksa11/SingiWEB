"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { zahtevajAdmina } from "@/lib/admin-auth";
import { napraviCommit, procitajFajl, type Promena } from "@/lib/github";
import { parsirajEkipu, sortiraj, type Clan } from "@/lib/ekipa";
import { napraviSlug } from "@/lib/vesti";
import { jeNovaSlika, slikaUFajl, obrisaneSlike } from "@/lib/slike-server";
import type { Stanje } from "../akcije";

const FAJL = "data/igraci.json";
const sadrzaj = (c: Clan[]) => Buffer.from(JSON.stringify({ igraci: sortiraj(c) }, null, 2) + "\n", "utf8").toString("base64");

export async function sacuvajClanaAkcija(_: Stanje, fd: FormData): Promise<Stanje> {
  await zahtevajAdmina();
  const p = (k: string) => String(fd.get(k) ?? "").trim();
  const id = p("id");
  const ime = p("ime");
  const brojTekst = p("broj");
  const pozicija = p("pozicija");
  const grupa = p("grupa") === "strucni-stab" ? "strucni-stab" : "igraci";
  const slikaPolje = p("slika");

  if (ime.length < 2) return { greska: "Upiši ime i prezime." };
  const broj = brojTekst ? Number(brojTekst) : null;
  if (broj !== null && (!Number.isInteger(broj) || broj < 1 || broj > 99)) return { greska: "Broj kape mora biti od 1 do 99." };

  try {
    const ekipa = parsirajEkipu((await procitajFajl(FAJL)) ?? "{}");
    const stari = id ? ekipa.find((c) => c.id === id) : undefined;
    if (id && !stari) return { greska: "Taj član više ne postoji (možda je obrisan)." };

    const promene: Promena[] = [];
    let slika: string | null = slikaPolje || null;
    const noviId = stari?.id ?? `${napraviSlug(ime)}-${crypto.randomBytes(2).toString("hex")}`;
    if (jeNovaSlika(slikaPolje)) {
      const r = slikaUFajl(slikaPolje, "ekipa", noviId);
      slika = r.url;
      promene.push(r.promena);
    }
    if (stari?.slika) promene.push(...obrisaneSlike([stari.slika], slika ? [slika] : []));

    const clan: Clan = { id: noviId, ime, broj, pozicija, grupa, slika };
    const nova = stari ? ekipa.map((c) => (c.id === id ? clan : c)) : [...ekipa, clan];
    promene.push({ putanja: FAJL, sadrzajBase64: sadrzaj(nova) });
    await napraviCommit(`${stari ? "Izmena" : "Novi član"} ekipe: ${ime}`, promene);
  } catch (e) {
    console.error("[admin] ekipa:", e);
    return { greska: "Čuvanje nije uspelo. Pokušaj ponovo za minut." };
  }
  redirect("/admin/ekipa?sacuvano=1");
}

export async function obrisiClanaAkcija(fd: FormData) {
  await zahtevajAdmina();
  const id = String(fd.get("id") ?? "");
  const ekipa = parsirajEkipu((await procitajFajl(FAJL)) ?? "{}");
  const clan = ekipa.find((c) => c.id === id);
  if (clan) {
    await napraviCommit(`Uklonjen iz ekipe: ${clan.ime}`, [
      { putanja: FAJL, sadrzajBase64: sadrzaj(ekipa.filter((c) => c.id !== id)) },
      ...obrisaneSlike(clan.slika ? [clan.slika] : [], []),
    ]);
  }
  redirect("/admin/ekipa?obrisano=1");
}
