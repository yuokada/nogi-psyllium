# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**nogi-psyllium** (乃木坂46 サイリウムカラービューワー) is a React + TypeScript + Vite SPA for viewing Nogizaka46 member penlight colors and underlive concert information. Deployed to GitHub Pages at `https://yuokada.github.io/nogi-psyllium/`.

## Commands

```bash
npm run dev        # Start dev server (also runs predev: YAML → JSON conversion)
npm run build      # TypeScript check + Vite production build to dist/
npm run lint       # Biome linting and formatting check
npm run preview    # Preview production build locally
```

**Prerequisite**: `yq` must be installed (`brew install yq`). The `predev`/`prebuild` scripts use it to convert `data/*.yaml` → `public/data/*.json`.

## Architecture

### Data Flow

```
data/members.yaml    ─┐
data/underlives.yaml ─┴─→ yq (pre-scripts) → public/data/*.json → fetched by React app
```

Never edit `public/data/*.json` directly — they are auto-generated from the YAML source files.

### Key Source Files

- `src/App.tsx` — Main component: tab system (Penlight / Underlive), search/filter state, URL param sync
- `src/colors.ts` — Master color dictionary mapping Japanese color names (e.g., `紫`, `ピンク`) to hex values
- `src/types.ts` — TypeScript interfaces: `Member`, `Underlive`, `Center`, `AbsentMember`
- `src/utils.ts` — WCAG luminance calculation for accessible text color on color swatches
- `src/main.tsx` — Entry point with `HashRouter` (required for GitHub Pages)

### Routing

Uses `HashRouter` for GitHub Pages compatibility:
- `/#/` → Penlight colors tab
- `/#/underlive` → Underlive information tab

URL parameters store filter/selection state for shareable links.

## Data Schemas

### `data/members.yaml`

```yaml
- id: ito_riria              # snake_case unique identifier (required)
  name: 伊藤 理々杏           # display name (required)
  gen: 3期生                  # generation label (optional)
  color1_name: 紫             # primary penlight color from colors.ts (required)
  color2_name: 赤             # secondary color (optional)
  icon: /icons/file.png      # member photo path (optional)
  active: true               # false = graduated; omit = hidden (optional)
  call: ""                   # fan call/chant text (optional)
```

### `data/underlives.yaml`

```yaml
- id: ul_41st_2026           # unique identifier (required)
  title: "41stSGアンダーライブ" # display title (required)
  year: 2026                 # year (required)
  dates:                     # performance dates (required)
    - "2026-03-17"
  venue: "ぴあアリーナMM"       # venue name (optional)
  source_url: "https://..."  # reference URL (optional)
  centers:                   # center members (optional)
    - id: okamoto_hina
      label: "C"             # display label (optional)
  member_ids:                # performing members by id (required)
    - ito_riria
  absent:                    # absent members (optional)
    - id: okuda_iroha
      note: "理由"
```

## Tooling

- **Biome** (`biome.json`): linter + formatter; uses tabs, double quotes, no CommonJS
- **pre-commit**: runs Biome checks on staged files
- **GitHub Actions**: auto-deploys `master` branch to GitHub Pages
- **Vite base path**: `/nogi-psyllium/` (set in `vite.config.ts`)
