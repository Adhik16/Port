"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, CheckCircle, Cpu } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface LogLine {
  id: number;
  text: string;
  type: "info" | "warn" | "success" | "error" | "highlight" | "dim";
}

interface ScanStep {
  label: string;
  icon: React.ReactNode;
  logs: string[];
  duration: number;
}

// ─── Scan Steps Definition ───────────────────────────────────────────────────
const SCAN_STEPS: ScanStep[] = [
  {
    label: "INITIALIZING SECURE CHANNEL",
    icon: <Shield className="w-4 h-4" />,
    logs: [
      "[*] Establishing encrypted handshake...",
      "[+] TLS 1.3 session negotiated",
      "[+] Certificate pinned — issuer: Let's Encrypt R3",
      "[*] Cipher suite: TLS_AES_256_GCM_SHA384",
      "[+] Perfect Forward Secrecy: ENABLED",
      "[OK] Secure channel established",
    ],
    duration: 2000,
  },
  {
    label: "IDENTITY VERIFICATION",
    icon: <CheckCircle className="w-4 h-4" />,
    logs: [
      "[*] Verifying session integrity...",
      "[+] Session token validated",
      "[+] Origin verified — same-origin policy enforced",
      "[+] Referrer policy: STRICT",
      "[*] Checking CORS preflight...",
      "[+] Cross-origin requests: BLOCKED",
      "[OK] Identity verified",
    ],
    duration: 2200,
  },
  {
    label: "FINALIZING CONNECTION",
    icon: <Cpu className="w-4 h-4" />,
    logs: [
      "[*] Compiling scan report...",
      "[+] Checks performed: 19",
      "[+] Threats detected: 0",
      "[+] Security score: 98/100",
      "[*] Encrypting session token...",
      "[*] Establishing secure session...",
      "[+] Session encrypted with AES-256-GCM",
      "[OK] Scan complete. Access granted.",
    ],
    duration: 2800,
  },
];

