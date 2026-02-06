"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";

export const Navbar = () => {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navItems = [
        { name: 'Analysis', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Patients', path: '/patients' },
        { name: 'Settings', path: '/settings' },
    ];

    return (
        <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/5 bg-app-bg/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/30 transition-colors">
                        <Zap size={18} fill="currentColor" />
                    </div>
                    <span className="font-semibold tracking-tight text-white text-lg">NeuroScreen<span className="text-primary-500">.ai</span></span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2">
                        {session && navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="relative px-4 py-2 text-sm font-medium transition-colors"
                                >
                                    <span className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-white/5 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="w-px h-6 bg-white/10 hidden md:block" />

                    {status === 'loading' ? (
                        <div className="w-24 h-9 bg-white/5 animate-pulse rounded-full" />
                    ) : session ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=0ea5e9&color=fff`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border border-white/10"
                                />
                                <div className="text-left hidden sm:block">
                                    <p className="text-xs font-medium text-white leading-none">{session.user?.name}</p>
                                    <p className="text-[10px] text-slate-500 leading-none mt-1">{session.user?.email}</p>
                                </div>
                                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <>
                                        {/* Backdrop to close dropdown on outside click */}
                                        <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-white/5 mb-1 sm:hidden">
                                                <p className="text-xs font-medium text-white">{session.user?.name}</p>
                                                <p className="text-[10px] text-slate-500">{session.user?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => signOut({ callbackUrl: "/" })}
                                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5 hover:text-red-300 flex items-center gap-2 transition-colors relative z-50"
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium text-white transition-all flex items-center gap-2"
                        >
                            <LogIn size={16} /> Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};
