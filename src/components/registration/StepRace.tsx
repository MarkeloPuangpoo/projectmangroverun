import React from 'react';
import { RegistrationFormData } from '@/types/registration';
import { Trophy, Zap, Heart, Crown, Ruler, CheckCircle2, Truck, Store, Shirt, MapPin } from 'lucide-react';

interface StepRaceProps {
    formData: RegistrationFormData;
    updateFormData: (data: Partial<RegistrationFormData>) => void;
    onOpenSizeChart: () => void;
}

const StepRace: React.FC<StepRaceProps> = ({ formData, updateFormData, onOpenSizeChart }) => {

    // Configuration for Race Categories with Theme Colors
    const categories = [
        {
            id: "10.5KM",
            distance: "10.5K",
            title: "Mini Marathon",
            price: 500,
            icon: Trophy,
            bgActive: "bg-orange-50",
            borderActive: "border-orange-500",
            textActive: "text-orange-600",
            ringActive: "ring-orange-200"
        },
        {
            id: "6KM",
            distance: "6K",
            title: "Fun Run",
            price: 500,
            icon: Zap,
            bgActive: "bg-emerald-50",
            borderActive: "border-emerald-500",
            textActive: "text-emerald-600",
            ringActive: "ring-emerald-200"
        },
        {
            id: "5KM",
            distance: "5K",
            title: "Walk-Run",
            price: 500,
            icon: Heart,
            bgActive: "bg-pink-50",
            borderActive: "border-pink-500",
            textActive: "text-pink-600",
            ringActive: "ring-pink-200"
        },
        {
            id: "VIP",
            distance: "VIP",
            title: "All Distances",
            price: 2000,
            icon: Crown,
            bgActive: "bg-yellow-50",
            borderActive: "border-yellow-500",
            textActive: "text-yellow-600",
            ringActive: "ring-yellow-200"
        }
    ];

    const shirtSizes = ["5XS", "4XS", "3XS", "2XS", "SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

    return (
        <div className="space-y-10 animate-fade-in-up">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">ข้อมูลการแข่งขัน</h2>
                    <p className="text-xs text-slate-500">Race Information & Kits</p>
                </div>
            </div>

            {/* --- 1. Category Selection --- */}
            <section className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">
                    เลือกประเภทการแข่งขัน <span className="text-red-500">*</span>
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                    {categories.map((cat) => {
                        const isSelected = formData.raceCategory === cat.id;
                        return (
                            <label key={cat.id} className="cursor-pointer relative group block">
                                <input
                                    type="radio"
                                    name="raceCategory"
                                    value={cat.id}
                                    checked={isSelected}
                                    onChange={() => updateFormData({ raceCategory: cat.id as any })}
                                    className="peer sr-only"
                                />
                                <div className={`
                                    p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden flex items-center gap-4
                                    hover:shadow-md
                                    ${isSelected
                                        ? `${cat.borderActive} ${cat.bgActive} shadow-sm ring-4 ${cat.ringActive} ring-opacity-50`
                                        : 'border-slate-100 bg-white hover:border-slate-300'
                                    }
                                `}>
                                    {/* Icon Box */}
                                    <div className={`
                                        w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm transition-colors shrink-0
                                        ${isSelected ? 'bg-white' : 'bg-slate-100 text-slate-400'}
                                        ${isSelected ? cat.textActive : ''}
                                    `}>
                                        <cat.icon className="w-8 h-8" />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <h3 className={`text-2xl font-black tracking-tight ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                                                {cat.distance}
                                            </h3>
                                            {isSelected && <CheckCircle2 className={`w-6 h-6 ${cat.textActive}`} />}
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">{cat.title}</p>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-lg font-bold text-xs bg-white border border-slate-200 shadow-sm text-slate-700">
                                            ฿ {cat.price.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Decorative BG Icon */}
                                    <cat.icon className={`
                                        absolute -bottom-4 -right-4 w-32 h-32 opacity-5 pointer-events-none transition-transform duration-500
                                        ${isSelected ? 'scale-110 rotate-12' : 'scale-100'}
                                    `} />
                                </div>
                            </label>
                        );
                    })}
                </div>
            </section>

            <div className="border-t border-dashed border-gray-200"></div>

            {/* --- 2. Shirt Size Selection --- */}
            <section className="space-y-4">
                <div className="flex items-end justify-between">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                            ไซส์เสื้อ / Shirt Size <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-slate-400 mt-1">กรุณาตรวจสอบตารางไซส์ให้ถูกต้อง</p>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenSizeChart}
                        className="text-xs font-bold flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors"
                    >
                        <Ruler className="w-4 h-4" /> ดูตารางไซส์
                    </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-12 gap-2">
                    {shirtSizes.map((size) => (
                        <label key={size} className="cursor-pointer group relative">
                            <input
                                type="radio"
                                name="shirtSize"
                                value={size}
                                checked={formData.shirtSize === size}
                                onChange={() => updateFormData({ shirtSize: size })}
                                className="peer sr-only"
                            />
                            <div className="
                                py-3 text-center rounded-xl border-2 border-slate-100 font-bold text-slate-500 text-sm transition-all duration-200
                                hover:border-slate-300 hover:bg-slate-50
                                peer-checked:bg-slate-800 peer-checked:text-neon-green peer-checked:border-slate-800 peer-checked:shadow-lg peer-checked:scale-105 peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-slate-300
                            ">
                                {size}
                            </div>
                        </label>
                    ))}
                </div>
            </section>

            <div className="border-t border-dashed border-gray-200"></div>

            {/* --- 3. Shipping Method & Address --- */}
            <section className="space-y-6">
                <label className="block text-sm font-bold text-slate-700">
                    การรับอุปกรณ์ (Race Kit) <span className="text-red-500">*</span>
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Pickup */}
                    <label className="cursor-pointer group">
                        <input
                            type="radio"
                            name="shipping"
                            value="pickup"
                            checked={formData.shipping === 'pickup'}
                            onChange={() => updateFormData({ shipping: 'pickup' })}
                            className="peer sr-only"
                        />
                        <div className="
                            p-4 rounded-xl border-2 border-slate-100 flex items-center gap-4 transition-all h-full
                            hover:border-slate-300 hover:bg-slate-50
                            peer-checked:border-emerald-500 peer-checked:bg-emerald-50/20 peer-checked:shadow-sm
                        ">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 peer-checked:bg-emerald-100 peer-checked:text-emerald-600 transition-colors">
                                <Store className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-slate-800">รับด้วยตนเอง (Pickup)</div>
                                <div className="text-xs text-slate-500">24-25 พ.ค. ณ จุดปล่อยตัว</div>
                            </div>
                            <div className="px-3 py-1 rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                                Free
                            </div>
                        </div>
                    </label>

                    {/* Postal */}
                    <label className="cursor-pointer group">
                        <input
                            type="radio"
                            name="shipping"
                            value="postal"
                            checked={formData.shipping === 'postal'}
                            onChange={() => updateFormData({ shipping: 'postal' })}
                            className="peer sr-only"
                        />
                        <div className="
                            p-4 rounded-xl border-2 border-slate-100 flex items-center gap-4 transition-all h-full
                            hover:border-slate-300 hover:bg-slate-50
                            peer-checked:border-indigo-500 peer-checked:bg-indigo-50/20 peer-checked:shadow-sm
                        ">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 peer-checked:bg-indigo-100 peer-checked:text-indigo-600 transition-colors">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-slate-800">จัดส่งไปรษณีย์ (Postal)</div>
                                <div className="text-xs text-slate-500">รอรับที่บ้านภายใน 3-5 วัน</div>
                            </div>
                            <div className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 peer-checked:bg-indigo-600 peer-checked:text-white">
                                +50 ฿
                            </div>
                        </div>
                    </label>
                </div>

                {/* 🔥 Conditional Address Field (สำคัญมาก!) */}
                {formData.shipping === 'postal' && (
                    <div className="animate-fade-in-down pt-2">
                        <label className="block text-sm font-bold text-indigo-600 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> ที่อยู่สำหรับจัดส่ง (Shipping Address) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                required
                                rows={3}
                                className="w-full p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-slate-800 placeholder:text-slate-400 resize-none transition-all"
                                placeholder="บ้านเลขที่, หมู่, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์..."
                                value={formData.address || ''}
                                // หมายเหตุ: ตรวจสอบให้แน่ใจว่า type RegistrationFormData มี field 'address' ด้วยนะครับ
                                onChange={(e) => updateFormData({ address: e.target.value })}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-right">
                            *กรุณาตรวจสอบความถูกต้องเพื่อป้องกันพัสดุตีกลับ
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default StepRace;