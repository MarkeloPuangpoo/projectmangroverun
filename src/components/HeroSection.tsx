'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Leaf, ArrowRight, PlayCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';
import Link from 'next/link';

const HeroSection = () => {
    const { language } = useLanguage();
    const t = translations[language].hero;

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const targetDate = new Date('2026-05-25T05:45:00').getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section id="home" className="relative px-4 py-4 md:py-6 max-w-[1440px] mx-auto">
            {/* Main Card Container */}
            <div
                className="relative w-full min-h-[85vh] md:min-h-[800px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col justify-center group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Background Layer with Zoom Effect */}
                <div className="absolute inset-0 bg-deep-blue">
                    <img
                        src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2940&auto=format&fit=crop"
                        alt="Mangrove Forest Path"
                        className={`
                            w-full h-full object-cover transition-transform duration-[2000ms] ease-out opacity-60 mix-blend-overlay
                            ${isHovered ? 'scale-105' : 'scale-100'}
                        `}
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-deep-blue/40 to-transparent opacity-90" />

                    {/* Noise Texture (Optional for gritty feel) */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 pt-20 pb-12">

                    {/* Floating Badge */}
                    <div className="animate-fade-in-down mb-8">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full pl-2 pr-4 py-1.5 flex items-center gap-3 shadow-lg shadow-black/20 hover:bg-white/10 transition-colors cursor-default">
                            <div className="bg-neon-green text-deep-blue p-1 rounded-full">
                                <Leaf className="w-3 h-3" />
                            </div>
                            <span className="text-white/90 text-xs font-bold uppercase tracking-widest">
                                {t.badge}
                            </span>
                        </div>
                    </div>

                    {/* Main Titles - Kinetic Typography */}
                    <div className="text-center space-y-2 mb-8 animate-fade-in-up">
                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
                            MANGROVE
                        </h1>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400 tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(0,255,128,0.5)]">
                            BPK RUN
                        </h1>
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-white/50"></div>
                            <span className="text-2xl md:text-4xl font-bold text-white tracking-[0.2em]">2026</span>
                            <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-white/50"></div>
                        </div>
                    </div>

                    {/* Description & Location */}
                    <div className="text-center max-w-2xl mx-auto space-y-6 mb-12 animate-fade-in-up delay-100">
                        <p className="text-lg md:text-xl font-medium text-gray-200 leading-relaxed px-4 text-shadow-sm">
                            {t.subtitle}
                        </p>
                        <div className="inline-flex items-center gap-2 text-white/80 bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 hover:bg-black/30 transition-colors">
                            <MapPin className="w-5 h-5 text-neon-green animate-bounce-subtle" />
                            <span className="text-sm md:text-base">{t.location}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto px-4 animate-fade-in-up delay-200">
                        <Link href="/register" className="w-full sm:w-auto">
                            <button className="group w-full sm:w-auto px-10 py-4 bg-neon-green text-deep-blue font-black rounded-2xl text-lg hover:bg-white hover:text-neon-green transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,255,128,0.4)] hover:shadow-[0_0_30px_rgba(0,255,128,0.6)] flex items-center justify-center gap-2">
                                {t.register}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>

                        <button className="group w-full sm:w-auto px-10 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-2xl text-lg hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-3">
                            {t.moreDetail}
                            <PlayCircle className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Countdown Timer - Glass Cards */}
                    <div className="grid grid-cols-4 gap-3 md:gap-6 w-full max-w-3xl animate-fade-in-up delay-300">
                        {[
                            { label: t.days, value: timeLeft.days },
                            { label: t.hours, value: timeLeft.hours },
                            { label: t.minutes, value: timeLeft.minutes },
                            { label: t.seconds, value: timeLeft.seconds }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col items-center justify-center bg-black/30 backdrop-blur-xl rounded-2xl py-4 md:py-6 border border-white/10 overflow-hidden group hover:border-neon-green/50 transition-colors"
                            >
                                {/* Glow Effect on Hover */}
                                <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                                <span className="relative text-2xl sm:text-4xl md:text-5xl font-black font-mono text-white tabular-nums tracking-tight">
                                    {String(item.value).padStart(2, '0')}
                                </span>
                                <span className="relative text-[10px] sm:text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mt-1 md:mt-2 group-hover:text-neon-green transition-colors">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;