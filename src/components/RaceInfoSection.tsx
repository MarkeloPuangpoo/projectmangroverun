'use client';

import React from 'react';
import { Timer, Trophy, Users, Heart, Sparkles, Crown, Shirt, Medal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';

const RaceInfoSection = () => {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];

    const races = [
        {
            id: '10k',
            ...t.raceInfo.cards.mini,
            icon: Trophy,
            color: "text-energetic-orange",
            bgHover: "hover:shadow-orange-500/20 hover:border-orange-200",
            gradient: "from-orange-500 to-red-500"
        },
        {
            id: 'fancy',
            ...t.raceInfo.cards.fancy,
            icon: Sparkles,
            color: "text-purple-500",
            bgHover: "hover:shadow-purple-500/20 hover:border-purple-200",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            id: '6k',
            ...t.raceInfo.cards.fun,
            icon: Users,
            color: "text-mangrove-green",
            bgHover: "hover:shadow-green-500/20 hover:border-green-200",
            gradient: "from-green-500 to-emerald-600"
        },
        {
            id: '5k',
            ...t.raceInfo.cards.walk,
            icon: Heart,
            color: "text-blue-500",
            bgHover: "hover:shadow-blue-500/20 hover:border-blue-200",
            gradient: "from-blue-400 to-blue-600"
        }
    ];

    return (
        <section id="race-info" className="py-20 md:py-28 px-4 bg-gray-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
                <div className="absolute top-10 right-10 w-96 h-96 bg-deep-blue rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-neon-green rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4 border border-gray-100">
                        <Timer className="w-4 h-4 text-neon-green" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.raceInfo.title}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-deep-blue tracking-tight mb-4">
                        {t.raceInfo.title}
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        {t.raceInfo.subheading}
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {races.map((race, index) => (
                        <div
                            key={race.id}
                            className={`
                                group relative bg-white rounded-[2rem] p-6 border-2 border-transparent transition-all duration-300
                                hover:-translate-y-2 hover:bg-white
                                ${race.bgHover} shadow-lg shadow-gray-100/50
                            `}
                        >
                            {/* Special Tag for Fancy */}
                            {(race as any).tag && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                                    {(race as any).tag}
                                </div>
                            )}

                            {/* Icon & Distance */}
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <race.icon className={`w-7 h-7 ${race.color}`} />
                                </div>
                                <div className="text-right">
                                    <h3 className={`text-2xl font-black italic tracking-tighter ${race.color}`}>
                                        {race.distance}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400">{t.raceInfo.distanceLabel}</p>
                                </div>
                            </div>

                            {/* Title */}
                            <h4 className="text-xl font-bold text-deep-blue mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-deep-blue group-hover:to-gray-600 transition-all">
                                {race.title}
                            </h4>

                            {/* Time & Price Row */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2 border border-gray-100">
                                    <Timer className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{t.raceInfo.startLabel}</p>
                                        <p className="text-sm font-black text-deep-blue">{race.start}</p>
                                    </div>
                                </div>
                                <div className="flex-1 bg-deep-blue rounded-xl px-3 py-2 flex items-center gap-2 border border-deep-blue shadow-lg shadow-blue-900/10 group-hover:shadow-blue-900/20 transition-all">
                                    <div className="w-1 h-full bg-neon-green rounded-full"></div>
                                    <div>
                                        <p className="text-[10px] text-blue-200 font-bold uppercase">{t.raceInfo.priceLabel}</p>
                                        <p className="text-sm font-black text-white">{race.price}.-</p>
                                    </div>
                                </div>
                            </div>

                            {/* Included Items */}
                            <div className="space-y-2 pt-4 border-t border-dashed border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Highlights</p>
                                {race.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${race.gradient}`} />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* VIP Banner */}
                <div className="relative rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-xl shadow-yellow-500/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-deep-blue" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                    {/* Animated Glow */}
                    <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-yellow-500/20 to-transparent skew-x-12 group-hover:translate-x-10 transition-transform duration-700" />

                    <div className="relative px-8 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 transform group-hover:rotate-12 transition-transform duration-300">
                                <Crown className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white italic tracking-tight mb-2">
                                    {t.raceInfo.vip.title}
                                </h3>
                                <p className="text-blue-100 font-medium">
                                    {t.raceInfo.vip.desc}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-4xl font-black text-white mb-1">
                                {t.raceInfo.vip.price} <span className="text-lg text-yellow-400">THB</span>
                            </div>
                            <button className="bg-white text-deep-blue px-6 py-2 rounded-xl font-bold text-sm hover:bg-neon-green transition-colors shadow-lg">
                                {t.raceInfo.vip.button}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Note */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400 bg-white inline-block px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                        <span className="text-red-500 font-bold mr-1">{t.raceInfo.note.label}</span>
                        {t.raceInfo.note.text}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RaceInfoSection;