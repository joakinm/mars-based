// src/data/mockShipments.ts
import type { Shipment } from '../types/shipment';

export const MOCK_SHIPMENTS: Shipment[] = [
    // 1. Critical Case: Customs Hold (International Multimodal)
    {
        id: 'SHP-8921-EU',
        orderReference: 'ORD-2026-4011',
        customerId: 'CUST-ALSTOM',
        customerName: 'Alstom Transport SA',
        originSite: 'Martorell Industrial Plant (ES)',
        destinationCity: 'Rotterdam',
        destinationCountry: 'Netherlands',
        mode: 'MULTIMODAL',
        currentStatus: 'HELD',
        primaryCarrier: 'Maersk Logistics',
        lastTelemetryPing: '2026-10-06T09:15:00Z',
        aiAssessment: {
            riskLevel: 'CRITICAL',
            confidenceScore: 0.94,
            isDelayed: true,
            predictedDelayHours: 72,
            confirmedEta: '2026-10-08T14:00:00Z',
            predictedEta: '2026-10-11T16:00:00Z',
            exceptionReason: 'CUSTOMS_HOLD',
            summaryText: 'Cargo held at Maasvlakte Terminal due to commercial tariff invoice discrepancy. Port penalty risk.',
            recommendedAction: {
                actionType: 'UPLOAD_DOCS',
                label: 'Rectify Tariff Declaration',
                description: 'Attach corrected commercial invoice (DUA) for immediate customs release.',
                prefilledPayload: {
                    requiredDocType: 'CUSTOMS_DECLARATION',
                    emailSubject: 'Urgent: Customs clearance SHP-8921-EU - Corrected documentation',
                    emailBody: 'Dear customs team, attached is the corrected commercial invoice to release container MRKU-9921.'
                }
            }
        },
        documents: [
            { id: 'DOC-1', title: 'Proforma Commercial Invoice', type: 'COMMERCIAL_INVOICE', status: 'VERIFIED', uploadedAt: '2026-10-01T10:00:00Z' },
            { id: 'DOC-2', title: 'Customs Declaration (DUA)', type: 'CUSTOMS_DECLARATION', status: 'PENDING_REVIEW' },
            { id: 'DOC-3', title: 'Bill of Lading MSK-0921', type: 'BILL_OF_LADING', status: 'VERIFIED', uploadedAt: '2026-10-02T16:30:00Z' }
        ],
        events: [
            {
                id: 'EV-101',
                category: 'ORIGIN_DISPATCH',
                name: 'Factory dispatch',
                location: 'Martorell, Spain',
                timestamp: '2026-10-01T08:30:00Z',
                status: 'COMPLETED',
                carrierName: 'Trans-Iberia Road',
                rawStatusDescription: 'GATE_OUT_FACTORY_OK'
            },
            {
                id: 'EV-102',
                category: 'PORT_GATE_IN',
                name: 'Port terminal gate-in',
                location: 'Port of Valencia, Spain',
                timestamp: '2026-10-02T14:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Noatum Container Terminal',
                rawStatusDescription: 'IN_GATE_CONTAINER_DROP'
            },
            {
                id: 'EV-103',
                category: 'VESSEL_TRANSIT',
                name: 'Sea transit aboard Maersk Mc-Kinney vessel',
                location: 'Bay of Biscay / English Channel',
                timestamp: '2026-10-04T18:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Maersk Line',
                rawStatusDescription: 'DEPARTED_TRANSIT_WAYPOINT_8'
            },
            {
                id: 'EV-104',
                category: 'CUSTOMS_CLEARANCE',
                name: 'Physical inspection and customs hold',
                location: 'Rotterdam Port Terminal, Netherlands',
                timestamp: '2026-10-06T07:45:00Z',
                status: 'FAILED',
                carrierName: 'Rotterdam Customs Authority',
                rawStatusDescription: 'HOLD_STATUS_DOC_MISMATCH_CODE_42'
            },
            {
                id: 'EV-105',
                category: 'LAST_MILE',
                name: 'Final delivery at customer facility',
                location: 'Rotterdam Distribution Park',
                timestamp: '2026-10-08T14:00:00Z',
                status: 'PENDING',
                carrierName: 'Vos Logistics NL',
                rawStatusDescription: 'DISPATCH_BLOCKED_WAITING_CLEARANCE'
            }
        ]
    },

    // 2. Silent Predictive Deviation (Maritime transit delayed due to congestion)
    {
        id: 'SHP-7734-OC',
        orderReference: 'ORD-2026-3980',
        customerId: 'CUST-SIEMENS',
        customerName: 'Siemens Energy AG',
        originSite: 'Antwerp Logistics Hub (BE)',
        destinationCity: 'Singapore',
        destinationCountry: 'Singapore',
        mode: 'SEA',
        currentStatus: 'IN_TRANSIT',
        primaryCarrier: 'CMA CGM',
        lastTelemetryPing: '2026-10-06T10:30:00Z',
        aiAssessment: {
            riskLevel: 'HIGH',
            confidenceScore: 0.88,
            isDelayed: true,
            predictedDelayHours: 48,
            confirmedEta: '2026-10-18T10:00:00Z',
            predictedEta: '2026-10-20T12:00:00Z',
            exceptionReason: 'PORT_CONGESTION',
            summaryText: 'Operator maintains original ETA in portal, but berth patterns at Port of Singapore predict 48h anchorage wait.',
            recommendedAction: {
                actionType: 'NOTIFY_CUSTOMER',
                label: 'Issue Proactive Customer Notice',
                description: 'Notify customer about predicted deviation before original committed date expires.',
                prefilledPayload: {
                    emailSubject: 'Update regarding your shipment SHP-7734-OC - ETA adjustment',
                    emailBody: 'Dear Siemens team, our systems estimate a 48-hour delay due to berth congestion in Singapore. New estimated date: October 20.'
                }
            }
        },
        documents: [
            { id: 'DOC-4', title: 'Sea Waybill CMA-7734', type: 'BILL_OF_LADING', status: 'VERIFIED', uploadedAt: '2026-09-28T11:00:00Z' },
            { id: 'DOC-5', title: 'Certificate of Origin EC', type: 'CUSTOMS_DECLARATION', status: 'VERIFIED', uploadedAt: '2026-09-28T11:30:00Z' }
        ],
        events: [
            {
                id: 'EV-201',
                category: 'PORT_GATE_IN',
                name: 'Container loading at Antwerp port',
                location: 'Antwerp, Belgium',
                timestamp: '2026-09-29T06:00:00Z',
                status: 'COMPLETED',
                carrierName: 'CMA CGM',
                rawStatusDescription: 'VESSEL_LOADED_ANTWERP'
            },
            {
                id: 'EV-202',
                category: 'VESSEL_TRANSIT',
                name: 'Maritime transit Red Sea / Indian Ocean',
                location: 'Gulf of Aden',
                timestamp: '2026-10-05T22:00:00Z',
                status: 'IN_PROGRESS',
                carrierName: 'CMA CGM Palais',
                rawStatusDescription: 'ON_ROUTE_CRUISING_SPEED_18KN'
            },
            {
                id: 'EV-203',
                category: 'PORT_GATE_OUT',
                name: 'Discharge and customs clearance',
                location: 'Pasir Panjang Terminal, Singapore',
                timestamp: '2026-10-18T10:00:00Z',
                status: 'PENDING',
                carrierName: 'PSA Singapore',
                rawStatusDescription: 'BERTH_RESERVATION_TENTATIVE'
            }
        ]
    },

    // 3. Frozen Telemetry / Signal Loss (Stale Data Alert)
    {
        id: 'SHP-6210-RD',
        orderReference: 'ORD-2026-5120',
        customerId: 'CUST-SCHNEIDER',
        customerName: 'Schneider Electric SAS',
        originSite: 'Lyon Distribution Center (FR)',
        destinationCity: 'Milan',
        destinationCountry: 'Italy',
        mode: 'ROAD',
        currentStatus: 'EXCEPTION',
        primaryCarrier: 'DB Schenker',
        lastTelemetryPing: '2026-10-04T14:20:00Z',
        aiAssessment: {
            riskLevel: 'HIGH',
            confidenceScore: 0.91,
            isDelayed: true,
            predictedDelayHours: 24,
            confirmedEta: '2026-10-05T17:00:00Z',
            predictedEta: '2026-10-07T12:00:00Z',
            exceptionReason: 'STALE_DATA',
            summaryText: 'No GPS position update or EDI telemetry for 44 hours after border crossing at Fréjus Tunnel.',
            recommendedAction: {
                actionType: 'ESCALATE_CARRIER',
                label: 'Escalate Incident to DB Schenker',
                description: 'Demand immediate position report and driver status from international traffic control.',
                prefilledPayload: {
                    emailSubject: 'URGENT: Missing telemetry / Overdue shipment SHP-6210-RD',
                    emailBody: 'We request urgent manual location and confirmation of truck status license plate FR-890-ZZ.'
                }
            }
        },
        documents: [
            { id: 'DOC-6', title: 'International Consignment Note CMR', type: 'BILL_OF_LADING', status: 'VERIFIED', uploadedAt: '2026-10-04T08:00:00Z' }
        ],
        events: [
            {
                id: 'EV-301',
                category: 'ORIGIN_DISPATCH',
                name: 'Loading completed in Lyon',
                location: 'Lyon, France',
                timestamp: '2026-10-04T09:00:00Z',
                status: 'COMPLETED',
                carrierName: 'DB Schenker France',
                rawStatusDescription: 'TRUCK_DEPARTED_HUB_A1'
            },
            {
                id: 'EV-302',
                category: 'ROAD_TRANSFER',
                name: 'Cross-border alpine transit',
                location: 'Fréjus Tunnel (FR-IT)',
                timestamp: '2026-10-04T14:20:00Z',
                status: 'IN_PROGRESS',
                carrierName: 'DB Schenker Italy',
                rawStatusDescription: 'TOLL_PASS_SENSOR_OK'
            },
            {
                id: 'EV-303',
                category: 'DELIVERY',
                name: 'Delivery at Milan Central Warehouse',
                location: 'Milan, Italy',
                timestamp: '2026-10-05T17:00:00Z',
                status: 'PENDING',
                carrierName: 'DB Schenker Italy',
                rawStatusDescription: 'NO_PING_RECORDED'
            }
        ]
    },

    // 4. Domestic Road Transit Operating Normally (Low Risk)
    {
        id: 'SHP-4019-ES',
        orderReference: 'ORD-2026-6102',
        customerId: 'CUST-SEAT',
        customerName: 'SEAT Componentes SA',
        originSite: 'Martorell Industrial Plant (ES)',
        destinationCity: 'Zaragoza',
        destinationCountry: 'Spain',
        mode: 'ROAD',
        currentStatus: 'IN_TRANSIT',
        primaryCarrier: 'DHL Freight',
        lastTelemetryPing: '2026-10-06T10:45:00Z',
        aiAssessment: {
            riskLevel: 'LOW',
            confidenceScore: 0.99,
            isDelayed: false,
            predictedDelayHours: 0,
            confirmedEta: '2026-10-06T16:30:00Z',
            predictedEta: '2026-10-06T16:15:00Z',
            summaryText: 'Transit along A-2 highway without traffic or weather incidents. On-time arrival projection.',
            recommendedAction: {
                actionType: 'MONITOR',
                label: 'Active Automatic Monitoring',
                description: 'No manual operations intervention required.'
            }
        },
        documents: [
            { id: 'DOC-7', title: 'Digital Dispatch Note', type: 'PACKING_LIST', status: 'VERIFIED', uploadedAt: '2026-10-06T06:00:00Z' }
        ],
        events: [
            {
                id: 'EV-401',
                category: 'ORIGIN_DISPATCH',
                name: 'Dispatch from Martorell',
                location: 'Martorell, Spain',
                timestamp: '2026-10-06T07:00:00Z',
                status: 'COMPLETED',
                carrierName: 'DHL Freight ES',
                rawStatusDescription: 'DEP_HUB_08'
            },
            {
                id: 'EV-402',
                category: 'ROAD_TRANSFER',
                name: 'En route via A-2 Km 210',
                location: 'Calatayud, Spain',
                timestamp: '2026-10-06T10:30:00Z',
                status: 'IN_PROGRESS',
                carrierName: 'DHL Freight ES',
                rawStatusDescription: 'GPS_TELEMETRY_TRACK_OK'
            },
            {
                id: 'EV-403',
                category: 'DELIVERY',
                name: 'Reception at Figueruelas plant',
                location: 'Zaragoza, Spain',
                timestamp: '2026-10-06T16:30:00Z',
                status: 'PENDING',
                carrierName: 'DHL Freight ES',
                rawStatusDescription: 'SCHEDULED_DELIVERY'
            }
        ]
    },

    // 5. Moderate Risk Due to Port Weather Alert
    {
        id: 'SHP-5591-MM',
        orderReference: 'ORD-2026-4419',
        customerId: 'CUST-BASF',
        customerName: 'BASF Coatings GmbH',
        originSite: 'Tarragona Chemical Plant (ES)',
        destinationCity: 'Hamburg',
        destinationCountry: 'Germany',
        mode: 'MULTIMODAL',
        currentStatus: 'IN_TRANSIT',
        primaryCarrier: 'Kuehne+Nagel',
        lastTelemetryPing: '2026-10-06T09:00:00Z',
        aiAssessment: {
            riskLevel: 'MEDIUM',
            confidenceScore: 0.76,
            isDelayed: true,
            predictedDelayHours: 12,
            confirmedEta: '2026-10-09T08:00:00Z',
            predictedEta: '2026-10-09T20:00:00Z',
            exceptionReason: 'WEATHER',
            summaryText: 'Gale warning in North Sea may delay pilotage maneuvers by 12h at Port of Hamburg.',
            recommendedAction: {
                actionType: 'MONITOR',
                label: 'Climatological Tracking',
                description: 'Monitor weather forecasts from the Elbe harbor master.'
            }
        },
        documents: [
            { id: 'DOC-8', title: 'Chemical Safety Data Sheet', type: 'PACKING_LIST', status: 'VERIFIED', uploadedAt: '2026-10-03T09:00:00Z' },
            { id: 'DOC-9', title: 'Multimodal Bill of Lading', type: 'BILL_OF_LADING', status: 'VERIFIED', uploadedAt: '2026-10-03T11:00:00Z' }
        ],
        events: [
            {
                id: 'EV-501',
                category: 'ORIGIN_DISPATCH',
                name: 'Chemical plant dispatch',
                location: 'Tarragona, Spain',
                timestamp: '2026-10-03T10:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Kuehne+Nagel Road',
                rawStatusDescription: 'ORIGIN_DEPARTURE'
            },
            {
                id: 'EV-502',
                category: 'PORT_GATE_IN',
                name: 'Feeder vessel boarding',
                location: 'Port of Bilbao, Spain',
                timestamp: '2026-10-04T16:00:00Z',
                status: 'COMPLETED',
                carrierName: 'KN Maritime',
                rawStatusDescription: 'LOADED_ON_FEEDER'
            },
            {
                id: 'EV-503',
                category: 'VESSEL_TRANSIT',
                name: 'Maritime transit English Channel',
                location: 'French Coast',
                timestamp: '2026-10-06T08:30:00Z',
                status: 'IN_PROGRESS',
                carrierName: 'KN Maritime',
                rawStatusDescription: 'VESSEL_SPEED_REDUCED_BAD_WEATHER'
            },
            {
                id: 'EV-504',
                category: 'DELIVERY',
                name: 'Final delivery Hamburg terminal',
                location: 'Hamburg, Germany',
                timestamp: '2026-10-09T08:00:00Z',
                status: 'PENDING',
                carrierName: 'Kuehne+Nagel DE',
                rawStatusDescription: 'ETA_UPDATED'
            }
        ]
    },

    // 6. Successfully Delivered Shipment (History / Baseline)
    {
        id: 'SHP-1088-OK',
        orderReference: 'ORD-2026-1100',
        customerId: 'CUST-ALSTOM',
        customerName: 'Alstom Transport SA',
        originSite: 'Martorell Industrial Plant (ES)',
        destinationCity: 'Bordeaux',
        destinationCountry: 'France',
        mode: 'ROAD',
        currentStatus: 'DELIVERED',
        primaryCarrier: 'Geodis',
        lastTelemetryPing: '2026-10-05T15:30:00Z',
        aiAssessment: {
            riskLevel: 'LOW',
            confidenceScore: 1.0,
            isDelayed: false,
            predictedDelayHours: 0,
            confirmedEta: '2026-10-05T15:00:00Z',
            predictedEta: '2026-10-05T15:00:00Z',
            summaryText: 'Delivery completed with digital signature on delivery note with no incidents reported.',
            recommendedAction: {
                actionType: 'MONITOR',
                label: 'Closed',
                description: 'Shipment successfully completed.'
            }
        },
        documents: [
            { id: 'DOC-10', title: 'Signed Delivery Note (POD)', type: 'PACKING_LIST', status: 'VERIFIED', uploadedAt: '2026-10-05T15:35:00Z' }
        ],
        events: [
            {
                id: 'EV-601',
                category: 'ORIGIN_DISPATCH',
                name: 'Departure from Martorell',
                location: 'Martorell, Spain',
                timestamp: '2026-10-04T08:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Geodis Road',
                rawStatusDescription: 'PICKUP_COMPLETED'
            },
            {
                id: 'EV-602',
                category: 'ROAD_TRANSFER',
                name: 'La Jonquera border transit',
                location: 'ES-FR Border',
                timestamp: '2026-10-04T12:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Geodis France',
                rawStatusDescription: 'CROSS_BORDER_SCAN'
            },
            {
                id: 'EV-603',
                category: 'DELIVERY',
                name: 'Delivered at Bordeaux plant',
                location: 'Bordeaux, France',
                timestamp: '2026-10-05T15:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Geodis France',
                rawStatusDescription: 'PROOF_OF_DELIVERY_SIGNED'
            }
        ]
    }
];