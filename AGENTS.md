# AGENTS.md — NeuroStack (Single Source of Truth)

> Purpose: one file Codex can read to scaffold the UI first, then implement flows with OpenAI Agents JS SDK, parallel agents, and handoffs. Desktop-first, App Router, TypeScript.

---

## Identity & Theme
- **Product**: NeuroStack
- **Theme (Neon Slate + Glow Pulse)**  
  Background `#0F172A` · Surface `#1E293B` · Accent `#06B6D4` · Secondary `#8B5CF6` · Warning `#F59E0B` · Text `#F1F5F9`  
- **Tone**: Futuristic startup vibe (AI/tech branding)
- **Animations**: Glow pulse on accent buttons, slide-in chat bubbles, pulsing dropzone borders

---

## Tech & Conventions
- **Framework**: Next.js **App Router** in `app/` (use `layout.tsx` + `page.tsx`). Use React Server Components where natural.  
- **Language**: **TypeScript + JSX** (`.tsx`) everywhere.  
- **UI**: shadcn/ui with Tailwind variables for theming; dark theme only.  
- **Node**: v20+. **SQLite** local; plan Postgres in cloud.  
- **Naming**: Use **NeuroStack** brand in UI (no external product names).

---

## Navigation (Left Rail, Desktop-only for MVP)
1. Dashboard  
2. Parse  
3. Index + Query / Chat  
4. Documents  
5. Settings  
6. **Classify** *(Phase 2)*  
7. **Extract** *(Phase 2)*  
8. **Connectors** *(Phase 2)*  
9. **Figures Extraction** *(Phase 2)*  
10. **Usage & Limits** *(Phase 2)*

---

## Screens & DoD (Definition of Done)

### Dashboard
- KPI cards (Docs Ingested, Pending Jobs, Chats), a chart placeholder, recent documents table.
- **DoD**: Renders mock data; desktop layout; no TS errors.

### Parse
- Dropzone upload; file validations using `MAX_UPLOAD_MB`.  
- Jobs/status table (Name, Pages, Status, Progress, Actions).  
- **Parse Options** panel: target pages (range input), OCR on/off, presets (mock only).  
- Parsed **Preview** tabs: Markdown and JSON (mock).  
- **DoD**: Options persist (local state), previews render after “parse” action.

### Index + Query / Chat
- **Index Builder** form + **Index Console** (sources list, last build time).  
- **Query/Chat** pane with message list, **Sources** panel (page thumbnails + excerpts), composer with send.  
- **DoD**: Mock index “rebuild” updates console; sending a query shows assistant reply and sources.

### Documents
- Gallery grid of document thumbnails + metadata; filters (date/type/status); preview drawer.
- **DoD**: Grid and filters work with mock data; preview drawer opens.

### Settings
- Tabs: Profile, Models (per-agent defaults visible), Ingestion Limits, Theme (dark locked).  
- **DoD**: Values persist in local state; reflects env defaults.

### Phase 2 Screens (add after MVP)

**Classify**  
- Rules Builder UI (classes + conditions); “Run classification” (mock) → label per doc; “Next step” routing column.  
- **DoD**: Rules persist; mock run updates labels.

**Extract**  
- Schema Editor (add/edit fields) + “Infer schema” (mock); run extraction; JSON preview; per-page vs whole-doc toggle; optional confidence tags.  
- **DoD**: Editor CRUD works; preview shows shaped JSON.

**Connectors**  
- Cards for S3, Box, SharePoint, Google Drive (auth state: Connected/Not Connected).  
- Settings drawer (bucket/folder id, sync toggle) — **UI state only**.  
- **DoD**: Connect/disconnect mock state toggles and persists locally.

**Figures Extraction**  
- List detected figures/tables/images with small previews and “open page” action (mock).  
- **DoD**: Running mock extraction lists figure rows and thumbnails.

**Usage & Limits**  
- Usage summary (parse/extract/index/query counts); limits/caps with plan label (mock).  
- **DoD**: Counters update from mock; reset button for demo.

---

## Shared Components (reusable)
- Layout: `Sidebar`, `TopNav`
- UI: `Card`, `Badge`, `Tabs`, `Table`, `Drawer/Sheet`, `Toast`
- Parse: `Dropzone`, `FileList`, `JobStatusBadge`, `ParseOptionsForm`, `ResultPreview`
- Index/Query: `IndexBuilderForm`, `IndexConsole`, `MessageBubble`, `Composer`, `SourcesPanel`
- Documents: `GalleryItem`, `PreviewDrawer`
- Classify: `RulesBuilder`, `ClassLabelBadge` *(Phase 2)*
- Extract: `SchemaEditor`, `JsonPreview`, `ConfidenceTag` *(Phase 2)*
- Connectors: `ConnectorCard`, `ConnectorSettingsDrawer` *(Phase 2)*
- Usage: `UsageSummary`, `UsageChart` *(Phase 2)*

