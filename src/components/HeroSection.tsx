'use client';

import React from 'react';
import { MapPin, Calendar, ArrowRight, PlayCircle, Trophy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';
import Link from 'next/link';

const HeroSection = () => {
    const { language } = useLanguage();
    const t = translations[language].hero;

    return (
        <section id="home" className="relative w-full h-[100svh] min-h-[600px] max-h-[1080px] overflow-hidden bg-deep-blue">

            {/* --- 1. Background Layer (Passive & Lightweight) --- */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2940&auto=format&fit=crop"
                    alt="Mangrove Forest"
                    className="w-full h-full object-cover opacity-50 animate-ken-burns" // Ken Burns Effect แทน Hover Zoom
                />
                {/* Clean Gradient for Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/60 via-deep-blue/40 to-deep-blue" />
            </div>

            {/* --- 2. Main Content (Centered & Focused) --- */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 pt-10 sm:pt-20">

                {/* Badge: Category Tag (เล็กและคม) */}
                <div className="mb-4 sm:mb-6 animate-fade-in-up">
                    <span className="bg-neon-green/10 text-neon-green border border-neon-green/20 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
                        Eco-Marathon 2026
                    </span>
                </div>

                {/* Headline: Clean & Impactful */}
                <div className="text-center mb-4 sm:mb-6 animate-fade-in-up delay-100">
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                        MANGROVE
                    </h1>
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400 tracking-tighter leading-[0.9]">
                        BPK RUN
                    </h1>
                </div>

                {/* Value Proposition (The "Why") */}
                <p className="max-w-xs sm:max-w-xl text-center text-slate-200 text-base sm:text-xl font-medium leading-relaxed mb-8 sm:mb-10 animate-fade-in-up delay-200 px-4">
                    {/* เปลี่ยนจากคำโปรยลอยๆ เป็นคำที่เห็นภาพ */}
                    {language === 'th'
                        ? "วิ่งสัมผัสธรรมชาติ สูดอากาศบริสุทธิ์กลางป่าชายเลน"
                        : "Experience the purest run through the lungs of Bang Pakong."}
                </p>

                {/* CTA Group: Clear Winner */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 animate-fade-in-up delay-300 w-full sm:w-auto px-6 sm:px-0">
                    {/* Primary Button */}
                    <Link href="/register" className="w-full sm:w-auto">
                        <button className="group relative w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-neon-green text-deep-blue font-black text-base sm:text-lg rounded-full shadow-[0_0_40px_-10px_rgba(0,255,128,0.5)] hover:shadow-[0_0_60px_-15px_rgba(0,255,128,0.7)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                            {t.register}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>

                    {/* Secondary Button (Visual Whisper) */}
                    <Link href="/check-status" className="hidden sm:block">
                        <button className="flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm uppercase tracking-wide transition-colors border-b border-transparent hover:border-neon-green pb-0.5">
                            <PlayCircle size={18} />
                            {t.moreDetail}
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- 3. Key Info Bar (Replaces Countdown) --- */}
            {/* ย้ายข้อมูลสำคัญมาไว้ข้างล่างสุด เพื่อให้ User เช็คความพร้อมได้ทันที */}
            <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-deep-blue/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 sm:py-6">
                    {/* ใช้ Grid 2x2 บนมือถือ และ 4x1 บนจอใหญ่ เพื่อความสมดุล */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-12 text-left">

                        {/* Info Item 1: Date */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg text-neon-green shrink-0">
                                <Calendar size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Race Date</p>
                                <p className="text-sm sm:text-base text-white font-bold">25 May 2026</p>
                            </div>
                        </div>

                        {/* Info Item 2: Location */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg text-neon-green shrink-0">
                                <MapPin size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Location</p>
                                <p className="text-sm sm:text-base text-white font-bold truncate max-w-[100px] sm:max-w-none">
                                    Bang Pakong
                                </p>
                            </div>
                        </div>

                        {/* Info Item 3: Distances */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg text-neon-green shrink-0">
                                <ArrowRight size={18} className="sm:w-5 sm:h-5 -rotate-45" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Distances</p>
                                <p className="text-sm sm:text-base text-white font-bold">5K / 10.5K</p>
                            </div>
                        </div>

                        {/* Info Item 4: Prize (Now Visible on Mobile for Balance) */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg text-neon-green shrink-0">
                                <Trophy size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Total Prize</p>
                                <p className="text-sm sm:text-base text-white font-bold">฿ 100K+</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;