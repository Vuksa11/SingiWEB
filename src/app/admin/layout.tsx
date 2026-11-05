import type { Metadata } from "next";
import { RawBazaProvider } from "@/components/admin/raw-baza";
import { rawBaza } from "@/lib/github";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] bg-cream-100 text-navy-800">
      <RawBazaProvider baza={rawBaza()}>{children}</RawBazaProvider>
    </div>
  );
}
