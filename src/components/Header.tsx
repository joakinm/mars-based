import React from 'react';
import { useShipments } from '../context/ShipmentContext';
import { ShieldCheck, UserCheck, Layers } from 'lucide-react';

export const Header: React.FC = () => {
    const { role, setRole } = useShipments();

    return (
        <header className="bg-slate-900 border-b border-slate-800 text-white min-h-[4rem] h-auto py-3 px-4 sm:px-6 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Identidad de la App */}
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-inner shrink-0">
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
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => setRole('OPERATIONS')}
                        className={`flex items-center justify-center sm:justify-start space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all w-full sm:w-auto ${role === 'OPERATIONS'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                    >
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">Internal Operations</span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 whitespace-nowrap bg-blue-800 text-blue-200">
                            Triage
                        </span>
                    </button>

                    <button
                        onClick={() => setRole('CUSTOMER')}
                        className={`flex items-center justify-center sm:justify-start space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all w-full sm:w-auto ${role === 'CUSTOMER'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                    >
                        <UserCheck className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">Customer Portal</span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 whitespace-nowrap bg-emerald-800 text-emerald-100">
                            Self-Service
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};