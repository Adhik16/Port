import { fileURLToPath } from "node:url";
import { dirname } from "node:path";https://github.com/Adhik16/Port/blob/main/next.config.mjs
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __dirname = dirname(__dirname);
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: "/vercel/path0",
    outputFileTracingRoot: "/vercel/path0",
    turbopack: {
      root: "/vercel/path0",
      root: "/vercel/path0",
    },
  },
};

export default nextConfig;
