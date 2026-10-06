# MarsLogistics OS - AI Tracking Engine

Consolidated multimodal operations and client visibility platform built for the **MarsBased** technical assessment.

---

## 🚀 Tech Stack

* **Framework:** React 18 + Vite
* **Language:** TypeScript (Strict, Clean Naming Convention)
* **Styling:** Tailwind CSS v3 + PostCSS
* **State Management:** React Context API (`ShipmentContext`)
* **Icons:** Lucide React

---

## 🏗️ Architectural Overview & Design Decisions

This application is architected around an **AI Exception Triage Engine** that addresses the core friction points in multimodal logistics (road, sea, rail, air):
1. **Operations View (`OPERATIONS` Role):** Designed for logistics controllers. Features an automated exception triage bar, risk-level filtering (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), natural language search, and automated action execution modals with pre-filled payloads (customs clearance, carrier escalation, proactive notices).
2. **Customer Self-Service Portal (`CUSTOMER` Role):** Provides end-clients with transparency through a **Smart Multimodal Timeline**, proactive delay alerts, confirmed vs. AI-predicted ETAs, and verified digital documentation tracking.
3. **OpenSpec Contract:** Governed by an internal specification (`openspec.yml`) enforcing type safety, zero console errors, modular components, and atomic conventional commits.

---

## 📂 Project Structure

```text
shipment-tracker/
├── src/
│   ├── components/
│   │   ├── ActionModal.tsx        # Automated AI action execution modal
│   │   ├── CustomerView.tsx       # Client self-service portal & smart timeline
│   │   ├── Header.tsx             # Global shell, navigation & role switcher
│   │   └── OperationsView.tsx     # Operations triage dashboard & filters
│   ├── context/
│   │   └── ShipmentContext.tsx    # Global state, filtering & exception resolution
│   ├── data/
│   │   └── mockShipments.ts       # Rich multimodal dataset (customs holds, congestion, etc.)
│   ├── types/
│   │   └── shipment.ts            # Strict domain contracts & entities
│   ├── App.tsx                    # Root layout and role router
│   ├── main.tsx                   # Application entrypoint
│   └── index.css                  # Tailwind CSS directrices
├── openspec.yml                   # Architecture & system rules contract
├── tailwind.config.js             # Tailwind v3 configuration
├── postcss.config.js              # PostCSS plugins setup
└── vite.config.ts                 # Vite bundler configuration
```

---

## 🛠️ Getting Started Locally

### Prerequisites
* Node.js (v18+ recommended)
* npm

### Installation & Execution

1. Clone or navigate to the project directory:
   ```powershell
   cd shipment-tracker
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Run the development server:
   ```powershell
   npm run dev
   ```

4. Run strict type checking:
   ```powershell
   npx tsc --noEmit
   ```

---

## 🛡️ Quality Gates & Git Workflow
* **Type Safety:** 100% strict TypeScript checks (`tsc --noEmit`).
* **Conventional Commits:** Implemented atomic commits following conventional standards (`feat`, `chore`, `refactor`).
