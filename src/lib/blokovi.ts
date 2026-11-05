// Sadržaj koji urednik slaže od blokova ("+ Tekst", "+ Podnaslov", "+ Slika").
// Na disku se čuva kao običan Markdown, pa se lako čita i bez admin panela.

export type Blok =
  | { tip: "tekst"; tekst: string }
  | { tip: "podnaslov"; tekst: string }
  | { tip: "slika"; url: string; opis: string };

const jedanRed = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function blokoviUMarkdown(blokovi: Blok[]): string {
  return blokovi
    .map((b) => {
      if (b.tip === "podnaslov") return `## ${jedanRed(b.tekst)}`;
      if (b.tip === "slika") return `![${jedanRed(b.opis).replace(/[[\]]/g, "")}](${b.url})`;
      return b.tekst.replace(/\r\n/g, "\n").trim();
    })
    .filter((s) => s && s !== "## ")
    .join("\n\n");
}

export function markdownUBlokove(md: string): Blok[] {
  const blokovi: Blok[] = [];
  for (const deo of md.replace(/\r\n/g, "\n").split(/\n{2,}/)) {
    const t = deo.trim();
    if (!t) continue;
    const slika = t.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (slika) blokovi.push({ tip: "slika", opis: slika[1], url: slika[2] });
    else if (/^#{1,3} /.test(t) && !t.includes("\n")) blokovi.push({ tip: "podnaslov", tekst: t.replace(/^#{1,3} /, "") });
    else {
      // Spoji uzastopne tekstualne pasuse u jedan blok? Ne — jedan pasus = jedan blok je jasnije.
      blokovi.push({ tip: "tekst", tekst: t });
    }
  }
  return blokovi;
}
