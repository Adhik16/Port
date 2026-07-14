"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Shield, CheckCircle2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
}

declare global {
  interface Window {
    turnstile: {
      render: (
        container: string | HTMLElement,
        options: TurnstileRenderOptions
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

// ── Props ────────────────────────────────────────────────────────────────────
interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js";

function isLocalhost(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

// ── Themed dev-mode bypass badge ─────────────────────────────────────────────
function DevBypassBadge() {
  return (
    <div className="flex items-center justify-center gap-3 rounded-md border border-purple-500/30 bg-purple-950/40 px-4 py-3 backdrop-blur-sm">
      <div className="relative flex-shrink-0">
        <Shield className="h-6 w-6 text-purple-400" />
        <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-emerald-400" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-purple-300">
            LOCALHOST • VERIFIED
          </span>
        </div>
        <p className="text-[10px] text-purple-400/60 mt-0.5">
          Turnstile bypassed in dev mode
        </p>
      </div>
    </div>
  );
}

// ── Turnstile load error fallback ────────────────────────────────────────────
function TurnstileErrorFallback() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-yellow-500/20 bg-yellow-950/30 px-3 py-2 text-xs">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
      <span className="text-yellow-400/80">
        Security check unavailable. Your message will still be reviewed.
      </span>
    </div>
  );
}

// ── Exported component ───────────────────────────────────────────────────────
export function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
  onError: _onError,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const devMode = isLocalhost();

  const callbacksRef = useRef({ onVerify });
  callbacksRef.current = { onVerify };

  // ── Dev mode: fire bypass token immediately ──────────────────────────────
  useEffect(() => {
    if (devMode) {
      callbacksRef.current.onVerify("dev-bypass-localhost");
    }
  }, [devMode]);

  // ── Dev mode: just show the badge, skip Cloudflare entirely ──────────────
  if (devMode) {
    return (
      <div className="flex justify-center" style={{ minHeight: 70 }}>
        <DevBypassBadge />
      </div>
    );
  }

  // ── Prod mode: real Turnstile widget ─────────────────────────────────────
  const renderWidget = useCallback(() => {
    const container = containerRef.current;
    if (!container || !window.turnstile) return;

    container.innerHTML = "";

    try {
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        callback: (token: string) => callbacksRef.current.onVerify(token),
        "expired-callback": () => {
          // Keep the callback from the latest render
        },
        "error-callback": () => setLoadError(true),
        theme: "dark",
        size: "normal",
      });
    } catch {
      setLoadError(true);
    }
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey) {
      setLoadError(true);
      return;
    }

    if (window.turnstile) {
      renderWidget();
      return () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            /* ignore */
          }
        }
      };
    }

    if (!document.querySelector(`script[src*="challenges.cloudflare.com/turnstile"]`)) {
      const script = document.createElement("script");
      script.src = `${TURNSTILE_SCRIPT}?render=explicit`;
      script.async = true;
      script.defer = true;
      script.setAttribute("data-cfasync", "false");
      script.onerror = () => setLoadError(true);
      script.onload = () => setTimeout(() => renderWidget(), 50);
      document.head.appendChild(script);

      return () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            /* ignore */
          }
        }
      };
    }

    let attempts = 0;
    const maxAttempts = 50;
    const interval = setInterval(() => {
      attempts++;
      if (window.turnstile) {
        clearInterval(interval);
        renderWidget();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        setLoadError(true);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
      }
    };
  }, [renderWidget]);

  if (loadError) {
    return <TurnstileErrorFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center"
      style={{ minHeight: 70 }}
    />
  );
}
