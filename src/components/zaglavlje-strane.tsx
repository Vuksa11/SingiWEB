export default function ZaglavljeStrane({ kicker, naslov, opis }: { kicker: string; naslov: string; opis?: string }) {
  return (
    <section className="bg-navy-900 staze-tamne">
      <div className="mx-auto max-w-[1328px] px-5 pb-12 pt-16 sm:px-7">
        <div className="kicker text-red-300">{kicker}</div>
        <h1 className="display mt-3 text-[60px] sm:text-[88px]">{naslov}</h1>
        {opis && <p className="mt-4 max-w-2xl text-[17px] text-white/55">{opis}</p>}
      </div>
    </section>
  );
}
