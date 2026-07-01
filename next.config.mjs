import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: "/vercel/path0", // match Vercel’s injected path
    turbopack: {
      root: "/vercel/path0",
    },
  },
};

export default nextConfig;
