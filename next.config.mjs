import { fileURLToPath } from "node:url";
import { dirname } from "node:path";https://github.com/Adhik16/Port/blob/main/next.config.mjs
const __dirname = dirname(__filename);
const __dirname = dirname(__dirname);
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: dirname(__filename),
    outputFileTracingRoot: dirname(__dirname),
    turbopack: {
      root: dirname(__filename),
      root: dirname(__dirname),
    },
  },
};

export default nextConfig;
