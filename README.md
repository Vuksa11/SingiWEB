# VK Singidunum — sajt kluba

Next.js 15 + Tailwind 4: isti stack, fontovi (Barlow / Barlow Condensed) i paleta
(navy / crvena / krem) kao aplikacija za treninge (vkbgd).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Šta se menja samo, a šta ručno

| Deo sajta | Odakle | Ko menja |
|---|---|---|
| **Tabela, raspored, rezultati, sezona** | srbijasport.net → `data/takmicenje.json`, `data/tabela.json`, `data/utakmice.json` | **samo** (GitHub Action sredom i vikendom) |
| **Vesti** | `content/vesti/*.md` | novinar u admin panelu |
| **Prvi tim** (igrači, stručni štab) | `data/igraci.json` + slike u `public/slike/ekipa/` | novinar u admin panelu |
| **Mlađe kategorije** | `content/stranice/mladje-kategorije.md` + slike | novinar u admin panelu |
| Kontakt, bazen, Instagram | `src/lib/klub.ts` | programer (retko) |

### Automatsko osvežavanje (srbijasport.net)

`.github/workflows/osvezi-podatke.yml` pokreće `scripts/osvezi-podatke.mjs` sredom, subotom i
nedeljom svaka 2 sata (10–24h). Skripta **sama pronalazi aktuelnu sezonu**: uzima prvo takmičenje
iz „Istorije" na strani kluba (`srbijasport.net/club/1140-singidunum`), pa nova sezona ne zahteva
izmenu koda. Ako se nešto promeni, Action napravi commit, a Vercel posle njega objavi sajt.
Isti Action sam sebe drži uključenim (GitHub inače gasi zakazane Action-e posle 60 dana mirovanja).

Ručno: **Actions → Osveži tabelu i rezultate → Run workflow**, ili lokalno `npm run osvezi`.

## Admin panel — `/admin`

Novinar otvori `sajt/admin`, upiše lozinku i radi samo kroz forme — **ne treba mu GitHub nalog
niti ikakvo znanje o kodu.** U pozadini sajt sam sačuva izmenu u ovaj repo (preko tokena na
Vercelu), a Vercel posle toga objavi sajt za 1–2 minuta.

- **Vesti** — naslov, datum, kategorija, naslovna slika, kratak opis; tekst se slaže dugmetom
  „+ Dodaj sadržaj" (tekst / podnaslov / slika), blokovi se pomeraju strelicama.
- **Prvi tim** — kartica sa „+" dodaje igrača ili člana štaba (ime, broj kape, pozicija, slika).
- **Mlađe kategorije** — naslov, uvod, velika slika i sadržaj od blokova kao kod vesti.

Slike se smanjuju u pregledaču pre slanja (telefon može da pošalje i 10 MB), pa upload radi i sa mobilnog.

### Podešavanje (jednom, ti — na Vercelu → Settings → Environment Variables)

| Promenljiva | Vrednost |
|---|---|
| `ADMIN_LOZINKA` | lozinka koju daješ novinaru |
| `ADMIN_TAJNA` | nasumičan niz, min. 32 znaka: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GITHUB_TOKEN` | fine-grained token (vidi ispod) |
| `GITHUB_REPO` | (opciono) podrazumevano `Vuksa11/SingiWEB` |

**GitHub token:** github.com → Settings → Developer settings → Personal access tokens →
Fine-grained tokens → Generate new token:
- Repository access: **Only select repositories → SingiWEB**
- Permissions → Repository permissions → **Contents: Read and write** (ništa drugo)
- Expiration: najduže što GitHub dozvoli. GitHub šalje mejl pre isteka; tada se napravi novi
  token i zameni na Vercelu.

Posle dodavanja promenljivih: Vercel → Deployments → poslednji → **Redeploy**.

Lokalno: iste promenljive u `.env.local` (ne ide u git).

## Deploy

Vercel → New Project → importuj `Vuksa11/SingiWEB` → dodaj promenljive iz tabele iznad → Deploy.
Svaki push na `main` (i svaka izmena iz admina) automatski objavljuje sajt.
