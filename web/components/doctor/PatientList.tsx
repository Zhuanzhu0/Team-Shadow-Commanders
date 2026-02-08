"use strict";
import React from 'react';
import { Patient } from '@/types/doctor';
import { User, Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface PatientListProps {
    patients: Patient[];
    selectedPatientId: string | null;
    onSelectPatient: (patientId: string) => void;
}

const statusColorMap = {
    'Stable': 'bg-green-100 text-green-700 border-green-200',
    'Warning': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Critical': 'bg-red-100 text-red-700 border-red-200',
    'Under Care': 'bg-blue-100 text-blue-700 border-blue-200',
    'Discharged': 'bg-gray-100 text-gray-500 border-gray-200',
    'Pending Approval': 'bg-orange-100 text-orange-700 border-orange-200 animate-pulse',
};

const statusIconMap = {
    'Stable': CheckCircle2,
    'Warning': AlertCircle,
    'Critical': Activity,
    'Under Care': User,
    'Discharged': Clock,
    'Pending Approval': Clock,
};

export default function PatientList({ patients, selectedPatientId, onSelectPatient }: PatientListProps) {
    if (patients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-slate-400 bg-white rounded-xl shadow-sm border border-slate-100 h-full">
                <User className="w-12 h-12 mb-2 opacity-20" />
                <p>No patients in this ward.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 overflow-y-auto pr-2 h-full">
            {patients.map((patient) => {
                const isSelected = selectedPatientId === patient.id;
                const StatusIcon = statusIconMap[patient.condition] || User;

                return (
                    <button
                        key={patient.id}
                        onClick={() => onSelectPatient(patient.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative ${isSelected
                            ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className={`font-bold ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'}`}>
                                    {patient.name}
                                </h3>
                                <p className={`text-xs ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                    Bed: {patient.bedNumber}
                                </p>
                            </div>
                            <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${statusColorMap[patient.condition]}`}>
                                {patient.condition}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                <Activity className="w-3 h-3" />
                                HR: {patient.vitals.heartRate}
                            </div>
                            <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                <span className="font-bold">O2:</span> {patient.vitals.spO2}%
                            </div>
                        </div>

                        {patient.dischargeRequested && (
                            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
