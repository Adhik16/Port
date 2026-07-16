"use client";

import { motion } from "framer-motion";
import { ArrowDown, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import DecryptedText from "@/components/ui/decrypted-text";
import dynamic from "next/dynamic";

// ── PREVIEW TOGGLE ──────────────────────────────────────────
const USE_NETWORK_GLOBE = true;
// ────────────────────────────────────────────────────────────

const RotatingShield = dynamic(
  () => import("@/components/three/rotating-shield"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    ),
  }
);

const NetworkGlobe = dynamic(
  () => import("@/components/three/network-globe"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    ),
  }
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero introduction"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-20 h-full">
        <motion.div
          className="h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left: Text content */}
          <div className="flex flex-col gap-6 max-w-[42%]">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono">
                <ShieldAlert className="h-4 w-4" />
                Security Operations Center
              </div>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono tracking-tight leading-normal"
            >
              <DecryptedText
                text="Hello there,"
                animateOn="view"
                sequential
                speed={80}
                maxIterations={15}
                className="text-foreground"
              />
              <br />
              <DecryptedText
                text="Adhik Shakya"
                animateOn="view"
                sequential
                speed={80}
                maxIterations={15}
                className="text-primary"
              />
              {" "}
              <DecryptedText
                text="here."
                animateOn="view"
                sequential
                speed={80}
                maxIterations={15}
                className="text-foreground"
              />
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              A passionate{" "}
              <span className="text-foreground font-semibold">SOC Analyst</span>{" "}
              dedicated to defending digital frontiers. I specialize in threat
              detection, incident response, and building resilient security
              operations.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Projects
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get in Touch
              </Button>
            </motion.div>
          </div>

          {/* Right: 3D Scene — absolutely positioned to cover right side */}
          <motion.div
            variants={itemVariants}
            className="absolute right-0 top-0 w-[55%] h-full"
          >
            {USE_NETWORK_GLOBE ? <NetworkGlobe /> : <RotatingShield />}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
        aria-hidden="true"
      >
        <ArrowDown className="h-5 w-5 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
