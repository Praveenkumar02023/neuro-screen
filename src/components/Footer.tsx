"use client";

import React from "react";
import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Heart } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-app-bg border-t border-white/5 py-16 px-6 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <span className="font-caveat font-bold tracking-tight text-white text-4xl">NeuroScreen<span className="text-primary-500">.ai</span></span>
                        </Link>
                        <p className="text-slate-500 leading-relaxed text-sm max-w-sm">
                            Pioneering the future of neurological diagnostics through advanced computer vision and machine learning.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div className="md:col-start-7 md:col-span-2 space-y-4">
                        <h4 className="text-white font-medium text-sm">Platform</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="/" className="hover:text-primary-400 transition-colors">Analysis Engine</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary-400 transition-colors">Clinical Dashboard</Link></li>
                            <li><Link href="/patients" className="hover:text-primary-400 transition-colors">Patient Records</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-white font-medium text-sm">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="/coming-soon" className="hover:text-primary-400 transition-colors">Documentation</Link></li>
                            <li><Link href="/coming-soon" className="hover:text-primary-400 transition-colors">API Reference</Link></li>
                            <li><Link href="/coming-soon" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-white font-medium text-sm">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="/coming-soon" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                            <li><Link href="/coming-soon" className="hover:text-primary-400 transition-colors">Contact</Link></li>
                            <li><Link href="/coming-soon" className="hover:text-primary-400 transition-colors">Partners</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-600 text-xs text-center md:text-left">
                        © 2026 NeuroScreen AI Inc. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github size={18} /></a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter size={18} /></a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
