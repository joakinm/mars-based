import type { FC } from 'react';
import { useShipments } from '../context/ShipmentContext';
import {
    Truck,
    Ship,
    CheckCircle2,
    AlertTriangle,
    MapPin,
    ArrowRight
} from 'lucide-react';

export const CustomerView: FC = () => {
    const { shipments, selectedShipmentId, setSelectedShipmentId } = useShipments();
    const activeShipment = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

    return (
        <div className="space-y-6">
            {/* Shipment Selector */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Self-Service Portal
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-1">Multimodal Shipment Tracking</h2>
                    <p className="text-xs text-slate-500">Visualize real-time status and predictive arrival of your cargo.</p>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
                    {shipments.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedShipmentId(s.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeShipment.id === s.id
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {s.id} ({s.destinationCity})
                        </button>
                    ))}
                </div>
            </div>

            {activeShipment && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-mono font-bold text-slate-900">{activeShipment.id}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-xs font-semibold text-slate-700">{activeShipment.customerName}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-xs text-slate-500 font-medium">Ref: {activeShipment.orderReference}</span>
                                    </div>
                                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                                        {activeShipment.originSite} <ArrowRight className="inline w-4 h-4 mx-1 text-slate-400" /> {activeShipment.destinationCity}, {activeShipment.destinationCountry}
                                    </h3>
                                </div>
                                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                    {activeShipment.mode === 'SEA' ? <Ship className="w-4 h-4 text-blue-600" /> : <Truck className="w-4 h-4 text-emerald-600" />}
                                    <span className="text-xs font-bold uppercase text-slate-700">{activeShipment.mode} Transport</span>
                                </div>
                            </div>

                            {/* Proactive Banner */}
                            {activeShipment.aiAssessment.isDelayed || activeShipment.currentStatus === 'HELD' ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-amber-900 uppercase">Proactive Update Notice</span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                    activeShipment.aiAssessment.riskLevel === 'CRITICAL'
                                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                                        : activeShipment.aiAssessment.riskLevel === 'HIGH'
                                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                }`}
                                            >
                                                {activeShipment.aiAssessment.riskLevel}
                                            </span>
                                            <span className="text-[10px] bg-amber-200 text-amber-900 font-mono px-1.5 py-0.2 rounded font-semibold">
                                                +{activeShipment.aiAssessment.predictedDelayHours}h Adjusted ETA
                                            </span>
                                        </div>
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            {activeShipment.aiAssessment.summaryText}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <div>
                                        <div className="text-xs font-bold text-emerald-900">In Transit - On Schedule</div>
                                        <p className="text-xs text-emerald-700">{activeShipment.aiAssessment.summaryText}</p>
                                    </div>
                                </div>
                            )}

                            {/* ETAs */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Carrier Confirmed ETA</span>
                                    <span className="text-sm font-mono font-bold text-slate-800 mt-1 block">
                                        {new Date(activeShipment.aiAssessment.confirmedEta).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200">
                                    <span className="text-[10px] uppercase font-semibold text-blue-600 block">AI Smart ETA</span>
                                    <span className="text-sm font-mono font-extrabold text-blue-900 mt-1 block">
                                        {new Date(activeShipment.aiAssessment.predictedEta).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Smart Timeline */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Smart Multimodal Timeline</h4>
                                    <p className="text-xs text-slate-500">End-to-end traceability with normalized carrier telemetry.</p>
                                </div>
                                <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                                    Last Telemetry Ping: <span className="font-semibold text-slate-700">{activeShipment.lastTelemetryPing}</span>
                                </div>
                            </div>

                            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {activeShipment.events.map((event, idx) => {
                                    const isCompleted = event.status === 'COMPLETED';
                                    const isInProgress = event.status === 'IN_PROGRESS';
                                    const isFailed = event.status === 'FAILED';

                                    return (
                                        <div key={event.id} className="relative flex items-start space-x-3">
                                            <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 bg-white ${isCompleted
                                                ? 'border-emerald-600 text-emerald-600'
                                                : isInProgress
                                                    ? 'border-blue-600 text-blue-600 animate-pulse'
                                                    : isFailed
                                                        ? 'border-red-600 text-red-600'
                                                        : 'border-slate-300 text-slate-400'
                                                }`}>
                                                {isCompleted ? '✓' : idx + 1}
                                            </div>

                                            <div className="flex-1 bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-bold text-xs text-slate-900">{event.name}</span>
                                                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${isCompleted ? 'bg-emerald-100 text-emerald-800' :
                                                            isInProgress ? 'bg-blue-100 text-blue-800' :
                                                                isFailed ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-600'
                                                            }`}>
                                                            {event.status}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] font-mono text-slate-500">
                                                        {new Date(event.timestamp).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span>{event.location}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="font-medium text-slate-700">{event.carrierName}</span>
                                                </div>

                                                <div className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                                                    Original telemetry: <code className="text-slate-600">{event.rawStatusDescription}</code>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Panel */}
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                            <h4 className="text-sm font-bold text-slate-900">Documentation</h4>
                            <div className="space-y-2.5">
                                {activeShipment.documents.map((doc) => (
                                    <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-xs text-slate-800">{doc.title}</div>
                                            <span className="text-[10px] font-mono text-slate-400">{doc.type}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {doc.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xs space-y-3">
                            <span className="text-[10px] font-mono uppercase bg-blue-600 px-2 py-0.5 rounded text-white font-semibold">
                                Primary Carrier
                            </span>
                            <div className="text-sm font-bold">{activeShipment.primaryCarrier}</div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                24/7 operational support integrated via direct EDI gateway with the fleet.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};