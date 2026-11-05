# VK Singidunum — sajt kluba

Next.js 15 + Tailwind 4: isti stack, fontovi (Barlow / Barlow Condensed) i paleta
(navy / crvena / krem) kao aplikacija za treninge (vkbgd). Raspored sekcija po uzoru
na vktaurunum.com.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Odakle dolaze podaci

| Sekcija | Izvor | Kako se menja |
|---|---|---|
| **Tabela lige** | `data/tabela.json` ← srbijasport.net `/league/8940-prva-a-liga/standings` | automatski, vikendom |
| **Raspored i rezultati** | `data/utakmice.json` ← srbijasport.net, JSON-LD `SportsEvent` iz svakog kola (`/games?round=N`) | automatski, vikendom |
| **Vesti** | Markdown fajlovi u `content/vesti/*.md` | novi `.md` fajl (može i preko GitHub web editora) → commit → Vercel objavi |
| Podaci o klubu | `src/lib/klub.ts` | bazen SC Tašmajdan, e-mail iz registra (companywall), Instagram |

### Osvežavanje samo vikendom

`.github/workflows/osvezi-podatke.yml` pokreće `scripts/osvezi-podatke.mjs` subotom i nedeljom
svaka 2 sata (10–24h). Ako se tabela ili rezultati promene, Action napravi commit, a Vercel
posle tog commita sam objavi sajt. Radnim danima se srbijasport uopšte ne kontaktira.
Ručno: kartica **Actions → Osveži tabelu i rezultate → Run workflow**, ili lokalno `npm run osvezi`.

Svake sezone: promeni `LIGA` i `BROJ_KOLA` u skripti i `srbijasportLigaUrl` u `src/lib/klub.ts`.

Kako to radi VK Taurunum: WordPress + Elementor + njihov plugin `vk-taurunum-manager`.
Vesti su obični WordPress postovi koje sami pišu. Tabelu i utakmice vodi njihov plugin
(tabela na njihovom sajtu je za jedno kolo ispred srbijasport-a, pa je verovatno unose
ručno), a dugme „Svi rezultati" vodi na srbijasport.net/club/12447.

## Deploy

Vercel → New Project → importuj GitHub repo → bez dodatnih podešavanja.
Svaki push na `main` automatski objavljuje sajt.
