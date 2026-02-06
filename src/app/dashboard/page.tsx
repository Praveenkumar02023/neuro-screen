"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import {
    Users,
    Activity,
    Brain,
    TrendingUp,
    Calendar,
    ChevronRight,
    MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-surface border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl text-primary-400 group-hover:bg-primary-500/10 transition-colors">
                <Icon size={24} />
            </div>
            {trend && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-xs text-slate-500 mt-4">{subtext}</p>
    </motion.div>
);

const ActivityItem = ({ title, time, type }: any) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 ${type === 'scan' ? 'bg-blue-500/10 text-blue-400' :
                type === 'alert' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
            {type === 'scan' ? <Brain size={16} /> : type === 'alert' ? <Activity size={16} /> : <Users size={16} />}
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">{title}</h4>
            <p className="text-xs text-slate-500">{time}</p>
        </div>
        <ChevronRight size={16} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
    </div>
);

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-app-bg pt-28 pb-12 px-6">
            <Navbar />

            <main className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <header>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-bold text-white mb-2"
                    >
                        Dashboard
                    </motion.h1>
                    <p className="text-slate-400">Welcome back, Dr. Smith. Here's your daily overview.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Scans"
                        value="1,284"
                        subtext="Lifetime analysis count"
                        icon={Brain}
                        trend={12}
                    />
                    <StatCard
                        title="AD Detected"
                        value="342"
                        subtext="Positive Alzheimer's cases"
                        icon={Activity}
                        trend={5}
                    />
                    <StatCard
                        title="Pending Review"
                        value="18"
                        subtext="Scans requiring verification"
                        icon={Calendar}
                        trend={-2}
                    />
                    <StatCard
                        title="Active Patients"
                        value="892"
                        subtext="Currently under monitoring"
                        icon={Users}
                        trend={8}
                    />
                </div>

                {/* Recent Activity & Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Chart Area (Mock Visual) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 p-8 rounded-[2.5rem] bg-surface border border-white/5"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold text-white">Analysis Trends</h3>
                            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-slate-300 outline-none hover:bg-white/10 transition-colors">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>

                        {/* CSS Chart Mockup */}
                        <div className="h-[300px] flex items-end justify-between gap-2 px-4 pb-2">
                            {[40, 65, 45, 80, 55, 70, 45, 60, 75, 50, 65, 85].map((h, i) => (
                                <div key={i} className="w-full bg-slate-800/50 rounded-t-lg relative group overflow-hidden">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.05 }}
                                        className="absolute bottom-0 inset-x-0 bg-primary-500/20 group-hover:bg-primary-500/40 transition-colors"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 h-1 bg-primary-500/50" />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-slate-500 font-mono">
                            <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                            <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
                        </div>
                    </motion.div>

                    {/* Recent Activity Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 rounded-[2.5rem] bg-surface border border-white/5 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                            <button className="text-slate-400 hover:text-white"><MoreHorizontal size={20} /></button>
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                            <ActivityItem title="MRI Upload: Patient #8832" time="2 mins ago" type="scan" />
                            <ActivityItem title="High Risk Alert: AD Detected" time="15 mins ago" type="alert" />
                            <ActivityItem title="New Patient Registered" time="1 hour ago" type="user" />
                            <ActivityItem title="Report Downloaded" time="3 hours ago" type="scan" />
                            <ActivityItem title="System Update" time="Yesterday" type="alert" />
                        </div>

                        <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
                            View All History
                        </button>
                    </motion.div>

                </div>

            </main>
        </div>
    );
}
