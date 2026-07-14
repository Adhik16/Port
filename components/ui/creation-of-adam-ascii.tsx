"use client";

import { motion } from "framer-motion";

/**
 * Connection animation for the contact section:
 * two glowing nodes with a pulsing beam between them.
 */
export function CreationOfAdamAscii() {
  return (
    <motion.div
      className="relative flex items-center justify-center h-24 select-none"
      whileHover="connected"
      initial="rest"
      animate="rest"
    >
      {/* ── Left node — YOU ── */}
      <motion.div
        className="relative flex items-center gap-2"
        variants={{
          rest: { x: 0 },
          connected: {
            x: -8,
            transition: { duration: 0.5, ease: "easeOut" },
          },
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          variants={{
            rest: { scale: 1, opacity: 0.2 },
            connected: {
              scale: [1, 1.6, 1],
              opacity: [0.2, 0.5, 0.2],
              transition: {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror" as const,
              },
            },
          }}
          style={{
            width: 40,
            height: 40,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
          }}
        />

        {/* Core node */}
        <motion.div
          className="relative z-10 h-5 w-5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
          variants={{
            rest: { scale: 1 },
            connected: {
              scale: [1, 1.3, 1],
              transition: {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror" as const,
              },
            },
          }}
        />
        <span className="text-[10px] font-mono text-purple-400/70">YOU</span>
      </motion.div>

      {/* ── Connection beam ── */}
      <motion.div
        className="relative mx-3 flex items-center"
        style={{ width: 80 }}
      >
        {/* Dashed line bg */}
        <div className="absolute inset-0 flex items-center">
          <div className="h-[1px] w-full bg-purple-500/15" />
        </div>

        {/* Animated beam */}
        <motion.div
          className="absolute inset-0 flex items-center overflow-hidden"
          variants={{
            rest: { opacity: 0.3 },
            connected: { opacity: 1 },
          }}
        >
          <motion.div
            className="h-[2px] w-full bg-gradient-to-r from-purple-400/0 via-purple-400 to-purple-400/0"
            variants={{
              rest: { scaleX: 0.3 },
              connected: {
                scaleX: [0.3, 1, 0.3],
                transition: {
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop" as const,
                },
              },
            }}
          />
        </motion.div>

        {/* Traveling dot on the beam */}
        <motion.div
          className="absolute h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
          variants={{
            rest: { left: "20%" },
            connected: {
              left: ["20%", "80%", "20%"],
              transition: {
                duration: 1.2,
                ease: "easeInOut",
                repeat: Infinity,
              },
            },
          }}
        />
      </motion.div>

      {/* ── Right node — ME ── */}
      <motion.div
        className="relative flex items-center gap-2"
        variants={{
          rest: { x: 0 },
          connected: {
            x: 8,
            transition: { duration: 0.5, ease: "easeOut" },
          },
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          variants={{
            rest: { scale: 1, opacity: 0.2 },
            connected: {
              scale: [1, 1.6, 1],
              opacity: [0.2, 0.5, 0.2],
              transition: {
                duration: 1.5,
                delay: 0.4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror" as const,
              },
            },
          }}
          style={{
            width: 40,
            height: 40,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(52,211,153,0.6) 0%, transparent 70%)",
          }}
        />

        {/* Core node */}
        <motion.div
          className="relative z-10 h-5 w-5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
          variants={{
            rest: { scale: 1 },
            connected: {
              scale: [1, 1.3, 1],
              transition: {
                delay: 0.4,
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror" as const,
              },
            },
          }}
        />
        <span className="text-[10px] font-mono text-emerald-400/70">ME</span>
      </motion.div>
    </motion.div>
  );
}


