import { Shipment } from '../types/shipment';

export const MOCK_SHIPMENTS: Shipment[] = [
    // 1. Caso Crítico: Retención en Aduanas (Multimodal Internacional)
    {
        id: 'SHP-8921-EU',
        orderReference: 'ORD-2026-4011',
        customerId: 'CUST-ALSTOM',
        customerName: 'Alstom Transport SA',
        originSite: 'Planta Industrial Martorell (ES)',
        destinationCity: 'Rotterdam',
        destinationCountry: 'Países Bajos',
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
            summaryText: 'Carga retenida en Terminal Maasvlakte por discrepancia en factura arancelaria comercial. Riesgo de penalización portuaria.',
            recommendedAction: {
                actionType: 'UPLOAD_DOCS',
                label: 'Subsanar Declaración Arancelaria',
                description: 'Adjuntar versión corregida de la factura comercial (DUA) para desbloqueo aduanero inmediato.',
                prefilledPayload: {
                    requiredDocType: 'CUSTOMS_DECLARATION',
                    emailSubject: 'Urgente: Desbloqueo aduanero SHP-8921-EU - Documentación subsanada',
                    emailBody: 'Estimado equipo de aduanas, adjuntamos la factura comercial corregida para liberar el contenedor MRKU-9921.'
                }
            }
        },
        documents: [
            { id: 'DOC-1', title: 'Factura Comercial Proforma', type: 'COMMERCIAL_INVOICE', status: 'VERIFIED', uploadedAt: '2026-10-01T10:00:00Z' },
            { id: 'DOC-2', title: 'Declaración Aduanera DUA', type: 'CUSTOMS_DECLARATION', status: 'PENDING_REVIEW' },
            { id: 'DOC-3', title: 'Bill of Lading MSK-0921', type: 'BILL_OF_LADING', status: 'VERIFIED', uploadedAt: '2026-10-02T16:30:00Z' }
        ],
        events: [
            {
                id: 'EV-101',
                category: 'ORIGIN_DISPATCH',
                name: 'Salida de fábrica',
                location: 'Martorell, España',
                timestamp: '2026-10-01T08:30:00Z',
                status: 'COMPLETED',
                carrierName: 'Trans-Iberia Road',
                rawStatusDescription: 'GATE_OUT_FACTORY_OK'
            },
            {
                id: 'EV-102',
                category: 'PORT_GATE_IN',
                name: 'Ingreso a terminal portuaria',
                location: 'Puerto de Valencia, España',
                timestamp: '2026-10-02T14:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Noatum Container Terminal',
                rawStatusDescription: 'IN_GATE_CONTAINER_DROP'
            },
            {
                id: 'EV-103',
                category: 'VESSEL_TRANSIT',
                name: 'Travesía marítima en buque Maersk Mc-Kinney',
                location: 'Mar Cantábrico / Canal de la Mancha',
                timestamp: '2026-10-04T18:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Maersk Line',
                rawStatusDescription: 'DEPARTED_TRANSIT_WAYPOINT_8'
            },
            {
                id: 'EV-104',
                category: 'CUSTOMS_CLEARANCE',
                name: 'Inspección física y retención aduanera',
                location: 'Rotterdam Port Terminal, Países Bajos',
                timestamp: '2026-10-06T07:45:00Z',
                status: 'FAILED',
                carrierName: 'Rotterdam Customs Authority',
                rawStatusDescription: 'HOLD_STATUS_DOC_MISMATCH_CODE_42'
            },
            {
                id: 'EV-105',
                category: 'LAST_MILE',
                name: 'Entrega final en nave de cliente',
                location: 'Rotterdam Distribution Park',
                timestamp: '2026-10-08T14:00:00Z',
                status: 'PENDING',
                carrierName: 'Vos Logistics NL',
                rawStatusDescription: 'DISPATCH_BLOCKED_WAITING_CLEARANCE'
            }
        ]
    },

    // 2. Desviación Predictiva Silenciosa (Marítimo en Tránsito con retraso por congestión)
    {
        id: 'SHP-7734-OC',
        orderReference: 'ORD-2026-3980',
        customerId: 'CUST-SIEMENS',
        customerName: 'Siemens Energy AG',
        originSite: 'Hub Logístico Amberes (BE)',
        destinationCity: 'Singapur',
        destinationCountry: 'Singapur',
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
            summaryText: 'El operador mantiene el ETA original en su portal, pero los patrones de atraque en Port of Singapore predicen 48h de espera en fondeadero.',
            recommendedAction: {
                actionType: 'NOTIFY_CUSTOMER',
                label: 'Emitir Aviso Proactivo al Cliente',
                description: 'Informar al cliente sobre la desviación prevista antes de que venza la fecha comprometida original.',
                prefilledPayload: {
                    emailSubject: 'Actualización sobre su envío SHP-7734-OC - Ajuste de fecha de llegada',
                    emailBody: 'Estimado equipo de Siemens, nuestros sistemas estiman un retraso de 48 horas debido a congestión de atraque en Singapur. Nueva fecha estimada: 20 de Octubre.'
                }
            }
        },
        documents: [
            { id: 'DOC-4', title: 'Sea Waybill CMA-7734', type: 'BILL_OF_LADING', status: 'VERIFIED', uploadedAt: '2026-09-28T11:00:00Z' },
            { id: 'DOC-5', title: 'Certificado de Origen CE', type: 'CUSTOMS_DECLARATION', status: 'VERIFIED', uploadedAt: '2026-09-28T11:30:00Z' }
        ],
        events: [
            {
                id: 'EV-201',
                category: 'PORT_GATE_IN',
                name: 'Carga de contenedor en puerto Amberes',
                location: 'Amberes, Bélgica',
                timestamp: '2026-09-29T06:00:00Z',
                status: 'COMPLETED',
                carrierName: 'CMA CGM',
                rawStatusDescription: 'VESSEL_LOADED_ANTWERP'
            },
            {
                id: 'EV-202',
                category: 'VESSEL_TRANSIT',
                name: 'Tránsito marítimo Mar Rojo / Océano Índico',
                location: 'Golfo de Adén',
                timestamp: '2026-10-05T22:00:00Z',
                status: 'IN_PROGRESS',
                carrierName: 'CMA CGM Palais',
                rawStatusDescription: 'ON_ROUTE_CRUISING_SPEED_18KN'
            },
            {
                id: 'EV-203',
                category: 'PORT_GATE_OUT',
                name: 'Descarga y desaduanamiento',
                location: 'Pasir Panjang Terminal, Singapur',
                timestamp: '2026-10-18T10:00:00Z',
                status: 'PENDING',
                carrierName: 'PSA Singapore',
                rawStatusDescription: 'BERTH_RESERVATION_TENTATIVE'
            }
        ]
    },

    // 3. Telemetría Congelada / Pérdida de Señal (Stale Data Alert)
    {
        id: 'SHP-6210-RD',
        orderReference: 'ORD-2026-5120',
        customerId: 'CUST-SCHNEIDER',
        customerName: 'Schneider Electric SAS',
        originSite: 'Centro de Distribución Lyon (FR)',
        destinationCity: 'Milán',
        destinationCountry: 'Italia',
        mode: 'ROAD',
        currentStatus: 'EXCEPTION',
        primaryCarrier: 'DB Schenker',
        lastTelemetryPing: '2026-10-04T14:20:00Z', // 45+ horas sin telemetría
        aiAssessment: {
            riskLevel: 'HIGH',
            confidenceScore: 0.91,
            isDelayed: true,
            predictedDelayHours: 24,
            confirmedEta: '2026-10-05T17:00:00Z',
            predictedEta: '2026-10-07T12:00:00Z',
            exceptionReason: 'STALE_DATA',
            summaryText: 'Sin actualización de posición GPS ni telemetría EDI desde hace 44 horas tras cruce de frontera en Túnel de Fréjus.',
            recommendedAction: {
                actionType: 'ESCALATE_CARRIER',
                label: 'Escalar Incidencia a DB Schenker',
                description: 'Exigir reporte de posición inmediato y estado del conductor a la central de tráfico internacional.',
                prefilledPayload: {
                    emailSubject: 'URGENTE: Falta de telemetría / Envío vencido SHP-6210-RD',
                    emailBody: 'Solicitamos localización manual urgente y confirmación del estado del camión matrícula FR-890-ZZ.'
                }
            }
        },
        documents: [
            { id: 'DOC-6', title: 'Carta de Porte Internacional CMR', type: 'BILL_OF_LADING', status: 'VERIFIED', uploadedAt: '2026-10-04T08:00:00Z' }
        ],
        events: [
            {
                id: 'EV-301',
                category: 'ORIGIN_DISPATCH',
                name: 'Carga completada en Lyon',
                location: 'Lyon, Francia',
                timestamp: '2026-10-04T09:00:00Z',
                status: 'COMPLETED',
                carrierName: 'DB Schenker France',
                rawStatusDescription: 'TRUCK_DEPARTED_HUB_A1'
            },
            {
                id: 'EV-302',
                category: 'ROAD_TRANSFER',
                name: 'Tránsito alpino transfronterizo',
                location: 'Túnel de Fréjus (FR-IT)',
                timestamp: '2026-10-04T14:20:00Z',
                status: 'IN_PROGRESS',
                carrierName: 'DB Schenker Italy',
                rawStatusDescription: 'TOLL_PASS_SENSOR_OK'
            },
            {
                id: 'EV-303',
                category: 'DELIVERY',
                name: 'Entrega en Almacén Central Milán',
                location: 'Milán, Italia',
                timestamp: '2026-10-05T17:00:00Z',
                status: 'PENDING',
                carrierName: 'DB Schenker Italy',
                rawStatusDescription: 'NO_PING_RECORDED'
            }
        ]
    },

    // 4. Tránsito Terrestre Doméstico Operando en Tiempo Normal (Bajo Riesgo)
    {
        id: 'SHP-4019-ES',
        orderReference: 'ORD-2026-6102',
        customerId: 'CUST-SEAT',
        customerName: 'SEAT Componentes SA',
        originSite: 'Planta Industrial Martorell (ES)',
        destinationCity: 'Zaragoza',
        destinationCountry: 'España',
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
            summaryText: 'Tránsito por autovía A-2 sin incidencias de tráfico ni meteorología. Proyección de llegada en hora.',
            recommendedAction: {
                actionType: 'MONITOR',
                label: 'Monitoreo Automático Activo',
                description: 'No se requiere intervención manual de operaciones.'
            }
        },
        documents: [
            { id: 'DOC-7', title: 'Albarán de Salida Digital', type: 'PACKING_LIST', status: 'VERIFIED', uploadedAt: '2026-10-06T06:00:00Z' }
        ],
        events: [
            {
                id: 'EV-401',
                category: 'ORIGIN_DISPATCH',
                name: 'Expedición desde Martorell',
                location: 'Martorell, España',
                timestamp: '2026-10-06T07:00:00Z',
                status: 'COMPLETED',
                carrierName: 'DHL Freight ES',
                rawStatusDescription: 'DEP_HUB_08'
            },
            {
                id: 'EV-402',
                category: 'ROAD_TRANSFER',
                name: 'En ruta por A-2 Km 210',
                location: 'Calatayud, España',
                timestamp: '2026-10-06T10:30:00Z',
                status: 'IN_PROGRESS',
                carrierName: 'DHL Freight ES',
                rawStatusDescription: 'GPS_TELEMETRY_TRACK_OK'
            },
            {
                id: 'EV-403',
                category: 'DELIVERY',
                name: 'Recepción en planta Figueruelas',
                location: 'Zaragoza, España',
                timestamp: '2026-10-06T16:30:00Z',
                status: 'PENDING',
                carrierName: 'DHL Freight ES',
                rawStatusDescription: 'SCHEDULED_DELIVERY'
            }
        ]
    },

    // 5. Riesgo Moderado por Alerta Climatológica en Puerto
    {
        id: 'SHP-5591-MM',
        orderReference: 'ORD-2026-4419',
        customerId: 'CUST-BASF',
        customerName: 'BASF Coatings GmbH',
        originSite: 'Planta Química Tarragona (ES)',
        destinationCity: 'Hamburgo',
        destinationCountry: 'Alemania',
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
            summaryText: 'Aviso de temporal de viento en Mar del Norte puede demorar 12h la maniobra de prácticos en Puerto de Hamburgo.',
            recommendedAction: {
                actionType: 'MONITOR',
                label: 'Seguimiento Climatológico',
                description: 'Monitorear partes meteorológicos de la capitanía marítima del Elba.'
            }
        },
        documents: [
            { id: 'DOC-8', title: 'Ficha de Seguridad Químicos', type: 'PACKING_LIST', status: 'VERIFIED', uploadedAt: '2026-10-03T09:00:00Z' },
            { id: 'DOC-9', title: 'Multimodal Bill of Lading', type: 'BILL_OF_LADING', status: 'VERIFIED', uploadedAt: '2026-10-03T11:00:00Z' }
        ],
        events: [
            {
                id: 'EV-501',
                category: 'ORIGIN_DISPATCH',
                name: 'Salida de planta química',
                location: 'Tarragona, España',
                timestamp: '2026-10-03T10:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Kuehne+Nagel Road',
                rawStatusDescription: 'ORIGIN_DEPARTURE'
            },
            {
                id: 'EV-502',
                category: 'PORT_GATE_IN',
                name: 'Embarque en buque feeder',
                location: 'Puerto de Bilbao, España',
                timestamp: '2026-10-04T16:00:00Z',
                status: 'COMPLETED',
                carrierName: 'KN Maritime',
                rawStatusDescription: 'LOADED_ON_FEEDER'
            },
            {
                id: 'EV-503',
                category: 'VESSEL_TRANSIT',
                name: 'Tránsito marítimo canal inglés',
                location: 'Costa francesa',
                timestamp: '2026-10-06T08:30:00Z',
                status: 'IN_PROGRESS',
                carrierName: 'KN Maritime',
                rawStatusDescription: 'VESSEL_SPEED_REDUCED_BAD_WEATHER'
            },
            {
                id: 'EV-504',
                category: 'DELIVERY',
                name: 'Entrega final terminal Hamburgo',
                location: 'Hamburgo, Alemania',
                timestamp: '2026-10-09T08:00:00Z',
                status: 'PENDING',
                carrierName: 'Kuehne+Nagel DE',
                rawStatusDescription: 'ETA_UPDATED'
            }
        ]
    },

    // 6. Envío Entregado Satisfactoriamente (Historial / Línea Base)
    {
        id: 'SHP-1088-OK',
        orderReference: 'ORD-2026-1100',
        customerId: 'CUST-ALSTOM',
        customerName: 'Alstom Transport SA',
        originSite: 'Planta Industrial Martorell (ES)',
        destinationCity: 'Burdeos',
        destinationCountry: 'Francia',
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
            summaryText: 'Entrega realizada con firma digital en albarán sin incidencias notificadas.',
            recommendedAction: {
                actionType: 'MONITOR',
                label: 'Cerrado',
                description: 'Envío completado exitosamente.'
            }
        },
        documents: [
            { id: 'DOC-10', title: 'Albarán Firmado (POD)', type: 'PACKING_LIST', status: 'VERIFIED', uploadedAt: '2026-10-05T15:35:00Z' }
        ],
        events: [
            {
                id: 'EV-601',
                category: 'ORIGIN_DISPATCH',
                name: 'Salida de Martorell',
                location: 'Martorell, España',
                timestamp: '2026-10-04T08:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Geodis Road',
                rawStatusDescription: 'PICKUP_COMPLETED'
            },
            {
                id: 'EV-602',
                category: 'ROAD_TRANSFER',
                name: 'Tránsito fronterizo La Jonquera',
                location: 'Frontera ES-FR',
                timestamp: '2026-10-04T12:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Geodis France',
                rawStatusDescription: 'CROSS_BORDER_SCAN'
            },
            {
                id: 'EV-603',
                category: 'DELIVERY',
                name: 'Entregado en planta Burdeos',
                location: 'Burdeos, Francia',
                timestamp: '2026-10-05T15:00:00Z',
                status: 'COMPLETED',
                carrierName: 'Geodis France',
                rawStatusDescription: 'PROOF_OF_DELIVERY_SIGNED'
            }
        ]
    }
];