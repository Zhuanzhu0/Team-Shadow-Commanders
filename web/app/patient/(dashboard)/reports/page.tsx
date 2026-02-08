"use client";

import { useState } from "react";
import { initialPatients, Patient } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Calendar, User } from "lucide-react";

export default function ReportsPage() {
    const [patient] = useState<Patient>(initialPatients[0]); // Default to p1

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Medical Reports</h1>
                <p className="text-slate-500 mt-1">View and download your test results</p>
            </div>

            <div className="grid gap-4">
                {patient.reports.length > 0 ? (
                    patient.reports.map((report) => (
                        <Card key={report.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-slate-100 p-3 rounded-lg text-slate-600">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900">{report.title}</h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> {report.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" /> {report.doctor}
                                            </span>
                                            <Badge variant="secondary" className="text-xs">
                                                {report.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Button variant="outline" className="flex-1 sm:flex-none">
                                        <Eye className="mr-2 h-4 w-4" /> Preview
                                    </Button>
                                    <Button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700">
                                        <Download className="mr-2 h-4 w-4" /> Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-200">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No reports available</h3>
                        <p className="text-slate-500">New reports will appear here when ready.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
