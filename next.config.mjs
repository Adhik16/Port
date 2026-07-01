import { fileURLToPath } from "node:url";
import { dirname } from "node:path";https://github.com/Adhik16/Port/blob/main/next.config.mjs
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: dirname(__filename),
    turbopack: {
      root: dirname(__filename),
    },
  },
};

export default nextConfig;
