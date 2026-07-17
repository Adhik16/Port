"use client";

import { useEffect, useState } from "react";
import PixelSnow from "./pixel-snow";

export default function PixelSnowBackground() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Don't render during SSR or if user prefers reduced motion
  if (!mounted || reducedMotion) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <PixelSnow
        color="#a855f7"
        flakeSize={0.008}
        minFlakeSize={1.0}
        pixelResolution={150}
        speed={0.8}
        brightness={0.6}
        density={0.25}
        variant="snowflake"
        direction={135}
      />
    </div>
  );
}
