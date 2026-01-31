'use client';

import React, { useState } from 'react';
import { Trophy, Gavel, Users, Star, AlertTriangle, Baby, Crown, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';

const AwardsRulesSection = () => {
    const { language } = useLanguage();
    const t = translations[language].awards;

    // Interactive State for Age Calculation
    const [selectedAge, setSelectedAge] = useState<number | null>(null);

    // Data Configuration
    const ageGroups = [
        { label: "12 - 20 ปี", min: 12, max: 20 },
        { label: "21 - 35 ปี", min: 21, max: 35 },
        { label: "36 - 45 ปี", min: 36, max: 45 },
        { label: "46 - 55 ปี", min: 46, max: 55 },
        { label: "56 ปีขึ้นไป", min: 56, max: 99 },
    ];

    const getRowStyle = (min: number, max: number) => {
        if (selectedAge === null) return "";
        if (selectedAge >= min && selectedAge <= max) {
            return "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200";
        }
        return "opacity-40 grayscale"; // Focus Mode
    };

    return (
        <section id="awards" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* --- 1. HUMAN-CENTRIC SUMMARY --- */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-orange-100">
                        Motivation & Rules
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        รางวัลและความภูมิใจ
                    </h2>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                        นักวิ่งทุกคนมีสิทธิ์ลุ้นถ้วยรางวัลตามรุ่นอายุ <span className="text-slate-400 mx-2">|</span>
                        <span className="text-indigo-600 font-bold"> ยกเว้น Overall ที่จำกัดเฉพาะสัญชาติไทย</span>
                    </p>
                </div>

                {/* --- 2. MAIN AWARDS (THE HEROES) --- */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">

                    {/* Overall Champion (Primary) */}
                    <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500">
                            <Crown size={180} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-slate-900 mb-6 shadow-lg shadow-yellow-400/50">
                                <Crown size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-3xl font-black mb-2">Overall Champion</h3>
                            <p className="text-yellow-400 font-bold mb-6 text-sm uppercase tracking-wide">ระยะ Mini Marathon 10.5 KM</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Trophy className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                    <span className="font-medium text-slate-200">ถ้วยรางวัลเกียรติยศ (แยกชาย/หญิง)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-300">
                                        สงวนสิทธิ์เฉพาะ <strong className="text-white">สัญชาติไทย</strong> เท่านั้น
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Age Group Winners (Secondary) */}
                    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 group hover:border-indigo-200 transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Trophy size={180} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                                <Trophy size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2">Age Group Winners</h3>
                            <p className="text-slate-400 font-bold mb-6 text-sm uppercase tracking-wide">ระยะ 10.5 KM & 6 KM</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="font-medium text-slate-700">ถ้วยรางวัล อันดับ 1 - 3 (ทุกรุ่นอายุ)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-500">
                                        แบ่งกลุ่ม ชาย/หญิง ตามช่วงอายุมาตรฐาน
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* --- 3. INTERACTIVE AGE TABLE & FANCY --- */}
                <div className="grid lg:grid-cols-12 gap-8 mb-20">

                    {/* Age Table (8 cols) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-lg h-full">
                            <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-slate-400" /> ตรวจสอบรุ่นอายุของคุณ
                                </h4>
                                {/* Interactive Input */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase">ระบุอายุ:</span>
                                    <input
                                        type="number"
                                        placeholder="Age"
                                        className="w-16 px-2 py-1 text-sm font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-center"
                                        onChange={(e) => setSelectedAge(e.target.value ? parseInt(e.target.value) : null)}
                                    />
                                </div>
                            </div>

                            <div className="p-2">
                                <table className="w-full text-sm">
                                    <thead className="text-slate-400 text-xs uppercase font-bold bg-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Age Range</th>
                                            <th className="px-6 py-3 text-center text-blue-500">Male</th>
                                            <th className="px-6 py-3 text-center text-pink-500">Female</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {ageGroups.map((group, idx) => (
                                            <tr key={idx} className={`transition-all duration-300 rounded-xl ${getRowStyle(group.min, group.max)}`}>
                                                <td className="px-6 py-4 font-bold text-slate-700 border-l-4 border-transparent rounded-l-xl">
                                                    {group.label}
                                                </td>
                                                <td className="px-6 py-4 text-center text-blue-600 bg-blue-50/30 font-bold">●</td>
                                                <td className="px-6 py-4 text-center text-pink-600 bg-pink-50/30 rounded-r-xl font-bold">●</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {selectedAge !== null && (
                                <div className="px-6 py-3 bg-indigo-50 text-indigo-700 text-xs font-bold text-center border-t border-indigo-100">
                                    {selectedAge < 12
                                        ? "น้องๆ อายุต่ำกว่า 12 ปี ต้องวิ่งพร้อมผู้ปกครองครับ (Kids Run)"
                                        : "คุณมีสิทธิ์ลุ้นรางวัลในรุ่นที่ไฮไลท์ไว้! 🎯"}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fancy Award (4 cols) - Reduced Visual Weight */}
                    <div className="lg:col-span-4">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem] p-6 border border-purple-100 h-full flex flex-col justify-center text-center relative overflow-hidden group hover:shadow-lg transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="w-24 h-24 text-purple-600" />
                            </div>

                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-500 mb-4 mx-auto shadow-sm">
                                <Sparkles size={20} />
                            </div>
                            <h4 className="font-black text-slate-800 text-lg mb-1">Fancy Run Special</h4>
                            <p className="text-slate-500 text-xs mb-6 px-4">รางวัลพิเศษสำหรับชุดแฟนซี (ไม่จำกัดรุ่นอายุ)</p>

                            <div className="space-y-3 relative z-10">
                                <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm border border-white/50">
                                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Winner</span>
                                    <span className="text-xl font-black text-purple-600">3,000.-</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm border border-white/50">
                                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">2nd</span>
                                        <span className="text-lg font-black text-pink-500">2,000.-</span>
                                    </div>
                                    <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm border border-white/50">
                                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">3rd</span>
                                        <span className="text-lg font-black text-orange-500">1,000.-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- 4. RULES (CALM & CLEAR) --- */}
                <div className="max-w-4xl mx-auto border-t border-slate-100 pt-16">
                    <h3 className="text-2xl font-black text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
                        <Gavel className="w-6 h-6 text-slate-400" /> กติกาสำคัญที่ควรรู้
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Note Card 1 */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg border border-slate-100 shadow-sm shrink-0 h-fit">
                                <Baby className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">นักวิ่งรุ่นจิ๋ว (ต่ำกว่า 12 ปี)</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    สามารถร่วมกิจกรรมได้ปกติ แต่ต้องอยู่ในการดูแลของผู้ปกครองตลอดเส้นทางเพื่อความปลอดภัย
                                </p>
                            </div>
                        </div>

                        {/* Note Card 2 */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg border border-slate-100 shadow-sm shrink-0 h-fit">
                                <Gavel className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">กฎเหล็กการแข่งขัน</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    ต้องติด BIB ด้านหน้าให้เห็นชัดเจน, ห้ามใช้พาหนะทุ่นแรง, และคำตัดสินของกรรมการถือเป็นที่สิ้นสุด
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AwardsRulesSection;