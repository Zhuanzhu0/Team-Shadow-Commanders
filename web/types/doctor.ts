export type PatientStatus = 'Stable' | 'Warning' | 'Critical' | 'Under Care' | 'Discharged' | 'Pending Approval';

export interface Vitals {
    heartRate: number;
    bloodPressure: string; // e.g., "120/80"
    spO2: number;
    temperature: number;
    respiratoryRate: number;
    lastUpdated: number; // timestamp
}

export interface NurseReport {
    id: string;
    notes: string;
    vitalsSummary: string;
    actionsTaken: string;
    timestamp: number;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    bedNumber: string;
    wardId: string;
    condition: PatientStatus;
    diagnosis: string;
    admissionDate: string;
    vitals: Vitals;
    nurseReports: NurseReport[];
    dischargeRequested?: boolean; // Flag for "Pending Approval" logic
    dischargeReason?: string;
}

export interface Ward {
    id: string;
    name: string;
    type: 'General' | 'ICU' | 'Emergency' | 'Surgical';
    capacity: number;
    occupied: number;
}

export interface SimulationState {
    isConnected: boolean;
    latency: number; // ms
    lastSync: number; // timestamp
}
