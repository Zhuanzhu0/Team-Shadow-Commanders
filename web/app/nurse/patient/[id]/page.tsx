"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Heart, Thermometer, Wind, Droplets, User, AlertTriangle, MessageSquare, Send, DollarSign, FileText } from "lucide-react";
import { initialPatients, type Patient } from "@/lib/mock-data";
import { VitalCard } from "@/components/nurse/VitalCard";
import { Waveform } from "@/components/nurse/Waveform";
import { CriticalAlertModal } from "@/components/nurse/CriticalAlertModal";
import { DischargeModal } from "@/components/nurse/DischargeModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVitalSimulation } from "@/hooks/use-vital-simulation";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function PatientMonitor({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const initialPatient = initialPatients.find((p) => p.id === unwrappedParams.id);

    if (!initialPatient) return <div className="p-8 text-center">Patient not found</div>;

    const { patient, history, updateStatus } = useVitalSimulation(initialPatient);

    // Local state for modals/UI logic
    const [showCriticalModal, setShowCriticalModal] = useState(false);
    const [isEscalating, setIsEscalating] = useState(false);
    const [escalationStatus, setEscalationStatus] = useState<"idle" | "sending" | "sent">("idle");
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState("");

    // Modals State
    const [dischargeOpen, setDischargeOpen] = useState(false);

    // Watch for critical status changes to trigger modal
    useEffect(() => {
        if (patient.status === "Critical" && !showCriticalModal) {
            setShowCriticalModal(true);
        }
    }, [patient.status]);

    const handleEscalate = async () => {
        setIsEscalating(true);
        setEscalationStatus("sending");

        // Simulate network delay for sending message
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setEscalationStatus("sent");
        setIsEscalating(false);

        // 1. Simulate Message Sent
        toast.success(`Emergency Alert sent to ${patient.assignedDoctor}`, {
            description: "Message delivered. Initiating call..."
        });

        // 2. Initiate Phone Call
        // In a real app, this would use the doctor's real number
        const phoneNumber = patient.doctorPhone || "911";

        // Small delay to let the user see the "Sent" state before the browser handles the tel link
        setTimeout(() => {
            window.location.href = `tel:${phoneNumber}`;
        }, 500);

        // Auto close modal after a moment
        setTimeout(() => {
            setShowCriticalModal(false);
            setEscalationStatus("idle");
        }, 2500);
    };

    const handleAcknowledge = () => {
        setShowCriticalModal(false);
        setEscalationStatus("idle");
        updateStatus("Warning");
        toast.info("Alert Acknowledged", {
            description: "Patient marked as 'Under Care'"
        });
    };

    const triggerCritical = () => {
        updateStatus("Critical");
        toast.warning("Simulating Critical Event...");
    };

    const handleSendMessage = () => {
        setMessageOpen(false);
        toast.success("Message Sent", {
            description: `Dr. ${patient.assignedDoctor} will be notified.`
        });
        setMessageText("");
    };

    // --- New Feature Handlers ---

    const handleRequestDischarge = (reason: string) => {
        updateStatus("Pending Discharge");
        toast.info("Discharge Requested", {
            description: "Waiting for Doctor's approval..."
        });

        // Simulate Doctor Response
        setTimeout(() => {
            const approved = Math.random() > 0.2; // 80% chance of approval
            if (approved) {
                updateStatus("Discharged");
                toast.success("Discharge Approved", {
                    description: `Patient ${patient.name} has been discharged.`
                });
            } else {
                updateStatus("Stable"); // Revert
                toast.error("Discharge Rejected", {
                    description: "Doctor requires further monitoring."
                });
            }
        }, 3000);
    };

    return (
        <div className={`min-h-screen bg-slate-50 p-4 pb-24 transition-colors duration-1000 ${patient.status === 'Critical' ? 'bg-red-50/50' : ''}`}>
            {/* Simulation Wrapper for Critical Alert */}
            {showCriticalModal && (
                <CriticalAlertModal
                    patientName={patient.name}
                    onAcknowledge={handleAcknowledge}
                    onEscalate={handleEscalate}
                    isEscalating={isEscalating}
                    doctorName={patient.assignedDoctor}
                    escalationStatus={escalationStatus}
                />
            )}

            <DischargeModal
                open={dischargeOpen}
                onOpenChange={setDischargeOpen}
                onConfirm={handleRequestDischarge}
                patientName={patient.name}
            />

            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/nurse/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {patient.name}
                            <Badge variant={patient.status === "Stable" ? "default" : patient.status === "Warning" ? "secondary" : "destructive"} className={
                                patient.status === "Warning" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                                    patient.status === "Pending Discharge" ? "bg-orange-100 text-orange-800 border-orange-200" :
                                        patient.status === "Discharged" ? "bg-green-100 text-green-800 border-green-200" : ""
                            }>
                                {patient.status}
                            </Badge>
                        </h1>
                        <p className="text-slate-500 text-sm">
                            ID: {patient.id} • {patient.ward} • Bed {patient.bed} • {patient.gender}, {patient.age}y
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => setDischargeOpen(true)}
                        disabled={patient.status === "Discharged" || patient.status === "Pending Discharge" || patient.status === "Critical"}
                    >
                        <FileText className="w-4 h-4" /> Discharge
                    </Button>

                    <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2" disabled={patient.status === "Discharged"}>
                                <MessageSquare className="w-4 h-4" /> Message Doctor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Message Dr. {patient.assignedDoctor}</DialogTitle>
                                <DialogDescription>
                                    Send a quick note or update regarding patient {patient.name}.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 py-4">
                                <Label>Message</Label>
                                <Textarea
                                    placeholder="Type your message here..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                                    <Send className="w-4 h-4 mr-2" /> Send Message
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={triggerCritical}
                        disabled={patient.status === "Discharged"}
                    >
                        Simulate Emergency
                    </Button>
                </div>
            </header>

            {/* Vitals Grid */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-opacity duration-500 ${patient.status === 'Discharged' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <VitalCard
                    title="Heart Rate"
                    value={Math.round(patient.vitals.heartRate)}
                    unit="bpm"
                    icon={Heart}
                    status={patient.vitals.heartRate > 100 || patient.vitals.heartRate < 60 ? "Warning" : "Normal"}
                />
                <VitalCard
                    title="Blood Pressure"
                    value={`${Math.round(patient.vitals.bloodPressureSys)}/${Math.round(patient.vitals.bloodPressureDia)}`}
                    unit="mmHg"
                    icon={Activity}
                    status={patient.vitals.bloodPressureSys > 140 ? "Warning" : "Normal"}
                />
                <VitalCard
                    title="SpO2"
                    value={Math.round(patient.vitals.spo2)}
                    unit="%"
                    icon={Droplets}
                    status={patient.vitals.spo2 < 95 ? "Warning" : "Normal"}
                />
                <VitalCard
                    title="Body Temp"
                    value={patient.vitals.temperature.toFixed(1)}
                    unit="°C"
                    icon={Thermometer}
                    status={patient.vitals.temperature > 37.5 ? "Warning" : "Normal"}
                />
            </div>

            {/* Waveforms Area */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 h-[300px] transition-opacity duration-500 ${patient.status === 'Discharged' ? 'opacity-25 pointer-events-none' : ''}`}>
                <Waveform
                    title="ECG Lead II"
                    color="#ef4444" // Red for Heart
                    type="ecg"
                    frequency={patient.vitals.heartRate}
                />
                <Waveform
                    title="Pleth (SpO2)"
                    color="#3b82f6" // Blue for SpO2
                    type="spo2"
                    frequency={patient.vitals.heartRate} // Usually matches pulse
                />
            </div>

            {patient.status === 'Discharged' && (
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="bg-green-100 border-2 border-green-500 text-green-800 px-8 py-4 rounded-xl shadow-2xl transform rotate-[-10deg] animate-in zoom-in duration-500">
                        <h2 className="text-4xl font-black uppercase tracking-widest border-4 border-green-800 p-4 rounded-lg">
                            Discharged
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
}
