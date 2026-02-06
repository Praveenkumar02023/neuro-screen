"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import {
    Users,
    Activity,
    Brain,
    Calendar,
    ChevronRight,
    MoreHorizontal,
    ArrowUpRight,
    Clock,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

// --- Types ---
interface DataPoint {
    date: string;
    scans: number;
    detections: number;
}

// --- Mock Data Generator ---
const generateHistoricData = (): DataPoint[] => {
    const data = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        data.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            scans: Math.floor(Math.random() * 20) + 40, // Random between 40-60
            detections: Math.floor(Math.random() * 10) + 5,
        });
    }
    return data;
};

// --- Components ---

const StatCard = ({ title, value, subtext, icon: Icon, trend, color }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-6 rounded-3xl bg-surface border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all hover:bg-white/[0.02]"
    >
        <div className="absolute top-0 right-0 p-8 bg-gradient-to-br from-white/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-white transition-colors`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trend > 0 ? <ArrowUpRight size={12} /> : null}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-xs text-slate-500 mt-4 font-mono">{subtext}</p>
    </motion.div>
);

const ActivityItem = ({ title, time, type, status }: any) => (
    <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer group"
    >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 ${type === 'scan' ? 'bg-blue-500/10 text-blue-400' :
                type === 'alert' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-emerald-500/10 text-emerald-400'
            }`}>
            {type === 'scan' ? <Brain size={18} /> : type === 'alert' ? <AlertCircle size={18} /> : <Users size={18} />}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate pr-4 group-hover:text-primary-400 transition-colors">{title}</h4>
            <div className="flex items-center gap-2 mt-1">
                <Clock size={10} className="text-slate-500" />
                <p className="text-xs text-slate-500">{time}</p>
            </div>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider ${status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                status === 'Processing' ? 'bg-yellow-500/10 text-yellow-400 animate-pulse' :
                    'bg-slate-700 text-slate-400'
            }`}>
            {status}
        </div>
    </motion.div>
);

// --- Custom SVG Line Chart ---
const LiveChart = ({ data }: { data: DataPoint[] }) => {
    const maxVal = Math.max(...data.map(d => d.scans));
    const width = 100;
    const height = 100; // viewBox units

    // Calculate path points
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d.scans / (maxVal * 1.2)) * height;
        return `${x},${y}`;
    }).join(' ');

    const areaPath = `${points} ${width},${height} 0,${height}`;

    return (
        <div className="w-full h-full relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area Fill */}
                <motion.path
                    d={`M ${areaPath}`}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Line Stroke */}
                <motion.polyline
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    points={points}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {/* Tooltip Hover Overlay (Simplified) */}
            <div className="absolute inset-0 flex items-end justify-between pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                {/* Logic for interactive tooltips would usually go here */}
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const { data: session } = useSession();
    const [chartData, setChartData] = useState<DataPoint[]>([]);
    const [recentActivity, setRecentActivity] = useState([
        { title: "Review: Patient #8832 (M. Johnson)", time: "Just now", type: "scan", status: "Processing" },
        { title: "Alert: Probability High (98%)", time: "12 mins ago", type: "alert", status: "Attention" },
        { title: "New Consult: Dr. Richards", time: "45 mins ago", type: "user", status: "Completed" },
        { title: "Batch Analysis: Group A", time: "2 hours ago", type: "scan", status: "Completed" },
    ]);

    // Initial Data Load
    useEffect(() => {
        setChartData(generateHistoricData());
    }, []);

    // Simulate Live Updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Add a new activity item
            const newActivities = [
                {
                    title: `Processing Scan #${Math.floor(Math.random() * 9000) + 1000}`,
                    time: "Live Update",
                    type: "scan",
                    status: "Processing"
                },
                ...recentActivity.slice(0, 3)
            ];
            setRecentActivity(newActivities);

            // Update chart data slightly to "breathe"
            setChartData(prev => {
                const newData = [...prev];
                newData[newData.length - 1].scans = Math.floor(Math.random() * 20) + 40;
                return newData;
            });

        }, 8000); // Calls every 8 seconds

        return () => clearInterval(interval);
    }, [recentActivity]);

    return (
        <div className="min-h-screen bg-app-bg pt-28 pb-12 px-6">
            <Navbar />

            <main className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold text-white mb-2"
                        >
                            Clinical Dashboard
                        </motion.h1>
                        <p className="text-slate-400">Live overview for {session?.user?.name || 'Dr. Practitioner'}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        SYSTEM ONLINE
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Today's Scans"
                        value="42"
                        subtext="↑ 12 from yesterday"
                        icon={Brain}
                        trend={8.4}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Critical Alerts"
                        value="3"
                        subtext="Requiring immediate review"
                        icon={Activity}
                        trend={-2.1}
                        color="bg-orange-500"
                    />
                    <StatCard
                        title="Success Rate"
                        value="99.8%"
                        subtext="Model accuracy (24h)"
                        icon={ArrowUpRight}
                        trend={0.2}
                        color="bg-emerald-500"
                    />
                    <StatCard
                        title="Active Patients"
                        value="1,204"
                        subtext="Total database records"
                        icon={Users}
                        trend={1.5}
                        color="bg-purple-500"
                    />
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">

                    {/* Live Chart Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 p-8 rounded-[2.5rem] bg-surface border border-white/5 flex flex-col relative overflow-hidden group"
                    >
                        {/* Background Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none opacity-20">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full h-px bg-white/10" />
                            ))}
                        </div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white">Diagnostic Throughput</h3>
                                <p className="text-sm text-slate-500">Scans proccessed over last 30 days</p>
                            </div>
                            <div className="flex gap-2">
                                {['Daily', 'Weekly', 'Monthly'].map(t => (
                                    <button key={t} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${t === 'Daily' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart Render */}
                        <div className="flex-1 w-full min-h-0">
                            {chartData.length > 0 && <LiveChart data={chartData} />}
                        </div>
                    </motion.div>

                    {/* Live Activity Feed */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 rounded-[2.5rem] bg-surface border border-white/5 flex flex-col h-full overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                Live Activity
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </h3>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 -mr-2">
                            <AnimatePresence mode="popLayout">
                                {recentActivity.map((item, i) => (
                                    <ActivityItem key={i} {...item} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                </div>

            </main>
        </div>
    );
}
