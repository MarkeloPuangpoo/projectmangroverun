'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react'; // ลบไอคอนที่ไม่ได้ใช้ออกแล้ว
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';
import Link from 'next/link';

const HeroSection = () => {
    const { language } = useLanguage();
    const t = translations[language].hero;

    // สถานะสำหรับ Countdown
    const [isMounted, setIsMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        setIsMounted(true);
        // ตั้งเป้าหมายเป็นวันที่ 25 กรกฎาคม 2026 (25/07/2026) เวลา 00:00:00
        const targetDate = new Date('2026-07-25T00:00:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section id="home" className="relative w-full h-[100svh] min-h-[600px] max-h-[1080px] overflow-hidden bg-deep-blue">

            {/* --- 1. Background Layer (Passive & Lightweight) --- */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2940&auto=format&fit=crop"
                    alt="Mangrove Forest"
                    className="w-full h-full object-cover opacity-50 animate-ken-burns"
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
                <div className="text-center mb-6 sm:mb-10 animate-fade-in-up delay-100">
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                        MANGROVE
                    </h1>
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400 tracking-tighter leading-[0.9]">
                        BPK RUN
                    </h1>
                </div>

                {/* Countdown Timer (แทนที่ข้อความเดิม) */}
                <div className="h-[80px] mb-8 sm:mb-12 animate-fade-in-up delay-200">
                    {isMounted && (
                        <div className="flex items-center justify-center gap-4 sm:gap-6 bg-deep-blue/40 px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-md">
                            {/* Days */}
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-3xl sm:text-4xl font-black text-white leading-none mb-1">
                                    {timeLeft.days}
                                </span>
                                <span className="text-[10px] sm:text-xs text-neon-green uppercase tracking-widest font-bold">Days</span>
                            </div>
                            <span className="text-2xl sm:text-3xl text-white/30 font-black pb-4">:</span>
                            {/* Hours */}
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-3xl sm:text-4xl font-black text-white leading-none mb-1">
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] sm:text-xs text-neon-green uppercase tracking-widest font-bold">Hrs</span>
                            </div>
                            <span className="text-2xl sm:text-3xl text-white/30 font-black pb-4">:</span>
                            {/* Minutes */}
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-3xl sm:text-4xl font-black text-white leading-none mb-1">
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] sm:text-xs text-neon-green uppercase tracking-widest font-bold">Mins</span>
                            </div>
                            <span className="text-2xl sm:text-3xl text-white/30 font-black pb-4">:</span>
                            {/* Seconds */}
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-3xl sm:text-4xl font-black text-white leading-none mb-1">
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] sm:text-xs text-neon-green uppercase tracking-widest font-bold">Secs</span>
                            </div>
                        </div>
                    )}
                </div>

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
            {/* นำแถบ Key Info Bar ด้านล่างออกตามที่รีเควสแล้ว */}
        </section>
    );
};

export default HeroSection; 