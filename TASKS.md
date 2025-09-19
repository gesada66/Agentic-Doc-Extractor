# TASKS.md — NeuroStack Parallel Plan (MVP → Phase 2)

> Work Breakdown Structure (WBS) of epics → small tasks for parallel agents. Next.js App Router; TypeScript/TSX; shadcn/ui. Use Playwright MCP for E2E post-MVP. (WBS best practices: keep tasks small, hierarchical, traceable. See refs.) 

## Legend
- **Agent**: UI / API / Parse / Index / Chat / Infra
- **Paths** (allowed writes): 
  - UI → `app/**`, `components/**`, `styles/**`
  - API → `app/api/**`, `lib/api/**`
  - Parse → `lib/parse/**`, `app/(parse)/**`
  - Index → `lib/index/**`, `app/(index)/**`
  - Chat → `lib/chat/**`, `app/(chat)/**`
  - Infra → `Dockerfile`, `.github/**`, `scripts/**`
- **DoD**: Definition of Done per task
- **Deps**: prerequisite task IDs
- **Parallel**: ✅ if can run in parallel safely

---

## EPIC A — Foundation & Theme (MVP)

### A1. App Shell & Theme
- **A1.1** Create App Router shell
  - Agent: UI | Paths: `app/layout.tsx`, `app/page.tsx`
  - DoD: Shell renders; TS compiles; dark theme base set
  - Deps: — | Parallel: ✅
- **A1.2** Emerald Noir tokens & Tailwind config
  - Agent: UI | Paths: `styles/**`, `tailwind.config.*`
  - DoD: Colors set: `#0B0F0C/#1A2320/#10B981/#F59E0B/#F9FAFB`; shadcn tokens applied
  - Deps: A1.1 | Parallel: ✅ :contentReference[oaicite:0]{index=0}
- **A1.3** Sidebar & TopNav layout
  - Agent: UI | Paths: `components/Sidebar.tsx`, `components/TopNav.tsx`, `app/(routes)/**`
  - DoD: Left rail + top bar; active route state
  - Deps: A1.1 | Parallel: ✅
- **A1.4** Lint/Type config (strict TS)
  - Agent: Infra | Paths: `tsconfig.json`, `.eslintrc*`
  - DoD: `pnpm typecheck` & `pnpm lint` pass
  - Deps: — | Parallel: ✅

---

## EPIC B — MVP Screens (UI First)

### B1. Dashboard
- **B1.1** KPI cards + chart placeholder + recent docs table
  - Agent: UI | Paths: `app/dashboard/page.tsx`, `components/Card.tsx`
  - DoD: Renders mock data; desktop layout
  - Deps: A1.* | Parallel: ✅

### B2. Parse
- **B2.1** Dropzone + validations
  - Agent: UI | Paths: `components/Dropzone.tsx`, `app/parse/page.tsx`
  - DoD: Accept file(s); size check via `MAX_UPLOAD_MB`
  - Deps: A1.* | Parallel: ✅
- **B2.2** Jobs table + status badges
  - Agent: UI | Paths: `components/FileList.tsx`
  - DoD: Shows Name/Pages/Status/Progress/Actions (mock)
  - Deps: B2.1 | Parallel: ✅
- **B2.3** Parse options panel (target pages/OCR toggle/presets UI only)
  - Agent: UI | Paths: `components/ParseOptionsForm.tsx`
  - DoD: Options persist in local state
  - Deps: B2.2 | Parallel: ✅
- **B2.4** Result preview (Markdown/JSON tabs, mock)
  - Agent: UI | Paths: `components/ResultPreview.tsx`
  - DoD: Preview switches tabs; renders mock
  - Deps: B2.2 | Parallel: ✅

### B3. Index + Query / Chat
- **B3.1** Index builder form + console
  - Agent: UI | Paths: `app/index/page.tsx`, `components/IndexBuilderForm.tsx`, `components/IndexConsole.tsx`
  - DoD: “Rebuild” updates console (mock)
  - Deps: A1.* | Parallel: ✅
