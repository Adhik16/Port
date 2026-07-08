"use client";

import { useState, useEffect } from "react";
import { TerminalIntro } from "@/components/terminal-intro";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalIntroWrapperProps {
  children: React.ReactNode;
}

export function TerminalIntroWrapper({ children }: TerminalIntroWrapperProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  // Check if user has already seen the intro in this session
  useEffect(() => {
    const seen = sessionStorage.getItem("terminal-intro-seen");
    if (seen === "true") {
      setShowIntro(false);
      setContentReady(true);
    }
  }, []);

  function handleIntroComplete() {
    sessionStorage.setItem("terminal-intro-seen", "true");
    setShowIntro(false);
    // Small delay to let exit animation play
    setTimeout(() => {
      setContentReady(true);
    }, 100);
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && <TerminalIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {contentReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
