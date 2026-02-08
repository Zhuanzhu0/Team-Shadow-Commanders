"use client";

import { PatientSidebar } from "@/components/patient/Sidebar";

export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <PatientSidebar />
            <div className="p-4 sm:ml-64">
                <main className="mx-auto max-w-5xl pt-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
