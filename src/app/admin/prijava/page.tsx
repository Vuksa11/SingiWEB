import { redirect } from "next/navigation";
import { jePrijavljen, adminPodesen } from "@/lib/admin-auth";
import FormaPrijave from "./forma";

export default async function Prijava() {
  if (adminPodesen() && (await jePrijavljen())) redirect("/admin");
  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <div className="kicker text-red-600">Uređivanje sajta</div>
      <h1 className="display mt-2 text-[52px]">Prijava</h1>
      {adminPodesen() ? (
        <FormaPrijave />
      ) : (
        <p className="mt-6 rounded-[8px] bg-amber-600/15 p-4 text-[15px]">
          Admin još nije podešen: na Vercelu treba dodati ADMIN_LOZINKA, ADMIN_TAJNA i GITHUB_TOKEN (uputstvo u README).
        </p>
      )}
    </div>
  );
}
