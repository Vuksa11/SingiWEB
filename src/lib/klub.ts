// Sve što je specifično za klub i takmičenje — menja se ovde, na jednom mestu.
export const KLUB = {
  ime: "Singidunum",
  punoIme: "Vaterpolo klub Singidunum",
  grad: "Beograd",
  bazen: "SC Tašmajdan",
  // Nalog linkovan sa starog sajta kluba — potvrditi da je aktivan.
  instagram: "https://www.instagram.com/vk_singidunum/",
  // Iz registra (companywall.rs) — da, piše se "singidumun".
  email: "wpcsingidumun@gmail.com",
  aplikacijaTreninzi: "https://vkbgd.vercel.app",
};

// Tabela i utakmice dolaze sa srbijasport.net preko scripts/osvezi-podatke.mjs
// (GitHub Action, samo vikendom). Svake sezone promeni ID lige i ovde i u skripti.
export const TAKMICENJE = {
  naziv: "Prva A liga",
  sezona: "2026/27",
  srbijasportLigaUrl: "https://srbijasport.net/league/8940-prva-a-liga",
  srbijasportKlubUrl: "https://srbijasport.net/club/1140-singidunum",
  // Kako se naš klub zove u tabeli (za isticanje reda).
  nazivUTabeli: "Singidunum",
};
