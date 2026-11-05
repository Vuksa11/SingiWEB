import "server-only";
import type { Blok } from "./blokovi";
import type { Promena } from "./github";

// Slike stižu iz pregledača kao "data:image/jpeg;base64,..." (već smanjene).
// Ovde ih pretvaramo u fajlove u public/slike/... koji idu u isti commit.

export const MAX_DATA_URL = 3_000_000;

export function jeNovaSlika(url: string | null | undefined): url is string {
  return Boolean(url && url.startsWith("data:image/jpeg;base64,"));
}

export function slikaUFajl(dataUrl: string, folder: string, ime: string): { url: string; promena: Promena } {
  if (dataUrl.length > MAX_DATA_URL) throw new Error("Slika je prevelika");
  const url = `/slike/${folder}/${ime}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.jpg`;
  return { url, promena: { putanja: `public${url}`, sadrzajBase64: dataUrl.split(",")[1] } };
}

/** Nove slike iz blokova → fajlovi; vraća blokove sa pravim putanjama + promene za commit. */
export function sacuvajSlikeIzBlokova(blokovi: Blok[], folder: string, ime: string) {
  const promene: Promena[] = [];
  const novi = blokovi.map((b) => {
    if (b.tip === "slika" && jeNovaSlika(b.url)) {
      const { url, promena } = slikaUFajl(b.url, folder, ime);
      promene.push(promena);
      return { ...b, url };
    }
    return b;
  });
  return { blokovi: novi.filter((b) => !(b.tip === "slika" && !b.url)), promene };
}

/** Slike koje su postojale u starom sadržaju, a više se ne koriste → brisanje. */
export function obrisaneSlike(stari: string[], novi: string[]): Promena[] {
  const ostaju = new Set(novi);
  return stari
    .filter((u) => u.startsWith("/slike/") && !ostaju.has(u))
    .map((u) => ({ putanja: `public${u}`, obrisi: true as const }));
}

export function slikeUMarkdownu(md: string): string[] {
  return [...md.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]);
}
