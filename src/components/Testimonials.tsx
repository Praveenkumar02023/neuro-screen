"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
    {
        content: "The accuracy for early-stage detection is remarkable. It has become an essential second opinion in our diagnostic workflow.",
        author: "Dr. Sarah Chen",
        role: "Neurologist, Metro General",
        rating: 5
    },
    {
        content: "Clean, fast, and clinically relevant. The attention heatmaps provide exactly the explainability we need to trust the AI's output.",
        author: "Dr. James Wilson",
        role: "Clinical Director, Hopkins",
        rating: 5
    },
    {
        content: "We've reduced our initial MRI screening time by 40%. A tool that actually gives time back to the physician.",
        author: "Dr. Elena Rodriguez",
        role: "Neurosurgeon, UCSF",
        rating: 5
    }
];

export const Testimonials = () => {
    return (
        <section className="py-32 px-6 bg-app-bg text-center">
            <div className="max-w-6xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 space-y-4"
                >
                    <h2 className="text-3xl font-light text-white tracking-tight">Clinical Validation</h2>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 1, ease: "easeOut" }}
                            className="group relative p-10 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-700 hover:bg-white/[0.04]"
                        >
                            <div className="flex justify-center gap-1 mb-8 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={12} className="fill-white text-white" />
                                ))}
                            </div>

                            <p className="text-slate-400 font-light leading-relaxed mb-8 group-hover:text-slate-300 transition-colors duration-700">
                                "{review.content}"
                            </p>

                            <div>
                                <h4 className="text-white text-sm font-medium tracking-wide mb-1 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                                    {review.author}
                                </h4>
                                <p className="text-xs text-slate-600 uppercase tracking-widest group-hover:text-primary-400 transition-colors duration-700">
                                    {review.role}
                                </p>
                            </div>

                            {/* Subtle Glow on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-2xl" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
