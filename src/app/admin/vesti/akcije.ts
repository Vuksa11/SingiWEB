"use server";

import { redirect } from "next/navigation";
import { zahtevajAdmina } from "@/lib/admin-auth";
import { napraviCommit, listaFajlova, procitajFajl, type Promena } from "@/lib/github";
import { napraviMarkdown, napraviSlug, parsiraj } from "@/lib/vesti";
import { blokoviUMarkdown, type Blok } from "@/lib/blokovi";
import { jeNovaSlika, slikaUFajl, sacuvajSlikeIzBlokova, obrisaneSlike, slikeUMarkdownu } from "@/lib/slike-server";
import type { Stanje } from "../akcije";

const FOLDER = "content/vesti";

export async function sacuvajVestAkcija(_: Stanje, fd: FormData): Promise<Stanje> {
  await zahtevajAdmina();
  const polje = (k: string) => String(fd.get(k) ?? "").trim();
  const naslov = polje("naslov");
  const datum = polje("datum");
  const kategorija = polje("kategorija");
  const sazetak = polje("sazetak");
  const postojeciSlug = polje("slug");
  const naslovna = polje("naslovna"); // "" | /slike/... | data:...
  let blokovi: Blok[];
  try {
    blokovi = JSON.parse(String(fd.get("blokovi") ?? "[]"));
  } catch {
    return { greska: "Sadržaj nije ispravan." };
  }

  if (naslov.length < 5) return { greska: "Naslov je prekratak (bar 5 slova)." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) return { greska: "Datum nije ispravan." };
  if (!blokovi.some((b) => (b.tip === "slika" ? b.url : b.tekst.trim()))) return { greska: "Vest nema sadržaj — dodaj bar jedan tekst." };
  if (postojeciSlug && !/^[a-z0-9-]+$/.test(postojeciSlug)) return { greska: "Neispravna vest." };

  let slug = postojeciSlug;
  try {
    if (!slug) {
      const postojeci = new Set((await listaFajlova(FOLDER)).map((f) => f.replace(/\.md$/, "")));
      const osnova = napraviSlug(naslov);
      slug = osnova;
      for (let i = 2; postojeci.has(slug); i++) slug = `${osnova}-${i}`;
    }

    const promene: Promena[] = [];
    let slika: string | null = naslovna || null;
    if (jeNovaSlika(naslovna)) {
      const r = slikaUFajl(naslovna, "vesti", slug);
      slika = r.url;
      promene.push(r.promena);
    }
    const sacuvano = sacuvajSlikeIzBlokova(blokovi, "vesti", slug);
    promene.push(...sacuvano.promene);
    const telo = blokoviUMarkdown(sacuvano.blokovi);

    // Stare slike koje više nisu u vesti → obriši ih iz repoa.
    if (postojeciSlug) {
      const staro = await procitajFajl(`${FOLDER}/${slug}.md`);
      if (staro) {
        const s = parsiraj(slug, staro);
        promene.push(...obrisaneSlike([...(s.slika ? [s.slika] : []), ...slikeUMarkdownu(s.telo)], [...(slika ? [slika] : []), ...slikeUMarkdownu(telo)]));
      }
    }

    const md = napraviMarkdown({ naslov, datum, kategorija: kategorija || "Klub", sazetak, telo, slika });
    promene.push({ putanja: `${FOLDER}/${slug}.md`, sadrzajBase64: Buffer.from(md, "utf8").toString("base64") });
    await napraviCommit(`${postojeciSlug ? "Izmena vesti" : "Nova vest"}: ${naslov}`, promene);
  } catch (e) {
    console.error("[admin] čuvanje vesti:", e);
    return { greska: "Čuvanje nije uspelo. Ako ima mnogo novih slika, sačuvaj pa dodaj ostale u izmeni. Inače pokušaj ponovo za minut." };
  }
  redirect(`/admin/vesti?sacuvano=1`);
}

export async function obrisiVestAkcija(fd: FormData) {
  await zahtevajAdmina();
  const slug = String(fd.get("id") ?? "");
  if (!/^[a-z0-9-]+$/.test(slug)) redirect("/admin/vesti");
  const putanja = `${FOLDER}/${slug}.md`;
  const sadrzaj = await procitajFajl(putanja);
  if (sadrzaj) {
    const v = parsiraj(slug, sadrzaj);
    await napraviCommit(`Brisanje vesti: ${v.naslov}`, [
      { putanja, obrisi: true },
      ...obrisaneSlike([...(v.slika ? [v.slika] : []), ...slikeUMarkdownu(v.telo)], []),
    ]);
  }
  redirect("/admin/vesti?obrisano=1");
}
