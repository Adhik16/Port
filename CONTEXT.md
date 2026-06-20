# Cybersecurity Portfolio — Project Context

> **Last updated**: 2026-06-11
> **Project path**: `c:\Users\asus\OneDrive\Documents\Portfolio`

---

## 1. Overview

Building a **dark-only, neon-purple cybersecurity portfolio** for **Adhik Shakya (SOC Analyst)** using:

| Technology | Version |
|---|---|
| Next.js (App Router) | 16.2.9 |
| React | 19.2.4 |
| Tailwind CSS | v4 |
| shadcn/ui | Latest (Radix Nova preset) |
| Three.js (+ R3F + Drei) | 0.184.0 |
| Framer Motion | 12.40.0 |
| react-hook-form + zod | 7.78.0 / 4.4.3 |
| lucide-react (icons) | 1.17.0 |
| pnpm | 11.5.2 |

---

## 2. Design Decisions (From User Q&A)

- **Color scheme**: Neon purple (`oklch(0.62 0.22 300)` ≈ `#a855f7`) on deep near-black (`oklch(0.145 0.008 280)`)
- **Dark-only** — no light mode, no toggle
- **Typography**: Geist Sans (body) + Geist Mono (headings/code)
- **3D Object**: Rotating procedural shield with lock icon, particle field, glow ring
- **Sections**: Hero → About → Skills → Projects → Blog → Contact
- **shadcn/ui components**: Button, Card, Badge, Input, Textarea, Sheet, Separator, Tooltip, Navigation Menu
- **Content**: ALL PLACEHOLDER — user fills in real data later
- **Accessibility**: WCAG AA minimum (4.5:1 contrast, visible focus rings, semantic HTML, aria labels, `prefers-reduced-motion` support)

---

## 3. File Inventory

### Config Files
| File | Status | Notes |
|---|---|---|
| `package.json` | ✅ Done | All dependencies installed |
| `tsconfig.json` | ✅ Done | Path alias `@/*` → `./*` |
| `next.config.ts` | ✅ Done | Minimal — no special config needed |
| `postcss.config.mjs` | ✅ Done | `@tailwindcss/postcss` plugin |
| `components.json` | ✅ Done | shadcn config (Radix Nova, neutral base) |
| `pnpm-workspace.yaml` | ⚠️ Corrupt | Auto-generated incorrectly — see Known Issues |
| `.npmrc` | Exists | Contains private config |

### Core App Files
| File | Status | Notes |
|---|---|---|
| `app/globals.css` | ✅ Done | Full neon-purple CSS variable system + `@theme inline`, custom animations (`glow-pulse`, `float`), focus-visible rings |
| `app/layout.tsx` | ✅ Done | Metadata set, skip-to-content link, Navbar+Footer wrapped in TooltipProvider |
| `app/page.tsx` | ✅ Done | Assembles all 6 sections in order |

### Layout Components
| File | Status | Notes |
|---|---|---|
| `components/layout/navbar.tsx` | ✅ Done | Fixed top, glassmorphism on scroll, IntersectionObserver scroll-spy, mobile Sheet drawer |
| `components/layout/footer.tsx` | ✅ Done | Social links (placeholder URLs), back-to-top button |

### Three.js
| File | Status | Notes |
|---|---|---|
| `components/three/rotating-shield.tsx` | ✅ Done | Procedural ShapeGeometry+ExtrudeGeometry shield, LockIcon, Particles (200 points), GlowRing torus, 3 lights |
| `components/three/network-globe.tsx` | ✅ Done | Interactive globe with continents, grid, data arcs, packets, atmosphere, orbital ring, stars. Hands imported from hand-models.tsx |
| `components/three/hand-models.tsx` | ✅ Done | **NEW** — 5 hand variants: cupping-refined, defensive-palm, cybernetic-claw, energy-wireframe, pointing-command. Configurable via HandVariant interface and HAND_PRESETS. Hero has variant toggle for preview.

### Section Components
| File | Status | Notes |
|---|---|---|
| `components/sections/section-heading.tsx` | ✅ Done | Reusable `# Title` with purple `#` prefix, animated via framer-motion |
| `components/sections/hero.tsx` | ✅ Done | Full-viewport, name+title left, 3D shield right (dynamic import, no SSR), CTA buttons, scroll indicator |
| `components/sections/about.tsx` | ✅ Done | Avatar placeholder, stats cards (5+/3+/20+), bio text, focus area badges |
| `components/sections/skills.tsx` | ✅ Done | 6 category cards (Network, SIEM, IR, Threat Intel, Pentesting, Tools), each with icon + badges |
| `components/sections/projects.tsx` | ✅ Done | 6 project cards (SOC Dashboard featured spanning 2 cols), GitHub/live links |
| `components/sections/blog.tsx` | ✅ Done | 4 blog post cards with date, read time, excerpt, tags |
| `components/sections/contact.tsx` | ✅ Done | Zod-validated form (name/email/subject/message), success state, contact info sidebar |

