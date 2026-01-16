import React from 'react';
import { RegistrationFormData } from '@/types/registration';
import { Trophy, Zap, Heart, Crown, Ruler, CheckCircle2, Truck, Store, Shirt } from 'lucide-react';

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
            // Theme: Energetic Orange
            bgActive: "bg-orange-50",
            borderActive: "border-orange-500",
            textActive: "text-orange-600",
            badgeColor: "bg-orange-100 text-orange-700"
        },
        {
            id: "6KM",
            distance: "6K",
            title: "Fun Run",
            price: 500,
            icon: Zap,
            // Theme: Nature Green
            bgActive: "bg-green-50",
            borderActive: "border-emerald-500",
            textActive: "text-emerald-600",
            badgeColor: "bg-emerald-100 text-emerald-700"
        },
        {
            id: "5KM",
            distance: "5K",
            title: "Walk-Run",
            price: 500,
            icon: Heart,
            // Theme: Healthy Pink
            bgActive: "bg-pink-50",
            borderActive: "border-pink-500",
            textActive: "text-pink-600",
            badgeColor: "bg-pink-100 text-pink-700"
        },
        {
            id: "VIP",
            distance: "VIP",
            title: "All Distances",
            price: 2000,
            icon: Crown,
            // Theme: Exclusive Gold
            bgActive: "bg-yellow-50",
            borderActive: "border-yellow-500",
            textActive: "text-yellow-600",
            badgeColor: "bg-yellow-100 text-yellow-800"
        }
    ];

    const shirtSizes = ["5XS", "4XS", "3XS", "2XS", "SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

    return (
        <div className="space-y-10 animate-fade-in-up">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Zap className="w-6 h-6 text-deep-blue" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-deep-blue">รายละเอียดการแข่งขัน</h2>
                    <p className="text-xs text-gray-500">Race Information & Kits</p>
                </div>
            </div>

            {/* 1. Category Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">
                    เลือกประเภทการแข่งขัน <span className="text-neon-green text-xs font-normal bg-deep-blue px-2 py-0.5 rounded-full ml-2">Select Category</span>
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                    {categories.map((cat) => {
                        const isSelected = formData.raceCategory === cat.id;
                        return (
                            <label key={cat.id} className="cursor-pointer relative group">
                                <input
                                    type="radio"
                                    name="raceCategory"
                                    value={cat.id}
                                    checked={isSelected}
                                    onChange={() => updateFormData({ raceCategory: cat.id as any })}
                                    className="peer sr-only"
                                />
                                <div className={`
                                    p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
                                    hover:shadow-lg hover:-translate-y-1
                                    ${isSelected
                                        ? `${cat.borderActive} ${cat.bgActive} shadow-md`
                                        : 'border-gray-100 bg-white hover:border-gray-300'
                                    }
                                `}>
                                    {/* Selection Indicator */}
                                    <div className={`
                                        absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
                                        bg-deep-blue text-white
                                    `}>
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>

                                    <div className="flex items-start gap-4 relative z-10">
                                        {/* Large Distance Number */}
                                        <div className={`
                                            w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm transition-colors
                                            ${isSelected ? 'bg-white' : 'bg-gray-100 text-gray-400'}
                                            ${isSelected ? cat.textActive : ''}
                                        `}>
                                            <cat.icon className="w-8 h-8" />
                                        </div>

                                        <div className="flex-1 pt-1">
                                            <div className="flex justify-between items-start pr-8">
                                                <div>
                                                    <h3 className={`text-2xl font-black tracking-tight ${isSelected ? 'text-deep-blue' : 'text-gray-700'}`}>
                                                        {cat.distance}
                                                    </h3>
                                                    <p className="text-sm font-medium text-gray-500">{cat.title}</p>
                                                </div>
                                            </div>

                                            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-lg font-bold text-sm bg-white border border-gray-100 shadow-sm">
                                                {cat.price.toLocaleString()} THB
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative Background Icon */}
                                    <cat.icon className={`
                                        absolute -bottom-4 -right-4 w-32 h-32 opacity-5 pointer-events-none transition-transform
                                        ${isSelected ? 'scale-110' : 'scale-100'}
                                    `} />
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-dashed border-gray-200"></div>

            {/* 2. Shirt Size Selection */}
            <div className="space-y-4">
                <div className="flex items-end justify-between">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                            ไซส์เสื้อ <Shirt className="w-4 h-4 text-gray-400" />
                        </label>
                        <p className="text-xs text-gray-400 mt-1">Select your shirt size</p>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenSizeChart}
                        className="text-sm text-deep-blue font-bold flex items-center gap-1.5 hover:text-neon-green transition-colors bg-gray-100 hover:bg-deep-blue px-3 py-1.5 rounded-lg"
                    >
                        <Ruler className="w-4 h-4" /> ตารางไซส์ (Chart)
                    </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {shirtSizes.map((size) => (
                        <label key={size} className="cursor-pointer group">
                            <input
                                type="radio"
                                name="shirtSize"
                                value={size}
                                checked={formData.shirtSize === size}
                                onChange={() => updateFormData({ shirtSize: size })}
                                className="peer sr-only"
                            />
                            <div className="
                                py-3.5 text-center rounded-xl border-2 border-gray-100 font-bold text-gray-600 relative overflow-hidden transition-all duration-200
                                hover:border-gray-300 hover:bg-gray-50
                                peer-checked:bg-deep-blue peer-checked:text-neon-green peer-checked:border-deep-blue peer-checked:shadow-lg peer-checked:shadow-blue-900/30 peer-checked:scale-105
                            ">
                                {size}
                                {/* Selection Dot */}
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-neon-green opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="border-t border-dashed border-gray-200"></div>

            {/* 3. Shipping Method */}
            <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">
                    การรับเสื้อและเบอร์วิ่ง <span className="text-gray-400 font-normal ml-2">Shipping Method</span>
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Pickup Option */}
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
                            p-4 rounded-xl border-2 border-gray-100 flex items-center gap-4 transition-all
                            hover:border-gray-300 hover:bg-gray-50
                            peer-checked:border-neon-green peer-checked:bg-green-50/30 peer-checked:shadow-sm
                        ">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-neon-green peer-checked:text-deep-blue transition-colors">
                                <Store className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-deep-blue">รับด้วยตนเอง (Pick up)</div>
                                <div className="text-xs text-gray-500">May 25, 2026 at Event Location</div>
                            </div>
                            <div className="px-3 py-1 rounded-lg bg-gray-100 text-xs font-bold text-gray-600 peer-checked:bg-neon-green peer-checked:text-deep-blue">
                                Free
                            </div>
                        </div>
                    </label>

                    {/* Postal Option */}
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
                            p-4 rounded-xl border-2 border-gray-100 flex items-center gap-4 transition-all
                            hover:border-gray-300 hover:bg-gray-50
                            peer-checked:border-neon-green peer-checked:bg-green-50/30 peer-checked:shadow-sm
                        ">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-neon-green peer-checked:text-deep-blue transition-colors">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-deep-blue">จัดส่งไปรษณีย์ (Postal)</div>
                                <div className="text-xs text-gray-500">Delivery within 3-5 days</div>
                            </div>
                            <div className="px-3 py-1 rounded-lg bg-gray-100 text-xs font-bold text-gray-600 peer-checked:bg-neon-green peer-checked:text-deep-blue">
                                +50 THB
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default StepRace;