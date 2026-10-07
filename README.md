# MarsLogistics OS - AI Tracking Engine

Consolidated multimodal operations and client visibility platform built for the **MarsBased** technical assessment.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript (Strict mode, clean naming without I/T/E prefixes) |
| Styling | Tailwind CSS v3 + PostCSS |
| State Management | React Context API (`ShipmentContext`) |
| Icons | Lucide React |
| Testing | Playwright (E2E, Chromium) |

---

## 🏗️ Architectural Overview

This application is architected around an **AI Exception Triage Engine** that addresses the core friction points in multimodal logistics (road, sea, rail, air):

1. **Operations View (`OPERATIONS` role):** Designed for logistics controllers. Features an automated exception triage bar, risk-level filtering (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), natural language search, and automated action execution modals with pre-filled payloads (customs clearance, carrier escalation, proactive notices).
2. **Customer Self-Service Portal (`CUSTOMER` role):** Provides end-clients with transparency through a **Smart Multimodal Timeline**, proactive delay alerts, confirmed vs. AI-predicted ETAs, and verified digital documentation tracking.
3. **Domain Contract:** Governed by `openspec.yml` enforcing type safety, strict TypeScript, modular components, and atomic conventional commits.

---

## 📂 Project Structure

```text
shipment-tracker/
├── src/
│   ├── components/
│   │   ├── ActionModal.tsx        # Assisted AI action execution modal (Escape + Cancel invariants)
│   │   ├── CustomerView.tsx       # Client self-service portal & smart multimodal timeline
│   │   ├── Header.tsx             # Global shell, navigation & role switcher
│   │   └── OperationsView.tsx     # Operations triage dashboard, filters & empty state
│   ├── context/
│   │   └── ShipmentContext.tsx    # Global state, filtering & exception resolution
│   ├── data/
│   │   └── mockShipments.ts       # Rich multimodal dataset (6 shipments: customs holds, stale data, congestion…)
│   ├── types/
│   │   └── shipment.ts            # Strict domain contracts aligned with OpenAPI 3.1
│   ├── App.tsx                    # Root layout and role router
│   ├── main.tsx                   # Application entrypoint
│   └── index.css                  # Tailwind CSS directives
├── e2e/
│   └── shipment-tracker.spec.ts   # Playwright E2E suite (5 scenarios, 0 arbitrary sleeps)
├── docs/
│   ├── openapi.yaml               # OpenAPI 3.1 REST contract (Swagger/Redoc compatible)
│   └── spec/
│       └── architecture.md        # Domain contract breakdown & role flow documentation
├── openspec/
│   └── specs/
│       └── tracking-engine/
│           └── spec.md            # Formal BDD specification (Given/When/Then, domain invariants)
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI pipeline
├── openspec.yml                   # Architecture & system rules contract
├── playwright.config.ts           # Playwright configuration (Chromium, 1280×720, webServer)
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js **22.x** (recommended) or 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Run the development server (http://localhost:5173)
npm run dev
```

---

## ✅ Quality Gates

### Type Checking
```bash
npx tsc --noEmit
```
Runs strict TypeScript type checking with zero tolerance for errors.

### Production Build
```bash
npm run build
```
Compiles TypeScript and bundles via Vite. Outputs hashed assets to `dist/`.

### E2E Test Suite
```bash
npx playwright test
```
Runs the full 5-scenario Playwright test suite against Chromium headless (port 5173). The `webServer` config auto-starts the dev server if not already running.

To open the interactive Playwright UI:
```bash
npx playwright test --ui
```

---

## 📐 API & Architecture Documentation

| Artifact | Path | Description |
|---|---|---|
| OpenAPI 3.1 Spec | [`docs/openapi.yaml`](docs/openapi.yaml) | Full REST contract, schemas, and endpoint definitions. Load in Swagger UI or Redoc. |
| Architecture Breakdown | [`docs/spec/architecture.md`](docs/spec/architecture.md) | Domain contract summary, entity responsibilities, and OPERATIONS / CUSTOMER role flows. |
| Formal BDD Specification | [`openspec/specs/tracking-engine/spec.md`](openspec/specs/tracking-engine/spec.md) | 5 verified requirements with Given/When/Then scenarios and domain invariants. Validated by `openspec validate`. |

---

## 🔄 CI Pipeline

The `.github/workflows/ci.yml` pipeline triggers on every `push` and `pull_request` against `main`:

1. Setup Node.js 22.x with npm cache
2. `npm ci`
3. `npx tsc --noEmit` — Type check
4. `npm run build` — Production build
5. `npx playwright install --with-deps chromium` — Install browser
6. `npx playwright test` — Full E2E suite
7. Upload Playwright report as artifact on failure (7-day retention)

---

## 🛡️ Domain Invariants

| ID | Invariant |
|---|---|
| INV-1 | Selected shipment persists across `OPERATIONS` ↔ `CUSTOMER` role switches |
| INV-2 | Proactive delay banners render **only** when `isDelayed: true` or `currentStatus: HELD` |
| INV-3 | Cancelling the triage modal (button or `Escape`) leaves shipment state untouched |
| INV-4 | Search and filter operations are idempotent and resilient to empty result sets |

---

## 📝 Conventional Commits

All commits follow the conventional commits standard:

```
feat(scope): description     # New features
fix(scope): description      # Bug fixes
docs(scope): description     # Documentation
test(scope): description     # Tests
chore(scope): description    # Maintenance
refactor(scope): description # Code refactoring
```
