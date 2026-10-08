> **Note:** A visually formatted version is also available on [Notion]
(https://app.notion.com/p/marslogistics_technical_operations_manual-v2-eff9ef97f7b482f5aa5d0150d4838d83?source=copy_link).
# MARSLOGISTICS OS: COMPREHENSIVE USER MANUAL & TECHNICAL SPECIFICATION

**Dual-Layer Reference: Plain-English Concept Guides & In-Depth Technical Specifications**

*Document Edition: 2.0.0 · Target Audience: Operations Staff, Customer Success, and Software Engineers*

---

## Quick Navigation & Glossary Index

| Plain-English Concept | Technical Name | Where It Lives | What It Does (In 5 Words) |
| :--- | :--- | :--- | :--- |
| **The Control Room** | `OperationsView.tsx` | View Layer | Spots problems, triages emergency shipments. |
| **The Client Portal** | `CustomerView.tsx` | View Layer | Clean, transparent delivery updates. |
| **The Fix-It Button** | `ActionModal.tsx` | Modal Component | Reviews and sends pre-drafted solutions. |
| **The Central Brain** | `ShipmentContext.tsx` | State Management | Keeps all screens in sync. |
| **The Digital Passport** | `Shipment` Aggregate | `types/shipment.ts` | Complete record of cargo journey. |
| **The AI Co-Pilot** | `AiAssessment` | `types/shipment.ts` | Predicts delays before carriers report. |
| **The Safety Inspector** | Playwright E2E Suite | `e2e/*.spec.ts` | Tests every click before release. |
| **The Auto-Shipper** | GitHub Actions CI | `.github/workflows/ci.yml` | Validates code automatically on push. |

---

## Table of Contents

1. [System Overview: How MarsLogistics Works](#1-system-overview-how-marslogistics-works)
   - 1.1 The Plain-English Big Picture
   - 1.2 System Architecture & Topology
2. [The Central Brain: State Management](#2-the-central-brain-state-management)
   - 2.1 Simple Concept: Shared Memory
   - 2.2 Details: `ShipmentContext.tsx` & React Hooks
3. [The Control Room: Operations View](#3-the-control-room-operations-view)
   - 3.1 Simple Concept: Management by Exception
   - 3.2 Details: Filtering, Search Debounce, & Metrics
4. [The Client Portal: Customer View](#4-the-client-portal-customer-view)
   - 4.1 Simple Concept: Radical Transparency Without Jargon
   - 4.2 Details: Smart Timeline, Delay Banners & Telemetry Audit
5. [The Fix-It Assistant: Action Modal](#5-the-fix-it-assistant-action-modal)
   - 6.1 Simple Concept: Human-in-the-Loop Automated Support
   - 6.2 Details: Lifecycle, Keyboard Traps & Invariants
6. [Domain Contracts & State Machine](#6-domain-contracts--state-machine)
   - 6.1 Simple Concept: The Journey of a Package
   - 6.2 Details: State Machine & The 4 Certified Invariants (`INV-1` to `INV-4`)
7. [API & Specifications Contract](#7-api--specifications-contract)
   - 7.1 Simple Concept: How Systems Talk to Each Other
   - 7.2 Details: OpenAPI 3.1 & OpenSpec BDD Scenarios
8. [End-to-End Safety Net: Automated Tests](#8-end-to-end-safety-net-automated-tests)
   - 8.1 Simple Concept: The Relentless Testing Robot
   - 8.2 Details: Playwright Scenarios 1 Through 5
9. [Standard Operating Procedures (SOP Playbooks)](#9-standard-operating-procedures-sop-playbooks)
   - 9.1 SOP-01: Clearing a Critical Customs Hold
   - 9.2 SOP-02: Tracking Down Silent Carriers (Stale Telemetry)
   - 9.3 SOP-03: Customer Self-Service & Proactive Rescheduling

---

## 1. System Overview: How MarsLogistics Works

### 1.1 The Plain-English Big Picture
Imagine sending a shipping container full of train components from Spain to Germany. It travels on a truck, boards a cargo ship, goes through an international seaport, passes customs inspectors, and boards another truck. 

Normally, each transportation company uses their own private computer system. If a customs officer in the Netherlands stops the container because of a tax paperwork typo, the customer in Germany has no idea why their package is late—they just see that it stopped moving.

**MarsLogistics OS** acts like a master interpreter and air traffic controller:
1. It listens to raw updates from trucks, ships, and ports.
2. It translates technical codes (like `GATE_IN_VLC_02`) into plain, clear English.
3. An artificial intelligence co-pilot spots problems early (like anticipating a 48-hour delay before the ship even docks) and writes the exact email needed to solve the problem with one click.

---

### 1.2 System Architecture & Topology

```
+-----------------------------------------------------------------------------------+
|                                 WEB BROWSER                                       |
|                                                                                   |
|   +------------------------------------+  +-----------------------------------+   |
|   |         OPERATIONS VIEW            |  |           CUSTOMER VIEW           |   |
|   |     (For Dispatchers & Staff)      |  |      (For Clients & Partners)     |   |
|   |  - Color-coded triage counters     |  |  - "+72h Adjusted ETA" Alert      |   |
|   |  - Fast search & risk filtering    |  |  - Multimodal journey map         |   |
|   |  - One-click remediation trigger   |  |  - Verified customs paperwork     |   |
|   +-----------------+------------------+  +-----------------+-----------------+   |
|                     |                                       |                     |
|                     +-------------------+-------------------+                     |
|                                         |                                         |
|                       +-----------------v-----------------+                       |
|                       |        SHIPMENT CONTEXT           |                       |
|                       |   Single source of truth in memory|                       |
|                       |   Zero delay between views        |                       |
|                       +-----------------+-----------------+                       |
+-----------------------------------------|-----------------------------------------+
                                          |
                        +-----------------v-----------------+
                        |     DOMAIN SPECIFICATION LAYER    |
                        |  - TypeScript: types/shipment.ts  |
                        |  - OpenAPI 3.1: docs/openapi.yaml |
                        |  - OpenSpec BDD: spec.md          |
                        +-----------------------------------+
```

#### 🔍 Details & Technical Stack:
* **Frontend Runtime:** React 18 / 19 with TypeScript 5.6 (strict mode enabled, zero `any` allowance).
* **Build System:** Vite 5.4 providing Instant Hot Module Replacement (HMR) and optimized Rollup tree-shaking.
* **Styling Framework:** Tailwind CSS 3.4 for accessible color tokens and dense grid structures.
* **Icons:** Lucide React (standardized cargo, vessel, truck, and warning glyphs).
* **Test Engine:** Playwright Test 1.48 running against headless Chromium.
* **Continuous Integration:** GitHub Actions hosted on Ubuntu with Node.js 22.

---

## 2. The Central Brain: State Management

### 2.1 Simple Concept: Shared Memory
Think of the State Manager as a whiteboard hanging in the center of the office. 

When a dispatcher in the Operations room clicks "Resolve Problem", they write the update on that whiteboard. When the customer looks at their screen, they are looking at that very same whiteboard. There is never a delay, never a need to press refresh, and no risk of the customer seeing old information while the operator sees new information.

---

### 2.2 Details: `ShipmentContext.tsx` & React Hooks

The central state is provided via a React Context provider without external state-library overhead.

```typescript
export interface ShipmentContextValue {
  shipments: Shipment[];
  selectedShipmentId: string;
  selectedShipment: Shipment;
  role: 'OPERATIONS' | 'CUSTOMER';
  setRole: (role: 'OPERATIONS' | 'CUSTOMER') => void;
  selectShipment: (id: string) => void;
  resolveException: (shipmentId: string, actionId: string) => void;
}
```

#### Function Reference:
* `setRole(role)`: Toggles interface perspective without unmounting the aggregate or losing the active shipment selection (enforcing invariant `INV-1`).
* `selectShipment(id)`: Changes the focused shipment across both views.
* `resolveException(shipmentId, actionId)`: Executes an in-memory state transition:
  * Updates `status` from `HELD` or `EXCEPTION` to `IN_TRANSIT`.
  * Drops `riskLevel` from `CRITICAL` or `HIGH` to `LOW`.
  * Resets `predictedDelayHours` to `0`.
  * Overwrites `aiAssessment.summary` with resolution confirmation text.

---

## 3. The Control Room: Operations View

### 3.1 Simple Concept: Management by Exception
If an operator manages 500 shipments, they cannot check every single one every hour. 

The Operations View organizes shipments using **Management by Exception**. This means:
* Shipments running smoothly remain quiet in green.
* Shipments with emergencies (customs blocks, broken GPS sensors) jump straight to the top with red warning badges.
* The operator only spends time on shipments that actively need human attention.

---

### 3.2 Details: Filtering, Search Debounce, & Metrics

#### Key Sub-Modules in `OperationsView.tsx`:

1. **Triage Summary Ribbon:**
   Computes aggregated counts across all risk categories:
   $$\text{Total} = N_{\text{CRITICAL}} + N_{\text{HIGH}} + N_{\text{MEDIUM}} + N_{\text{LOW}}$$
   Clicking any badge filters the table to that specific severity level.

2. **Substring Search Engine:**
   Filters rows in real time across four record properties:
   ```typescript
   const matchesQuery = 
     shipment.id.toLowerCase().includes(query) ||
     shipment.client.toLowerCase().includes(query) ||
     shipment.destination.toLowerCase().includes(query) ||
     shipment.aiAssessment.summary.toLowerCase().includes(query);
   ```

3. **Accessible Empty State:**
   If a search query yields zero matches (e.g., `NON_EXISTENT_QUERY_999`), the view renders an accessible fallback card:
   ```html
   <div role="status" class="text-center py-12">
     <h3 class="text-base font-semibold text-slate-900">No shipments found</h3>
     <p class="text-sm text-slate-500">No matching shipments found for your search criteria.</p>
   </div>
   ```

---

## 4. The Client Portal: Customer View

### 4.1 Simple Concept: Radical Transparency Without Jargon
Customers hate two things:
1. Being left in the dark when something is delayed.
2. Receiving technical error codes that make no sense (like `ERR_PORT_VLC_CUSTOMS_BLOCKED`).

The Customer View gives corporate clients complete peace of mind. If a shipment is on time, everything is clean and calm. If there is a delay, a prominent, polite notice appears at the top explaining:
* Exactly how many hours will be added to the arrival date (e.g., `+72h Adjusted ETA`).
* Why it happened in simple words (e.g., *"Cargo held at port terminal due to a customs paperwork review"*).
* Exactly which documents are being processed right now to fix it.

---

### 4.2 Details: Smart Timeline, Delay Banners & Telemetry Audit

#### Key Sub-Modules in `CustomerView.tsx`:

1. **Proactive Deviation Banner (`INV-2`):**
   * Condition: Only mounts if `shipment.aiAssessment.isDelayed === true` or `shipment.status === 'HELD'`.
   * When `isDelayed === false` (such as on-time shipment `SHP-4019-ES`), the banner is completely omitted from the DOM.

2. **Multimodal Smart Timeline:**
   Iterates through the `milestones` array and renders distinct visual checkpoints:
   * **Completed Checkpoints:** Checked icon with timestamp.
   * **Active Checkpoint:** Pulsing blue indicator representing current physical location.
   * **Blocked Checkpoint:** Amber or Red icon showing the exact physical bottleneck.
   * **Raw Telemetry Inspector:** Exposes low-level telemetry strings (e.g., `TRUCK_DEPARTED_HUB_A1`, `NO_PING_RECORDED`) alongside `lastTelemetryPing` for client technical auditors.

3. **Document Vault:**
   Renders verified trade documentation (`COMMERCIAL_INVOICE`, `BILL_OF_LADING`, `CUSTOMS_DECLARATION`) with verification status tokens (`VERIFIED`, `PENDING_REVIEW`, `REJECTED`).

---

## 5. The Fix-It Assistant: Action Modal

### 5.1 Simple Concept: Human-in-the-Loop Automated Support
When something goes wrong with a cargo shipment, fixing it usually requires typing repetitive emails to shipping lines, customs brokers, or truck drivers.

The **Action Modal** does 90% of the work automatically:
* It reads what the problem is.
* It drafts a professional email with all container numbers and reference codes filled in.
* It specifies which document needs to be re-uploaded.

**Crucial Rule:** The computer never sends anything without a human operator reading it first and clicking **"Approve and Apply Action"**.

---

### 5.2 Details: Lifecycle, Keyboard Traps & Invariants

```
   [Operator clicks "Rectify..."]
                 │
                 ▼
       ┌───────────────────┐
       │   Modal Mounts    │ <--- Binds window "keydown" (Escape)
       └─────────┬─────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
[Press "Escape"     [Click "Approve &
 or "Cancel"]        Apply Action"]
       │                   │
       ▼                   ▼
┌──────────────┐    ┌──────────────┐
│  Unmounts    │    │ resolveExcep-│
│  NO state    │    │ tion() runs  │
│  mutation    │    │ State -> LOW │
│  (INV-3)     │    │ Status->OK   │
└──────────────┘    └──────────────┘
```

#### Event Listeners & Invariant Enforcement:
* **Keyboard Escape Listener (`INV-3`):**
  ```typescript
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  ```
* **Cancellation Safety (`INV-3`):** Clicking `Cancel`, pressing `Escape`, or clicking outside the modal guarantees that the shipment remains in `HELD` / `CRITICAL` state.

---

## 6. Domain Contracts & State Machine

### 6.1 Simple Concept: The Journey of a Package
A package moves through predictable stages, just like an airplane flight:
1. **Pending:** Packed in the factory, waiting for the truck.
2. **In Transit:** Moving on the highway, railway, or across the ocean.
3. **Held:** A customs inspector or port authority asked to see paperwork before it can continue.
4. **Exception:** A sensor stopped sending GPS signals, or severe weather blocked the route.
5. **Delivered:** Safely signed for at the final warehouse.

---

### 6.2 Details: State Machine & The 4 Certified Invariants

#### TypeScript Domain Entities (`src/types/shipment.ts`):
```typescript
export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'HELD' | 'EXCEPTION' | 'DELIVERED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TransportMode = 'ROAD' | 'SEA' | 'AIR' | 'RAIL';

export interface MilestoneEvent {
  id: string;
  stageName: string;
  location: string;
  mode: TransportMode;
  carrier: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED';
  rawStatusDescription: string;
  timestamp?: string;
}

export interface AiAssessment {
  isDelayed: boolean;
  predictedDelayHours: number;
  confidenceScore: number;
  summary: string;
  rootCause: string;
  recommendedAction?: {
    actionId: string;
    actionType: 'CUSTOMS_RESUBMISSION' | 'ESCALATE_CARRIER' | 'ROUTE_REROUTE';
    label: string;
    description: string;
    payload: {
      emailSubject?: string;
      emailBody?: string;
      requiredDocument?: string;
    };
  };
}

export interface Shipment {
  id: string;
  client: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  riskLevel: RiskLevel;
  lastTelemetryPing: string;
  aiAssessment: AiAssessment;
  milestones: MilestoneEvent[];
  documents: Document[];
}
```

#### The 4 Certified Invariants:
* **`INV-1 (Selection Invariant)`:** Switching between `OPERATIONS` and `CUSTOMER` views MUST never reset or clear the selected shipment. The active package remains in focus.
* **`INV-2 (Proactive Warning Invariant)`:** Proactive delay warning cards MUST only render in Customer view when `aiAssessment.isDelayed === true` or `status === 'HELD'`. On-time shipments must display clean, calm statuses.
* **`INV-3 (Cancellation Invariant)`:** Closing an action modal via `Cancel`, backdrop click, or `Escape` MUST NOT alter shipment status, risk level, or delay estimates.
* **`INV-4 (Search Resilience Invariant)`:** Filter and search operations must be non-destructive and idempotent. Zero results display an accessible empty-state message without runtime crashes.

---

## 7. API & Specifications Contract

### 7.1 Simple Concept: How Systems Talk to Each Other
When other companies or external servers want to ask MarsLogistics OS for shipment information, they must follow strict rules, like an official diplomatic language.

* **OpenAPI 3.1** is the digital dictionary describing what questions external systems can ask.
* **OpenSpec BDD** is the rulebook written in plain English sentences describing how the system must behave in every possible scenario.

---

### 7.2 Details: OpenAPI 3.1 & OpenSpec BDD Scenarios

#### OpenAPI 3.1 Endpoint Summary (`docs/openapi.yaml`):
* `GET /api/v1/shipments`: Returns list of aggregate shipments (supports query parameters `riskLevel` and `search`).
* `GET /api/v1/shipments/{id}`: Returns a single aggregate root with full milestones and documents.
* `POST /api/v1/shipments/{id}/resolve-action`: Resolves an exception and resumes transit.

```json
// Example: POST /api/v1/shipments/SHP-8921-EU/resolve-action
{
  "actionId": "ACT-84920-CUSTOMS",
  "notes": "Corrected HS Code 8501.31 attached. Invoice re-uploaded to Maasvlakte customs portal.",
  "documentId": "DOC-INV-2024-001"
}
```

#### OpenSpec BDD Specification (`openspec/specs/tracking-engine/spec.md`):
```gherkin
Feature: Tracking Engine & AI Exception Resolution

  Scenario: Default view initialization (INV-1)
    GIVEN an operator accesses the application at the root route
    WHEN the application finishes loading
    THEN the interface defaults to the "OPERATIONS" role
    AND the "AI Exception Triage Summary" header is visible
    AND shipment "SHP-8921-EU" is selected by default in the active list

  Scenario: Modal Cancellation Invariant (INV-3)
    GIVEN shipment "SHP-8921-EU" is in "HELD" status with "CRITICAL" risk
    WHEN the operator clicks "Rectify Tariff Declaration"
    AND the Action Modal becomes visible
    AND the operator presses the "Escape" key
    THEN the Action Modal unmounts from the DOM
    AND shipment "SHP-8921-EU" remains in "HELD" status
    AND its risk level remains "CRITICAL"
```

---

## 8. End-to-End Safety Net: Automated Tests

### 8.1 Simple Concept: The Relentless Testing Robot
Every time an engineer makes a change to the code, an automated robot (Playwright) boots up a real web browser. 

The robot clicks buttons, searches for fake packages, tests the `Escape` key, and tries to break the app faster than any human could. If even a tiny bug or hidden error occurs in the background, the robot rings an alarm and stops the code from reaching users.

---

### 8.2 Details: Playwright Scenarios 1 Through 5

All tests live in `e2e/shipment-tracker.spec.ts` and run against headless Chromium with a zero-tolerance error listener:

```typescript
let unhandledErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  unhandledErrors = [];
  page.on('pageerror', (err) => unhandledErrors.push(`[Runtime Error]: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') unhandledErrors.push(`[Console Error]: ${msg.text()}`);
  });
  await page.goto('/');
});

test.afterEach(async () => {
  expect(unhandledErrors, 'Expected zero console errors or uncaught exceptions').toEqual([]);
});
```

#### The 5 Tested Scenarios:
1. **Scenario 1 (Role Switching & State Persistence):** Validates default `OPERATIONS` view, ensures operations controls unmount in `CUSTOMER` view, and verifies that `SHP-8921-EU` stays selected across rapid view changes (`INV-1`).
2. **Scenario 2 (Dynamic Search & Filter Edge Cases):** Validates the `CRITICAL` risk filter, partial client search ("Alstom"), partial ID search ("6210"), empty state display on non-existent queries, and full portfolio restoration (`INV-4`).
3. **Scenario 3 (On-Time Shipments vs. Delay Banners):** Verifies that on-time shipment `SHP-4019-ES` hides the proactive banner, while delayed shipment `SHP-8921-EU` renders the `+72h Adjusted ETA` notice (`INV-2`).
4. **Scenario 4 (Stale Data & Raw Telemetry):** Verifies detection of `STALE_DATA` with `ESCALATE_CARRIER` in operations, and checks that `rawStatusDescription` (`TRUCK_DEPARTED_HUB_A1`) and timestamps render in customer timeline.
5. **Scenario 5 (Modal Lifecycle & Mitigation Flow):** Validates cancellation via `Cancel` button and `Escape` key (`INV-3`), verifies prefilled email drafts, approves the action, and confirms immediate transition to `IN_TRANSIT` with `LOW` risk across both views.

---

## 9. Standard Operating Procedures (SOP Playbooks)

### 9.1 SOP-01: Clearing a Critical Customs Hold

* **When to use:** A shipment row is colored red with status `HELD` and risk `CRITICAL`.
* **Goal:** Review corrected customs documentation and resume cargo transit.

```
Step 1: Open the Operations dashboard.
Step 2: Click the red "Critical" filter button in the top metric bar.
Step 3: Select shipment "SHP-8921-EU" (Alstom Transport SA).
Step 4: Click the blue "Rectify Tariff Declaration" button.
Step 5: Review the pre-drafted customs email and required document badge.
Step 6: Click "Approve and Apply Action".
Result: The modal closes, status updates to "IN_TRANSIT", and risk drops to "LOW".
```

---

### 9.2 SOP-02: Tracking Down Silent Carriers (Stale Telemetry)

* **When to use:** A shipment displays status `EXCEPTION` with diagnosis `STALE_DATA`.
* **Goal:** Ping the shipping carrier to restore GPS and EDI tracking feeds.

```
Step 1: In Operations view, locate shipment "SHP-6210-RD".
Step 2: Check "Last Telemetry Ping" (exceeds standard 48h SLA).
Step 3: Click "Escalate Incident to DB Schenker".
Step 4: Verify that the container ID and carrier tracking number are correct.
Step 5: Click "Send Escalation Ticket".
Result: The carrier is notified, and the automated ping recovery timer starts.
```

---

### 9.3 SOP-03: Customer Self-Service & Proactive Rescheduling

* **When to use:** A corporate client wants to check their delivery date without calling support.
* **Goal:** View verified delivery estimates, reason for delay, and customs paperwork.

```
Step 1: In the top right header, click "Customer Portal".
Step 2: Click your Shipment ID (e.g., "SHP-8921-EU").
Step 3: Check the top alert banner for revised arrival dates (+72h Adjusted ETA).
Step 4: Scroll down to the "Smart Multimodal Timeline" to see which port or highway leg the cargo is currently traversing.
Step 5: Click on any document in the "Documentation" section to view verified paperwork.
```

---

## 10. Verification Commands & Operational Checklist

To verify the complete project locally, execute these deterministic terminal commands from the repository root:

```powershell
# 1. Start local development server
npm run dev

# 2. Run strict TypeScript compilation check (0 errors required)
npx tsc --noEmit

# 3. Compile production distribution bundle
npm run build

# 4. Run automated Playwright end-to-end test suite
npx playwright test

# 5. Launch interactive visual time-travel test debugger
npx playwright test --ui
```