/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Slike iz admin panela se smanjuju u pregledaču, ali neka bude prostora.
    serverActions: { bodySizeLimit: "4mb" },
  },
};
export default nextConfig;
