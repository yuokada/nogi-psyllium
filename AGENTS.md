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

----

# Claude Operational Policy

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity
- For complex tasks, separate roles:
  - Plan Author
  - Staff Engineer Reviewer
- Do not begin implementation until Plan Review passes

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution
- For large changes, use parallel sessions (3–5) or git worktrees
- Keep execution contexts isolated

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- If the pattern is systemic, update this CLAUDE.md
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness
- When fixing bugs, require:
  - Logs
  - Failing test output
  - Clear reproduction steps
- Validate against CI expectations before marking done

### 5. Demand Elegance

- For non-trivial changes: pause and ask “Is there a more elegant way?”
- If a fix feels hacky: “Knowing everything I know now, implement the elegant solution.”
- Skip this for simple, obvious fixes — don’t over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it.
- Point at logs, errors, failing tests — then resolve them
- Do not require hand-holding
- Assume ownership of full resolution path:
  - Root cause
  - Fix
  - Validation
- Require zero context switching from the user
- Fix failing CI tests proactively

### 7. Operational Discipline
- Automate formatting/linting after modifications when environment allows
- Maintain reusable slash-commands for frequent workflows
- Version-control command templates under `.claude/commands/`
- Pre-approve safe commands when permissions model supports it
- Optimize for minimal context switching

---

## Task Management

1. **Plan First**: Write the plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: Provide a high-level summary at each step
5. **Document Results**: Add a review section to `tasks/todo.md`
6. **Capture Lessons**:
    - Update `tasks/lessons.md` after corrections
   - Escalate recurring issues into CLAUDE.md rules

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Maintain senior developer standards.
- **Minimal Impact**: Changes should only touch what’s necessary. Avoid introducing bugs.
- **Systemic Thinking**: Fix classes of problems, not isolated instances
- **Parallelize Intelligently**: Use additional compute or sessions when complexity demands it
