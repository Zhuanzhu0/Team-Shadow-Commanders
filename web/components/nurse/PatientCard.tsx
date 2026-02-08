import Link from "next/link";
import { Activity, AlertTriangle, Clock, User } from "lucide-react";
import { type Patient } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PatientCardProps {
    patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
    const statusColor =
        patient.status === "Stable"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-transparent"
            : patient.status === "Warning"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-transparent animate-pulse"
                : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-transparent animate-pulse";

    const borderColor =
        patient.status === "Stable"
            ? "border-l-emerald-500"
            : patient.status === "Warning"
                ? "border-l-amber-500"
                : "border-l-rose-500";

    return (
        <Link href={`/nurse/patient/${patient.id}`}>
            <Card className={`hover:shadow-lg hover:shadow-primary/5 transition-all border-l-4 ${borderColor}`}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-foreground">{patient.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="w-3 h-3" /> {patient.age}y • {patient.gender}
                        </span>
                    </div>
                    <Badge className={`${statusColor} hover:${statusColor} border`}>
                        {patient.status}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Ward/Bed</span>
                            <span className="font-medium text-foreground">
                                {patient.ward} - {patient.bed}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-muted-foreground text-xs">HR / SpO2</span>
                            <span className="font-medium flex items-center gap-1 text-foreground">
                                <Activity className="w-3 h-3 text-muted-foreground" />
                                {patient.vitals.heartRate} / {patient.vitals.spo2}%
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-2 border-t bg-muted/50 flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Updated now
                    </div>
                    {patient.alerts.length > 0 && (
                        <div className="flex items-center gap-1 text-destructive font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            {patient.alerts.length} Alert(s)
                        </div>
                    )}
                </CardFooter>
            </Card>
        </Link>
    );
}
