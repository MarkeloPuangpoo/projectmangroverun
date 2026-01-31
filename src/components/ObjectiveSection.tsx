'use client';

import React from 'react';
import { Leaf, GraduationCap, HeartHandshake, ArrowRight, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';
import Link from 'next/link';

const ObjectiveSection = () => {
    const { language } = useLanguage();
    const t = translations[language];

    // Curated 3 Key Pillars (Impact Focused)
    const pillars = [
        {
            icon: Leaf,
            title: language === 'th' ? "ฟื้นฟูระบบนิเวศ" : "Restore Nature",
            desc: language === 'th'
                ? "รายได้ส่วนหนึ่งมอบให้ศูนย์ศึกษาธรรมชาติฯ เพื่อปลูกป่าชายเลนและอนุรักษ์พื้นที่สีเขียว"
                : "Proceeds support mangrove reforestation and ecosystem conservation efforts.",
            color: "text-neon-green",
            bg: "bg-neon-green/10",
            border: "border-neon-green/20"
        },
        {
            icon: GraduationCap,
            title: language === 'th' ? "สนับสนุนการศึกษา" : "Support Education",
            desc: language === 'th'
                ? "มอบทุนการศึกษาและอุปกรณ์กีฬาให้โรงเรียนในเครือมูลนิธิฯ สร้างโอกาสให้เยาวชน"
                : "Providing scholarships and sports equipment to underprivileged schools.",
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "border-blue-400/20"
        },
        {
            icon: HeartHandshake,
            title: language === 'th' ? "สร้างสุขภาพชุมชน" : "Community Health",
            desc: language === 'th'
                ? "ส่งเสริมให้คนในชุมชนและนักวิ่งได้ออกกำลังกาย เพื่อสุขภาพกายและใจที่แข็งแรง"
                : "Promoting physical and mental well-being for the local community and runners.",
            color: "text-pink-400",
            bg: "bg-pink-400/10",
            border: "border-pink-400/20"
        }
    ];

    return (
        <section className="py-24 bg-deep-blue relative overflow-hidden text-white">

            {/* --- Background Atmosphere --- */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* --- 1. HEADLINE: Reframe to "You" --- */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300 mb-6">
                        More Than Just A Run
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
                        {language === 'th' ? "ทุกก้าวของคุณ..." : "Your Every Step..."} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400">
                            {language === 'th' ? "สร้างการเปลี่ยนแปลง" : "Creates Real Impact"}
                        </span>
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                        {language === 'th'
                            ? "งานวิ่งครั้งนี้ไม่ได้มีแค่เส้นชัย แต่คือการรวมพลังเพื่อส่งต่อสิ่งดีๆ กลับคืนสู่ธรรมชาติและสังคม นี่คือสิ่งที่คุณจะช่วยสร้างให้เกิดขึ้นจริง"
                            : "This run isn't just about the finish line. It's about coming together to give back to nature and society. Here is the impact you will help create."}
                    </p>
                </div>

                {/* --- 2. IMPACT CARDS (3 Pillars) --- */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    {pillars.map((item, index) => (
                        <div
                            key={index}
                            className={`
                                group p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2
                                ${item.bg} ${item.border} hover:bg-opacity-20 backdrop-blur-sm relative overflow-hidden
                            `}
                        >
                            {/* Decorative Glow */}
                            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${item.bg.replace('/10', '')}`} />

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-deep-blue border border-white/10 group-hover:scale-110 transition-transform`}>
                                <item.icon className={`w-7 h-7 ${item.color}`} />
                            </div>

                            <h3 className="text-2xl font-bold mb-3 text-white">
                                {item.title}
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* --- 3. SOCIAL PROOF & SOFT CTA --- */}
                <div className="bg-white/5 rounded-[2.5rem] p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md">

                    {/* Left: Social Proof with Real Faces (Placeholders) */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                        <div className="flex -space-x-4">
                            {[
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                            ].map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt="Runner"
                                    className="w-14 h-14 rounded-full border-4 border-deep-blue object-cover"
                                />
                            ))}
                            <div className="w-14 h-14 rounded-full border-4 border-deep-blue bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                +1.5k
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-white">
                                {language === 'th' ? "ร่วมวิ่งไปกับเพื่อนๆ อีกกว่า 1,500 คน" : "Join 1,500+ Changemakers"}
                            </p>
                            <p className="text-slate-400 text-sm">
                                {language === 'th' ? "มาเป็นส่วนหนึ่งของครอบครัว Mangrove Run" : "Be part of the Mangrove Run family"}
                            </p>
                        </div>
                    </div>

                    {/* Right: Soft CTA */}
                    <Link href="/register">
                        <button className="group flex items-center gap-3 px-8 py-4 bg-white text-deep-blue font-black rounded-2xl hover:bg-neon-green transition-colors shadow-lg">
                            {language === 'th' ? "ร่วมสร้างการเปลี่ยนแปลง" : "Join the Movement"}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>

                </div>

            </div>
        </section>
    );
};

export default ObjectiveSection;