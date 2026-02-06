"use client";

import React, { useState, useRef, useEffect } from "react";
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
    MousePointer2,
    Share2,
    Download,
    Scan,
    Maximize2,
    AlertCircle
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

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
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
            setStatus("idle");
            setResult(null);
        }
    };

    // Advanced Scanning Effect on Canvas
    useEffect(() => {
        if (preview && status === 'analyzing' && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.src = preview;
            img.onload = () => {
                canvasRef.current!.width = img.width;
                canvasRef.current!.height = img.height;

                let scanLine = 0;
                let direction = 1;

                const animate = () => {
                    if (status !== 'analyzing') return;
                    ctx.clearRect(0, 0, img.width, img.height);

                    // Draw the Scan Line (Bright and Glowing)
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = '#0ea5e9'; // Primary Blue
                    ctx.fillStyle = '#0ea5e9';
                    ctx.fillRect(0, scanLine, img.width, 3);
                    ctx.shadowBlur = 0;

                    // Draw a trailing gradient
                    const gradient = ctx.createLinearGradient(0, scanLine, 0, scanLine - (50 * direction));
                    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.5)');
                    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, scanLine - (50 * direction), img.width, 50 * direction);

                    // Move
                    scanLine += 8 * direction;

                    // Bounce
                    if (scanLine > img.height) direction = -1;
                    if (scanLine < 0) direction = 1;

                    requestAnimationFrame(animate);
                };
                animate();
            };
        }
    }, [preview, status]);

    const startAnalysis = async () => {
        if (!file) return;
        setStatus("analyzing");

        // Simulate a realistic analysis duration
        await new Promise(r => setTimeout(r, 4500));

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
            <div className="min-h-screen bg-app-bg text-white selection:bg-primary-500/30">
                <Navbar />


                <div className="bg-app-bg relative min-h-screen pt-28 pb-12 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN: Controls & Status */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Header Widget */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-[2rem] bg-surface border border-white/5"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">Analysis Console</h2>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    SYSTEM READY
                                </div>
                            </motion.div>

                            {/* Controls Widget */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-6 rounded-[2rem] bg-surface border border-white/5 space-y-6"
                            >
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 block">Select Model</label>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setMode('binary')}
                                            className={`p-4 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between group ${mode === 'binary' ? 'bg-primary-500/10 border-primary-500 text-white' : 'border-white/5 text-slate-400 hover:bg-white/5'}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <Activity size={18} className={mode === 'binary' ? 'text-primary-400' : 'text-slate-600'} />
                                                Standard Detection
                                            </span>
                                            {mode === 'binary' && <CheckCircle2 size={16} className="text-primary-400" />}
                                        </button>
                                        <button
                                            onClick={() => setMode('multiclass')}
                                            className={`p-4 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between group ${mode === 'multiclass' ? 'bg-primary-500/10 border-primary-500 text-white' : 'border-white/5 text-slate-400 hover:bg-white/5'}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <Brain size={18} className={mode === 'multiclass' ? 'text-primary-400' : 'text-slate-600'} />
                                                Multi-Class Granular
                                            </span>
                                            {mode === 'multiclass' && <CheckCircle2 size={16} className="text-primary-400" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Active Telemetry</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                            <div className="text-[10px] text-slate-500 uppercase mb-1">Latency</div>
                                            <div className="text-lg font-mono text-white">24<span className="text-xs text-slate-500 ml-1">ms</span></div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                            <div className="text-[10px] text-slate-500 uppercase mb-1">Confidence</div>
                                            <div className="text-lg font-mono text-emerald-400">99.8<span className="text-xs text-emerald-500/50 ml-1">%</span></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Action Button */}
                            <AnimatePresence>
                                {preview && status === 'idle' && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        onClick={startAnalysis}
                                        className="w-full py-5 bg-primary-500 hover:bg-primary-400 text-white rounded-[1.5rem] font-bold text-lg shadow-[0_8px_30px_rgb(14,165,233,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <Zap size={20} fill="currentColor" /> Initialize Analysis
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* RIGHT COLUMN: Viewport */}
                        <div className="lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-[650px] bg-surface rounded-[2.5rem] border border-white/5 relative overflow-hidden group"
                            >
                                {/* Grid Pattern */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

                                <AnimatePresence mode="wait">

                                    {/* STATE: Idle / Upload */}
                                    {!preview && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10"
                                        >
                                            <div className="relative group/btn cursor-pointer">
                                                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                                <div className="w-32 h-32 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 backdrop-blur-sm group-hover/btn:scale-105 transition-transform duration-500">
                                                    <Upload size={40} className="text-slate-400 group-hover/btn:text-white transition-colors" />
                                                </div>
                                                <input type="file" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/*" />
                                            </div>

                                            <h3 className="text-3xl font-light text-white mb-3">Upload MRI Scan</h3>
                                            <p className="text-slate-500 max-w-sm leading-relaxed">Drag & drop DICOM or standard image files here to begin the neural screening process.</p>
                                        </motion.div>
                                    )}

                                    {/* STATE: Preview / Analyzing */}
                                    {preview && status !== 'completed' && (
                                        <motion.div className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden">

                                            {/* Header Overlay */}
                                            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-30 bg-gradient-to-b from-black/80 to-transparent">
                                                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                                                    <div className={`w-2 h-2 rounded-full ${status === 'analyzing' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
                                                    <span className="text-xs font-mono text-slate-200">{file?.name}</span>
                                                </div>
                                                <button onClick={reset} className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                                                    <X size={20} />
                                                </button>
                                            </div>

                                            {/* The Image */}
                                            <div className="relative w-full h-full p-12 flex items-center justify-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={preview}
                                                    alt="Scan"
                                                    className={`max-w-full max-h-full object-contain transition-all duration-700 ${status === 'analyzing' ? 'opacity-30 blur-sm scale-95 grayscale' : 'opacity-100 scale-100 grayscale-0'}`}
                                                />
                                            </div>

                                            {/* Active Scan Canvas */}
                                            {status === 'analyzing' && (
                                                <canvas
                                                    ref={canvasRef}
                                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 mix-blend-screen"
                                                />
                                            )}

                                            {/* Analyzing Status Text */}
                                            {status === 'analyzing' && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
                                                >
                                                    <Loader2 className="animate-spin text-primary-400" size={32} />
                                                    <span className="text-primary-400 font-mono text-sm tracking-widest uppercase">Processing Neural Data...</span>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* STATE: Results Modal */}
                                    {status === 'completed' && result && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xl flex items-center justify-center p-8"
                                        >
                                            <motion.div
                                                initial={{ scale: 0.9, y: 20 }}
                                                animate={{ scale: 1, y: 0 }}
                                                className="w-full max-w-md bg-surface border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-black"
                                            >
                                                <div className={`p-8 ${result.result.prediction.includes('Demented') ? 'bg-red-500/10' : 'bg-emerald-500/10'} border-b border-white/5`}>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Diagnosis Complete</div>
                                                            <h2 className={`text-3xl font-bold ${result.result.prediction.includes('Demented') ? 'text-red-400' : 'text-emerald-400'}`}>
                                                                {result.result.prediction}
                                                            </h2>
                                                        </div>
                                                        <div className={`p-3 rounded-full ${result.result.prediction.includes('Demented') ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                            {result.result.prediction.includes('Demented') ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-8 space-y-6">
                                                    <div className="flex items-end justify-between">
                                                        <span className="text-sm text-slate-400">Confidence Score</span>
                                                        <span className="text-3xl font-mono text-white font-bold">{(result.result.confidence * 100).toFixed(1)}%</span>
                                                    </div>

                                                    <div className="h-px bg-white/5" />

                                                    <div className="space-y-4">
                                                        {Object.entries(result.result.details).map(([label, score]: [string, any]) => (
                                                            <div key={label} className="group">
                                                                <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide group-hover:text-white transition-colors">
                                                                    <span>{label}</span>
                                                                    <span>{(score * 100).toFixed(1)}%</span>
                                                                </div>
                                                                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${score * 100}%` }}
                                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                                        className={`h-full ${label === result.result.prediction ? 'bg-primary-500' : 'bg-slate-700'}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="pt-4 flex gap-3">
                                                        <button onClick={reset} className="flex-1 py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors">
                                                            New Analysis
                                                        </button>
                                                        <button className="p-3.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                                                            <Download size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </motion.div>
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
        </div>
    );
}
