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

Sajt živi na dva mesta, a oba se sama osvežavaju iz istog repoa:

| Šta | Gde | Ko ga objavljuje |
|---|---|---|
| Javni sajt (statički HTML) | `wpcsingidunum.rs` → `public_html` na Beotel cPanel-u | GitHub Action **Objavi sajt** (FTP) |
| Admin za urednika | Vercel adresa (`…vercel.app/admin`), urednik je čuva u bookmarku | Vercel, sam na svaki push |

```
urednik klikne „Sačuvaj" ──┐
                           ├──► commit na main ──► Vercel (admin)
ti uradiš git push ────────┘                  └──► Objavi sajt → FTP → wpcsingidunum.rs  (~1–2 min)
Osveži tabelu (sreda/vikend) ──► commit ──► pokreće Objavi sajt eksplicitno
svake noći ──► Objavi sajt (da se „sledeća utakmica" pomeri)
```

Statički build lokalno (NE u ovom folderu — briše `src/app/admin`, radi to na kopiji):
`rm -rf src/app/admin && STATIC_EXPORT=1 npx next build` → rezultat u `out/`, plus `deploy/.htaccess`.

### Vercel (admin)

Vercel → New Project → importuj `Vuksa11/SingiWEB` → dodaj promenljive iz tabele iznad → Deploy.

### FTP (javni sajt) — jednom

1. cPanel → **FTP Accounts** → novi nalog, Directory: `public_html`.
2. GitHub → repo → Settings → Secrets and variables → Actions → **Secrets**:
   `FTP_SERVER` (npr. `cpanel18.beotel.net` ili `ftp.wpcsingidunum.rs`), `FTP_USERNAME`, `FTP_PASSWORD`.
3. (Opciono) **Variables**: `FTP_FOLDER` ako nalog nije zaključan na `public_html`
   (tada `public_html/`); `FTP_PROTOKOL=ftp` samo ako `ftps` ne prolazi.

Dok `FTP_SERVER` nije postavljen, Action samo proveri da li se sajt pravi i ništa ne otprema.

### Prvo puštanje (zamena WordPress-a)

1. cPanel → **Backup** → preuzmi Home Directory i MySQL bazu WordPress-a.
2. U File Manager-u premesti sadržaj `public_html` (osim `.well-known` i `cgi-bin`) u npr. `~/stari_wordpress/`
   (van `public_html`, da stari WP ne bude dostupan).
3. Dodaj FTP secrete → Actions → **Objavi sajt** → Run workflow.
4. Proveri `https://wpcsingidunum.rs`.

FTP deploy pamti šta je otpremio (`.ftp-deploy-sync-state.json` na serveru) i šalje samo izmene;
fajlove koje nije on postavio ne bi trebalo da dira (zato se WordPress ipak premešta pre prve objave). `.htaccess` dolazi iz `deploy/.htaccess` — ručne izmene na serveru se gaze.
