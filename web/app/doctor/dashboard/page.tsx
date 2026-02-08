"use strict";
"use client";
import React, { useState, useMemo } from 'react';
import { SimulationProvider, useSimulation } from '@/context/SimulationProvider';
import DashboardLayout from '@/components/doctor/DashboardLayout';
import PatientList from '@/components/doctor/PatientList';
import PatientCondition from '@/components/doctor/PatientCondition';

function DashboardContent() {
    const { patients, updatePatientStatus } = useSimulation();
    const [selectedWard, setSelectedWard] = useState('all');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    const filteredPatients = useMemo(() => {
        if (selectedWard === 'all') return patients;
        return patients.filter((p) => p.wardId === selectedWard);
    }, [patients, selectedWard]);

    const selectedPatient = useMemo(() => {
        return patients.find((p) => p.id === selectedPatientId) || null;
    }, [patients, selectedPatientId]);

    return (
        <DashboardLayout selectedWard={selectedWard} onSelectWard={setSelectedWard}>
            <div className="flex h-[calc(100vh-140px)] gap-6">
                {/* Left Panel: Patient List */}
                <div className="w-1/3 min-w-[320px] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-700">Patient List</h2>
                        <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                            {filteredPatients.length}
                        </span>
                    </div>
                    <div className="flex-1 overflow-hidden p-2">
                        <PatientList
                            patients={filteredPatients}
                            selectedPatientId={selectedPatientId}
                            onSelectPatient={setSelectedPatientId}
                        />
                    </div>
                </div>

                {/* Right Panel: Patient Details */}
                <div className="flex-1 min-w-[500px] overflow-hidden">
                    <PatientCondition
                        patient={selectedPatient}
                        onUpdateStatus={updatePatientStatus}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}

export default function DoctorDashboard() {
    return (
        <SimulationProvider>
            <DashboardContent />
        </SimulationProvider>
    );
}
