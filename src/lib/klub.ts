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
};

// Takmičenje (naziv, sezona, liga) se otkriva automatski sa srbijasport.net —
// vidi scripts/osvezi-podatke.mjs i data/takmicenje.json.
import takmicenje from "../../data/takmicenje.json";

export const TAKMICENJE = {
  naziv: takmicenje.naziv,
  sezona: takmicenje.sezona,
  srbijasportLigaUrl: takmicenje.ligaUrl,
  srbijasportKlubUrl: takmicenje.klubUrl,
  nazivUTabeli: KLUB.ime,
};
