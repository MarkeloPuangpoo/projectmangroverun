import React, { useEffect, useState } from 'react';
import { RegistrationFormData } from '@/types/registration';
import { User, CreditCard, Phone, Mail, Droplet, Activity, UserCircle2, ChevronDown } from 'lucide-react';

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

    // --- Logic สำหรับ Dropdown วันเกิด ---
    // ใช้ Local State เพื่อจัดการค่าชั่วคราว ก่อนส่งไปรวมเป็น YYYY-MM-DD
    const [dateState, setDateState] = useState({
        day: '',
        month: '',
        year: ''
    });

    // Sync from FormData on Mount (กรณีมีข้อมูลเดิม - เช่น ย้อนกลับมาแก้ไข)
    useEffect(() => {
        if (formData.birthDate) {
            const [y, m, d] = formData.birthDate.split('-');
            setDateState({
                day: d || '',
                month: m || '',
                year: y || ''
            });
        }
    }, []); // Run once on mount

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // ย้อนหลัง 100 ปี
    const months = [
        { val: '01', label: 'มกราคม (Jan)' }, { val: '02', label: 'กุมภาพันธ์ (Feb)' },
        { val: '03', label: 'มีนาคม (Mar)' }, { val: '04', label: 'เมษายน (Apr)' },
        { val: '05', label: 'พฤษภาคม (May)' }, { val: '06', label: 'มิถุนายน (Jun)' },
        { val: '07', label: 'กรกฎาคม (Jul)' }, { val: '08', label: 'สิงหาคม (Aug)' },
        { val: '09', label: 'กันยายน (Sep)' }, { val: '10', label: 'ตุลาคม (Oct)' },
        { val: '11', label: 'พฤศจิกายน (Nov)' }, { val: '12', label: 'ธันวาคม (Dec)' }
    ];

    // คำนวณจำนวนวันในเดือนนั้นๆ
    const getDaysInMonth = (year: string, month: string) => {
        if (!year || !month) return 31;
        return new Date(parseInt(year), parseInt(month), 0).getDate();
    };

    // Dynamic Days Array
    const days = Array.from({ length: getDaysInMonth(dateState.year, dateState.month) }, (_, i) =>
        (i + 1).toString().padStart(2, '0')
    );

    const handleDateChange = (field: 'day' | 'month' | 'year', value: string) => {
        // Calculate new state based on current closure 'dateState'
        // This is safe for user interactions
        const newState = { ...dateState, [field]: value };

        // Check leap year / max days adjustment
        if (newState.year && newState.month && newState.day) {
            const maxDay = getDaysInMonth(newState.year, newState.month);
            if (parseInt(newState.day) > maxDay) {
                newState.day = maxDay.toString().padStart(2, '0');
            }
        }

        // 1. Update Local State
        setDateState(newState);

        // 2. Update Parent FormData
        if (newState.year && newState.month && newState.day) {
            updateFormData({ birthDate: `${newState.year}-${newState.month}-${newState.day}` });
        } else {
            updateFormData({ birthDate: '' });
        }
    };

    // Style Helpers
    const inputClass = "w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all bg-white/50 focus:bg-white placeholder:text-gray-400 font-medium text-deep-blue";
    const labelClass = "block text-sm font-bold text-gray-700 mb-1.5 ml-1";
    const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-deep-blue transition-colors";

    return (
        <div className="space-y-8 animate-fade-in-up">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <UserCircle2 className="w-6 h-6 text-deep-blue" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-deep-blue">ข้อมูลส่วนตัว</h2>
                    <p className="text-xs text-gray-500">Personal Information</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Names Row (เหมือนเดิม) */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <label className={labelClass}>ชื่อ-นามสกุล (ภาษาไทย) <span className="text-red-500">*</span></label>
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

                {/* ID & Gender Row (เหมือนเดิม) */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <label className={labelClass}>
                            เลขบัตรประชาชน / Passport No. <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <CreditCard className={iconClass} />
                            <input
                                type="text"
                                required
                                maxLength={13}
                                className={`${inputClass} peer tracking-wide`}
                                placeholder="1234567890123"
                                value={formData.nationalId}
                                onChange={(e) => updateFormData({ nationalId: e.target.value.replace(/\D/g, '') })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>เพศ / Gender <span className="text-red-500">*</span></label>
                        <div className="flex gap-4 h-[50px]">
                            <label className="flex-1 cursor-pointer relative">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    className="peer sr-only"
                                    checked={formData.gender === 'male'}
                                    onChange={() => updateFormData({ gender: 'male' })}
                                />
                                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 peer-checked:bg-deep-blue peer-checked:text-white peer-checked:border-deep-blue peer-checked:shadow-md transition-all">
                                    <span className="font-bold flex items-center gap-2">Male</span>
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer relative">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    className="peer sr-only"
                                    checked={formData.gender === 'female'}
                                    onChange={() => updateFormData({ gender: 'female' })}
                                />
                                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 peer-checked:bg-pink-500 peer-checked:text-white peer-checked:border-pink-500 peer-checked:shadow-md transition-all">
                                    <span className="font-bold flex items-center gap-2">Female</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* --- Birth Date (Custom Dropdown) --- */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <label className={labelClass}>วันเกิด / Date of Birth <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-[1fr_1.8fr_1.2fr] gap-3">
                            {/* Day */}
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-8 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neon-green/50 bg-white appearance-none text-center font-medium text-deep-blue text-sm"
                                    value={dateState.day || ''}
                                    onChange={(e) => handleDateChange('day', e.target.value)}
                                >
                                    <option value="" disabled>วัน</option>
                                    {days.map(d => <option key={d} value={d}>{parseInt(d)}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Month */}
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-8 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neon-green/50 bg-white appearance-none font-medium text-deep-blue text-sm"
                                    value={dateState.month || ''}
                                    onChange={(e) => handleDateChange('month', e.target.value)}
                                >
                                    <option value="" disabled>เดือน</option>
                                    {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Year */}
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-8 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neon-green/50 bg-white appearance-none text-center font-medium text-deep-blue text-sm"
                                    value={dateState.year || ''}
                                    onChange={(e) => handleDateChange('year', e.target.value)}
                                >
                                    <option value="" disabled>ปี</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Age Display */}
                    <div>
                        <label className={labelClass}>อายุ (วันแข่งขัน) / Age</label>
                        <div className="relative h-[52px] bg-gray-50 rounded-xl border border-gray-200 flex items-center px-4 justify-between select-none">
                            <span className="text-gray-500 text-sm font-medium">Auto-calculated</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-deep-blue">
                                    {formData.age ? formData.age : '-'}
                                </span>
                                <span className="text-xs text-gray-400 font-bold uppercase mt-1">Years</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-200 my-2"></div>

                {/* Contact & Medical Row (เหมือนเดิม) */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <label className={labelClass}>หมู่เลือด / Blood Type <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Droplet className={iconClass} />
                            <select
                                required
                                className={`${inputClass} peer appearance-none cursor-pointer`}
                                value={formData.bloodType}
                                onChange={(e) => updateFormData({ bloodType: e.target.value })}
                            >
                                <option value="" disabled>เลือก / Select</option>
                                <option value="A">Group A</option>
                                <option value="B">Group B</option>
                                <option value="O">Group O</option>
                                <option value="AB">Group AB</option>
                                <option value="Unknown">ไม่ทราบ / Unknown</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

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
                </div>

                <div className="relative group">
                    <label className={labelClass}>อีเมล / Email <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Mail className={iconClass} />
                        <input
                            type="email"
                            required
                            className={`${inputClass} peer`}
                            placeholder="yourname@email.com"
                            value={formData.email}
                            onChange={(e) => updateFormData({ email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="relative group">
                    <label className={labelClass}>โรคประจำตัว - การแพ้ยา / Medical Conditions</label>
                    <div className="relative">
                        <Activity className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 peer-focus:text-deep-blue transition-colors" />
                        <textarea
                            className={`${inputClass} pl-11 min-h-[100px] peer resize-none py-3`}
                            placeholder="ระบุโรคประจำตัว หรือ ยาที่แพ้ (ถ้ามี) / Specify if any"
                            value={formData.medicalConditions}
                            onChange={(e) => updateFormData({ medicalConditions: e.target.value })}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StepPersonal;