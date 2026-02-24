# Harmony Shell → React Conversion Report

## Summary

- **Shell variant:** VP dark (`theme-vp dark` on `<html>`; preview reference: `shell-layout-dark-vp.astro`)
- **Target framework:** React (TSX + CSS)
- **Build:** `npm run build` succeeds

## Components Converted

| Step | Component       | Source                    | Output |
|------|-----------------|---------------------------|--------|
| 1    | Icon            | Icon.astro                | Icon.tsx (manifest + fallback "?") |
| 2    | LeftSidebar     | LeftSidebar.astro         | LeftSidebar.tsx, LeftSidebar.css |
| 3    | RightSidebar    | RightSidebar.astro        | RightSidebar.tsx, RightSidebar.css |
| 4    | TabStrip        | TabStrip.astro            | TabStrip.tsx, TabStrip.css |
| 5    | ShellFooter     | ShellFooter.astro         | ShellFooter.tsx, ShellFooter.css |
| 6    | ShellPageHeader | ShellPageHeader.astro    | ShellPageHeader.tsx, ShellPageHeader.css |
| 7    | Card            | Card.astro                | Card.tsx, Card.css |
| 8    | ShellLayout     | ShellLayout.astro         | ShellLayout.tsx, ShellLayout.css |

Additional components used by the shell and converted as dependencies:

- **Tooltip** – Tooltip.tsx (for LeftSidebar and RightSidebar)
- **Button** – Button.tsx (minimal, for ShellPageHeader)

## Verification

- **Per-component:** DOM, props, and scoped styles aligned with Astro source. TabStrip scoped styles and ShellFooter/RightSidebar pitfalls included.
- **Integration:** Assembled shell composes header (minimal placeholder), LeftSidebar, RightSidebar, ShellPageHeader, Card, and ShellFooter. Main content uses correct padding when right sidebar is present; footer tab labels use `--shell-footer-tab-label-color` (white in dark). ShellHeader (gradient bar, company picker, Avatar), FloatingNav, and ShellPanel were not in the conversion order and are represented by a minimal header placeholder or omitted.

## Icon Color Pitfalls Addressed

1. **Inline SVG vs `<img>`:** Icon component uses manifest inline SVG with `currentColor` where available. RightSidebar custom icons (Dela logo) use `<img>` with classes `right-sidebar__dela-logo` and `right-sidebar__dela-logo--default`.
2. **Dark-mode filters:** RightSidebar.css includes:
   - `html.dark .right-sidebar__dela-logo--default { filter: brightness(0) invert(1); }`
   - `html.dark .right-sidebar__icon-img { filter: brightness(0) invert(1); }`
3. **Icon resolution:** Icon.tsx resolves from theme-scoped manifest (vp, cp, ppm, maconomy); fallback is "?" in a span matching Astro’s fallback styling.
4. **Footer tab colors:** ShellFooter.css overrides TabStrip tab/label/icon to use `--shell-footer-tab-label-color` and `--shell-footer-tab-icon-color-active` in light and `html.dark` so active tab and label stay white in dark mode.

## Icon Report

- Icons used in the shell resolve from `@harmony-data/icon-manifest.json` (Vite alias to Harmony package `src/data/icon-manifest.json`). Manifest includes `svg` field for inline SVG; no "?" fallback in default shell content for converted components.
- If any icon were to show "?", the fix would be to add that icon to the manifest or to the Icon component’s resolution (e.g. public path or inline SVG) per the skill’s “When icons don't resolve” rule.

## Files Created

- `src/components/shell/Icon.tsx`
- `src/components/shell/Tooltip.tsx`
- `src/components/shell/LeftSidebar.tsx`, `LeftSidebar.css`
- `src/components/shell/RightSidebar.tsx`, `RightSidebar.css`
- `src/components/shell/TabStrip.tsx`, `TabStrip.css`
- `src/components/shell/ShellFooter.tsx`, `ShellFooter.css`
- `src/components/shell/Button.tsx`
- `src/components/shell/ShellPageHeader.tsx`, `ShellPageHeader.css`
- `src/components/shell/Card.tsx`, `Card.css`
- `src/components/shell/ShellLayout.tsx`, `ShellLayout.css`

## How to Run

- `npm run build` – production build
- `npm run dev` – dev server (then open the app and ensure `<html class="theme-vp dark">` for VP dark)
- `index.html` is set to `<html lang="en" class="theme-vp dark">` for the VP dark shell variant.
