// src/types/shipment.ts

export type UserRole = 'CUSTOMER' | 'OPERATIONS';

export type TransportMode = 'ROAD' | 'SEA' | 'MULTIMODAL';

export type ShipmentStatus =
    | 'DRAFT'
    | 'IN_TRANSIT'
    | 'HELD'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'EXCEPTION';

export type MilestoneCategory =
    | 'ORIGIN_DISPATCH'
    | 'ROAD_TRANSFER'
    | 'PORT_GATE_IN'
    | 'CUSTOMS_CLEARANCE'
    | 'VESSEL_TRANSIT'
    | 'PORT_GATE_OUT'
    | 'LAST_MILE'
    | 'DELIVERY';

export interface MilestoneEvent {
    id: string;
    category: MilestoneCategory;
    name: string;
    location: string;
    timestamp: string; // ISO 8601
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FAILED';
    carrierName: string;
    rawStatusDescription: string; // Telemetría original del transportista sin normalizar
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AiAssessment {
    riskLevel: RiskLevel;
    confidenceScore: number; // 0.00 a 1.00
    isDelayed: boolean;
    predictedDelayHours: number;
    confirmedEta: string; // ISO 8601 (del transportista)
    predictedEta: string; // ISO 8601 (calculado por IA)
    summaryText: string; // Explicación en lenguaje natural (apto para cliente o soporte)
    exceptionReason?: 'CUSTOMS_HOLD' | 'PORT_CONGESTION' | 'STALE_DATA' | 'WEATHER' | 'DOCUMENTATION_MISSING';
    recommendedAction?: {
        actionType: 'NOTIFY_CUSTOMER' | 'ESCALATE_CARRIER' | 'UPLOAD_DOCS' | 'MONITOR';
        label: string;
        description: string;
        prefilledPayload?: {
            emailSubject?: string;
            emailBody?: string;
            requiredDocType?: string;
        };
    };
}

export interface DocumentItem {
    id: string;
    title: string;
    type: 'COMMERCIAL_INVOICE' | 'BILL_OF_LADING' | 'CUSTOMS_DECLARATION' | 'PACKING_LIST';
    status: 'VERIFIED' | 'MISSING' | 'PENDING_REVIEW';
    uploadedAt?: string;
}

export interface Shipment {
    id: string; // ej: "SHP-2026-001"
    orderReference: string; // ej: "ORD-89412"
    customerId: string;
    customerName: string;
    originSite: string; // Fábrica/almacén de origen (ej: "Planta Martorell - BCN")
    destinationCity: string;
    destinationCountry: string;
    mode: TransportMode;
    currentStatus: ShipmentStatus;
    primaryCarrier: string;
    events: MilestoneEvent[];
    aiAssessment: AiAssessment;
    documents: DocumentItem[];
    lastTelemetryPing: string; // ISO 8601 para detectar stale data
}