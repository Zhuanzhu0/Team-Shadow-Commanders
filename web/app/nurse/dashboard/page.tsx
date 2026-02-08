"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { initialPatients, type Patient, fluctuateVitals } from "@/lib/mock-data";
import { PatientCard } from "@/components/nurse/PatientCard";
import { Activity, Bell, Filter, Search, UserPlus, LogOut, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdmitPatientModal } from "@/components/nurse/AdmitPatientModal";
import { toast } from "sonner";

export default function NurseDashboard() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>(initialPatients);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"All" | "CRITICAL" | "WARNING">("All");
    const [admitOpen, setAdmitOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setPatients((currentPatients) =>
                currentPatients.map((patient) => ({
                    ...patient,
                    vitals: fluctuateVitals(patient.vitals, patient.status),
                }))
            );
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

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
        };

        setPatients(prev => [newPatient, ...prev]);
        toast.success("Patient Admitted", {
            description: `${newPatient.name} added to dashboard.`
        });
    };

    async function handleLogout() {
        setIsLoggingOut(true);

        try {
            const { signOutUser } = await import("@/lib/auth");
            const { error } = await signOutUser();

            if (error) {
                toast.error("Failed to log out. Please try again.");
                setIsLoggingOut(false);
                return;
            }

            // Success - redirect to home
            router.push("/");
        } catch (err) {
            console.error("Logout error:", err);
            toast.error("Failed to log out. Please try again.");
            setIsLoggingOut(false);
        }
    }

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
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <AdmitPatientModal
                open={admitOpen}
                onOpenChange={setAdmitOpen}
                onConfirm={handleAdmitPatient}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="text-blue-600" />
                        Nurse Dashboard
                    </h1>
                    <p className="text-slate-500">
                        Real-time monitoring of {patients.length} patients
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <Button onClick={() => setAdmitOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <UserPlus className="mr-2 h-4 w-4" /> Admit Patient
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="mr-2 h-4 w-4" />
                        )}
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium border border-red-200 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        Critical: {criticalCount}
                    </div>
                    <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium border border-yellow-200 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-600" />
                        Warning: {warningCount}
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
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