- **B3.2** Chat UI + sources panel + composer
  - Agent: UI | Paths: `app/chat/page.tsx`, `components/MessageBubble.tsx`, `components/Composer.tsx`, `components/SourcesPanel.tsx`
  - DoD: Sending message renders assistant reply + source thumbnails (mock)
  - Deps: A1.* | Parallel: ✅

### B4. Documents
- **B4.1** Gallery grid + filters + preview drawer
  - Agent: UI | Paths: `app/documents/page.tsx`, `components/GalleryItem.tsx`, `components/PreviewDrawer.tsx`
  - DoD: Grid renders mock docs; filter works; drawer opens
  - Deps: A1.* | Parallel: ✅

### B5. Settings
- **B5.1** Tabs (Profile/Models/Limits/Theme)
  - Agent: UI | Paths: `app/settings/page.tsx`
  - DoD: Fields persist in local state; reflect env model defaults
  - Deps: A1.* | Parallel: ✅

---

## EPIC C — MVP Stubs & API (local)

### C1. Local API routes (mock only)
- **C1.1** `/api/ingest` stub (returns job id/status)
  - Agent: API | Paths: `app/api/ingest/route.ts`, `lib/api/ingest.ts`
  - DoD: Returns mock job id; 200s; TS types defined
  - Deps: B2.* | Parallel: ✅
- **C1.2** `/api/query` stub (returns mock hits+sources)
  - Agent: API | Paths: `app/api/query/route.ts`, `lib/api/query.ts`
  - DoD: Accepts {query, topK}; returns mock sources (with thumbnails)
  - Deps: B3.* | Parallel: ✅

### C2. Parse/Index plumbing (mock)
- **C2.1** Parse manager
  - Agent: Parse | Paths: `lib/parse/manager.ts`
  - DoD: `startJob()`, `getStatus()`, `getResults()` mocked
  - Deps: C1.1 | Parallel: ✅
- **C2.2** Index module
  - Agent: Index | Paths: `lib/index/index.ts`
  - DoD: `rebuild()`, `retrieve(query,topK)` mocked
  - Deps: C1.2 | Parallel: ✅

---

## EPIC D — Infra, CI, and Local Tests (MVP)

### D1. Docker & Scripts
- **D1.1** Dockerfile (Node 20), compose/dev script
  - Agent: Infra | Paths: `Dockerfile`, `scripts/dev.sh`
  - DoD: `docker build` succeeds; container runs app
  - Deps: A1.* | Parallel: ✅ :contentReference[oaicite:1]{index=1}

### D2. QA (fast)
- **D2.1** Unit/Component tests (smoke)
  - Agent: UI | Paths: `__tests__/**`
  - DoD: Key components (Dropzone, FileList, MessageBubble) basic tests pass
  - Deps: B2.*, B3.2 | Parallel: ✅
- **D2.2** Minimal Playwright smoke (optional local)
  - Agent: UI | Paths: `tests/e2e/**`
  - DoD: Can launch app and navigate core pages
  - Deps: B1–B5 | Parallel: ✅ :contentReference[oaicite:2]{index=2}

---

## EPIC E — Staging E2E (post-MVP, mandatory)

### E1. Playwright MCP E2E (core flow)
- **E1.1** Configure MCP server (Codex)
  - Agent: Infra | Paths: `.codex/**`, `playwright/**`
  - DoD: `mcp_servers.playwright` enabled per your config; CI env running
  - Deps: D1.* | Parallel: ✅ :contentReference[oaicite:3]{index=3}
- **E1.2** E2E: Upload→Parse (mock) → Index rebuild → Query/Chat
  - Agent: UI | Paths: `tests/e2e/core.spec.ts`
  - DoD: Passes in CI (staging runner)
  - Deps: E1.1, B2.*, B3.*, C* | Parallel: ✅
- **E1.3** Visual regression (key screens)
  - Agent: UI | Paths: `tests/visual/**`
  - DoD: Baselines saved; comparisons pass
  - Deps: E1.2 | Parallel: ✅
- **E1.4** Basic a11y checks (contrast/focus/keyboard nav)
  - Agent: UI | Paths: `tests/a11y/**`
  - DoD: No critical violations
  - Deps: E1.2 | Parallel: ✅

