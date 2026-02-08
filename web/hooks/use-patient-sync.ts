"use client";

import { useEffect, useRef, useState } from "react";
import { Patient } from "@/lib/mock-data";

type SyncMessage =
    | { type: "VITALS_UPDATE"; patientId: string; vitals: any }
    | { type: "MEDICATION_UPDATE"; patientId: string; medicationId: string; status: "taken" | "missed" | "upcoming" };

export function usePatientSync(currentPatientId?: string) {
    const channelRef = useRef<BroadcastChannel | null>(null);
    const [lastSync, setLastSync] = useState<number>(Date.now());
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize BroadcastChannel
        const channel = new BroadcastChannel("pulseguard-sync");
        channelRef.current = channel;
        setIsConnected(true);

        channel.onmessage = (event: MessageEvent<SyncMessage>) => {
            if (event.data.type === "VITALS_UPDATE") {
                if (currentPatientId && event.data.patientId === currentPatientId) {
                    setLastSync(Date.now());
                    // We can dispatch a custom event or let the component handle it
                    window.dispatchEvent(new CustomEvent("vital-sync", { detail: event.data.vitals }));
                }
            }
        };

        return () => {
            channel.close();
            setIsConnected(false);
        };
    }, [currentPatientId]);

    const broadcastVitals = (patientId: string, vitals: any) => {
        channelRef.current?.postMessage({
            type: "VITALS_UPDATE",
            patientId,
            vitals
        });
    };

    const broadcastMedicationUpdate = (patientId: string, medicationId: string, status: "taken" | "missed" | "upcoming") => {
        channelRef.current?.postMessage({
            type: "MEDICATION_UPDATE",
            patientId,
            medicationId,
            status
        });
    };

    return { isConnected, lastSync, broadcastVitals, broadcastMedicationUpdate };
}