// ─── Glitch Text Effect ──────────────────────────────────────────────────────
function GlitchText({ text, active }: { text: string; active: boolean }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{text}</span>
      {active && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 z-0 text-red-500/70 translate-x-[1px] -translate-y-[1px]"
            style={{ clipPath: "inset(40% 0 30% 0)" }}
          >
            {text}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 z-0 text-blue-500/70 -translate-x-[1px] translate-y-[1px]"
            style={{ clipPath: "inset(60% 0 10% 0)" }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}

// ─── Binary Rain Background (Matrix-style 0/1 characters) ────────────────────

interface Drop {
  x: number;
  y: number;
  speed: number;
  value: string; // single binary string like "00110111001"
}

function BinaryRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const fontSize = 13;
    let drops: Drop[] = [];

    function randomBinary(): string {
      const len = 7 + Math.floor(Math.random() * 15); // 7-21 chars like "00110111001101"
      let s = "";
      for (let i = 0; i < len; i++) s += Math.random() < 0.5 ? "0" : "1";
      return s;
    }

    // Rough pixel width of a binary string
    function strWidth(s: string): number {
      return s.length * fontSize * 0.6; // monospace approx
    }

    function initDrops() {
      drops = [];
      const maxAttempts = 300;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const val = randomBinary();
        const w = strWidth(val);
        const x = Math.random() * canvas!.width;
        // Simple overlap check
        const tooClose = drops.some(
          (d) => Math.abs(d.x - x) < strWidth(d.value) + fontSize * 2
        );
        if (!tooClose) {
          drops.push({
            x,
            y: Math.random() * canvas!.height * 2 - canvas!.height,
            speed: 0.4 + Math.random() * 1.8,
            value: val,
          });
        }
      }
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initDrops();
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!ctx || !canvas) return;

      // Fast fade — strings don't leave long trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Geist Mono", "Courier New", monospace`;
      ctx.textAlign = "left";

      const purple = activeRef.current;

      for (const drop of drops) {
        // Bright green / purple — single string, clearly visible
        ctx.fillStyle = purple
          ? "rgba(190, 140, 250, 0.75)"
          : "rgba(100, 240, 120, 0.7)";
        ctx.fillText(drop.value, drop.x, drop.y);

        // Slowly drift
        drop.y += drop.speed;

        // Occasional bit flip
        if (Math.random() < 0.02) {
          const arr = drop.value.split("");
          const ri = Math.floor(Math.random() * arr.length);
          arr[ri] = Math.random() < 0.5 ? "0" : "1";
          drop.value = arr.join("");
        }

        // Reset when off screen
        if (drop.y > canvas.height + fontSize * 2) {
          drop.y = -fontSize * 2 - Math.random() * 300;
          drop.x = Math.random() * canvas!.width;
          drop.value = randomBinary();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

// ─── Progress Bar ────────────────────────────────────────────────────────────
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, 
            oklch(0.72 0.22 142 / ${1 - progress}), 
            oklch(0.62 0.22 300 / ${progress})
          )`,
        }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
interface TerminalIntroProps {
  onComplete: () => void;
}

export function TerminalIntro({ onComplete }: TerminalIntroProps) {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [scanPassed, setScanPassed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const totalDuration = SCAN_STEPS.reduce((sum, s) => sum + s.duration, 0);
  const elapsedRef = useRef(0);
  const logIdCounter = useRef(0);

  // ── Auto-scroll terminal ──
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, charIndex]);

  // ── Show skip button after 3 seconds ──
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // ── Glitch effect ──
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100 + Math.random() * 200);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // ── Typewriter effect for current log line ──
  const currentLogText = currentStep < SCAN_STEPS.length
    ? SCAN_STEPS[currentStep].logs[currentLogIndex] ?? ""
    : "";

  useEffect(() => {
    if (isComplete || currentStep >= SCAN_STEPS.length) return;

    if (charIndex < currentLogText.length) {
      const speed = Math.random() * 20 + 8; // 8-28ms per char
      const timer = setTimeout(() => {
        setCharIndex((c) => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const prefix = currentLogText.startsWith("[OK]") || currentLogText.startsWith("[+]")
        ? "success"
        : currentLogText.startsWith("[-]")
          ? "error"
          : "normal";
      const delay = prefix === "success" ? 250 : prefix === "error" ? 180 : 400;

      const timer = setTimeout(() => {
        addLogLine(currentLogText);
        setCharIndex(0);

        const nextLogIndex = currentLogIndex + 1;
        if (nextLogIndex < SCAN_STEPS[currentStep].logs.length) {
          setCurrentLogIndex(nextLogIndex);
        } else {
          // Move to next step
          const nextStep = currentStep + 1;
          if (nextStep < SCAN_STEPS.length) {
            // Add step header
            const headerId = logIdCounter.current++;
            setLogs((prev) => [
              ...prev,
              { id: headerId, text: "", type: "dim" },
              {
                id: headerId + 0.5,
                text: `╔══ ${SCAN_STEPS[nextStep].label} ${"═".repeat(40)}`,
                type: "highlight",
              },
            ]);
            setCurrentStep(nextStep);
            setCurrentLogIndex(0);
          } else {
            finishIntro();
          }
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIndex, currentLogText, currentStep, currentLogIndex, isComplete]);

  // ── Progress tracker ──
  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      elapsedRef.current += 100;
      setProgress(Math.min(elapsedRef.current / totalDuration, 1));
    }, 100);
    return () => clearInterval(interval);
  }, [isComplete, totalDuration]);

  function addLogLine(text: string) {
    const type: LogLine["type"] = text.startsWith("[+]") || text.startsWith("[OK]")
      ? "success"
      : text.startsWith("[-]")
        ? "error"
        : text.startsWith("[!]")
          ? "warn"
          : text.startsWith("╔")
            ? "highlight"
            : text === ""
              ? "dim"
              : "info";
    setLogs((prev) => [...prev, { id: logIdCounter.current++, text, type }]);
  }

  function finishIntro() {
    setIsComplete(true);
    setProgress(1);
    setScanPassed(true);

    addLogLine("");
    addLogLine("╔══ SCAN PASSED — ACCESS GRANTED ═════════════════════");
    addLogLine("║  All security checks passed successfully.");
    addLogLine("║  Welcome to the Security Operations Center.");
    addLogLine("╚══════════════════════════════════════════════════════");

    setTimeout(() => {
      onComplete();
    }, 2200);
  }

  function handleSkip() {
    setIsComplete(true);
    setProgress(1);
    setScanPassed(true);
    setTimeout(() => onComplete(), 400);
  }

  const logColor = (type: LogLine["type"]) => {
    // When scan passes, shift everything to purple tones
    if (scanPassed) {
      switch (type) {
        case "success":
          return "text-purple-400";
        case "error":
          return "text-purple-300/60";
        case "warn":
          return "text-purple-300/70";
        case "highlight":
          return "text-purple-300";
        case "dim":
          return "text-purple-400/50";
        default:
          return "text-purple-300/80";
      }
    }
    switch (type) {
      case "success":
        return "text-emerald-400";
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      case "highlight":
        return "text-cyan-400";
      case "dim":
        return "text-zinc-600";
      default:
        return "text-green-400";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          filter: "blur(10px)",
          scale: 1.05,
          transition: { duration: 0.7, ease: "easeInOut" },
        }}
      >
        {/* Binary rain background — green → purple on pass */}
        <BinaryRain active={scanPassed} />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

        {/* Purple glow overlay when scan passes */}
        <AnimatePresence>
          {scanPassed && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0.08, 0.12, 0.06] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(0.62 0.22 300 / 0.5) 0%, transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Glitch overlay */}
        <AnimatePresence>
          {glitchActive && (
            <motion.div
              className="absolute inset-0 pointer-events-none bg-white/5 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* Main terminal container */}
        <motion.div
          className="relative w-full max-w-3xl mx-4 z-30"
          initial={{ y: 30, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            boxShadow: scanPassed
              ? "0 0 40px oklch(0.62 0.22 300 / 0.4), 0 0 80px oklch(0.62 0.22 300 / 0.2)"
              : "none",
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          {/* Terminal header bar */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950 border rounded-t-lg transition-colors duration-700"
            animate={{
              borderColor: scanPassed
                ? "oklch(0.62 0.22 300 / 0.6)"
                : "oklch(0.28 0.03 280 / 0.5)",
            }}
          >
            <div className="flex gap-1.5">
              <motion.div
                className="w-3 h-3 rounded-full"
                animate={{
                  backgroundColor: scanPassed
                    ? "oklch(0.62 0.22 300 / 0.9)"
                    : "oklch(0.6 0.22 20 / 0.8)",
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full"
                animate={{
                  backgroundColor: scanPassed
                    ? "oklch(0.62 0.22 300 / 0.7)"
                    : "oklch(0.7 0.18 85 / 0.8)",
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full"
                animate={{
                  backgroundColor: scanPassed
                    ? "oklch(0.62 0.22 300 / 0.9)"
                    : "oklch(0.72 0.22 142 / 0.8)",
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex-1 text-center">
              <GlitchText
                text={scanPassed ? "ACCESS GRANTED — WELCOME" : "SOC ANALYST TERMINAL v2.4 — SECURE CONNECTION"}
                active={glitchActive}
              />
              <motion.span
                className="text-xs font-mono ml-2"
                animate={{
                  color: scanPassed
                    ? "oklch(0.62 0.22 300)"
                    : "oklch(0.65 0.02 280)",
                }}
                transition={{ duration: 0.5 }}
              >
                {scanPassed ? "ALL CHECKS PASSED" : SCAN_STEPS[currentStep]?.label ?? "FINALIZING"}
              </motion.span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              {Math.round(progress * 100)}%
            </span>
          </motion.div>

          {/* Terminal body */}
          <motion.div
            ref={terminalRef}
            className="h-[420px] overflow-y-auto bg-black border-x border-b rounded-b-lg p-4 font-mono text-xs leading-relaxed transition-colors duration-700"
            animate={{
              borderColor: scanPassed
                ? "oklch(0.62 0.22 300 / 0.6)"
                : "oklch(0.28 0.03 280 / 0.5)",
            }}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "oklch(0.62 0.22 300 / 0.3) transparent",
            }}
          >
            {/* Startup banner */}
            <motion.div
              className="mb-3"
              animate={{ color: scanPassed ? "oklch(0.62 0.22 300 / 0.9)" : "oklch(0.64 0.18 190 / 0.8)" }}
              transition={{ duration: 0.5 }}
            >
              <pre className="text-[10px] leading-tight mb-2">
{`   _____  ____   _____          _        _   _         
  / ____|/ __ \\ / ____|   /\\   | |      | | (_)        
 | (___ | |  | | |       /  \\  | |_ __ _| |_ _  ___   
  \\___ \\| |  | | |      / /\\ \\ | __/ _\` | __| |/ __|  
  ____) | |__| | |____ / ____ \\| || (_| | |_| | (__ _ 
 |_____/ \\___\\_\\\\_____/_/    \\_\\\\__\\__,_|\\__|_|\\___(_)
                                                      `}</pre>
              <motion.div
                className="text-[10px]"
                animate={{
                  color: scanPassed
                    ? "oklch(0.62 0.22 300 / 0.8)"
                    : "oklch(0.72 0.22 142 / 0.7)",
                }}
                transition={{ duration: 0.5 }}
              >
                ╔══════════════════════════════════════════════════════╗
                ║  SOC ANALYST PORTFOLIO — SECURE TERMINAL INTERFACE  ║
                ║         Security clearance: VERIFIED                ║
                ╚══════════════════════════════════════════════════════╝
              </motion.div>
            </motion.div>

            <div className="text-zinc-500 text-[10px] mb-3">
              [System] Initializing security scan sequence...
            </div>

              {/* Step header */}
              <motion.div
                className="font-bold mb-2 text-[10px]"
                animate={{
                  color: scanPassed
                    ? "oklch(0.62 0.22 300 / 0.9)"
                    : "oklch(0.64 0.18 190 / 0.8)",
                }}
                transition={{ duration: 0.5 }}
              >
                ╔══ {SCAN_STEPS[0]?.label} {"═".repeat(40)}
              </motion.div>

              {/* Log lines */}
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`${logColor(log.type)} ${log.type === "highlight" ? "font-bold" : ""} ${log.type === "dim" ? "" : ""}`}
                  style={{ minHeight: log.text === "" ? "0.5em" : "auto" }}
                >
                  {log.text}
                </div>
              ))}

              {/* Current typing line */}
              {currentStep < SCAN_STEPS.length && (
                <div className={logColor(
                  currentLogText.startsWith("[+]") || currentLogText.startsWith("[OK]")
                    ? "success"
                    : currentLogText.startsWith("[-]")
                      ? "error"
                      : currentLogText.startsWith("[!]")
                        ? "warn"
                        : "info"
                )}>
                  {currentLogText.slice(0, charIndex)}
                  <motion.span
                    className="inline-block w-2 h-3.5 bg-current align-middle ml-0.5"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
              )}
            </motion.div>

            {/* Terminal footer */}
            <motion.div
              className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-x border-b rounded-b-lg transition-colors duration-700"
              animate={{
                borderColor: scanPassed
                  ? "oklch(0.62 0.22 300 / 0.6)"
                  : "oklch(0.28 0.03 280 / 0.5)",
              }}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{ color: scanPassed ? "oklch(0.62 0.22 300)" : "oklch(0.72 0.22 142)" }}
                    transition={{ duration: 0.5 }}
                  >
                    <Lock className="w-3 h-3" />
                  </motion.div>
                  <span className="text-zinc-300">ENCRYPTED</span>
                </div>
                <span className="text-zinc-600">|</span>
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{ color: scanPassed ? "oklch(0.62 0.22 300)" : "oklch(0.72 0.22 142)" }}
                    transition={{ duration: 0.5 }}
                  >
                    <Shield className="w-3 h-3" />
                  </motion.div>
                  <span className="text-zinc-300">TLS 1.3</span>
                </div>
                <span className="text-zinc-600">|</span>
                <motion.span
                  className="text-zinc-300"
                  animate={{ color: scanPassed ? "oklch(0.62 0.22 300)" : "oklch(0.72 0.22 142)" }}
                  transition={{ duration: 0.5 }}
                >
                  SECURE
                </motion.span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">
                SESSION: {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
            </motion.div>
          </motion.div>

          {/* Progress and scan step indicator */}
          <motion.div
            className="mt-6 w-full max-w-3xl mx-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <ProgressBar progress={progress} />

            <div className="flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                {SCAN_STEPS.map((step, i) => (
                  <div
                    key={step.label}
                    className={`flex items-center gap-1.5 transition-colors duration-500 ${
                      scanPassed
                        ? "text-purple-200"
                        : i < currentStep
                          ? "text-emerald-200"
                          : i === currentStep
                            ? "text-cyan-100"
                            : "text-zinc-300"
                    }`}
                  >
                    <span className={i === currentStep && !scanPassed ? "animate-pulse" : ""}>
                      {step.icon}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">
                      {step.label.slice(0, 12)}
                      {step.label.length > 12 ? "…" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skip button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={handleSkip}
                className="mt-6 px-8 py-3 text-sm font-mono font-bold tracking-widest text-white/90 hover:text-white border-2 border-zinc-400 hover:border-white rounded-md transition-all duration-300 bg-zinc-700/90 hover:bg-zinc-600 shadow-lg shadow-black/50 animate-pulse"
              >
                [ SKIP INTRO ]
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
    </AnimatePresence>
  );
}
