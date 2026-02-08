"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileText, LayoutDashboard, LogOut, Pill, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "/patient/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/patient/medications", label: "Medications", icon: Pill },
    { href: "/patient/reports", label: "Reports", icon: FileText },
];

export function PatientSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r bg-white transition-transform sm:translate-x-0">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-5 flex items-center pl-2.5 gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        PulseGuard
                    </span>
                </div>
                <ul className="space-y-2 font-medium">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`group flex items-center rounded-lg p-2 ${isActive
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    <item.icon
                                        className={`h-5 w-5 transition duration-75 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900"
                                            }`}
                                    />
                                    <span className="ml-3">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="mt-auto border-t border-slate-200 pt-4 space-y-2">
                    <Link
                        href="#"
                        className="group flex items-center rounded-lg p-2 text-slate-900 hover:bg-slate-100"
                    >
                        <Settings className="h-5 w-5 text-slate-500 transition duration-75 group-hover:text-slate-900" />
                        <span className="ml-3">Settings</span>
                    </Link>
                    <Link
                        href="/patient/login"
                        className="group flex items-center rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5 text-red-500 transition duration-75 group-hover:text-red-700" />
                        <span className="ml-3">Sign Out</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
