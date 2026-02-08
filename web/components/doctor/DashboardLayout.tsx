"use strict";
import React from 'react';
import { LayoutDashboard, Users, Activity, LogOut, Wifi, Zap } from 'lucide-react';
import { useSimulation } from '@/context/SimulationProvider';
import Link from 'next/link';

interface DashboardLayoutProps {
    children: React.ReactNode;
    selectedWard: string;
    onSelectWard: (wardId: string) => void;
}

const WARDS = [
    { id: 'all', name: 'All Wards', icon: LayoutDashboard },
    { id: 'ward-a', name: 'Ward A (General)', icon: Users },
    { id: 'ward-b', name: 'Ward B (Ortho)', icon: Users },
    { id: 'icu', name: 'Intensive Care (ICU)', icon: Activity },
    { id: 'er', name: 'Emergency Room', icon: Zap },
];

export default function DashboardLayout({ children, selectedWard, onSelectWard }: DashboardLayoutProps) {
    const { simulationState } = useSimulation();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Activity className="w-6 h-6 text-blue-600 mr-2" />
                    <span className="text-xl font-bold text-slate-900">PulseGuard</span>
                </div>

                <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                        Wards & Units
                    </div>
                    {WARDS.map((ward) => {
                        const Icon = ward.icon;
                        const isActive = selectedWard === ward.id;
                        return (
                            <button
                                key={ward.id}
                                onClick={() => onSelectWard(ward.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                {ward.name}
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-100">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-slate-800">
                        Doctor Dashboard
                    </h1>

                    <div className="flex items-center gap-6">
                        {/* 5G Status Indicator */}
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                            <div className={`w-2 h-2 rounded-full ${simulationState.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            <div className="flex flex-col leading-none">
                                <span className="text-xs font-bold text-slate-700">5G LIVE</span>
                                <span className="text-[10px] text-slate-500">{simulationState.latency}ms latency</span>
                            </div>
                            <Wifi className="w-4 h-4 text-slate-400" />
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                                DR
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-slate-900">Dr. Sarah Wilson</p>
                                <p className="text-slate-500 text-xs">Head of Cardiology</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
