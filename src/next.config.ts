import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Izinkan semua domain gambar (HTTPS & HTTP)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // 2. Konfigurasi Turbopack & Tailwind bawaan Anda
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;