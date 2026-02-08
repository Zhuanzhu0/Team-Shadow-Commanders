"use client";

import { useState, useEffect } from "react";
import { initialPatients, type Patient, fluctuateVitals } from "@/lib/mock-data";
import { PatientCard } from "@/components/nurse/PatientCard";
import { Activity, Bell, Filter, Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdmitPatientModal } from "@/components/nurse/AdmitPatientModal";
import { toast } from "sonner";
import { usePatientSync } from "@/hooks/use-patient-sync";

export default function NurseDashboard() {
    const [patients, setPatients] = useState<Patient[]>([]); // Start empty to avoid hydration mismatch
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"All" | "CRITICAL" | "WARNING">("All");
    const [admitOpen, setAdmitOpen] = useState(false);

    // Simulate real-time updates
    const { broadcastVitals } = usePatientSync();

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            const { getStoredPatients } = await import("@/lib/mock-data");
            const stored = getStoredPatients();
            setPatients(stored);
        };
        loadData();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            // We need to fetch the latest state from storage to ensure we don't overwrite other updates (conceptually)
            // But here we are the "source of truth" for vitals as the nurse dashboard simulation
            const { savePatients } = await import("@/lib/mock-data");

            setPatients((currentPatients) => {
                if (currentPatients.length === 0) return currentPatients;

                const updatedPatients = currentPatients.map((patient) => {
                    // Only simulate vitals for active patients, maybe just p1 for now or all
                    const newVitals = fluctuateVitals(patient.vitals, patient.status);

                    // Broadcast updates for p1 (or any patient)
                    // We broadcast p1 specifically because that's what the patient dashboard listens to by default
                    if (patient.id === "p1") {
                        broadcastVitals("p1", newVitals);
                    }

                    return {
                        ...patient,
                        vitals: newVitals,
                    };
                });

                // Persist the updated vitals to storage so if the patient refreshes they see new data
                savePatients(updatedPatients);

                return updatedPatients;
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, [broadcastVitals]);

    const handleAdmitPatient = (newPatientData: Partial<Patient>) => {
        const newPatient: Patient = {
            id: `p${patients.length + 1}`,
            name: newPatientData.name || "Unknown",
            age: newPatientData.age || 0,
            gender: newPatientData.gender || "Other",
            ward: newPatientData.ward || "Emergency",
            bed: "Wait",
            status: "Stable",
            vitals: {
                heartRate: 80,
                bloodPressureSys: 120,
                bloodPressureDia: 80,
                spo2: 98,
                temperature: 37,
                respiratoryRate: 16,
            },
            history: [],
            alerts: [],
            assignedDoctor: "Dr. OnCall",
            billing: [],
            dischargeRequest: { status: "none" },
            medications: [],
            reports: []
        };

        setPatients(prev => [newPatient, ...prev]);
        toast.success("Patient Admitted", {
            description: `${newPatient.name} added to dashboard.`
        });
    };

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch = patient.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === "All" || patient.status.toUpperCase() === filter;
        return matchesSearch && matchesFilter;
    });

    const criticalCount = patients.filter((p) => p.status === "Critical").length;
    const warningCount = patients.filter((p) => p.status === "Warning").length;

    return (
        <div className="min-h-screen bg-background p-4 sm:p-8">
            <AdmitPatientModal
                open={admitOpen}
                onOpenChange={setAdmitOpen}
                onConfirm={handleAdmitPatient}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <Activity className="text-primary" />
                        Nurse Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Real-time monitoring of {patients.length} patients
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <Button onClick={() => setAdmitOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <UserPlus className="mr-2 h-4 w-4" /> Admit Patient
                    </Button>
                    <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg font-medium border border-destructive/20 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        Critical: {criticalCount}
                    </div>
                    <div className="bg-amber-500/10 text-amber-600 dark:text-amber-500 px-4 py-2 rounded-lg font-medium border border-amber-500/20 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        Warning: {warningCount}
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search patients by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === "All" ? "default" : "outline"}
                        onClick={() => setFilter("All")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "WARNING" ? "default" : "outline"}
                        onClick={() => setFilter("WARNING")}
                        className={filter === "WARNING" ? "bg-yellow-500 hover:bg-yellow-600" : "text-yellow-600 hover:bg-yellow-50"}
                    >
                        Warning
                    </Button>
                    <Button
                        variant={filter === "CRITICAL" ? "default" : "outline"}
                        onClick={() => setFilter("CRITICAL")}
                        className={filter === "CRITICAL" ? "bg-red-500 hover:bg-red-600" : "text-red-600 hover:bg-red-50"}
                    >
                        Critical
                    </Button>
                </div>
            </div>

            {/* Patient Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPatients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                ))}

                {filteredPatients.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No patients found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
