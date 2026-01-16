'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Flag, Coffee, ArrowLeftRight, ExternalLink, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';

const RouteMapSection = () => {
    const { language } = useLanguage();
    // Using direct strings here for demo, utilizing extracted data from PDF
    const t = translations[language].routes;

    const [activeTab, setActiveTab] = useState<'10.5KM' | '6KM' | '5KM'>('10.5KM');

    // Data extracted from PDF Source [cite: 6, 99, 119]
    const routes = {
        '10.5KM': {
            distance: '10.5 KM',
            title: 'Mini Marathon',
            color: 'text-energetic-orange',
            bgColor: 'bg-energetic-orange',
            borderColor: 'border-energetic-orange',
            description: "เส้นทางเลียบแม่น้ำบางปะกง สัมผัสธรรมชาติและวิถีชีวิตท้องถิ่น",
            uTurn: "กลับตัวที่ร้านอาหารแพเคียงน้ำ (ครึ่งทาง)", // 
            landmarks: [
                { name: "โรงเรียนบางปะกง (Start)", icon: Flag }, // [cite: 111]
                { name: "สถานีตำรวจ / โรงพยาบาลบางปะกง", icon: MapPin }, // [cite: 110, 112]
                { name: "ปั๊ม PTT / ไปรษณีย์", icon: Coffee }, // [cite: 115, 116]
                { name: "ข้ามแม่น้ำบางปะกง", icon: Navigation }, // [cite: 114]
                { name: "ร้านอาหารแพเคียงน้ำ (U-Turn)", icon: ArrowLeftRight, highlight: true } // [cite: 102, 117]
            ]
        },
        '6KM': {
            distance: '6 KM',
            title: 'Fun Run',
            color: 'text-mangrove-green',
            bgColor: 'bg-mangrove-green',
            borderColor: 'border-mangrove-green',
            description: "เส้นทางสนุกสนาน วิ่งสบายๆ ผ่านชุมชนและสถานที่สำคัญ",
            uTurn: "กลับตัวบริเวณทางแยกเข้าซอยเทศบาลท่าข้าม 4", // 
            landmarks: [
                { name: "โรงเรียนบางปะกง (Start)", icon: Flag }, // [cite: 130]
                { name: "โรงพยาบาลบางปะกง", icon: MapPin }, // [cite: 131]
                { name: "ปั๊ม PTT / ไปรษณีย์", icon: Coffee }, // [cite: 132, 133]
                { name: "แยกซอยเทศบาลท่าข้าม 4 (U-Turn)", icon: ArrowLeftRight, highlight: true } // [cite: 122, 135]
            ]
        },
        '5KM': {
            distance: '5 KM',
            title: 'Walk-Run',
            color: 'text-pink-500',
            bgColor: 'bg-pink-500',
            borderColor: 'border-pink-500',
            description: "เดิน-วิ่งเพื่อสุขภาพ ชมวิวแม่น้ำบนสะพานบางปะกง",
            uTurn: "กลับตัวครึ่งทางบริเวณกลางสะพานข้ามแม่น้ำ", // 
            landmarks: [
                { name: "โรงเรียนบางปะกง (Start)", icon: Flag }, // [cite: 20]
                { name: "โรงพยาบาลบางปะกง", icon: MapPin }, // [cite: 22]
                { name: "ปั๊ม PTT", icon: Coffee }, // [cite: 23]
                { name: "กลางสะพานแม่น้ำบางปะกง (U-Turn)", icon: ArrowLeftRight, highlight: true } // [cite: 9, 18]
            ]
        }
    };

    const currentRoute = routes[activeTab];

    return (
        <section id="routes" className="py-20 md:py-28 px-4 bg-gray-50 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/city-fields.png')]" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4 border border-gray-100">
                        <MapPin className="w-4 h-4 text-neon-green" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Course Map</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-deep-blue uppercase mb-4 tracking-tight">
                        เส้นทางวิ่ง <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-600">ชมธรรมชาติ</span>
                    </h2>
                    <div className="w-24 h-2 bg-gradient-to-r from-neon-green to-deep-blue mx-auto rounded-full" />
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row">

                    {/* LEFT SIDE: Controls & Info */}
                    <div className="lg:w-1/3 p-8 md:p-10 flex flex-col border-r border-gray-100 bg-white relative z-10">

                        {/* Tab Switcher */}
                        <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-10 relative">
                            {/* Sliding Background */}
                            <div
                                className={`absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-md transition-all duration-300 ease-out`}
                                style={{
                                    left: activeTab === '10.5KM' ? '6px' : activeTab === '6KM' ? '33.33%' : '66.66%',
                                    width: 'calc(33.33% - 4px)',
                                    transform: activeTab === '6KM' ? 'translateX(2px)' : activeTab === '5KM' ? 'translateX(-2px)' : 'none'
                                }}
                            />

                            {(Object.keys(routes) as Array<keyof typeof routes>).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`
                                        flex-1 py-3 text-sm md:text-base font-bold rounded-xl relative z-10 transition-colors duration-300
                                        ${activeTab === key ? 'text-deep-blue' : 'text-gray-400 hover:text-gray-600'}
                                    `}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>

                        {/* Route Details */}
                        <div className="flex-1 animate-fade-in space-y-8">
                            <div>
                                <h3 className={`text-4xl font-black mb-2 ${currentRoute.color}`}>
                                    {currentRoute.distance}
                                </h3>
                                <p className="text-xl font-bold text-deep-blue mb-2">{currentRoute.title}</p>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {currentRoute.description}
                                </p>
                            </div>

                            {/* Timeline Landmarks */}
                            <div className="space-y-0 relative pl-4">
                                {/* Vertical Line */}
                                <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-100" />

                                {currentRoute.landmarks.map((landmark, index) => (
                                    <div key={index} className="flex items-center gap-4 relative py-3 group">
                                        {/* Dot */}
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110
                                            ${landmark.highlight ? currentRoute.bgColor : 'bg-gray-100 text-gray-400'}
                                            ${landmark.highlight ? 'text-white' : ''}
                                        `}>
                                            <landmark.icon className="w-4 h-4" />
                                        </div>
                                        {/* Text */}
                                        <div>
                                            <p className={`text-sm font-bold ${landmark.highlight ? 'text-deep-blue' : 'text-gray-600'}`}>
                                                {landmark.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* U-Turn Alert */}
                        <div className={`mt-8 p-4 rounded-xl bg-gray-50 border-l-4 ${currentRoute.borderColor}`}>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">จุดกลับตัว (U-Turn Point)</p>
                            <p className="text-sm font-bold text-deep-blue">{currentRoute.uTurn}</p>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Map Visualization */}
                    <div className="lg:w-2/3 bg-gray-50 relative min-h-[400px] lg:min-h-full group overflow-hidden">

                        {/* Map Image Placeholder (Simulating the PDF Map) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* This would be the actual map image from assets */}
                            <div
                                className="w-full h-full bg-cover bg-center opacity-80 transition-transform duration-700 group-hover:scale-105"
                                style={{
                                    backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')`, // Placeholder
                                    // In production, use local assets like: /images/map-10k.jpg
                                }}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-deep-blue/20 group-hover:bg-deep-blue/10 transition-colors" />

                            {/* Interactive Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl text-center transform transition-all duration-300 group-hover:-translate-y-2">
                                    <MapPin className={`w-12 h-12 mx-auto mb-3 ${currentRoute.color}`} />
                                    <h4 className="text-xl font-black text-deep-blue mb-1">
                                        แผนที่ระยะ {currentRoute.distance}
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-4">คลิกเพื่อดูภาพขยาย หรือ เปิด Google Maps</p>

                                    <div className="flex gap-3 justify-center">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-deep-blue text-white rounded-xl text-sm font-bold hover:bg-navy transition-colors">
                                            <ZoomIn className="w-4 h-4" /> ดูรูปภาพ
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-deep-blue border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                                            <ExternalLink className="w-4 h-4" /> Google Maps
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Right Distance Badge */}
                        <div className="absolute top-6 right-6 z-20">
                            <span className={`px-4 py-2 rounded-lg font-black text-white text-xl shadow-lg ${currentRoute.bgColor}`}>
                                {currentRoute.distance}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RouteMapSection;