---

## EPIC F — Phase 2 Screens & Flows

### F1. Classify
- **F1.1** Rules Builder UI (classes, conditions)
  - Agent: UI | Paths: `app/classify/page.tsx`, `components/RulesBuilder.tsx`
  - DoD: CRUD rules; state saved
  - Deps: A1.* | Parallel: ✅
- **F1.2** Classification stub
  - Agent: Parse | Paths: `lib/parse/classify.ts`
  - DoD: `runClassification()` returns labels (mock)
  - Deps: F1.1 | Parallel: ✅

### F2. Extract
- **F2.1** Schema Editor + infer button
  - Agent: UI | Paths: `app/extract/page.tsx`, `components/SchemaEditor.tsx`
  - DoD: CRUD fields; infer produces mock schema
  - Deps: A1.* | Parallel: ✅
- **F2.2** Extract manager
  - Agent: Parse | Paths: `lib/parse/extract.ts`
  - DoD: `runExtract()` returns JSON (mock); per-page toggle works
  - Deps: F2.1 | Parallel: ✅

### F3. Connectors
- **F3.1** Connector cards + settings drawer
  - Agent: UI | Paths: `app/connectors/page.tsx`, `components/ConnectorCard.tsx`, `components/ConnectorSettingsDrawer.tsx`
  - DoD: Connect/Disconnect states (mock) per provider
  - Deps: A1.* | Parallel: ✅
- **F3.2** Connector registry (stub)
  - Agent: API | Paths: `lib/api/connectors.ts`
  - DoD: Provider configs persisted in memory (mock)
  - Deps: F3.1 | Parallel: ✅

### F4. Figures Extraction
- **F4.1** Figures list + preview
  - Agent: UI | Paths: `app/figures/page.tsx`, `components/FigureRow.tsx`
  - DoD: Lists tables/charts/images with thumbnails (mock)
  - Deps: A1.*, B2.* | Parallel: ✅
- **F4.2** Figures service (stub)
  - Agent: Parse | Paths: `lib/parse/figures.ts`
  - DoD: `detectFigures()` returns mock assets with page refs
  - Deps: F4.1 | Parallel: ✅

### F5. Usage & Limits
- **F5.1** Usage panel + chart
  - Agent: UI | Paths: `app/usage/page.tsx`, `components/UsageSummary.tsx`, `components/UsageChart.tsx`
  - DoD: Counters update; reset button works (mock)
  - Deps: A1.* | Parallel: ✅
- **F5.2** Usage service (stub)
  - Agent: API | Paths: `lib/api/usage.ts`
  - DoD: Returns per-feature counters (mock)
  - Deps: F5.1 | Parallel: ✅

### F6. Phase 2 E2E Expansion (staging)
- **F6.1** E2E: Classify → Extract → Index → Query
  - Agent: UI | Paths: `tests/e2e/phase2.spec.ts`
  - DoD: Passes in CI with Playwright MCP
  - Deps: F1–F2 | Parallel: ✅
- **F6.2** E2E: Connectors + Figures + Usage
  - Agent: UI | Paths: `tests/e2e/connectors-usage.spec.ts`
  - DoD: Passes in CI; visual baselines updated
  - Deps: F3–F5 | Parallel: ✅

---

## EPIC G — Coordinator & Guardrails

### G1. Coordinator wiring (Agents SDK)
- **G1.1** Per-agent model mapping (env-driven)
  - Agent: Infra | Paths: `scripts/agents-coordinator.ts`
  - DoD: Logs chosen model per agent; overrides via `NEUROSTACK_MODEL_*`
  - Deps: A1.* | Parallel: ✅
- **G1.2** Handoffs + path guardrails
  - Agent: Infra | Paths: `scripts/agents-coordinator.ts`
  - DoD: `transfer_to_*` tools exposed; edits blocked outside allowed paths
  - Deps: G1.1 | Parallel: ✅
- **G1.3** TASKS loader
  - Agent: Infra | Paths: `tasks.yaml` (or JSON)
  - DoD: Loads epics/tasks; runs parallel where safe
  - Deps: G1.1 | Parallel: ✅

