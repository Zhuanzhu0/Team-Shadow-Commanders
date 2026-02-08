"use strict";
import React, { useState, useMemo } from 'react';
import { Patient, NurseReport } from '@/types/doctor';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Thermometer, Wind, Heart, ClipboardList, Clock, AlertTriangle } from 'lucide-react';
import { DischargeModal } from './DischargeModal';

interface PatientConditionProps {
    patient: Patient | null;
    onUpdateStatus: (patientId: string, status: Patient['condition'], reason?: string) => void;
}

// Mock chart data generator
const generateChartData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
        time: `${i}:00`,
        hr: 60 + Math.random() * 40,
        spo2: 90 + Math.random() * 10,
    }));
};

export default function PatientCondition({ patient, onUpdateStatus }: PatientConditionProps) {
    const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);

    // Use useMemo to prevent chart jitter on every render, but ideally this would come from real history
    const chartData = useMemo(() => generateChartData(), [patient?.id]);

    if (!patient) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm p-12 animate-in fade-in duration-500">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <Activity className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-700">Select a Patient</h3>
                <p className="text-center max-w-xs text-slate-500">Choose a patient from the list to view their real-time vitals, condition report, and discharge status.</p>
            </div>
        );
    }

    const isCritical = patient.condition === 'Critical';
    const isStable = patient.condition === 'Stable';

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto pb-6">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${isCritical ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' :
                            isStable ? 'bg-green-100 text-green-700 border-green-200' :
                                'bg-blue-100 text-blue-700 border-blue-200'
                            }`}>
                            {patient.condition}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">Based in: <span className="font-medium text-slate-700">{patient.bedNumber}</span></span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full self-center"></span>
                        <span>Age: <span className="font-medium text-slate-700">{patient.age}</span></span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full self-center"></span>
                        <span>Gender: <span className="font-medium text-slate-700">{patient.gender}</span></span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full self-center"></span>
                        <span>ID: <span className="font-medium text-slate-700">#{patient.id}</span></span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {patient.dischargeRequested && (
                        <button
                            onClick={() => setIsDischargeModalOpen(true)}
                            className="px-5 py-2.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 font-semibold rounded-xl hover:from-orange-200 hover:to-orange-100 transition-all flex items-center gap-2 shadow-sm border border-orange-200 animate-pulse"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            Review Discharge Request
                        </button>
                    )}
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <VitalCard
                    label="Heart Rate"
                    value={patient.vitals.heartRate}
                    unit="bpm"
                    icon={Heart}
                    color="text-red-500"
                    bgColor="bg-red-50/50"
                    borderColor="border-red-100"
                />
                <VitalCard
                    label="Blood Pressure"
                    value={patient.vitals.bloodPressure}
                    unit=""
                    icon={Activity}
                    color="text-indigo-500"
                    bgColor="bg-indigo-50/50"
                    borderColor="border-indigo-100"
                />
                <VitalCard
                    label="SpO2 Level"
                    value={patient.vitals.spO2}
                    unit="%"
                    icon={Wind}
                    color="text-cyan-500"
                    bgColor="bg-cyan-50/50"
                    borderColor="border-cyan-100"
                />
                <VitalCard
                    label="Body Temp"
                    value={patient.vitals.temperature}
                    unit="°C"
                    icon={Thermometer}
                    color="text-orange-500"
                    bgColor="bg-orange-50/50"
                    borderColor="border-orange-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Charts Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Biometrics Trend Analysis
                    </h3>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    domain={[40, 160]}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    domain={[85, 100]}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                    formatter={(value: any, name: any) => [Math.round(Number(value)), name === 'hr' ? 'Heart Rate' : 'SpO2']}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="hr"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    animationDuration={1000}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="spo2"
                                    stroke="#06b6d4"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    animationDuration={1000}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span> Heart Rate
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="w-3 h-3 rounded-full bg-cyan-500"></span> SpO2
                        </div>
                    </div>
                </div>

                {/* Nurse Reports */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2 sticky top-0 bg-white z-10">
                        <ClipboardList className="w-5 h-5 text-slate-600" />
                        Nurse Notes
                    </h3>
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {patient.nurseReports && patient.nurseReports.length > 0 ? (
                            patient.nurseReports.map((report: NurseReport, idx: number) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            Daily Report
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100">
                                            <Clock className="w-3 h-3" />
                                            {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">{report.notes}</p>
                                    <div className="flex flex-col gap-1.5 ">
                                        {report.actionsTaken && (
                                            <div className="flex items-start gap-2 text-xs text-slate-600 bg-blue-50/50 p-2 rounded-lg">
                                                <span className="font-semibold whitespace-nowrap text-blue-700">Action:</span>
                                                {report.actionsTaken}
                                            </div>
                                        )}
                                        {report.vitalsSummary && (
                                            <div className="flex items-start gap-2 text-xs text-slate-600 bg-emerald-50/50 p-2 rounded-lg">
                                                <span className="font-semibold whitespace-nowrap text-emerald-700">Observed:</span>
                                                {report.vitalsSummary}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                                <ClipboardList className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm">No nurse reports yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DischargeModal
                patient={patient}
                isOpen={isDischargeModalOpen}
                onClose={() => setIsDischargeModalOpen(false)}
                onApprove={() => {
                    onUpdateStatus(patient.id, 'Discharged');
                    setIsDischargeModalOpen(false);
                }}
                onReject={(reason) => {
                    onUpdateStatus(patient.id, 'Under Care', reason);
                    setIsDischargeModalOpen(false);
                }}
            />
        </div>
    );
}

function VitalCard({ label, value, unit, icon: Icon, color, bgColor, borderColor }: any) {
    return (
        <div className={`p-4 rounded-2xl border ${borderColor} ${bgColor} flex items-center justify-between`}>
            <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-bold text-slate-900 leading-none">
                    {value} <span className="text-xs font-normal text-slate-500 ml-0.5">{unit}</span>
                </p>
            </div>
            <div className={`p-3 rounded-xl bg-white shadow-sm ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
