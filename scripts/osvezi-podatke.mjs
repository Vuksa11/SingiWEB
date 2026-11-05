// Povlači tabelu i raspored/rezultate Singidunuma sa srbijasport.net i upisuje
// data/tabela.json i data/utakmice.json. Pokreće ga GitHub Action samo vikendom
// (.github/workflows/osvezi-podatke.yml); ručno: npm run osvezi
import { readFileSync, writeFileSync } from "node:fs";

const LIGA = "https://srbijasport.net/league/8940-prva-a-liga"; // promeni svake sezone
const KLUB = "Singidunum";
const BROJ_KOLA = 26;
const UA = { "User-Agent": "VK-Singidunum-sajt (osvezavanje vikendom)" };

const preuzmi = async (url) => {
  const odg = await fetch(url, { headers: UA });
  if (!odg.ok) throw new Error(`${url} → HTTP ${odg.status}`);
  return odg.text();
};
const tekst = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// ---------- tabela ----------
function parsirajTabelu(html) {
  const tbody = html.match(/<tbody class="data">([\s\S]*?)<\/tbody>/);
  if (!tbody) throw new Error("tabela nije pronađena");
  const kol = (r, id) => {
    const m = r.match(new RegExp(`<td[^>]*class="[^"]*col-${id}(?:\\s[^"]*)?"[^>]*>([\\s\\S]*?)</td>`));
    return m ? parseInt(tekst(m[1]).replace("+", ""), 10) || 0 : 0;
  };
  return tbody[1]
    .split(/<tr[\s>]/)
    .slice(1)
    .filter((r) => /class="team-name"/.test(r) && /pos-deleg[^"]*">\s*\d/.test(r))
    .map((r) => ({
      poz: Number(r.match(/pos-deleg[^"]*">\s*(\d+)/)[1]),
      tim: tekst(r.match(/class="team-name">([\s\S]*?)<\/div>/)[1]),
      grad: tekst(r.match(/class="team-city">([\s\S]*?)<\/div>/)?.[1] ?? ""),
      ut: kol(r, "UTAKM"), pob: kol(r, "POB"), pbp: kol(r, "POBP"), prp: kol(r, "PORP"), por: kol(r, "POR"),
      dg: kol(r, "DG"), pg: kol(r, "PG"), gr: kol(r, "GR"),
      bod: Number(r.match(/class="pts-wrapper">\s*(-?\d+)/)?.[1] ?? 0),
    }));
}

// ---------- utakmice (JSON-LD SportsEvent u svakom kolu) ----------
function parsirajKolo(html, kolo) {
  const out = [];
  for (const [, blok] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let d;
    try { d = JSON.parse(blok); } catch { continue; }
    if (d["@type"] !== "SportsEvent") continue;
    const domacin = d.homeTeam?.name, gost = d.awayTeam?.name;
    if (domacin !== KLUB && gost !== KLUB) continue;
    const rez = (d.description ?? "").match(/\s(\d+:\d+)\.?(\s|$)/);
    out.push({
      kolo,
      datum: d.startDate, // ISO sa zonom; 00:00 znači da satnica još nije objavljena
      domacin,
      gost,
      grad: d.location?.name ?? "",
      rezultat: rez ? rez[1] : null,
      link: d.url ?? null,
    });
  }
  return out;
}

const tabela = parsirajTabelu(await preuzmi(`${LIGA}/standings`));
if (tabela.length < 4) throw new Error("premalo redova u tabeli — verovatno se promenio HTML");

const utakmice = [];
for (let k = 1; k <= BROJ_KOLA; k++) {
  utakmice.push(...parsirajKolo(await preuzmi(`${LIGA}/games?round=${k}`), k));
  await new Promise((r) => setTimeout(r, 400)); // da ne opterećujemo srbijasport
}
if (utakmice.length === 0) throw new Error("nema utakmica — verovatno se promenio HTML");

// Upis samo ako se nešto promenilo (da Action ne pravi prazne commitove).
function upisi(fajl, podaci) {
  const novo = JSON.stringify(podaci, null, 2) + "\n";
  let staro = "";
  try { staro = readFileSync(fajl, "utf8"); } catch {}
  const bez = (s) => s.replace(/"azurirano": "[^"]*",?\n?/, "");
  if (bez(staro) === bez(novo)) return console.log(`${fajl}: bez promena`);
  writeFileSync(fajl, novo);
  console.log(`${fajl}: ažurirano`);
}
const sada = new Date().toISOString();
upisi("data/tabela.json", { azurirano: sada, izvor: `${LIGA}/standings`, redovi: tabela });
upisi("data/utakmice.json", { azurirano: sada, izvor: `${LIGA}/games`, utakmice });
