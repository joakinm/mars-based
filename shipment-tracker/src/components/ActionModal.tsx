import React, { useState } from 'react';
import type { Shipment } from '../types/shipment';
import { useShipments } from '../context/ShipmentContext';
import { X, Send, CheckCircle2, AlertTriangle, FileUp } from 'lucide-react';

interface ActionModalProps {
    shipment: Shipment;
    onClose: () => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({ shipment, onClose }) => {
    const { resolveException } = useShipments();
    const [isSuccess, setIsSuccess] = useState(false);
    const action = shipment.aiAssessment.recommendedAction;

    if (!action) return null;

    const handleExecute = () => {
        setIsSuccess(true);
        setTimeout(() => {
            resolveException(shipment.id);
            onClose();
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono uppercase bg-blue-600 px-2 py-0.5 rounded text-white font-semibold">
                            IA Next Action
                        </span>
                        <span className="font-semibold text-sm">{shipment.id}</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">{action.label}</h3>
                        <p className="text-xs text-slate-500 mt-1">{action.description}</p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start space-x-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800">
                            <span className="font-semibold">Diagnóstico: </span>
                            {shipment.aiAssessment.summaryText}
                        </div>
                    </div>

                    {action.prefilledPayload && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                                Borrador Automático Asistido
                            </span>
                            {action.prefilledPayload.emailSubject && (
                                <div className="text-xs">
                                    <span className="text-slate-500 font-medium">Asunto: </span>
                                    <span className="text-slate-800 font-semibold">{action.prefilledPayload.emailSubject}</span>
                                </div>
                            )}
                            {action.prefilledPayload.emailBody && (
                                <div className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] leading-relaxed">
                                    {action.prefilledPayload.emailBody}
                                </div>
                            )}
                            {action.prefilledPayload.requiredDocType && (
                                <div className="flex items-center space-x-2 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200 font-medium">
                                    <FileUp className="w-4 h-4" />
                                    <span>Documento requerido: {action.prefilledPayload.requiredDocType}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {isSuccess ? (
                        <div className="flex items-center justify-center space-x-2 py-3 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-200 font-semibold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Acción ejecutada e incidencia mitigada en el grafo</span>
                        </div>
                    ) : (
                        <div className="flex justify-end space-x-2 pt-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleExecute}
                                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>Aprobar y Ejecutar Acción</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};