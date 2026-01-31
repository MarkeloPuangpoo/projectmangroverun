import React, { useEffect, useState } from 'react';
import { RegistrationFormData } from '@/types/registration';
import { User, CreditCard, Phone, Mail, Activity, UserCircle2, ChevronDown, Calendar, ShieldCheck } from 'lucide-react';

interface StepPersonalProps {
    formData: RegistrationFormData;
    updateFormData: (data: Partial<RegistrationFormData>) => void;
}

const StepPersonal: React.FC<StepPersonalProps> = ({ formData, updateFormData }) => {
    // --- Logic คำนวณอายุ ---
    useEffect(() => {
        if (formData.birthDate) {
            const eventDate = new Date('2026-05-25');
            const birthDate = new Date(formData.birthDate);
            let age = eventDate.getFullYear() - birthDate.getFullYear();
            const m = eventDate.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && eventDate.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age !== formData.age) {
                updateFormData({ age });
            }
        }
    }, [formData.birthDate, formData.age, updateFormData]);

    // --- Date State Management ---
    const [dateState, setDateState] = useState({ day: '', month: '', year: '' });

    // Sync on Mount
    useEffect(() => {
        if (formData.birthDate) {
            const [y, m, d] = formData.birthDate.split('-');
            setDateState({ day: d || '', month: m || '', year: y || '' });
        }
    }, []);

    // Date Constants
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = [
        { val: '01', label: 'มกราคม (Jan)' }, { val: '02', label: 'กุมภาพันธ์ (Feb)' },
        { val: '03', label: 'มีนาคม (Mar)' }, { val: '04', label: 'เมษายน (Apr)' },
        { val: '05', label: 'พฤษภาคม (May)' }, { val: '06', label: 'มิถุนายน (Jun)' },
        { val: '07', label: 'กรกฎาคม (Jul)' }, { val: '08', label: 'สิงหาคม (Aug)' },
        { val: '09', label: 'กันยายน (Sep)' }, { val: '10', label: 'ตุลาคม (Oct)' },
        { val: '11', label: 'พฤศจิกายน (Nov)' }, { val: '12', label: 'ธันวาคม (Dec)' }
    ];

    const getDaysInMonth = (year: string, month: string) => {
        if (!year || !month) return 31;
        return new Date(parseInt(year), parseInt(month), 0).getDate();
    };

    const days = Array.from({ length: getDaysInMonth(dateState.year, dateState.month) }, (_, i) =>
        (i + 1).toString().padStart(2, '0')
    );

    const handleDateChange = (field: 'day' | 'month' | 'year', value: string) => {
        const newState = { ...dateState, [field]: value };

        // Auto-correct day if month changes (e.g., 31 Feb -> 28 Feb)
        if (newState.year && newState.month && newState.day) {
            const maxDay = getDaysInMonth(newState.year, newState.month);
            if (parseInt(newState.day) > maxDay) {
                newState.day = maxDay.toString().padStart(2, '0');
            }
        }

        setDateState(newState);

        if (newState.year && newState.month && newState.day) {
            updateFormData({ birthDate: `${newState.year}-${newState.month}-${newState.day}` });
        } else {
            updateFormData({ birthDate: '' });
        }
    };

    // --- Medical Toggle State ---
    const [hasMedicalCondition, setHasMedicalCondition] = useState(!!formData.medicalConditions);

    // Style Helpers
    const inputClass = "w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all bg-white/50 focus:bg-white placeholder:text-gray-400 font-medium text-deep-blue text-sm";
    const labelClass = "block text-sm font-bold text-gray-700 mb-1.5 ml-1";
    const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-deep-blue transition-colors";

    return (
        <div className="space-y-10 animate-fade-in-up">

            {/* --- Section 1: Identity --- */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <UserCircle2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">ข้อมูลส่วนตัว (Identity)</h3>
                        <p className="text-xs text-slate-500">กรุณากรอกข้อมูลให้ตรงกับบัตรประชาชน</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <label className={labelClass}>ชื่อ-นามสกุล (ไทย) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User className={iconClass} />
                            <input
                                type="text"
                                required
                                className={`${inputClass} peer`}
                                placeholder="สมชาย ใจดี"
                                value={formData.fullNameTh}
                                onChange={(e) => updateFormData({ fullNameTh: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="relative group">
                        <label className={labelClass}>Full Name (English) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User className={iconClass} />
                            <input
                                type="text"
                                required
                                className={`${inputClass} peer`}
                                placeholder="Somchai Jaidee"
                                value={formData.fullNameEn}
                                onChange={(e) => updateFormData({ fullNameEn: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <label className={labelClass}>
                            เลขบัตร ปชช. / Passport No. <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <CreditCard className={iconClass} />
                            <input
                                type="text"
                                required
                                className={`${inputClass} peer font-mono tracking-wide`}
                                placeholder="1234567890123 / A1234567"
                                value={formData.nationalId}
                                // Allow both numbers and letters (for passports)
                                onChange={(e) => updateFormData({ nationalId: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>เพศ / Gender <span className="text-red-500">*</span></label>
                        <div className="flex gap-3 h-[50px]">
                            {['male', 'female'].map((g) => (
                                <label key={g} className="flex-1 cursor-pointer relative group">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        className="peer sr-only"
                                        checked={formData.gender === g}
                                        onChange={() => updateFormData({ gender: g as 'male' | 'female' })}
                                    />
                                    <div className={`
                                        absolute inset-0 flex items-center justify-center rounded-xl border transition-all
                                        peer-checked:font-bold peer-checked:shadow-sm
                                        ${g === 'male'
                                            ? 'peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600'
                                            : 'peer-checked:bg-pink-500 peer-checked:text-white peer-checked:border-pink-500'}
                                        border-gray-200 bg-white text-gray-500 hover:bg-gray-50
                                    `}>
                                        <span className="capitalize">{g}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Birth Date (Logical Order: Year -> Month -> Day) --- */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <label className={labelClass}>วันเกิด / Date of Birth <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-[1.2fr_1.8fr_1fr] gap-2">
                            {/* 1. Year First */}
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-8 py-3.5 rounded-xl border border-gray-200 bg-white appearance-none text-center font-medium text-deep-blue text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                    value={dateState.year || ''}
                                    onChange={(e) => handleDateChange('year', e.target.value)}
                                >
                                    <option value="" disabled>Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {/* 2. Month */}
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-8 py-3.5 rounded-xl border border-gray-200 bg-white appearance-none font-medium text-deep-blue text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                    value={dateState.month || ''}
                                    onChange={(e) => handleDateChange('month', e.target.value)}
                                >
                                    <option value="" disabled>Month</option>
                                    {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {/* 3. Day */}
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-8 py-3.5 rounded-xl border border-gray-200 bg-white appearance-none text-center font-medium text-deep-blue text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                    value={dateState.day || ''}
                                    onChange={(e) => handleDateChange('day', e.target.value)}
                                >
                                    <option value="" disabled>Day</option>
                                    {days.map(d => <option key={d} value={d}>{parseInt(d)}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    {/* Age Display (Contextual) */}
                    <div>
                        <label className={labelClass}>อายุ (ในวันแข่งขัน) / Age</label>
                        <div className="relative h-[52px] bg-slate-50 rounded-xl border border-slate-200 flex items-center px-4 justify-between select-none">
                            <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                                <Calendar size={14} /> สำหรับจัดรุ่นอายุ (Class)
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl font-black ${formData.age ? 'text-indigo-600' : 'text-slate-300'}`}>
                                    {formData.age ? formData.age : '-'}
                                </span>
                                <span className="text-xs text-slate-400 font-bold uppercase mt-1">Yrs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-dashed border-gray-200"></div>

            {/* --- Section 2: Contact --- */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <Phone size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">ข้อมูลติดต่อ (Contact)</h3>
                        <p className="text-xs text-slate-500">ช่องทางสำหรับรับข่าวสารและผลการสมัคร</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <label className={labelClass}>เบอร์โทรศัพท์ / Phone <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Phone className={iconClass} />
                            <input
                                type="tel"
                                required
                                className={`${inputClass} peer`}
                                placeholder="08x-xxx-xxxx"
                                value={formData.phone}
                                onChange={(e) => updateFormData({ phone: e.target.value.replace(/[^\d-]/g, '') })}
                            />
                        </div>
                    </div>
                    <div className="relative group">
                        <label className={labelClass}>อีเมล / Email <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Mail className={iconClass} />
                            <input
                                type="email"
                                required
                                className={`${inputClass} peer`}
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => updateFormData({ email: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-dashed border-gray-200"></div>

            {/* --- Section 3: Safety (Optional Toggle) --- */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">ข้อมูลสุขภาพ (Safety)</h3>
                        <p className="text-xs text-slate-500">เพื่อความปลอดภัยทางการแพทย์ (ถ้ามี)</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Blood Type */}
                    <div className="relative group">
                        <label className={labelClass}>หมู่เลือด / Blood Type <span className="text-red-500">*</span></label>
                        <select
                            required
                            className={`${inputClass} pl-4 cursor-pointer appearance-none`}
                            value={formData.bloodType}
                            onChange={(e) => updateFormData({ bloodType: e.target.value })}
                        >
                            <option value="" disabled>เลือก / Select</option>
                            {['A', 'B', 'O', 'AB', 'Unknown'].map(t => (
                                <option key={t} value={t}>{t === 'Unknown' ? 'ไม่ทราบ' : `Group ${t}`}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Medical Condition Toggle */}
                    <div className="relative">
                        <label className={labelClass}>โรคประจำตัว / แพ้ยา ?</label>
                        <div className="flex gap-4 mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setHasMedicalCondition(false);
                                    updateFormData({ medicalConditions: '' });
                                }}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${!hasMedicalCondition
                                        ? 'bg-slate-100 border-slate-300 text-slate-600'
                                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                ไม่มี (No)
                            </button>
                            <button
                                type="button"
                                onClick={() => setHasMedicalCondition(true)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${hasMedicalCondition
                                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                มี (Yes)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conditional Textarea */}
                {hasMedicalCondition && (
                    <div className="animate-fade-in-down">
                        <label className={`${labelClass} text-rose-600`}>โปรดระบุรายละเอียด (สำคัญ)</label>
                        <div className="relative">
                            <Activity className="absolute left-3.5 top-3.5 w-5 h-5 text-rose-400" />
                            <textarea
                                className={`${inputClass} pl-11 min-h-[100px] bg-rose-50/30 border-rose-100 focus:border-rose-400 focus:ring-rose-100`}
                                placeholder="เช่น แพ้ยา Penicillin, โรคหอบหืด..."
                                value={formData.medicalConditions}
                                onChange={(e) => updateFormData({ medicalConditions: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default StepPersonal;