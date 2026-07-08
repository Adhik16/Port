import { NextRequest, NextResponse } from "next/server";

interface VisitorData {
  ip: string;
  userAgent: string;
  language: string;
  referer: string;
  timestamp: string;
  // GeoIP approximated from headers
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  // Browser/OS fingerprinting
  platform: string | null;
  browser: string | null;
  isBot: boolean;
  // Network info
  isVPN: boolean;
  connectionType: string | null;
}

function parseUserAgent(ua: string) {
  const platform = ua.includes("Windows")
    ? "Windows"
    : ua.includes("Mac")
      ? "macOS"
      : ua.includes("Linux")
        ? "Linux"
        : ua.includes("Android")
          ? "Android"
          : ua.includes("iPhone") || ua.includes("iPad")
            ? "iOS"
            : "Unknown";

  const browser = ua.includes("Firefox")
    ? "Firefox"
    : ua.includes("Edg")
      ? "Edge"
      : ua.includes("Chrome")
        ? "Chrome"
        : ua.includes("Safari")
          ? "Safari"
          : ua.includes("Opera")
            ? "Opera"
            : "Unknown";

  const isBot = /bot|crawler|spider|crawling|scraper/i.test(ua);

  return { platform, browser, isBot };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const headers = request.headers;

    // Extract IP from various headers (Vercel, Cloudflare, etc.)
    const ip =
      headers.get("x-real-ip") ??
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
      headers.get("cf-connecting-ip") ??
      "Unknown";

    const userAgent = headers.get("user-agent") ?? "Unknown";
    const { platform, browser, isBot } = parseUserAgent(userAgent);

    const data: VisitorData = {
      ip,
      userAgent,
      language: headers.get("accept-language") ?? "Unknown",
      referer: headers.get("referer") ?? "Direct",
      timestamp: new Date().toISOString(),
      // GeoIP from headers (Vercel/Cloudflare)
      country: headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry") ?? body.country ?? null,
      city: headers.get("x-vercel-ip-city") ?? headers.get("cf-ipcity") ?? body.city ?? null,
      region: headers.get("x-vercel-ip-region") ?? headers.get("cf-region") ?? body.region ?? null,
      timezone: headers.get("x-vercel-ip-timezone") ?? body.timezone ?? null,
      platform,
      browser,
      isBot,
      isVPN: body.isVPN ?? false,
      connectionType: body.connectionType ?? null,
    };

    // Log the visitor data — in production, send to a database/SIEM
    console.log(
      `[VISITOR] ${data.ip} | ${data.country ?? "XX"} | ${data.browser} | ${data.platform} | Bot: ${data.isBot}`
    );

    // Optionally: store in a database (e.g., Vercel KV, Supabase, etc.)
    // await db.visitors.insert(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VISITOR] Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Also support GET for non-JS fallback (tracking pixel style)
export async function GET(request: NextRequest) {
  // Minimal tracking via GET
  const headers = request.headers;
  const ip =
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "Unknown";
  const userAgent = headers.get("user-agent") ?? "Unknown";
  const { isBot } = parseUserAgent(userAgent);

  console.log(
    `[VISITOR-GET] ${ip} | ${headers.get("x-vercel-ip-country") ?? "XX"} | Bot: ${isBot}`
  );

  return NextResponse.json({ success: true });
}