---

## EPIC H — Staging CI (GitHub Actions)

### H1. Workflow
- **H1.1** Node 20 setup + cache
  - Agent: Infra | Paths: `.github/workflows/staging.yml`
  - DoD: Checkout, setup-node@v4, pnpm install/cache
  - Deps: D1.* | Parallel: ✅ :contentReference[oaicite:4]{index=4}
- **H1.2** Lint/type/unit/component
  - Agent: Infra | Paths: `.github/workflows/staging.yml`
  - DoD: Steps pass; artifacts uploaded
  - Deps: H1.1 | Parallel: ✅
- **H1.3** Build Docker image
  - Agent: Infra | Paths: `.github/workflows/staging.yml`, `Dockerfile`
  - DoD: Image built; optional push to registry
  - Deps: H1.2 | Parallel: ✅
- **H1.4** Playwright MCP E2E (post-MVP required)
  - Agent: Infra | Paths: `.github/workflows/staging.yml`
  - DoD: E2E suite green; visual baselines updated on approval
  - Deps: H1.3, E1.* | Parallel: ✅

---

## Acceptance Gates

- **MVP Complete** when:
  - A1–A1.4, B1–B5, C1–C2, D1–D2 done; 
  - Staging E2E (E1.2) passes using Playwright MCP. :contentReference[oaicite:5]{index=5}

- **Phase 2 Complete** when:
  - F1–F5 shipped; F6 E2E suites pass in staging.

---

## References
- Next.js App Router (layouts/pages, structure). :contentReference[oaicite:6]{index=6}
- shadcn/ui theming & component docs. :contentReference[oaicite:7]{index=7}
- Playwright MCP servers (setup/CI). :contentReference[oaicite:8]{index=8}
- WBS/decomposition best practices. :contentReference[oaicite:9]{index=9}


### Sample pdf files
-a number pdf files are stored in "sample-pdf" folder in root directory of this project for purpose of e2e testing via use of Playwright mcp server.
\n## Sample PDFs for E2E Testing

- Place sample PDFs under `web/tests/fixtures/pdfs/` (create folder if missing).
- Include at least three files:
  - `sample-small.pdf` — 1–2 pages, selectable text.
  - `sample-medium.pdf` — 10–30 pages, mixed headings/tables.
  - `sample-scanned.pdf` — scanned/OCR content to exercise OCR paths (mocked for now).
- I will update Playwright specs to use these files in the Parse flow and tune selectors against realistic content.
- For CI: enable the E2E job by setting repo/environment variable `RUN_E2E=true`. If large, consider Git LFS or hosting in release assets/artifacts.
\n## MVP Progress (NeuroStack)

- [x] Scaffold Next.js App Router app in `web/`
- [x] Emerald Noir theme and base layout (Sidebar + TopNav)
- [x] Dashboard page with KPI cards, chart placeholder, recent table (mock)
- [x] Parse page with Dropzone + file input, options, jobs table, Markdown/JSON previews (mock)
- [x] Index + Query/Chat with Index Builder, Console, message list, Sources panel (mock)
- [x] Documents grid with filters and preview drawer (mock)
- [x] Settings tabs (Profile, Models, Ingestion Limits, Theme) with local state persisting in-session
- [x] Phase 2 placeholders (Classify, Extract, Connectors, Figures, Usage)
- [x] Agents stubs and `web/agents/tasks.yaml`
- [x] `.env.example` for web
- [x] Dockerfile and CI (build job)

## E2E Testing Plan

- Tool: Playwright (scaffolded under `web/`)
- Config: `web/playwright.config.ts` with auto dev server
- Specs:
  - `web/tests/e2e/parse.spec.ts` — upload fixture → Parse → preview visible
  - `web/tests/e2e/index_chat.spec.ts` — rebuild index → chat send → reply and sources
  - `web/tests/e2e/documents.spec.ts` — filter → open preview drawer
- Local run: `cd web && npx playwright install && npm run test:e2e`
- CI: E2E job gated by repo/environment var `RUN_E2E=true`
