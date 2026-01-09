import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Isso gera a pasta 'out' com arquivos estáticos
  images: {
    unoptimized: true, // Necessário para exportação estática
  },
};

export default nextConfig;
