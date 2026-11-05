import Link from "next/link";
export default function NijePronadjeno() {
  return (
    <section className="mx-auto max-w-[900px] px-5 py-32 text-center">
      <div className="display text-[96px] text-red-600">404</div>
      <p className="mt-4 text-white/60">Stranica ne postoji.</p>
      <Link href="/" className="mt-8 inline-block rounded-[7px] bg-red-600 px-6 py-3 font-cond font-bold uppercase tracking-[.16em]">Početna</Link>
    </section>
  );
}
