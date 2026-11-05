import Grb from "./grb";
import { KLUB, TAKMICENJE } from "@/lib/klub";

export default function Podnozje() {
  return (
    <footer id="kontakt" className="border-t border-white/8 bg-navy-950">
      <div className="mx-auto grid max-w-[1328px] gap-10 px-5 py-14 sm:px-7 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex items-start gap-4">
          <Grb size={64} />
          <div>
            <div className="display text-[34px]">VK {KLUB.ime}</div>
            <p className="mt-2 max-w-sm text-[15px] text-white/55">{KLUB.punoIme} · {KLUB.grad}</p>
          </div>
        </div>
        <div>
          <div className="kicker text-red-300">Kontakt</div>
          <ul className="mt-3 space-y-1.5 text-[15px] text-white/70">
            <li><a href={`mailto:${KLUB.email}`} className="hover:text-white">{KLUB.email}</a></li>
            <li>Bazen: {KLUB.bazen}</li>
            <li><a href={KLUB.instagram} className="hover:text-white">Instagram</a></li>
          </ul>
        </div>
        <div>
          <div className="kicker text-red-300">Takmičenje</div>
          <ul className="mt-3 space-y-1.5 text-[15px] text-white/70">
            <li>{TAKMICENJE.naziv} {TAKMICENJE.sezona}</li>
            <li><a href={TAKMICENJE.srbijasportKlubUrl} className="hover:text-white">Svi rezultati (srbijasport.net)</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/6 py-5 text-center text-[13px] text-white/35">
        © {new Date().getFullYear()} {KLUB.punoIme}
      </div>
    </footer>
  );
}
