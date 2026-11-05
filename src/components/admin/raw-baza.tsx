"use client";

import { createContext, useContext } from "react";

// Nove slike su u GitHub repou odmah, a na sajtu tek posle objave (1–2 min).
// Zato ih admin prikazuje direktno sa GitHub-a, da urednik odmah vidi šta je postavio.
const RawBaza = createContext("");

export function RawBazaProvider({ baza, children }: { baza: string; children: React.ReactNode }) {
  return <RawBaza.Provider value={baza}>{children}</RawBaza.Provider>;
}

export function usePrikazSlike() {
  const baza = useContext(RawBaza);
  return (url: string) => (url.startsWith("/slike/") && baza ? `${baza}/public${url}` : url);
}
