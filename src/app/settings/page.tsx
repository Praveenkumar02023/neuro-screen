"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Save, Bell, Shield, Sliders, Database, Smartphone, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const SettingSection = ({ title, icon: Icon, children }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-surface border border-white/5 rounded-3xl p-8 mb-8"
    >
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
            <div className="p-2.5 bg-primary-500/10 rounded-xl text-primary-400">
                <Icon size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </motion.div>
);

const Toggle = ({ label, desc }: { label: string, desc: string }) => (
    <div className="flex items-center justify-between">
        <div>
            <h4 className="font-medium text-slate-200">{label}</h4>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-700/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
    </div>
);

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-app-bg pt-28 pb-12 px-6">
            <Navbar />

            <main className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-bold text-white mb-2"
                    >
                        Settings & Preferences
                    </motion.h1>
                    <p className="text-slate-400">Configure model parameters and application defaults.</p>
                </header>

                <SettingSection title="Model Configuration" icon={Sliders}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Sensitivity Threshold (0.1 - 0.9)</label>
                            <input type="range" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500" min="1" max="100" />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Low Sensitivity</span>
                                <span>High Sensitivity</span>
                            </div>
                        </div>
                        <Toggle label="Auto-Enhance MRI" desc="Automatically apply contrast enhancement filters before analysis." />
                        <Toggle label="Deep Ensemble" desc="Use ensemble voting for higher accuracy (Increases latency)." />
                    </div>
                </SettingSection>

                <SettingSection title="Notifications" icon={Bell}>
                    <Toggle label="Email Alerts" desc="Receive comprehensive reports via email on completion." />
                    <Toggle label="Browser Notifications" desc="Get notified when background processing finishes." />
                </SettingSection>

                <SettingSection title="Data & Privacy" icon={Shield}>
                    <Toggle label="Local-Only Processing" desc="Ensure scan data never leaves this machine (Requires GPU)." />
                    <div className="pt-4">
                        <button className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors flex items-center gap-2">
                            <Database size={16} /> Clear Local Cache
                        </button>
                    </div>
                </SettingSection>

                <div className="flex justify-end gap-4 mt-8">
                    <button className="px-8 py-3 rounded-xl text-slate-300 font-medium hover:text-white transition-colors">
                        Discard Changes
                    </button>
                    <button className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                        <Save size={18} /> Save Settings
                    </button>
                </div>

            </main>
        </div>
    );
}
