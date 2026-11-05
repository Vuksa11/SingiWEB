"use client";

import { useActionState } from "react";
import { prijavaAkcija } from "../akcije";

export default function FormaPrijave() {
  const [stanje, akcija, uToku] = useActionState(prijavaAkcija, undefined);
  return (
    <form action={akcija} className="mt-8 grid gap-4">
      <label className="grid gap-1.5">
        <span className="font-cond text-[13px] font-bold uppercase tracking-[.16em] text-navy-800/60">Lozinka</span>
        <input name="lozinka" type="password" required autoFocus autoComplete="current-password"
          className="rounded-[8px] border border-navy-800/20 bg-white px-4 py-3 text-[16px] outline-none focus:border-red-600" />
      </label>
      {stanje?.greska && <p className="text-[14px] font-semibold text-red-600">{stanje.greska}</p>}
      <button disabled={uToku} className="rounded-[8px] bg-red-600 px-5 py-3.5 font-cond text-[16px] font-bold uppercase tracking-[.16em] text-white hover:bg-red-500 disabled:opacity-60">
        {uToku ? "Proveravam…" : "Uđi"}
      </button>
    </form>
  );
}
