"use strict";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Patient, SimulationState } from '../types/doctor';
import { toast } from 'sonner';

interface SimulationContextType {
    simulationState: SimulationState;
    patients: Patient[];
    updatePatientStatus: (patientId: string, status: Patient['condition'], reason?: string) => void;
    refreshVitals: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Mock Initial Data
const INITIAL_PATIENTS: Patient[] = [
    {
        id: 'p1',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        bedNumber: 'A-101',
        wardId: 'ward-a',
        condition: 'Stable',
        diagnosis: 'Post-op Recovery',
        admissionDate: '2023-10-25',
        vitals: {
            heartRate: 72,
            bloodPressure: '120/80',
            spO2: 98,
            temperature: 36.6,
            respiratoryRate: 16,
            lastUpdated: Date.now(),
        },
        nurseReports: [
            {
                id: 'r1',
                notes: 'Patient resting comfortably.',
                vitalsSummary: 'Stable',
                actionsTaken: 'Administered pain meds',
                timestamp: Date.now() - 3600000,
            },
        ],
    },
    {
        id: 'p2',
        name: 'Jane Smith',
        age: 62,
        gender: 'Female',
        bedNumber: 'ICU-05',
        wardId: 'icu',
        condition: 'Critical',
        diagnosis: 'Severe Pneumonia',
        admissionDate: '2023-10-26',
        vitals: {
            heartRate: 110,
            bloodPressure: '145/95',
            spO2: 88,
            temperature: 39.2,
            respiratoryRate: 24,
            lastUpdated: Date.now(),
        },
        nurseReports: [],
    },
    {
        id: 'p3',
        name: 'Robert Brown',
        age: 30,
        gender: 'Male',
        bedNumber: 'B-202',
        wardId: 'ward-b',
        condition: 'Under Care',
        diagnosis: 'Fractured Femur',
        admissionDate: '2023-10-27',
        vitals: {
            heartRate: 80,
            bloodPressure: '130/85',
            spO2: 99,
            temperature: 37.0,
            respiratoryRate: 18,
            lastUpdated: Date.now(),
        },
        nurseReports: [],
        dischargeRequested: true,
    }
];

export function SimulationProvider({ children }: { children: React.ReactNode }) {
    const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
    const [simulationState, setSimulationState] = useState<SimulationState>({
        isConnected: true,
        latency: 15,
        lastSync: Date.now(),
    });

    // Simulate 5G Network Fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setSimulationState((prev) => ({
                ...prev,
                latency: Math.floor(Math.random() * (30 - 5 + 1) + 5), // 5-30ms
                lastSync: Date.now(),
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Simulate Real-time Vitals Updates
    useEffect(() => {
        const interval = setInterval(() => {
            setPatients((prevPatients) =>
                prevPatients.map((p) => {
                    if (p.condition === 'Discharged') return p;

                    // Randomize vitals slightly
                    const newHeartRate = p.vitals.heartRate + Math.floor(Math.random() * 5 - 2);
                    const newSpO2 = Math.min(100, Math.max(80, p.vitals.spO2 + Math.floor(Math.random() * 3 - 1)));

                    return {
                        ...p,
                        vitals: {
                            ...p.vitals,
                            heartRate: newHeartRate,
                            spO2: newSpO2,
                            lastUpdated: Date.now(),
                        },
                    };
                })
            );
        }, 1000); // Update every second
        return () => clearInterval(interval);
    }, []);

    const updatePatientStatus = useCallback((patientId: string, status: Patient['condition'], reason?: string) => {
        // Simulate low latency network request
        setTimeout(() => {
            setPatients((prev) =>
                prev.map((p) => {
                    if (p.id === patientId) {
                        return {
                            ...p,
                            condition: status,
                            dischargeRequested: status === 'Discharged' ? false : (status === 'Under Care' && p.dischargeRequested && reason ? false : p.dischargeRequested), // Reset flag if discharged or rejected
                            dischargeReason: reason,
                        };
                    }
                    return p;
                })
            );
            toast.success(`Patient status updated to ${status}`);
        }, 50); // 50ms simulated delay included in "immediate" feel
    }, []);

    const refreshVitals = useCallback(() => {
        // Force refresh logic if needed
        setSimulationState(prev => ({ ...prev, lastSync: Date.now() }));
    }, []);

    return (
        <SimulationContext.Provider value={{ simulationState, patients, updatePatientStatus, refreshVitals }}>
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    const context = useContext(SimulationContext);
    if (context === undefined) {
        throw new Error('useSimulation must be used within a SimulationProvider');
    }
    return context;
}
