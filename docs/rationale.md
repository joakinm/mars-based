# Architectural Rationale & Scope Decisions

## 1. Executive Summary & Problem Framing
MarsLogistics OS is built as a mission-critical multimodal visibility and exception management cockpit. The solution is strictly scoped to solve high-impact operational friction: rapid exception triage for dispatchers (`OPERATIONS`) and transparent status tracking with proactive impact surfacing for B2B cargo owners (`CUSTOMER`).

## 2. Deliberate Scope Cuts (The 8-Hour Boundary)
To prioritize engineering rigor, strict contracts, and verified test suites over surface-level feature sprawl, the following items were deliberately scoped out:

* **Authentication & RBAC Backend:** Replaced with an instantaneous in-memory role switcher. In an operational assessment, validating state synchronization and viewport resilience across roles provides higher signal than boilerplate JWT tokens.
* **Database & WebSocket Infrastructure:** Substituted with deterministic in-memory state and contract-compliant mocks (`docs/openapi.yaml`). Real-time WebSockets were omitted in favor of verifiable state machine transitions (`resolveException`) and reproducible E2E tests.
* **Bespoke Mobile-First Interfaces:** Multimodal customs triage is a high-density, multi-column desktop workflow. We implemented responsive layout degradation (`INV-5` in `openspec/specs/responsive-layout/spec.md`) ensuring zero layout shift or clipping on narrow viewports, while intentionally avoiding a dedicated mobile redesign.

## 3. Key Architecture & Technology Choices

| Decision | Alternative Considered | Justification |
| :--- | :--- | :--- |
| **React Context API** | Redux Toolkit / Zustand | Zero external boilerplate. Domain state is contained, predictable, and fully typed via TypeScript discriminated unions without state fragmentation. |
| **OpenSpec + Playwright E2E** | Jest + React Testing Library | Unit tests on mock DOMs fail to catch CSS clipping, modal `Escape` event listeners, or end-to-end view state persistence. Playwright validates real browser behavior against certified domain invariants (`INV-1` to `INV-5`). |
| **OpenAPI 3.1 Contract First** | Ad-hoc TypeScript types | Establishes a single source of truth (`docs/openapi.yaml`) decoupled from frontend implementation, ready for backend integration. |
| **Tailwind CSS v3** | CSS Modules / Styled Components | Deterministic utility constraints prevent CSS regression, eliminate runtime style overhead, and allow rapid responsive containment. |

## 4. Quality & Verification Standards
* **Certified Invariants:** 5 system invariants formally specified in `openspec/specs/` (`tracking-engine` and `responsive-layout`).
* **CI Hardening:** Deterministic GitHub Actions pipeline executing TypeScript compilation (`tsc --noEmit`), Vite production build, and headless Chromium E2E testing in under 60 seconds.