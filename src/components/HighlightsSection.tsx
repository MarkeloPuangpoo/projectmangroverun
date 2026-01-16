'use client';

import React, { useState } from 'react';
import { Shirt, Medal, ArrowRight, RotateCw, Ruler } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';

const HighlightsSection = () => {
    const { language } = useLanguage();
    const t = translations[language].highlights;

    // State for flipping shirt
    const [isFlipped, setIsFlipped] = useState(false);

    // Data from uploaded PDF Page 9 
    const sizes = [
        { name: '5XS', chest: 26, length: 21 },
        { name: '4XS', chest: 28, length: 22 },
        { name: '3XS', chest: 30, length: 23 },
        { name: '2XS', chest: 32, length: 24 },
        { name: 'SS', chest: 34, length: 25 },
        { name: 'S', chest: 36, length: 26 },
        { name: 'M', chest: 38, length: 27 },
        { name: 'L', chest: 40, length: 28 },
        { name: 'XL', chest: 42, length: 29 },
        { name: '2XL', chest: 44, length: 30 },
        { name: '3XL', chest: 46, length: 31 },
        { name: '4XL', chest: 48, length: 32 },
    ];

    return (
        <section id="highlights" className="py-20 md:py-32 bg-white relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-neon-green/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-deep-blue/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 mb-4 shadow-sm">
                            <Shirt className="w-4 h-4 text-neon-green" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.badge}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-deep-blue tracking-tight leading-none">
                            {t.headerTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-600">{t.headerSubtitle}</span>
                        </h2>
                    </div>

                    <div className="hidden md:block w-32 h-1 bg-gray-100 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-neon-green w-1/2 animate-slide-right"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Shirt & Medal (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* 1. Shirt Showcase */}
                        <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shirt className="w-48 h-48 text-deep-blue transform rotate-12" />
                            </div>

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-deep-blue">{t.jerseyTitle}</h3>
                                    <p className="text-gray-500 text-sm">{t.jerseyDesc}</p>
                                </div>
                                <button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-bold text-deep-blue hover:text-neon-green transition-colors border border-gray-100 z-20"
                                >
                                    <RotateCw className="w-4 h-4" />
                                    {isFlipped ? t.flipButton.front : t.flipButton.back}
                                </button>
                            </div>

                            {/* Shirt Image Container */}
                            <div className="relative aspect-[4/3] bg-white rounded-3xl shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden p-6">
                                <div className={`transition-all duration-500 transform ${isFlipped ? 'rotate-y-180 opacity-0 absolute' : 'opacity-100 relative'}`}>
                                    {/* Placeholder for Front Image */}
                                    <div className="text-center">
                                        <div className="w-48 h-56 mx-auto bg-gradient-to-b from-blue-100 to-white rounded-t-3xl rounded-b-lg relative shadow-lg">
                                            <div className="absolute inset-0 flex items-center justify-center text-deep-blue font-black opacity-20 text-4xl">FRONT</div>
                                            {/* Logo Mockup */}
                                            <div className="absolute top-12 left-0 right-0 text-center">
                                                <div className="text-xs font-bold text-deep-blue">Mangrove</div>
                                                <div className="text-[10px] text-neon-green font-black">BPK RUN 2025</div>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{t.designLabel.front}</p>
                                    </div>
                                </div>

                                <div className={`transition-all duration-500 transform ${!isFlipped ? 'rotate-y-180 opacity-0 absolute' : 'opacity-100 relative'}`}>
                                    {/* Placeholder for Back Image */}
                                    <div className="text-center">
                                        <div className="w-48 h-56 mx-auto bg-gradient-to-b from-blue-100 to-white rounded-t-3xl rounded-b-lg relative shadow-lg">
                                            <div className="absolute inset-0 flex items-center justify-center text-deep-blue font-black opacity-20 text-4xl">BACK</div>
                                        </div>
                                        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{t.designLabel.back}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Medal Showcase */}
                        <div className="bg-deep-blue rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
                            {/* Glow Effect */}
                            <div className="absolute -left-20 -top-20 w-64 h-64 bg-neon-green/20 rounded-full blur-[80px]" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                            <Medal className="w-6 h-6 text-neon-green" />
                                        </div>
                                        <h3 className="text-2xl font-bold">{t.medalTitle}</h3>
                                    </div>
                                    <p className="text-blue-100 mb-6 leading-relaxed">
                                        {t.medalDesc} <br />
                                        <span className="text-neon-green font-bold">{t.medalConditionStrong}</span> {t.medalCondition}
                                    </p>
                                    <div className="flex gap-3">
                                        <span className="px-3 py-1 rounded-md bg-white/10 text-xs font-bold border border-white/10">10.5 KM (Gold)</span>
                                        <span className="px-3 py-1 rounded-md bg-white/10 text-xs font-bold border border-white/10">Fun Run (Silver)</span>
                                    </div>
                                </div>

                                {/* Medal Visual */}
                                <div className="flex-shrink-0 relative">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center border-4 border-yellow-200/50">
                                        <div className="text-center">
                                            <div className="text-[10px] font-bold text-yellow-900">Mangrove</div>
                                            <div className="text-2xl font-black text-white drop-shadow-md">2025</div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-neon-green text-deep-blue text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        High Quality
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Size Chart (5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 h-full flex flex-col overflow-hidden">
                            <div className="p-8 bg-gray-50 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-black text-deep-blue flex items-center gap-2">
                                        <Ruler className="w-5 h-5 text-neon-green" /> {t.sizeChart.title}
                                    </h3>
                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 text-gray-400">{t.sizeChart.unit}</span>
                                </div>
                                <p className="text-sm text-gray-500">{t.sizeChart.subtitle}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-gray-400 font-bold uppercase text-xs">{t.sizeChart.columns.size}</th>
                                            <th className="px-4 py-3 text-center text-deep-blue font-bold">{t.sizeChart.columns.chest}</th>
                                            <th className="px-4 py-3 text-center text-deep-blue font-bold">{t.sizeChart.columns.length}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {sizes.map((size) => (
                                            <tr key={size.name} className="group hover:bg-neon-green/5 transition-colors">
                                                <td className="px-6 py-3">
                                                    <span className="inline-flex items-center justify-center w-10 h-8 rounded-lg bg-gray-100 text-deep-blue font-bold group-hover:bg-deep-blue group-hover:text-neon-green transition-colors text-xs">
                                                        {size.name}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center font-medium text-gray-600 group-hover:text-deep-blue group-hover:scale-110 transition-transform">{size.chest}"</td>
                                                <td className="px-4 py-3 text-center font-medium text-gray-600 group-hover:text-deep-blue group-hover:scale-110 transition-transform">{size.length}"</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                <p className="text-[10px] text-gray-400">
                                    {t.sizeChart.note}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HighlightsSection;