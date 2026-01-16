'use client';

import React from 'react';
import { Trophy, Gavel, Users, Star, AlertTriangle, Baby, Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';

const AwardsRulesSection = () => {
    const { language } = useLanguage();
    // Fallback if translations aren't fully populated yet, using direct strings based on PDF
    const t = translations[language].awards;

    // Data from PDF Page 3 & 8
    const ageGroups = [
        { label: "12 - 20 ปี", male: true, female: true },
        { label: "21 - 35 ปี", male: true, female: true },
        { label: "36 - 45 ปี", male: true, female: true },
        { label: "46 - 55 ปี", male: true, female: true },
        { label: "56 ปีขึ้นไป", male: true, female: true },
    ];

    const awards = [
        {
            title: "Overall Champion",
            subtitle: "Mini Marathon 10.5 KM",
            icon: Crown,
            rewards: ["ถ้วยรางวัลชนะเลิศ (Male/Female)"],
            condition: "*สงวนสิทธิ์เฉพาะสัญชาติไทย (Thai National Only)",
            color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
            textColor: "text-white"
        },
        {
            title: "Age Group Winners",
            subtitle: "10.5 KM & 6 KM",
            icon: Trophy,
            rewards: ["ถ้วยรางวัล อันดับ 1 - 3 (ทุกรุ่นอายุ)"],
            condition: "แบ่งชาย/หญิง ตามกลุ่มอายุ",
            color: "bg-white border-2 border-gray-100",
            textColor: "text-deep-blue"
        }
    ];

    return (
        <section id="awards" className="py-20 md:py-28 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-energetic-orange/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mangrove-green/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 mb-4 shadow-sm">
                            <Trophy className="w-4 h-4 text-energetic-orange" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trophies & Rules</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-deep-blue tracking-tight">
                            รางวัล <span className="text-transparent bg-clip-text bg-gradient-to-r from-energetic-orange to-red-500">& กติกาการแข่งขัน</span>
                        </h2>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Awards (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* 1. Main Awards Cards */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {awards.map((award, index) => (
                                <div key={index} className={`rounded-3xl p-6 shadow-lg ${award.color} relative overflow-hidden group`}>
                                    {/* Icon Background */}
                                    <award.icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 transform group-hover:rotate-12 transition-transform" />

                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${award.textColor === 'text-white' ? 'bg-white/20 backdrop-blur-md' : 'bg-gray-100'}`}>
                                            <award.icon className={`w-6 h-6 ${award.textColor === 'text-white' ? 'text-white' : 'text-deep-blue'}`} />
                                        </div>
                                        <h3 className={`text-xl font-black mb-1 ${award.textColor}`}>{award.title}</h3>
                                        <p className={`text-sm font-medium mb-4 opacity-80 ${award.textColor}`}>{award.subtitle}</p>

                                        <ul className="space-y-2">
                                            {award.rewards.map((r, i) => (
                                                <li key={i} className={`text-sm font-bold flex items-center gap-2 ${award.textColor}`}>
                                                    <Star className="w-3 h-3" /> {r}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className={`mt-4 pt-4 border-t ${award.textColor === 'text-white' ? 'border-white/20' : 'border-gray-100'}`}>
                                            <p className={`text-[10px] font-medium opacity-70 ${award.textColor}`}>{award.condition}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. Fancy Prize Highlight */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-1 shadow-xl transform hover:scale-[1.01] transition-transform">
                            <div className="bg-white rounded-[1.4rem] p-6 h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 bg-purple-100 rounded-bl-2xl">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="text-center md:text-left flex-1">
                                        <h3 className="text-2xl font-black text-deep-blue mb-2 flex items-center gap-2 justify-center md:justify-start">
                                            Fancy Run Awards <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 text-purple-600 border border-purple-200 uppercase">Special</span>
                                        </h3>
                                        <p className="text-gray-500 text-sm">รางวัลสำหรับนักวิ่งแฟนซีที่แต่งกายโดดเด่น (รวมรุ่นอายุ)</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-gray-400 mb-1">ชนะเลิศ</div>
                                            <div className="text-xl font-black text-purple-600">3,000.-</div>
                                        </div>
                                        <div className="w-px bg-gray-100" />
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-gray-400 mb-1">รองอันดับ 1</div>
                                            <div className="text-xl font-black text-pink-500">2,000.-</div>
                                        </div>
                                        <div className="w-px bg-gray-100" />
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-gray-400 mb-1">รองอันดับ 2</div>
                                            <div className="text-xl font-black text-orange-500">1,000.-</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Age Group Table */}
                        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-lg">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h4 className="font-bold text-deep-blue flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" /> การแบ่งรุ่นอายุ (Age Groups)
                                </h4>
                                <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded-md">10.5 KM & 6 KM Only</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 font-bold w-1/3">ช่วงอายุ (ปี)</th>
                                            <th className="px-6 py-3 font-bold text-center text-deep-blue bg-blue-50/50">ชาย (Male)</th>
                                            <th className="px-6 py-3 font-bold text-center text-pink-600 bg-pink-50/50">หญิง (Female)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {ageGroups.map((group, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                                                <td className="px-6 py-3 font-bold text-gray-700">{group.label}</td>
                                                <td className="px-6 py-3 text-center text-deep-blue bg-blue-50/30">●</td>
                                                <td className="px-6 py-3 text-center text-pink-500 bg-pink-50/30">●</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Rules (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Rules Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl h-full relative">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                <Gavel className="w-40 h-40 text-deep-blue" />
                            </div>

                            <h3 className="text-2xl font-black text-deep-blue mb-6 flex items-center gap-3">
                                <Gavel className="w-6 h-6 text-mangrove-green" /> กติกาสำคัญ
                            </h3>

                            <div className="space-y-4 relative z-10">
                                {/* Rule 1: Thai Only */}
                                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-4">
                                    <div className="mt-1">
                                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-orange-800 text-sm mb-1">Overall Winner Qualification</h4>
                                        <p className="text-xs text-orange-700 leading-relaxed">
                                            รางวัลชนะเลิศประเภททั่วไป (Overall) ระยะ 10.5 กม. สงวนสิทธิ์สำหรับ <strong>ผู้ถือสัญชาติไทย (Thai Nationality)</strong> เท่านั้น
                                        </p>
                                    </div>
                                </div>

                                {/* Rule 2: Kids */}
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                                    <div className="mt-1">
                                        <Baby className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-800 text-sm mb-1">Children Participation</h4>
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            เด็กอายุต่ำกว่า 12 ปี สามารถสมัครร่วมกิจกรรมได้ แต่ต้องอยู่ภายใต้การดูแลของผู้ปกครองตลอดเวลา
                                        </p>
                                    </div>
                                </div>

                                {/* General Rules List */}
                                <div className="pt-4 mt-2 border-t border-gray-100">
                                    <h4 className="font-bold text-gray-700 text-sm mb-3">ข้อปฏิบัติทั่วไป (General Rules)</h4>
                                    <ul className="space-y-3">
                                        {[
                                            "การตัดสินของกรรมการถือเป็นที่สิ้นสุด",
                                            "ต้องติดหมายเลขวิ่ง (BIB) ให้เห็นชัดเจนด้านหน้า",
                                            "นักวิ่งต้องผ่านจุด Check Point ให้ครบถ้วน",
                                            "ห้ามใช้พาหนะทุ่นแรง หรือรับความช่วยเหลือที่ผิดกติกา"
                                        ].map((rule, i) => (
                                            <li key={i} className="text-xs text-gray-500 flex gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                                                {rule}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default AwardsRulesSection;