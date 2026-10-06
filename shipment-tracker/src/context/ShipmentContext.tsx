import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Shipment, UserRole } from '../types/shipment';
import { MOCK_SHIPMENTS } from '../data/mockShipments';

interface ShipmentContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    shipments: Shipment[];
    selectedShipment: Shipment | null;
    selectedShipmentId: string | null;
    setSelectedShipmentId: (id: string | null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    resolveException: (shipmentId: string) => void;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const ShipmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<UserRole>('OPERATIONS');
    const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
    const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>('SHP-8921-EU'); // Seleccionado por defecto el caso de aduanas
    const [searchQuery, setSearchQuery] = useState<string>('');

    const selectedShipment = shipments.find((s) => s.id === selectedShipmentId) || null;

    const resolveException = (shipmentId: string) => {
        setShipments((prev) =>
            prev.map((s) => {
                if (s.id !== shipmentId) return s;
                return {
                    ...s,
                    currentStatus: 'IN_TRANSIT',
                    aiAssessment: {
                        ...s.aiAssessment,
                        riskLevel: 'LOW',
                        isDelayed: false,
                        predictedDelayHours: 0,
                        predictedEta: s.aiAssessment.confirmedEta,
                        summaryText: 'Incidencia resuelta. Tránsito reanudado conforme al itinerario estándar.',
                        recommendedAction: undefined,
                    },
                };
            })
        );
    };

    return (
        <ShipmentContext.Provider
            value={{
                role,
                setRole,
                shipments,
                selectedShipment,
                selectedShipmentId,
                setSelectedShipmentId,
                searchQuery,
                setSearchQuery,
                resolveException,
            }}
        >
            {children}
        </ShipmentContext.Provider>
    );
};

export const useShipments = () => {
    const context = useContext(ShipmentContext);
    if (!context) {
        throw new Error('useShipments debe usarse dentro de un ShipmentProvider');
    }
    return context;
};