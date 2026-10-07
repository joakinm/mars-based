# Tracking Engine Specification

## Purpose
The Tracking Engine capability delivers real-time multimodal shipment visibility, AI-driven exception detection, telemetry reconciliation, and assisted operational triage across road, sea, air, rail, and multimodal transit corridors for MarsLogistics OS.

## Domain Model & State Invariants

### 1. Entities and Value Objects
- **Shipment**: Root aggregate containing routing metadata, status lifecycle, assigned carrier, telemetry ping, and AI assessment.
- **MilestoneEvent**: Chronological checkpoint containing operational category, normalized milestone status (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`), carrier attribution, and unnormalized raw telemetry (`rawStatusDescription`).
- **Document**: Regulatory and trade compliance file (`COMMERCIAL_INVOICE`, `CUSTOMS_DECLARATION`, `BILL_OF_LADING`, `PACKING_LIST`) with verification states (`VERIFIED`, `PENDING_REVIEW`, `REJECTED`).
- **AiAssessment**: Evaluative intelligence payload containing risk classification (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), confidence score, deviation metrics (`isDelayed`, `predictedDelayHours`), ETA reconciliation (`confirmedEta` vs `predictedEta`), diagnostic explanation, and executable action proposals (`recommendedAction`).

### 2. State Machine Rules
- **Initial / Active States**: A newly recorded shipment enters `PENDING` before transitioning to active route execution (`IN_TRANSIT`).
- **Degraded / Held States**: A shipment experiencing regulatory delays or customs discrepancies enters `HELD`. A shipment experiencing stale telemetry or operational failure enters `EXCEPTION`.
- **Triage & Mitigation Transition**: Applying an AI assisted resolution action transitions `HELD` or `EXCEPTION` shipments directly to `IN_TRANSIT`, resets `isDelayed` to `false`, zeroes `predictedDelayHours`, sets `riskLevel` to `LOW`, and clears pending actionable recommendations.
- **Terminal State**: Shipments reaching final destination successfully transition to `DELIVERED`.

### 3. Core System Invariants
- **INV-1 (Selection Invariant)**: The active `selectedShipmentId` MUST persist across user role transitions between `OPERATIONS` and `CUSTOMER`.
- **INV-2 (Proactive Warning Invariant)**: Proactive delay update banners MUST only be rendered when `aiAssessment.isDelayed` is `true` or `currentStatus` is `HELD`. On-time shipments (`isDelayed: false`) MUST NOT display proactive delay warning notices.
- **INV-3 (Cancellation Invariant)**: Dismissing or cancelling an operational action modal via UI button or `Escape` key MUST NOT alter the shipment's status, risk level, or diagnostic payload.
- **INV-4 (Search Resilience Invariant)**: Filter and query operations MUST be idempotent, non-destructive, and resilient against empty search results without throwing unhandled exceptions or disrupting table layout.

## Requirements

### Requirement: Role-Based Access & View Partitioning
The system SHALL partition presentation logic and capabilities between `OPERATIONS` and `CUSTOMER` roles while maintaining unified domain state persistence.

#### Scenario: Default view initialization
- **GIVEN** an operator accesses the tracking application at the root route
- **WHEN** the application loads
- **THEN** the interface defaults to the `OPERATIONS` role
- **AND** the AI Exception Triage summary header is displayed
- **AND** shipment `SHP-8921-EU` is selected by default in the active portfolio list

#### Scenario: Transition to customer self-service portal
- **GIVEN** an active session in the `OPERATIONS` role
- **WHEN** the user activates the "Customer Portal" role switcher
- **THEN** operational triage controls, risk metric filters, and action buttons are unmounted
- **AND** customer-facing Smart Multimodal Timeline, documentation checklist, and cargo routing summaries are rendered
- **AND** the active shipment details correspond to `SHP-8921-EU`

#### Scenario: Selection state persistence across role switching
- **GIVEN** an active shipment is selected in either role view
- **WHEN** the user rapidly toggles between `OPERATIONS` and `CUSTOMER` roles
- **THEN** the active `selectedShipmentId` remains unchanged
- **AND** the view renders without visual flickering, blank screens, or state reset

### Requirement: Real-time Filtering & Resilient Substring Search
The system SHALL provide dynamic portfolio filtering by risk level and resilient substring search across shipment identifiers, client names, destinations, and AI diagnoses.

#### Scenario: Risk level filtering
- **GIVEN** a portfolio of 6 shipments containing mixed risk levels
- **WHEN** the operator selects the `CRITICAL` risk filter
- **THEN** only shipments evaluated with `CRITICAL` risk (e.g. `SHP-8921-EU`) are visible in the portfolio
- **AND** the portfolio counter displays "Showing 1 of 6 shipments"
- **AND** non-critical shipments are excluded from the table view

#### Scenario: Filter clearing and portfolio restoration
- **GIVEN** an active filter restricting visible shipments
- **WHEN** the operator selects the "All" filter option
- **THEN** all 6 shipments in the active portfolio are restored and rendered in the table view

#### Scenario: Substring search matching
- **GIVEN** the shipment portfolio in the operations view
- **WHEN** the operator enters a partial customer name ("Alstom") into the search query input
- **THEN** all matching shipments belonging to "Alstom Transport SA" (`SHP-8921-EU` and `SHP-1088-OK`) are displayed
- **AND** non-matching shipments (e.g. `SEAT Componentes`) are excluded
- **AND** searching by partial shipment identifier ("6210") isolates shipment `SHP-6210-RD`

#### Scenario: Empty state handling for unmatched queries
- **GIVEN** an operator enters a non-existent search term ("NON_EXISTENT_QUERY_999")
- **WHEN** the search filter resolves with zero matching shipments
- **THEN** an accessible empty state message "No shipments found" is rendered
- **AND** the portfolio counter displays "Showing 0 of 6 shipments"
- **AND** the table structure remains intact without throwing runtime errors
- **AND** clearing the query input restores all 6 shipments immediately

### Requirement: Predictive Delay Surfacing
The system SHALL compare carrier confirmed arrival estimates against AI predictive estimates, surfacing proactive warning banners only when arrival deviations or operational holds occur.

#### Scenario: On-time transit suppresses delay banners
- **GIVEN** an on-schedule shipment evaluated with `LOW` risk and `isDelayed: false` (`SHP-4019-ES`)
- **WHEN** the customer views the shipment in the self-service portal
- **THEN** the status badge indicates "In Transit - On Schedule"
- **AND** the proactive delay warning banner ("Proactive Update Notice") is strictly NOT displayed
- **AND** no adjusted ETA delay hours are surfaced

#### Scenario: Predictive deviation surfaces proactive delay warning
- **GIVEN** a delayed shipment evaluated with `CRITICAL` risk and `isDelayed: true` (`SHP-8921-EU`)
- **WHEN** the customer views the shipment in the self-service portal
- **THEN** a proactive warning banner with "Proactive Update Notice" is displayed
- **AND** the calculated delay indicator displays "+72h Adjusted ETA"
- **AND** the corresponding risk badge `CRITICAL` is rendered alongside the diagnostic summary

### Requirement: Stale Telemetry Degradation Handling
The system SHALL detect stale tracking telemetry, expose degraded timeline events with raw carrier telemetry, and suggest carrier escalation actions.

#### Scenario: Operations triage of stale telemetry
- **GIVEN** shipment `SHP-6210-RD` exhibiting missing telemetry updates for over 40 hours
- **WHEN** the operator inspects the shipment in the operations view
- **THEN** the exception reason badge displays `STALE_DATA`
- **AND** the proposed operational action specifies `ESCALATE_CARRIER`
- **AND** the action button presents "Escalate Incident to DB Schenker"

#### Scenario: Customer inspection of raw telemetry and ping timestamp
- **GIVEN** shipment `SHP-6210-RD` selected in the customer portal
- **WHEN** the customer navigates the Smart Multimodal Timeline
- **THEN** each milestone event renders its unnormalized carrier status description (`rawStatusDescription`, e.g. "TRUCK_DEPARTED_HUB_A1", "TOLL_PASS_SENSOR_OK", "NO_PING_RECORDED")
- **AND** the timeline header displays the last recorded telemetry ping timestamp ("2026-10-04T14:20:00Z")

### Requirement: AI Mitigation Lifecycle & State Transitions
The system SHALL provide an assisted mitigation workflow that presents prefilled resolution payloads, enforces cancellation invariants, and atomically transitions shipment status upon approval.

#### Scenario: Modal cancellation preserves shipment state intact
- **GIVEN** an operational modal opened for a held shipment (`SHP-8921-EU`)
- **WHEN** the operator clicks the "Cancel" button or presses the `Escape` key
- **THEN** the modal unmounts immediately
- **AND** the shipment retains its `HELD` status in the portfolio list
- **AND** the risk level remains `CRITICAL` without mutation

#### Scenario: Prefilled payload verification and assisted execution
- **GIVEN** an operator opens the AI Next Action modal for `SHP-8921-EU`
- **WHEN** the assisted draft container renders
- **THEN** prefilled domain fields display the required document type `CUSTOMS_DECLARATION`
- **AND** prefilled email subject contains "Urgent: Customs clearance SHP-8921-EU - Corrected documentation"
- **AND** prefilled email body contains the specific container resolution instructions
- **WHEN** the operator clicks the "Approve and Apply Action" confirmation button
- **THEN** the modal closes immediately
- **AND** the shipment status badge in the operations list updates to `IN_TRANSIT`
- **AND** the shipment risk level transitions to `LOW`
- **AND** the AI summary updates to indicate the exception was resolved
- **AND** switching to the customer portal displays "In Transit - On Schedule" in real time without a page refresh