### shadcn/ui Generated Components
| File | Status |
|---|---|
| `components/ui/button.tsx` | ✅ |
| `components/ui/card.tsx` | ✅ |
| `components/ui/badge.tsx` | ✅ |
| `components/ui/input.tsx` | ✅ |
| `components/ui/textarea.tsx` | ✅ |
| `components/ui/sheet.tsx` | ✅ |
| `components/ui/separator.tsx` | ✅ |
| `components/ui/tooltip.tsx` | ✅ |
| `components/ui/navigation-menu.tsx` | ✅ |
| `lib/utils.ts` (cn helper) | ✅ |

---

## 4. Known Issues & Fixes

### Issue 1: pnpm workspace config corruption
- **Symptom**: `[ERROR] Cannot destructure property 'manifest' of 'manifestsByPath[rootDir]' as it is undefined.`
- **Cause**: `pnpm-workspace.yaml` gets auto-generated with broken `allowBuilds:` syntax by shadcn init
- **Fix applied**: Delete `pnpm-workspace.yaml` before running `pnpm install`, then re-add:
  ```yaml
  onlyBuiltDependencies:
    - sharp
    - unrs-resolver
  ```
- **Ongoing**: The file may regenerate. If `pnpm add` fails with this error, delete the workspace yaml first.

### Issue 2: OneDrive sync interference
- **Symptom**: Build/dev failures, file locking issues
- **Cause**: `OneDrive\Documents\Portfolio` path — OneDrive syncing can lock files during builds, corrupt `node_modules`
- **Fix**: Pause OneDrive sync while working, or better: move project outside OneDrive to e.g. `C:\Dev\Portfolio`
- **Recommendation**: **Start new session by cloning/moving to `C:\Dev\Portfolio`**

### Issue 3: shadcn init required interactive input
- The `pnpm dlx shadcn@latest init` command prompts for:
  1. Component library → select **Radix**
  2. Preset → select **Nova**
- User must answer these interactively

---

## 5. CSS Variable System (globals.css)

```
--background:     oklch(0.145 0.008 280)   → deep near-black
--foreground:     oklch(0.985 0 0)         → near-white
--primary:        oklch(0.62 0.22 300)     → neon purple (#a855f7-ish)
--primary-fg:     oklch(0.985 0 0)
--card:           oklch(0.17 0.01 280)
--muted:          oklch(0.22 0.01 280)
--muted-fg:       oklch(0.65 0.02 280)
--border:         oklch(0.28 0.03 280)
--ring:           oklch(0.62 0.22 300)     → same as primary
--destructive:    oklch(0.6 0.22 20)       → red
```

**Contrast strategy**: Purple (`--primary`) used ONLY for accents, borders, glow. Body text is always `--foreground` (near-white on near-black = ~19:1 ratio, far exceeding 4.5:1).

---

## 6. What Works vs What Doesn't

### Working ✅
- All source files are written and syntactically correct
- Tailwind v4 with shadcn CSS variable system configured
- All 6 sections composed in `app/page.tsx`
- Three.js procedural shield with auto-rotation, particles, glow
- Framer Motion scroll-triggered animations on all sections
- Contact form with Zod validation
- Mobile-responsive navbar with Sheet drawer
- Skip-to-content accessibility link

### Not Yet Verified ⚠️
- **Build/dev server** — has not run successfully due to OneDrive + pnpm issues
- **Runtime behavior** — animations, 3D rendering, scroll-spy not tested in browser
- **Accessibility audit** — Lighthouse/axe scan not run
- **Responsive testing** — not verified at real breakpoints
- **`prefers-reduced-motion`** — implemented but not tested

---

## 7. Quick Start (for new session)

```powershell
# 1. Move project OUT of OneDrive
# Copy entire Portfolio folder to C:\Dev\Portfolio

# 2. Delete corrupt workspace file
Remove-Item pnpm-workspace.yaml -Force -ErrorAction SilentlyContinue

# 3. Clean install
pnpm install

# 4. Run dev server
pnpm dev
```

If `pnpm install` fails with manifest error, delete `pnpm-workspace.yaml` and `node_modules`, then retry.
