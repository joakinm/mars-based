import React from 'react';
import { useShipments } from '../context/ShipmentContext';
import { ShieldCheck, UserCheck, Layers } from 'lucide-react';

export const Header: React.FC = () => {
    const { role, setRole } = useShipments();

    return (
        <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-3.5 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Identidad de la App */}
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-inner">
                        <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-bold tracking-tight text-base text-slate-100">MarsLogistics OS</span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                                AI Tracking Engine
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">Consolidated Multimodal Operations & Client Visibility</p>
                    </div>
                </div>

                {/* Role Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => setRole('OPERATIONS')}
                        className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${role === 'OPERATIONS'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Internal Operations</span>
                        <span className="ml-1 text-[10px] bg-blue-800 text-blue-200 px-1.5 py-0.2 rounded-full font-mono">
                            Triage
                        </span>
                    </button>

                    <button
                        onClick={() => setRole('CUSTOMER')}
                        className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${role === 'CUSTOMER'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                    >
                        <UserCheck className="w-4 h-4" />
                        <span>Customer Portal</span>
                        <span className="ml-1 text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.2 rounded-full font-mono">
                            Self-Service
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};