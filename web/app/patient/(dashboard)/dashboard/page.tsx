"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { initialPatients, Patient } from "@/lib/mock-data";
import { usePatientSync } from "@/hooks/use-patient-sync";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, Thermometer, Wind, Wifi, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const VitalsCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
    <Card className="relative overflow-hidden border-none shadow-md bg-white">
        <div className={`absolute left-0 top-0 h-full w-1 ${color}`} />
        <CardContent className="p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {value}
                        </h3>
                        <span className="text-sm text-slate-400 font-medium">{unit}</span>
                    </div>
                </div>
                <div className={`p-2 rounded-full ${color.replace('bg-', 'bg-opacity-10 bg-')} ${color.replace('bg-', 'text-')}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
                {trend === 'up' && <ArrowUp className="h-4 w-4 text-red-500" />}
                {trend === 'down' && <ArrowDown className="h-4 w-4 text-green-500" />}
                {trend === 'stable' && <ArrowRight className="h-4 w-4 text-slate-400" />}
                <span className="text-slate-500">vs last hour</span>
            </div>
        </CardContent>
    </Card>
);

export default function PatientDashboard() {
    const [patient, setPatient] = useState<Patient>(initialPatients[0]); // Default to p1
    const { isConnected, lastSync } = usePatientSync("p1");
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // Listen for sync updates
    useEffect(() => {
        setLastUpdate(new Date());

        // Load user name and data from localStorage
        const loadData = async () => {
            const { getStoredPatients } = await import("@/lib/mock-data");
            const storedPatients = getStoredPatients();
            const myself = storedPatients.find(p => p.id === "p1");
            if (myself) {
                setPatient(myself);
            }
        };
        loadData();

        const handleVitalSync = (event: CustomEvent) => {
            setPatient(prev => ({
                ...prev,
                vitals: event.detail
            }));
            setLastUpdate(new Date());
        };

        window.addEventListener("vital-sync" as any, handleVitalSync);
        return () => window.removeEventListener("vital-sync" as any, handleVitalSync);
    }, []);

    return (
        <div className="space-y-6 pb-20 bg-background min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Good Morning, {patient.name.split(' ')[0]}</h1>
                    <p className="text-muted-foreground mt-1">Here is your daily health summary</p>
                </div>
                <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                    <div className={`flex items-center gap-2 ${isConnected ? "text-emerald-600 dark:text-emerald-500" : "text-amber-500"}`}>
                        <Wifi className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">{isConnected ? "5G Sync Active" : "Connecting..."}</span>
                    </div>
                    <span className="h-4 w-px bg-border" />
                    <span className="text-xs text-muted-foreground">
                        Last update: {lastUpdate?.toLocaleTimeString() ?? "Syncing..."}
                    </span>
                </div>
            </div>

            {/* Health Status Banner */}
            <div className={`rounded-xl p-6 text-white shadow-lg transition-colors duration-500 ${patient.status === 'Stable' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
                patient.status === 'Warning' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                    'bg-gradient-to-r from-red-600 to-rose-600'
                }`}>
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <Activity className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold opacity-90">Current Status</h2>
                        <div className="text-3xl font-bold tracking-tight">{patient.status}</div>
                    </div>
                    <div className="ml-auto text-right hidden sm:block">
                        <div className="text-sm opacity-75">Assigned Doctor</div>
                        <div className="font-semibold">{patient.assignedDoctor}</div>
                    </div>
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <VitalsCard
                    title="Heart Rate"
                    value={patient.vitals.heartRate}
                    unit="bpm"
                    icon={Heart}
                    color="bg-rose-500"
                    trend={patient.vitals.heartRate > 100 ? 'up' : 'stable'}
                />
                <VitalsCard
                    title="Blood Pressure"
                    value={`${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia}`}
                    unit="mmHg"
                    icon={Activity}
                    color="bg-blue-500"
                    trend="stable"
                />
                <VitalsCard
                    title="SpO2"
                    value={patient.vitals.spo2}
                    unit="%"
                    icon={Wind}
                    color="bg-sky-500"
                    trend={patient.vitals.spo2 < 95 ? 'down' : 'stable'}
                />
                <VitalsCard
                    title="Body Temp"
                    value={patient.vitals.temperature}
                    unit="°C"
                    icon={Thermometer}
                    color="bg-amber-500"
                    trend={patient.vitals.temperature > 37.5 ? 'up' : 'stable'}
                />
            </div>

            {/* Daily Chart Placeholder (Recharts would go here) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Health Trends (24h)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center bg-slate-50 border-dashed border-2 rounded-lg m-6">
                        <p className="text-slate-400">Chart Visualization Placeholder</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Next Medication</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patient.medications.length > 0 ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-blue-900">{patient.medications[0].name}</h4>
                                        <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                                            {patient.medications[0].time}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-blue-700 mb-2">{patient.medications[0].dosage} • {patient.medications[0].instructions}</p>
                                </div>
                                <div className="text-center">
                                    <Link href="/patient/medications" className="text-sm text-blue-600 font-medium hover:underline">
                                        View Full Schedule &rarr;
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500">No upcoming medications.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
