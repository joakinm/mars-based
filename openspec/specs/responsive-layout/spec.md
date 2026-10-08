# Responsive Layout Specification

## Purpose
The Responsive Layout capability formalizes the viewport degradation strategy across MarsLogistics OS cockpit views, ensuring visual integrity, operational accessibility, and zero-loss workflows on compact and mobile viewports (<768px).

## Domain Invariants

- **INV-5 (Viewport Resilience Invariant)**: The operational cockpit layout MUST gracefully degrade on narrow viewports (<768px) via vertical flex wrapping and horizontal scroll containers without content clipping, overlapping text elements, or disruptive layout shifts.

## Requirements

### Requirement: Compact Viewport Navigation & Header Stacking
The system SHALL adapt navigation controls and identity headers across narrow screens without clipping badges, truncating action labels, or causing vertical layout collisions.

#### Scenario 1: Narrow Viewport Header Adaptation
- **GIVEN** a user accesses MarsLogistics OS on a viewport narrower than 768px
- **WHEN** the header and role selector render
- **THEN** the navigation controls stack or wrap cleanly without text clipping or overlapping badges

### Requirement: Table Horizontal Containment & Scroll Isolation
The system SHALL isolate multi-column tabular datasets within dedicated horizontal scroll containers to preserve data density and avoid uncontrolled page body overflow.

#### Scenario 2: Operational Table Horizontal Containment
- **GIVEN** an operator views the shipment table on a compact screen
- **WHEN** table columns exceed screen width
- **THEN** the table container isolates horizontal scrolling without causing global page body horizontal overflow.
