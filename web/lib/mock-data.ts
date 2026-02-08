export type PatientStatus = "Stable" | "Warning" | "Critical" | "Pending Discharge" | "Discharged";

export interface Vitals {
    heartRate: number;
    bloodPressureSys: number;
    bloodPressureDia: number;
    spo2: number;
    temperature: number;
    respiratoryRate: number;
}

export interface Alert {
    id: string;
    message: string;
    severity: "low" | "medium" | "high";
    timestamp: string;
    acknowledged: boolean;
}


export interface BillItem {
    id: string;
    description: string;
    cost: number;
    timestamp: string;
}

export interface DischargeRequest {
    status: "none" | "pending" | "approved" | "rejected";

    note?: string;
    requestedAt?: string;
    respondedAt?: string;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    time: "Morning" | "Afternoon" | "Evening" | "Night";
    status: "taken" | "missed" | "upcoming";
    instructions?: string;
}

export interface Report {
    id: string;
    title: string;
    date: string;
    type: "Lab" | "Imaging" | "Prescription" | "Discharge";
    doctor: string;
    status: "Ready" | "Processing";

}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    ward: string;
    bed: string;
    status: PatientStatus;
    vitals: Vitals;
    history: Vitals[]; // For charts
    alerts: Alert[];
    assignedDoctor: string;
    doctorPhone?: string;
    billing: BillItem[];
    dischargeRequest: DischargeRequest;
    medications: Medication[];
    reports: Report[];
}

export const initialPatients: Patient[] = [
    {
        id: "p1",
        name: "James Wilson",
        age: 65,
        gender: "Male",
        ward: "ICU-A",
        bed: "01",
        status: "Stable",
        vitals: {
            heartRate: 72,
            bloodPressureSys: 120,
            bloodPressureDia: 80,
            spo2: 98,
            temperature: 36.6,
            respiratoryRate: 16,
        },
        history: [],
        alerts: [],
        assignedDoctor: "Dr. Sarah Chen",
        doctorPhone: "555-0101",
        billing: [
            { id: "b1", description: "Initial Consultation", cost: 150, timestamp: new Date().toISOString() },
            { id: "b2", description: "Blood Test Panel", cost: 200, timestamp: new Date().toISOString() }
        ],
        dischargeRequest: { status: "none" },
        medications: [
            {
                id: "m1",
                name: "Lisinopril",
                dosage: "10mg",
                frequency: "Once daily",
                time: "Morning",
                status: "upcoming",
                instructions: "Take with food"
            },
            {
                id: "m2",
                name: "Atorvastatin",
                dosage: "20mg",
                frequency: "Once daily",
                time: "Night",
                status: "taken",
                instructions: "Before bed"
            }
        ],
        reports: [
            {
                id: "r1",
                title: "Blood Chemistry Panel",
                date: "2024-02-15",
                type: "Lab",
                doctor: "Dr. Sarah Chen",
                status: "Ready"
            },
            {
                id: "r2",
                title: "Chest X-Ray",
                date: "2024-02-14",
                type: "Imaging",
                doctor: "Dr. Smith",
                status: "Ready"
            }
        ]
    },
    {
        id: "p2",
        name: "Maria Garcia",
        age: 54,
        gender: "Female",
        ward: "ICU-A",
        bed: "02",
        status: "Warning",
        vitals: {
            heartRate: 95,
            bloodPressureSys: 145,
            bloodPressureDia: 90,
            spo2: 94,
            temperature: 37.8,
            respiratoryRate: 20,
        },
        history: [],
        alerts: [
            {
                id: "a1",
                message: "Elevated Heart Rate",
                severity: "medium",
                timestamp: new Date().toISOString(),
                acknowledged: false,
            },
        ],
        assignedDoctor: "Dr. Ahmed Khan",
        doctorPhone: "555-0102",
        billing: [],
        dischargeRequest: { status: "none" },
        medications: [],
        reports: [],
    },
    {
        id: "p3",
        name: "Robert Johnson",
        age: 78,
        gender: "Male",
        ward: "ICU-B",
        bed: "01",
        status: "Critical",
        vitals: {
            heartRate: 45,
            bloodPressureSys: 85,
            bloodPressureDia: 50,
            spo2: 88,
            temperature: 35.9,
            respiratoryRate: 10,
        },
        history: [],
        alerts: [
            {
                id: "a2",
                message: "Bradycardia Alert",
                severity: "high",
                timestamp: new Date().toISOString(),
                acknowledged: false,
            },
            {
                id: "a3",
                message: "Low SpO2",
                severity: "high",
                timestamp: new Date().toISOString(),
                acknowledged: false,
            },
        ],
        assignedDoctor: "Dr. Emily Davis",
        doctorPhone: "555-0103",
        billing: [],
        dischargeRequest: { status: "none" },
        medications: [],
        reports: [],
    },
    {
        id: "p4",
        name: "Linda Taylor",
        age: 42,
        gender: "Female",
        ward: "Gen-A",
        bed: "05",
        status: "Stable",
        vitals: {
            heartRate: 68,
            bloodPressureSys: 118,
            bloodPressureDia: 76,
            spo2: 99,
            temperature: 36.5,
            respiratoryRate: 14,
        },
        history: [],
        alerts: [],
        assignedDoctor: "Dr. Sarah Chen",
        doctorPhone: "555-0101",
        billing: [],
        dischargeRequest: { status: "none" },
        medications: [],
        reports: [],
    },
];

// Helper to simulate slight vital fluctuations
export function fluctuateVitals(current: Vitals, status: PatientStatus): Vitals {
    const stabilityFactor = status === "Stable" ? 1 : status === "Warning" ? 3 : 8;
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const change = (val: number, range: number) => {
        const delta = random(-range, range);
        return val + delta;
    };

    // Logic to keep values somewhat realistic
    return {
        heartRate: Math.max(30, Math.min(200, change(current.heartRate, stabilityFactor))),
        bloodPressureSys: Math.max(60, Math.min(250, change(current.bloodPressureSys, stabilityFactor))),
        bloodPressureDia: Math.max(40, Math.min(150, change(current.bloodPressureDia, stabilityFactor))),
        spo2: Math.max(70, Math.min(100, change(current.spo2, stabilityFactor === 8 ? 2 : 1))),
        temperature: Number((Math.max(34, Math.min(42, current.temperature + (Math.random() - 0.5) * 0.1 * stabilityFactor))).toFixed(1)),
        respiratoryRate: Math.max(8, Math.min(40, change(current.respiratoryRate, stabilityFactor === 8 ? 2 : 1))),
    };
}

// --- LocalStorage Helpers for Shared Simulation ---

export const STORAGE_KEY = "pulseguard_patients";

export function getStoredPatients(): Patient[] {
    if (typeof window === "undefined") return initialPatients;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Initialize if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPatients));
        return initialPatients;
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse patient data", e);
        return initialPatients;
    }
}

export function savePatients(patients: Patient[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}
