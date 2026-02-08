"use client";

import { useState } from "react";
import { initialPatients, Patient } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function MedicationsPage() {
    const [patient, setPatient] = useState<Patient>(initialPatients[0]);

    const handleTakeMedication = (medId: string) => {
        setPatient(prev => ({
            ...prev,
            medications: prev.medications.map(med =>
                med.id === medId ? { ...med, status: "taken" } : med
            )
        }));
        toast.success("Medication Recorded", {
            description: "Great job keeping up with your schedule!"
        });
    };

    const categories = ["Morning", "Afternoon", "Evening", "Night"];

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Medication Schedule</h1>
                <p className="text-slate-500 mt-1">Track your daily prescriptions</p>
            </div>

            <div className="grid gap-6">
                {categories.map((timeOfDay) => {
                    const meds = patient.medications.filter(m => m.time === timeOfDay);
                    if (meds.length === 0) return null;

                    return (
                        <div key={timeOfDay}>
                            <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                {timeOfDay === "Morning" && "🌅"}
                                {timeOfDay === "Afternoon" && "☀️"}
                                {timeOfDay === "Evening" && "🌇"}
                                {timeOfDay === "Night" && "🌙"}
                                {timeOfDay}
                            </h3>
                            <div className="grid gap-4">
                                {meds.map(med => (
                                    <Card key={med.id} className={`transition-all ${med.status === 'taken' ? 'opacity-60 bg-slate-50' : 'bg-white border-blue-100 shadow-sm'}`}>
                                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-full ${med.status === 'taken' ? 'bg-green-100 text-green-600' :
                                                        med.status === 'missed' ? 'bg-red-100 text-red-600' :
                                                            'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {med.status === 'taken' ? <Check className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`text-lg font-bold ${med.status === 'taken' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                                            {med.name}
                                                        </h4>
                                                        <Badge variant="outline">{med.dosage}</Badge>
                                                    </div>
                                                    <p className="text-slate-500">{med.instructions}</p>
                                                </div>
                                            </div>

                                            {med.status === 'upcoming' && (
                                                <Button onClick={() => handleTakeMedication(med.id)} className="bg-blue-600 hover:bg-blue-700 sm:w-auto w-full">
                                                    Mark as Taken
                                                </Button>
                                            )}
                                            {med.status === 'taken' && (
                                                <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                                                    <Check className="h-4 w-4" /> Taken
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
