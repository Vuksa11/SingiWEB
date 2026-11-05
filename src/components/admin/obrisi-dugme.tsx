"use client";

import { useFormStatus } from "react-dom";

function Dugme({ tekst }: { tekst: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="rounded-[7px] border border-red-600/30 bg-white px-3.5 py-2 font-cond text-[13px] font-bold uppercase tracking-[.14em] text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50">
      {pending ? "Brišem…" : tekst}
    </button>
  );
}

/** Dugme za brisanje sa potvrdom. */
export default function ObrisiDugme({ akcija, id, pitanje, tekst = "Obriši" }: { akcija: (fd: FormData) => Promise<void>; id: string; pitanje: string; tekst?: string }) {
  return (
    <form action={akcija} onSubmit={(e) => { if (!confirm(pitanje)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <Dugme tekst={tekst} />
    </form>
  );
}
