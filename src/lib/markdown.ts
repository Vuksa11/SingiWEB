import { Marked } from "marked";

// Markdown → HTML. Sirovi HTML iz teksta se ne propušta (prikazuje se kao tekst),
// a linkovi su dozvoljeni samo kao http(s)/mailto/relativni — urednik ne može
// slučajno (ili namerno) da ubaci skriptu na sajt.
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const bezbedanUrl = (u: string) => /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(u.trim());
const markdown = new Marked({
  renderer: {
    html({ text }) {
      return esc(text);
    },
    link({ href, tokens }) {
      const tekst = this.parser.parseInline(tokens);
      if (!bezbedanUrl(href)) return tekst;
      const spolja = /^https?:/i.test(href) ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${esc(href)}"${spolja}>${tekst}</a>`;
    },
    image({ href, text }) {
      if (!bezbedanUrl(href)) return "";
      return `<img src="${esc(href)}" alt="${esc(text)}" loading="lazy" />`;
    },
  },
});
export function uHtml(md: string) {
  return markdown.parse(md, { async: false }) as string;
}


export const KATEGORIJE = ["Prvi tim", "Najava", "Mlađe kategorije", "Škola vaterpola", "Klub", "Intervju"];
