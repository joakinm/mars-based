import React, { useState, useMemo } from 'react';
import { useShipments } from '../context/ShipmentContext';
import type { Shipment, RiskLevel } from '../types/shipment';
import { ActionModal } from './ActionModal';
import {
    AlertOctagon,
    AlertTriangle,
    CheckCircle,
    Clock,
    Search,
    Truck,
    Ship,
    ArrowRight,
    Sparkles
} from 'lucide-react';

export const OperationsView: React.FC = () => {
    const { shipments, selectedShipmentId, setSelectedShipmentId, searchQuery, setSearchQuery } = useShipments();
    const [filterRisk, setFilterRisk] = useState<RiskLevel | 'ALL'>('ALL');
    const [activeModalShipment, setActiveModalShipment] = useState<Shipment | null>(null);

    // IA Triage Metrics
    const stats = useMemo(() => {
        return {
            total: shipments.length,
            critical: shipments.filter((s) => s.aiAssessment.riskLevel === 'CRITICAL' || s.currentStatus === 'HELD').length,
            delayed: shipments.filter((s) => s.aiAssessment.isDelayed).length,
            onTrack: shipments.filter((s) => !s.aiAssessment.isDelayed && s.currentStatus !== 'HELD').length,
        };
    }, [shipments]);

    // Basic Natural Language Search & Filter
    const filteredShipments = useMemo(() => {
        return shipments.filter((s) => {
            // Risk level filter
            if (filterRisk !== 'ALL' && s.aiAssessment.riskLevel !== filterRisk) return false;

            // Search filter
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                s.id.toLowerCase().includes(q) ||
                s.customerName.toLowerCase().includes(q) ||
                s.destinationCountry.toLowerCase().includes(q) ||
                s.destinationCity.toLowerCase().includes(q) ||
                s.primaryCarrier.toLowerCase().includes(q) ||
                s.originSite.toLowerCase().includes(q) ||
                s.aiAssessment.summaryText.toLowerCase().includes(q)
            );
        });
    }, [shipments, filterRisk, searchQuery]);

    return (
        <div className="space-y-6">
            {/* 1. AI Exception Triage Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-sm font-bold tracking-tight text-white">IA Exception Triage Summary</h2>
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono px-1.5 py-0.5 rounded">
                                    Live Engine
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Estado del portafolio: <strong className="text-white">{stats.critical} críticos</strong>,{' '}
                                <strong className="text-white">{stats.delayed} con retraso previsto</strong>,{' '}
                                <strong className="text-white">{stats.onTrack} bajo control</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            onClick={() => setFilterRisk('ALL')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterRisk === 'ALL'
                                ? 'bg-slate-800 text-white border border-slate-700'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                }`}
                        >
                            Todos ({stats.total})
                        </button>
                        <button
                            onClick={() => setFilterRisk('CRITICAL')}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterRisk === 'CRITICAL'
                                ? 'bg-red-950 text-red-200 border border-red-800'
                                : 'text-red-400 hover:bg-red-950/40'
                                }`}
                        >
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>Críticos ({stats.critical})</span>
                        </button>
                        <button
                            onClick={() => setFilterRisk('HIGH')}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterRisk === 'HIGH'
                                ? 'bg-amber-950 text-amber-200 border border-amber-800'
                                : 'text-amber-400 hover:bg-amber-950/40'
                                }`}
                        >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Alto Riesgo ({shipments.filter((s) => s.aiAssessment.riskLevel === 'HIGH').length})</span>
                        </button>
                        <button
                            onClick={() => setFilterRisk('LOW')}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterRisk === 'LOW'
                                ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
                                : 'text-emerald-400 hover:bg-emerald-950/40'
                                }`}
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>En Hora ({shipments.filter((s) => s.aiAssessment.riskLevel === 'LOW').length})</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Search & Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="relative w-full sm:w-96">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por ID, cliente, país o diagnóstico IA..."
                        className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                    />
                </div>
                <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
                    Mostrando {filteredShipments.length} de {shipments.length} envíos
                </div>
            </div>

            {/* 3. Shipment Portfolio Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
                                <th className="py-3 px-4">Envío / Referencia</th>
                                <th className="py-3 px-4">Cliente & Origen</th>
                                <th className="py-3 px-4">Ruta / Modo</th>
                                <th className="py-3 px-4">Diagnóstico IA & Desviación</th>
                                <th className="py-3 px-4">ETA (Conf. vs IA)</th>
                                <th className="py-3 px-4 text-right">Acción Propuesta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredShipments.map((s) => {
                                const isSelected = selectedShipmentId === s.id;
                                const risk = s.aiAssessment.riskLevel;

                                return (
                                    <tr
                                        key={s.id}
                                        onClick={() => setSelectedShipmentId(s.id)}
                                        className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${isSelected ? 'bg-blue-50/50 font-medium' : ''
                                            }`}
                                    >
                                        {/* ID */}
                                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                                            <div>{s.id}</div>
                                            <div className="text-[10px] text-slate-400 font-normal">{s.orderReference}</div>
                                        </td>

                                        {/* Cliente & Origen */}
                                        <td className="py-3.5 px-4">
                                            <div className="font-semibold text-slate-900">{s.customerName}</div>
                                            <div className="text-[11px] text-slate-500 truncate max-w-48">{s.originSite}</div>
                                        </td>

                                        {/* Destino y Modo */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                                                {s.mode === 'SEA' ? (
                                                    <Ship className="w-3.5 h-3.5 text-blue-600" />
                                                ) : (
                                                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                                                )}
                                                <span>{s.destinationCity}, {s.destinationCountry}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{s.primaryCarrier} • {s.mode}</div>
                                        </td>

                                        {/* Diagnóstico IA */}
                                        <td className="py-3.5 px-4 max-w-xs">
                                            <div className="flex items-center space-x-1.5 mb-1">
                                                <span
                                                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${risk === 'CRITICAL'
                                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                                        : risk === 'HIGH'
                                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                            : risk === 'MEDIUM'
                                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                        }`}
                                                >
                                                    {risk}
                                                </span>
                                                {s.aiAssessment.isDelayed && (
                                                    <span className="text-[10px] font-semibold text-rose-600">
                                                        +{s.aiAssessment.predictedDelayHours}h
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
                                                {s.aiAssessment.summaryText}
                                            </p>
                                        </td>

                                        {/* ETAs */}
                                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                                            <div className="text-slate-500">
                                                Conf: {new Date(s.aiAssessment.confirmedEta).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                            </div>
                                            <div className={s.aiAssessment.isDelayed ? 'text-rose-600 font-semibold' : 'text-emerald-600'}>
                                                IA: {new Date(s.aiAssessment.predictedEta).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </td>

                                        {/* CTA Next Action */}
                                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                            {s.aiAssessment.recommendedAction && s.aiAssessment.recommendedAction.actionType !== 'MONITOR' ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveModalShipment(s);
                                                    }}
                                                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                                                >
                                                    <span>{s.aiAssessment.recommendedAction.label}</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center text-slate-400 text-xs italic">
                                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                                    Monitoreo
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* IA Action Modal */}
            {activeModalShipment && (
                <ActionModal
                    shipment={activeModalShipment}
                    onClose={() => setActiveModalShipment(null)}
                />
            )}
        </div>
    );
};