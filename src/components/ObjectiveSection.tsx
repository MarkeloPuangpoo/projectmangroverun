'use client';

import React from 'react';
import { Leaf, GraduationCap, School, Globe2, Lightbulb, HeartPulse, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';

const ObjectiveSection = () => {
    const { language } = useLanguage();
    const t = translations[language];

    // Map icons to the translated items
    const objectives = [
        { icon: Leaf, ...t.objective.items[0] },
        { icon: GraduationCap, ...t.objective.items[1] },
        { icon: School, ...t.objective.items[2] },
        { icon: Globe2, ...t.objective.items[3] },
        { icon: Lightbulb, ...t.objective.items[4] },
        { icon: HeartPulse, ...t.objective.items[5] }
    ];

    return (
        <section className="py-20 bg-deep-blue relative overflow-hidden text-white">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-neon-green/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-3 gap-12 items-center">

                    {/* Left: Main Story */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-xs font-bold uppercase tracking-wider">
                            {t.objective.missionBadge}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black leading-tight">
                            {t.objective.titlePrefix} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400">
                                {t.objective.titleHighlight}
                            </span>
                        </h2>
                        <div className="relative">
                            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/10 transform -scale-x-100" />
                            <p className="text-gray-300 text-lg leading-relaxed pl-6 border-l-2 border-neon-green/50">
                                {t.objective.quote}
                            </p>
                        </div>
                        <div className="pt-4">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-deep-blue bg-gray-600"></div>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-400">
                                    <span className="text-white font-bold">1,500+</span> {t.objective.runners}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Objectives Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {objectives.map((item, index) => (
                                <div
                                    key={index}
                                    className="group p-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-neon-green/30 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-neon-green mb-4 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-neon-green transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ObjectiveSection;