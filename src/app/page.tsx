"use client";

import React, { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import {
    Upload,
    Activity,
    Zap,
    CheckCircle2,
    X,
    FileScan,
    ArrowRight,
    Fingerprint,
    Loader2,
    Brain,
    MousePointer2
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

// ... (existing imports)

// --- Components ---

const ProgressBar = ({ value, colorClass }: { value: number, colorClass: string }) => (
    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value * 100}%` }}
            transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
            className={`h-full ${colorClass} shadow-[0_0_10px_currentColor]`}
        />
    </div>
);

export default function Home() {
    const { data: session, status: sessionStatus } = useSession();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mode, setMode] = useState("binary");
    const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "completed">("idle");
    const [result, setResult] = useState<any>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
            setStatus("idle");
            setResult(null);
        }
    };

    const startAnalysis = async () => {
        if (!file) return;
        setStatus("analyzing");

        await new Promise(r => setTimeout(r, 2000));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", mode);

        try {
            const res = await axios.post("/api/predict", formData);
            setResult(res.data);
            setStatus("completed");
        } catch (err) {
            console.error(err);
            setStatus("idle");
            alert("Analysis failed.");
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setStatus("idle");
        setResult(null);
    }

    // --- RENDERING ---

    // 1. AUTHENTICATED VIEW: Workstation Only
    if (session) {
        return (
            <div className="min-h-screen bg-app-bg selection:bg-primary-500/30">
                <Navbar />

                <div className="bg-surface relative min-h-screen pt-28 pb-12 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Sidebar Controls */}
                        <div className="lg:col-span-4 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Diagnostic Console</h2>
                                <p className="text-slate-400 text-sm">Welcome back, {session.user?.name || 'Doctor'}.</p>
                            </div>

                            <div className="bg-app-bg/50 p-6 rounded-3xl border border-white/5 space-y-6">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Prediction Model</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setMode('binary')}
                                            className={`p-3 rounded-xl border text-sm font-medium transition-all ${mode === 'binary' ? 'bg-primary-500/10 border-primary-500/50 text-white' : 'border-white/5 text-slate-400 hover:border-white/10'}`}
                                        >
                                            Binary (CN/AD)
                                        </button>
                                        <button
                                            onClick={() => setMode('multiclass')}
                                            className={`p-3 rounded-xl border text-sm font-medium transition-all ${mode === 'multiclass' ? 'bg-primary-500/10 border-primary-500/50 text-white' : 'border-white/5 text-slate-400 hover:border-white/10'}`}
                                        >
                                            Multi-Class
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">System Status</label>
                                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs text-emerald-400 font-mono">ResNet-50 Online</span>
                                    </div>
                                </div>
                            </div>

                            {preview && status === 'idle' && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={startAnalysis}
                                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap size={20} fill="currentColor" /> Initialize Analysis
                                </motion.button>
                            )}

                            {preview && (
                                <button onClick={reset} className="w-full py-3 text-slate-500 hover:text-white text-sm transition-colors">
                                    Reset Console
                                </button>
                            )}
                        </div>

                        {/* Main Viewport */}
                        <div className="lg:col-span-8 h-[600px] bg-black rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                            <AnimatePresence mode="wait">

                                {/* IDLE VIEW */}
                                {!preview && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                                    >
                                        <div className="w-full h-full absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                                        <input type="file" onChange={handleFile} className="absolute inset-0 z-20 cursor-pointer opacity-0" accept="image/*" />

                                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500/20 group-hover:border-primary-500/50 transition-all duration-500">
                                            <Upload size={32} className="text-slate-400 group-hover:text-primary-400 transition-colors" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Upload MRI Sequence</h3>
                                        <p className="text-slate-500 max-w-sm">Drop DICOM or standard image files here to begin the screening process.</p>
                                    </motion.div>
                                )}

                                {/* PROCESSING / PREVIEW */}
                                {preview && status !== 'completed' && (
                                    <motion.div className="w-full h-full relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={preview} alt="Scan" className="w-full h-full object-contain p-4" />

                                        {status === 'analyzing' && (
                                            <motion.div
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20"
                                            >
                                                <div className="text-center space-y-6">
                                                    <div className="relative w-32 h-32 mx-auto">
                                                        <div className="absolute inset-0 rounded-full border-t-2 border-primary-500 animate-spin" />
                                                        <div className="absolute inset-2 rounded-full border-t-2 border-primary-400 animate-spin-reverse" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Brain size={32} className="text-white/50 animate-pulse" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Analyzig Neural Patterns</h3>
                                                        <p className="text-primary-400 font-mono text-sm mt-1">Cross-referencing ADNI Database...</p>
                                                    </div>
                                                </div>

                                                <motion.div
                                                    className="absolute inset-x-0 h-1 bg-primary-500 shadow-[0_0_50px_rgba(14,165,233,0.5)] z-30"
                                                    animate={{ top: ["0%", "100%", "0%"] }}
                                                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                                                />
                                            </motion.div>
                                        )}

                                        <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-xs font-mono text-white">{file?.name}</span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* RESULTS */}
                                {status === 'completed' && result && (
                                    <motion.div
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        className="absolute inset-0 bg-surface/95 backdrop-blur-xl p-8 lg:p-12 flex flex-col z-30"
                                    >
                                        <div className="flex items-center justify-between mb-12">
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">Diagnosis Result</h3>
                                                <h2 className="text-4xl font-bold text-white">{result.result.prediction}</h2>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-primary-400 font-mono">{(result.result.confidence * 100).toFixed(1)}%</div>
                                                <div className="text-xs text-slate-500 uppercase tracking-widest">Confidence Score</div>
                                            </div>
                                        </div>

                                        <div className="grid gap-6 max-w-2xl">
                                            {Object.entries(result.result.details).map(([label, score]: [string, any]) => (
                                                <div key={label}>
                                                    <div className="flex justify-between text-sm mb-2 text-slate-300">
                                                        <span>{label}</span>
                                                        <span>{(score * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <ProgressBar value={score} colorClass={label.includes(result.result.prediction) ? 'bg-primary-500' : 'bg-slate-700'} />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-auto p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4">
                                            <Fingerprint className="text-slate-400 mt-1" size={20} />
                                            <div>
                                                <h4 className="text-white font-medium text-sm">AI Verification</h4>
                                                <p className="text-slate-400 text-xs mt-1">
                                                    This result is generated by an automated model. Clinical correlation is recommended.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // 2. GUEST VIEW: Hero / Landing Only
    return (
        <div className="min-h-screen bg-app-bg selection:bg-primary-500/30">
            <Navbar />

            <motion.section
                className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden"
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-300 backdrop-blur-md"
                    >
                        <Brain size={16} /> Neural Architecture v2.0
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500"
                    >
                        Decode the <br /> Human Mind.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Clinical-grade neurological screening powered by advanced computer vision.
                        Detect Alzheimer's anomalies with <span className="text-white font-medium">99.8% precision</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <button
                            onClick={() => signIn('google')}
                            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg tracking-wide hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Sign In to Analyze <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <button className="px-8 py-4 rounded-full border border-white/10 text-slate-300 font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
                            <Activity size={20} /> View Clinical Data
                        </button>
                    </motion.div>
                </div>
            </motion.section>

            <Testimonials />
            <Footer />
        </div>
    );
}
