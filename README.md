# Project Hub Lite

Small React 18 + TypeScript + Vite app: browse projects, filter by status / tag / text search, open a side-panel detail view. Filters and the selected project are reflected in the URL so refreshing or sharing a link restores the same view.

## Run and test

```bash
npm install
npm run dev          # http://localhost:5173
npm test -- --run    # one-shot test run
npm run build        # production build
```

Node 20+ (see `.nvmrc`).

## Project structure

```
src/
├── App.tsx                  # main screen — the only stateful component
├── App.css                  # layout + side-panel styling
├── main.tsx                 # ReactDOM root
├── components/              # presentational pieces, props-driven
│   ├── ProjectList.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectDetail.tsx
│   ├── SearchBar.tsx
│   ├── StatusFilter.tsx
│   ├── TagFilter.tsx
│   ├── TagList.tsx
│   └── CopyLinkButton.tsx
├── hooks/                   # one hook per responsibility
│   ├── useProjects.ts       #   async load + stale-response guard
│   ├── useUrlState.ts       #   state ↔ URL mirroring + parser
│   ├── useDebouncedValue.ts
│   ├── useFilteredProjects.ts
│   └── useAllTags.ts
├── schemas/projectSchema.ts # type guard / parser for the mock data
├── utils/strings.ts         # capitalize, formatDate
├── data/projects.json       # mock backend
├── ui-stub/                 # provided design-system stand-in (Button/Card/Stack/Text)
└── App.test.tsx             # React Testing Library tests
```

## Architecture

`App.tsx` is the only stateful component; everything in `components/` is presentational and receives data + callbacks via props. State is split into four buckets, each with a single source of truth:

- **URL** is canonical for the shareable state — `q`, `status`, `tag` (repeatable), `selected`. `useUrlState` mirrors React state into the URL via `history.replaceState`, and `parseUrlParams()` reads it back on first render, so refresh and shared links round-trip exactly.
- **`useProjects`** owns the async data — `projects`, `loading`, `error` — plus a `requestId` ref that drops late or stale promise resolutions so newer state can't be clobbered.
- **Memoized derivations** (`useFilteredProjects`, `useAllTags`, `useDebouncedValue`) re-derive from the inputs above; nothing is duplicated in state.
- **Local UI state** (`simulateError` in `App`, `copied` in `CopyLinkButton`, `detailRef` in `ProjectDetail`) lives in the component that uses it.

There's one cross-cutting effect in `App.tsx` that clears `state.selected` when filter changes hide the open project — gated on `projects` being loaded so a deep-linked `?selected=` survives the initial render. No global store: at this scope the URL plays the role a Redux/Context store would.

## Assumptions

`src/data/projects.json` is treated as the mock backend; `useProjects` simulates an 800ms first-load delay and exposes a `simulateError` toggle so the loading and error states are observable in the UI. Detail is rendered as an in-page side panel rather than a separate route, since the surface is small. The "Simulate Error" toolbar button is a dev-only control for triggering the error state.

## Debounce

Search input is debounced by **300ms** (`SEARCH_DEBOUNCE_MS` in `src/App.tsx`, applied via `useDebouncedValue`).

## Focus

When a project becomes selected (whether by click or via `?selected=` on first render), the detail container — `tabIndex={-1}` with a `ref` — has `.focus()` called inside a `useEffect` keyed on the project id, so the keyboard lands inside the panel.

## AI and verification

### Tools

Claude Code (Anthropic's CLI agent), running locally in the project workspace.

### Prompt links

No shareable prompt URL is available from this local Claude Code session. The significant prompt direction covered, in order: getting the starter to build (a missing `zod` dependency was importing from a package not in `package.json`), fixing a deep-link selection-clearing bug in `App.tsx` where the "drop-stale-selection" effect ran before projects loaded, restructuring `useProjects` for stale-response cancellation, simplifying the keyboard-shortcut handling, tightening the CSS to round numbers and a single breakpoint, removing AI-style block comments from components, and writing the README structure / architecture sections.

### Verify

1. `npm test -- --run` — the four tests cover debounced search narrowing the list, deep-linked URL state restoring filters and focusing the detail region, the empty-state copy, and the simulated error / retry recovery.
2. Drove the toolbar manually in the browser: combined filters, the `/` and `Escape` shortcuts, refresh-preserves-URL, and the Copy Link button writing the current URL to the clipboard.
3. `npx tsc --noEmit` and `npm run build` to verify TypeScript and the production bundle beyond what Vitest's transform exercises.

### Course-correct

The starter's schema parser imported `zod`, which is not declared in `package.json` — that broke both `npm test` and `npm run build`. Rather than pull in an unused dependency, I replaced it with a small hand-written type guard in `src/schemas/projectSchema.ts` that validates the fixed mock-data shape and throws on anything else.

## Keyboard shortcuts

- `/` — focus the search input (no-op while typing in an input).
- `Escape` — close the open detail panel.
- `Enter` / `Space` — open the focused project card.

## Optional stretch

**None.**

## Bonus (Tailwind)

**Not used.** Tailwind ships with the starter but all new styling lives in plain CSS (`src/App.css`) plus the existing `src/ui-stub/` components.
