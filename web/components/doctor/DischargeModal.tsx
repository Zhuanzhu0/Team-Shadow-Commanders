"use strict";
import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { Patient } from '../../types/doctor';

interface DischargeModalProps {
    patient: Patient;
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: (reason: string) => void;
}

export function DischargeModal({ patient, isOpen, onClose, onApprove, onReject }: DischargeModalProps) {
    const [rejectReason, setRejectReason] = useState('');
    const [view, setView] = useState<'main' | 'reject'>('main');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {view === 'reject' ? 'Reject Discharge' : 'Discharge Request'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {view === 'main' ? (
                        <>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">{patient.name}</h4>
                                    <p className="text-sm text-slate-500">ID: {patient.id} • Bed: {patient.bedNumber}</p>
                                    <p className="mt-2 text-slate-600">
                                        Nurse has requested discharge for this patient. Please review latest vitals and reports before approving.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setView('reject')}
                                    className="flex-1 py-2.5 px-4 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={onApprove}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Approve Discharge
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Reason for Rejection
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px] mb-4"
                                placeholder="e.g., Patient vitals unstable, further observation required..."
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setView('main')}
                                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => onReject(rejectReason)}
                                    disabled={!rejectReason.trim()}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