---

## Agents, Models, Orchestration
- **Agents**: `UIAgent`, `APIAgent`, `ParseAgent`, `IndexAgent`, `ChatAgent`, `InfraAgent`.
- **Model defaults** (env-driven):  
  - UIAgent → **low**  
  - API/Parse/Index/Chat → **medium**  
  - InfraAgent → **high**  
  (Override via `NEUROSTACK_MODEL_*`; fallback to `OPENAI_DEFAULT_MODEL`.)
- **Parallel approach**: Coordinator reads `tasks.yaml`, spawns agents in parallel.
- **Handoffs**: `APIAgent → ParseAgent → IndexAgent → ChatAgent`.
- **Path guardrails**: each agent edits only within its allowed directories.

---

## Environment & Config (single section here; no separate file)
- Provide `.env.example`; copy to `.env` for local.  
- Required variables:
OPENAI_API_KEY=...
OPENAI_DEFAULT_MODEL=gpt-5-mini
NEUROSTACK_MODEL_UI=gpt-5-low
NEUROSTACK_MODEL_API=gpt-5-medium
NEUROSTACK_MODEL_PARSE=gpt-5-medium
NEUROSTACK_MODEL_INDEX=gpt-5-medium
NEUROSTACK_MODEL_CHAT=gpt-5-medium
NEUROSTACK_MODEL_INFRA=gpt-5-high
NEXT_PUBLIC_DEPLOY_TARGET=local # local|staging
ENABLE_BENCHMARKS=false # true only in cloud/staging
MAX_UPLOAD_MB=50
DATABASE_URL=sqlite://./dev.db
- **Local**: fast demo; no benchmarks.  
- **Staging/Cloud**: set envs via GitHub Actions environment secrets/vars; benchmarks may be enabled.  
- **Databases**: SQLite locally; plan Postgres in cloud (configure via `DATABASE_URL` when applicable).

---

## Testing Strategy (phase-gated)
**Phase 1 — Local/Demo (time-efficient)**
- Functional smoke: Upload → Parse preview; Documents; Index + Query/Chat mock.  
- Unit/component tests for shared components.  
- Skip heavy visual regression/a11y unless trivial.

**Phase 1 — Staging (after MVP is ready)**
- **MANDATORY**: run **E2E tests via Playwright MCP** covering Parse → Index → Query/Chat.  
- Add visual regression snapshots on key screens; basic a11y checks (contrast, focus, keyboard nav).  
- API/schema contract validation (schemas/guardrails for request/response shapes).

**Phase 2 — Local & Cloud Enhancements**
- Extend E2E to **Classify**, **Extract**, **Connectors**, **Figures Extraction**, **Usage & Limits**.  
- Performance sampling (latency) in staging only (optionally gated by `ENABLE_BENCHMARKS=true`).  
- Production (optional future): all of staging + error tracking, security scans, load tests.

---

## Deployment
- **Docker** image for cloud-agnostic deploy.  
- **GitHub Actions** for staging: Node 20 runner; environment-scoped secrets/vars; write perms as needed for CI.  
- No health-endpoint logging requirement; optional later.

---

## Documentation References (for Codex to consult when needed)
- **Next.js App Router**: layouts & pages (routing and `layout.tsx` usage).  
- **shadcn/ui**: theming via CSS variables/Tailwind; dark mode patterns.  
- **OpenAI Agents JS SDK**: agents, tools, **handoffs**, **guardrails**.  
- **LlamaCloud**: Parse / Classify / Extract / Index / Query UI concepts.  
- **Playwright**: E2E/component testing best practices.
- (Codex may search docs as needed; use official sources.)

---

## Definition of Done (per Task/PR)
- Compiles cleanly (no TS errors), lints pass.  
- Screen renders with Emerald Noir theme and required UI controls.  
- Tests updated: unit/component for new pieces; E2E where phase mandates (Playwright MCP in staging after MVP).  
- Env vars documented; `.env.example` updated if new config added.  
- Handoffs and allowed-paths respected by agents.  
- For MVP exit: all MVP screens render; core mock flows pass; staging E2E suite runs.

---

## Changelog
- **v1.2** — Unified file; MVP pages + Phase 2 pages (Classify, Extract, Connectors, Figures Extraction, Usage & Limits). E2E via Playwright MCP required in staging post-MVP. One **Environment & Config** subsection (no separate “VARIABLES” file).
