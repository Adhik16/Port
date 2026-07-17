"use client";

import dynamic from "next/dynamic";

const PixelSnowBackground = dynamic(
  () => import("@/components/three/pixel-snow-background"),
  { ssr: false }
);

export default function PixelSnowLoader() {
  return <PixelSnowBackground />;
}
