// Dva načina gradnje:
// - Vercel (podrazumevano): ceo app sa /admin (server actions).
// - STATIC_EXPORT=1 (GitHub Action "Objavi sajt"): samo javni deo kao gotov HTML u out/,
//   koji ide preko FTP-a u public_html na wpcsingidunum.rs. Action pre toga obriše src/app/admin.

const staticki = process.env.STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = staticki
  ? {
      output: "export",
      trailingSlash: true, // /vesti/ → vesti/index.html, Apache to služi bez rewrite pravila
      images: { unoptimized: true },
    }
  : {
      experimental: {
        // Slike iz admin panela se smanjuju u pregledaču, ali neka bude prostora.
        serverActions: { bodySizeLimit: "4mb" },
      },
    };

export default nextConfig;
