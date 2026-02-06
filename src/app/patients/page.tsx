"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Search, Filter, MoreVertical, FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const patients = [
    { id: "PT-001", name: "Eleanor Rigby", age: 72, risk: "High", lastScan: "2024-03-10", status: "AD" },
    { id: "PT-002", name: "John Doe", age: 65, risk: "Moderate", lastScan: "2024-03-08", status: "MCI" },
    { id: "PT-003", name: "Sarah Connor", age: 58, risk: "Low", lastScan: "2024-03-01", status: "CN" },
    { id: "PT-004", name: "Bruce Wayne", age: 45, risk: "Low", lastScan: "2024-02-28", status: "CN" },
    { id: "PT-005", name: "Clark Kent", age: 80, risk: "High", lastScan: "2024-02-25", status: "AD" },
    { id: "PT-006", name: "Diana Prince", age: 60, risk: "Moderate", lastScan: "2024-02-20", status: "MCI" },
];

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        AD: "bg-red-500/10 text-red-400 border-red-500/20",
        MCI: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        CN: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status as keyof typeof styles]}`}>
            {status}
        </span>
    );
};

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-app-bg pt-28 pb-12 px-6">
            <Navbar />

            <main className="max-w-7xl mx-auto space-y-8">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold text-white mb-2"
                        >
                            Patient Registry
                        </motion.h1>
                        <p className="text-slate-400">Manage patient records and neurological history.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-surface border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 w-[250px]"
                            />
                        </div>
                        <button className="p-2.5 bg-surface border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                            <Filter size={18} />
                        </button>
                        <button className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-primary-500/20">
                            Add Patient
                        </button>
                    </div>
                </div>

                {/* Patients Table */}
                <div className="bg-surface border border-white/5 rounded-3xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-6 font-medium">Patient Details</th>
                                <th className="p-6 font-medium">Age</th>
                                <th className="p-6 font-medium">Diagnosis Status</th>
                                <th className="p-6 font-medium">Risk Factor</th>
                                <th className="p-6 font-medium">Last Scan</th>
                                <th className="p-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient, idx) => (
                                <motion.tr
                                    key={patient.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">{patient.name}</div>
                                                <div className="text-xs text-slate-500 font-mono">{patient.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-300">{patient.age}</td>
                                    <td className="p-6">
                                        <StatusBadge status={patient.status} />
                                    </td>
                                    <td className="p-6">
                                        <span className={`text-sm font-medium ${patient.risk === 'High' ? 'text-red-400' :
                                                patient.risk === 'Moderate' ? 'text-orange-400' : 'text-slate-400'
                                            }`}>
                                            {patient.risk}
                                        </span>
                                    </td>
                                    <td className="p-6 text-slate-400 text-sm">{patient.lastScan}</td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/10 rounded-lg hover:text-primary-400 transition-colors">
                                                <FileText size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg hover:text-white transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredPatients.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            No patients found matching "{searchTerm}"
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
