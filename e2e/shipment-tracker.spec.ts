// e2e/shipment-tracker.spec.ts
import { test, expect } from '@playwright/test';

test.describe('MarsLogistics OS - AI Tracking Engine E2E Suite', () => {
  let unhandledErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    unhandledErrors = [];

    // Automated listener to capture runtime and console errors
    page.on('pageerror', (exception) => {
      unhandledErrors.push(`[Unhandled Page Error]: ${exception.message}`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        unhandledErrors.push(`[Console Error]: ${msg.text()}`);
      }
    });

    await page.goto('/');
  });

  test.afterEach(async () => {
    expect(unhandledErrors, 'Expected zero console.error or unhandled exceptions').toEqual([]);
  });

  test.describe('Scenario 1: Role Switching & State Persistence', () => {
    test('defaults to OPERATIONS role with SHP-8921-EU selected, supports clean role switching and preserves active shipment state', async ({ page }) => {
      // 1. Initial load verification
      await expect(page.getByRole('heading', { name: /AI Exception Triage Summary/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Internal Operations/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Customer Portal/i })).toBeVisible();

      // Check default selected shipment SHP-8921-EU in table
      const initialRow = page.getByRole('row', { name: /SHP-8921-EU/i });
      await expect(initialRow).toBeVisible();
      await expect(initialRow.getByText('Alstom Transport SA')).toBeVisible();

      // 2. Switch to CUSTOMER role
      await page.getByRole('button', { name: /Customer Portal/i }).click();

      // Operations-only triage controls should be unmounted
      await expect(page.getByRole('heading', { name: /AI Exception Triage Summary/i })).not.toBeVisible();
      await expect(page.getByRole('button', { name: /High Risk/i })).not.toBeVisible();

      // Customer-specific elements should render cleanly
      await expect(page.getByRole('heading', { name: /Smart Multimodal Timeline/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Documentation/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Multimodal Shipment Tracking/i })).toBeVisible();

      // Active shipment reflects SHP-8921-EU details
      await expect(page.getByText('Alstom Transport SA', { exact: false })).toBeVisible();
      await expect(page.getByText('Rotterdam, Netherlands')).toBeVisible();

      // 3. Rapid toggle test: OPERATIONS -> CUSTOMER -> OPERATIONS
      await page.getByRole('button', { name: /Internal Operations/i }).click();
      await expect(page.getByRole('heading', { name: /AI Exception Triage Summary/i })).toBeVisible();

      await page.getByRole('button', { name: /Customer Portal/i }).click();
      await expect(page.getByRole('heading', { name: /Smart Multimodal Timeline/i })).toBeVisible();

      await page.getByRole('button', { name: /Internal Operations/i }).click();
      await expect(page.getByRole('heading', { name: /AI Exception Triage Summary/i })).toBeVisible();

      // Assert active shipment persisted without flickering or lifecycle crashes
      const persistedRow = page.getByRole('row', { name: /SHP-8921-EU/i });
      await expect(persistedRow).toBeVisible();
    });
  });

  test.describe('Scenario 2: Dynamic Search & Filtering Edge Cases', () => {
    test('filters accurately by risk level, supports substring search, displays accessible empty state, and restores complete portfolio', async ({ page }) => {
      // 1. Initial state: All 6 shipments displayed
      await expect(page.getByText('Showing 6 of 6 shipments')).toBeVisible();

      // 2. Risk Level Filter: Filter by CRITICAL
      await page.getByRole('button', { name: /Critical \(/i }).click();
      await expect(page.getByText('Showing 1 of 6 shipments')).toBeVisible();
      await expect(page.getByRole('row', { name: /SHP-8921-EU/i })).toBeVisible();
      await expect(page.getByRole('row', { name: /SHP-4019-ES/i })).not.toBeVisible();
      await expect(page.getByRole('row', { name: /SHP-6210-RD/i })).not.toBeVisible();

      // Reset to ALL filter
      await page.getByRole('button', { name: /All \(/i }).click();
      await expect(page.getByText('Showing 6 of 6 shipments')).toBeVisible();

      // 3. Substring Search: Search by partial client name ("Alstom")
      const searchInput = page.getByPlaceholder('Search by ID, client, country or AI diagnosis...');
      await searchInput.fill('Alstom');
      await expect(page.getByText('Showing 2 of 6 shipments')).toBeVisible();
      await expect(page.getByRole('row', { name: /SHP-8921-EU/i })).toBeVisible();
      await expect(page.getByRole('row', { name: /SHP-1088-OK/i })).toBeVisible();
      await expect(page.getByRole('row', { name: /SEAT Componentes/i })).not.toBeVisible();

      // Substring Search: Search by partial shipment ID ("6210")
      await searchInput.fill('6210');
      await expect(page.getByText('Showing 1 of 6 shipments')).toBeVisible();
      await expect(page.getByRole('row', { name: /SHP-6210-RD/i })).toBeVisible();
      await expect(page.getByRole('row', { name: /SHP-8921-EU/i })).not.toBeVisible();

      // 4. Empty State Edge Case: Search for non-existent query
      await searchInput.fill('NON_EXISTENT_QUERY_999');
      await expect(page.getByText('Showing 0 of 6 shipments')).toBeVisible();
      await expect(page.getByText('No shipments found')).toBeVisible();
      await expect(page.getByText('No matching shipments found for your search criteria.')).toBeVisible();

      // 5. Clear search input and verify portfolio restoration
      await searchInput.fill('');
      await expect(page.getByText('Showing 6 of 6 shipments')).toBeVisible();
      await expect(page.getByRole('row', { name: /SHP-8921-EU/i })).toBeVisible();
      await expect(page.getByRole('row', { name: /SHP-4019-ES/i })).toBeVisible();
    });
  });

  test.describe('Scenario 3: On-Time Shipments vs. Predictive Delay Banner', () => {
    test('renders on-schedule state without delay banners for on-time shipments, and displays proactive alert banner for delayed shipments', async ({ page }) => {
      // 1. Select on-time low-risk shipment SHP-4019-ES
      await page.getByRole('row', { name: /SHP-4019-ES/i }).click();

      // Switch to CUSTOMER view
      await page.getByRole('button', { name: /Customer Portal/i }).click();

      // Verify on-schedule state is displayed
      await expect(page.getByText('In Transit - On Schedule')).toBeVisible();
      await expect(page.getByText('Transit along A-2 highway without traffic or weather incidents.')).toBeVisible();

      // Proactive delay alert banner must strictly NOT be present
      await expect(page.getByText('Proactive Update Notice')).not.toBeVisible();
      await expect(page.getByText(/Adjusted ETA/i)).not.toBeVisible();

      // 2. Select delayed shipment SHP-8921-EU via customer portal selector buttons
      await page.getByRole('button', { name: /SHP-8921-EU/i }).click();

      // Assert proactive delay alert banner is visible with expected details
      await expect(page.getByText('Proactive Update Notice')).toBeVisible();
      await expect(page.getByText('+72h Adjusted ETA')).toBeVisible();
      await expect(page.getByText('CRITICAL').first()).toBeVisible();
      await expect(page.getByText('Cargo held at Maasvlakte Terminal due to commercial tariff invoice discrepancy.')).toBeVisible();
    });
  });

  test.describe('Scenario 4: Stale Data & Raw Telemetry Inspection', () => {
    test('identifies stale data exception with escalation action in operations, and exposes raw telemetry with last ping in customer timeline', async ({ page }) => {
      // 1. OPERATIONS view inspection for SHP-6210-RD
      const staleRow = page.getByRole('row', { name: /SHP-6210-RD/i });
      await expect(staleRow).toBeVisible();

      // Verify exception reason and proposed action
      await expect(staleRow.getByText('STALE_DATA')).toBeVisible();
      await expect(staleRow.getByText('ESCALATE_CARRIER')).toBeVisible();
      await expect(staleRow.getByRole('button', { name: /Escalate Incident to DB Schenker/i })).toBeVisible();

      // Select SHP-6210-RD
      await staleRow.click();

      // 2. Switch to CUSTOMER view
      await page.getByRole('button', { name: /Customer Portal/i }).click();

      // Verify customer timeline shows raw status descriptions
      await expect(page.getByText('TRUCK_DEPARTED_HUB_A1')).toBeVisible();
      await expect(page.getByText('TOLL_PASS_SENSOR_OK')).toBeVisible();
      await expect(page.getByText('NO_PING_RECORDED')).toBeVisible();

      // Verify last recorded telemetry ping is displayed
      await expect(page.getByText('Last Telemetry Ping:')).toBeVisible();
      await expect(page.getByText('2026-10-04T14:20:00Z')).toBeVisible();
    });
  });

  test.describe('Scenario 5: Modal Lifecycle & Exception Mitigation Flow', () => {
    test('enforces modal cancellation invariant, verifies domain payload prefill, and mitigates exception transitioning state to IN_TRANSIT', async ({ page }) => {
      // 1. Open AI Action Modal for SHP-8921-EU
      const targetRow = page.getByRole('row', { name: /SHP-8921-EU/i });
      await expect(targetRow).toBeVisible();

      const actionButton = targetRow.getByRole('button', { name: /Rectify Tariff Declaration/i });
      await actionButton.click();

      // Modal is visible
      await expect(page.getByRole('heading', { name: 'Rectify Tariff Declaration' })).toBeVisible();
      await expect(page.getByText('AI Next Action')).toBeVisible();

      // 2. Cancellation via Cancel button
      await page.getByRole('button', { name: 'Cancel' }).click();
      await expect(page.getByRole('heading', { name: 'Rectify Tariff Declaration' })).not.toBeVisible();

      // Verify invariant: remains HELD with CRITICAL risk
      await expect(targetRow.getByText('HELD', { exact: true })).toBeVisible();
      await expect(targetRow.getByText('CRITICAL', { exact: true })).toBeVisible();

      // 3. Test Escape key cancellation invariant
      await actionButton.click();
      await expect(page.getByRole('heading', { name: 'Rectify Tariff Declaration' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('heading', { name: 'Rectify Tariff Declaration' })).not.toBeVisible();

      // 4. Execution & Mitigation Flow
      await actionButton.click();
      await expect(page.getByRole('heading', { name: 'Rectify Tariff Declaration' })).toBeVisible();

      // Assert pre-filled assisted draft fields
      await expect(page.getByText('Urgent: Customs clearance SHP-8921-EU - Corrected documentation')).toBeVisible();
      await expect(page.getByText('Dear customs team, attached is the corrected commercial invoice to release container MRKU-9921.')).toBeVisible();
      await expect(page.getByText('Required Document: CUSTOMS_DECLARATION')).toBeVisible();

      // Click confirmation button to apply action
      const confirmButton = page.getByRole('button', { name: /Approve and Apply Action/i });
      await confirmButton.click();

      // Post-Mitigation Assertions:
      // a. Modal closes immediately
      await expect(page.getByRole('heading', { name: 'Rectify Tariff Declaration' })).not.toBeVisible();

      // b. Status badge updates to IN_TRANSIT
      await expect(targetRow.getByText('IN_TRANSIT', { exact: true })).toBeVisible();

      // c. Risk level transitions to LOW
      await expect(targetRow.getByText('LOW', { exact: true })).toBeVisible();

      // d. AI summary updates to indicate the exception was resolved
      await expect(targetRow.getByText('Exception resolved. Transit resumed according to standard itinerary.')).toBeVisible();

      // e. Switch to CUSTOMER view for this shipment and verify real-time status update
      await page.getByRole('button', { name: /Customer Portal/i }).click();

      await expect(page.getByText('In Transit - On Schedule')).toBeVisible();
      await expect(page.getByText('Exception resolved. Transit resumed according to standard itinerary.')).toBeVisible();
      await expect(page.getByText('Proactive Update Notice')).not.toBeVisible();
    });
  });
});
