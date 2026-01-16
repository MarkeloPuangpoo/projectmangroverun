import React, { useEffect, useState } from 'react';
import { X, Ruler, ArrowLeftRight, ArrowUpDown } from 'lucide-react';

interface SizeChartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
    // Animation state
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    const sizes = [
        { name: '5XS', chest: 26, length: 20 },
        { name: '4XS', chest: 28, length: 21 },
        { name: '3XS', chest: 30, length: 22 },
        { name: '2XS', chest: 32, length: 23 },
        { name: 'SS', chest: 34, length: 24 },
        { name: 'S', chest: 36, length: 25 },
        { name: 'M', chest: 38, length: 26 },
        { name: 'L', chest: 40, length: 27 },
        { name: 'XL', chest: 42, length: 28 },
        { name: '2XL', chest: 44, length: 29 },
        { name: '3XL', chest: 46, length: 30 },
        { name: '4XL', chest: 48, length: 31 },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`
                    absolute inset-0 bg-deep-blue/80 backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0'}
                `}
                onClick={onClose}
            />

            {/* Modal Card */}
            <div
                className={`
                    bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col
                    transform transition-all duration-300 ease-out
                    ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
                `}
            >
                {/* Header */}
                <div className="bg-deep-blue text-white p-5 md:p-6 flex items-center justify-between shadow-md z-20 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Ruler className="w-6 h-6 text-neon-green" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">ตารางไซส์เสื้อ</h3>
                            <p className="text-xs text-blue-200">Size Chart (Inches)</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                    >
                        <X className="w-6 h-6 text-white/70 group-hover:text-white group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto p-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">

                    {/* Left: Visual Guide */}
                    <div className="p-8 md:w-5/12 bg-gray-50 flex flex-col items-center justify-center text-center">
                        <div className="relative w-48 md:w-56 mb-6">
                            {/* Simple T-Shirt SVG */}
                            <svg viewBox="0 0 100 100" className="w-full drop-shadow-xl text-white fill-current">
                                <path d="M30,10 L40,15 L60,15 L70,10 L90,30 L80,40 L70,30 L70,90 L30,90 L30,30 L20,40 L10,30 Z" stroke="#1B1F3B" strokeWidth="1" />
                            </svg>

                            {/* Width Arrow (Green) */}
                            <div className="absolute top-[45%] left-[30%] right-[30%] h-px bg-neon-green/50"></div>
                            <div className="absolute top-[45%] left-[30%] right-[30%] flex justify-between items-center -mt-3">
                                <ArrowLeftRight className="w-5 h-5 text-neon-green bg-white rounded-full p-0.5 shadow-sm" />
                                <span className="text-xs font-bold text-deep-blue bg-neon-green px-1.5 rounded">Chest</span>
                                <ArrowLeftRight className="w-5 h-5 text-neon-green bg-white rounded-full p-0.5 shadow-sm" />
                            </div>

                            {/* Length Arrow (Blue) */}
                            <div className="absolute top-[15%] bottom-[10%] right-[15%] w-px bg-deep-blue/30 border-l border-dashed border-deep-blue"></div>
                            <div className="absolute top-[50%] right-[2%] flex flex-col items-center -mt-6">
                                <ArrowUpDown className="w-5 h-5 text-deep-blue bg-white rounded-full p-0.5 shadow-sm mb-1" />
                                <span className="text-xs font-bold text-white bg-deep-blue px-1.5 rounded rotate-90">Length</span>
                            </div>
                        </div>
                        <h4 className="font-bold text-deep-blue">วิธีการวัด (How to Measure)</h4>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                            <span className="text-neon-green font-bold">Chest (รอบอก):</span> วัดรอบอกส่วนที่กว้างที่สุด<br />
                            <span className="text-deep-blue font-bold">Length (ยาว):</span> วัดจากไหล่ถึงชายเสื้อ
                        </p>
                    </div>

                    {/* Right: Table */}
                    <div className="p-0 md:w-7/12 bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-gray-500 font-bold uppercase text-xs tracking-wider">Size</th>
                                        <th className="px-6 py-4 text-center text-deep-blue font-bold">
                                            <span className="flex items-center justify-center gap-1">
                                                <ArrowLeftRight className="w-4 h-4 text-neon-green" /> รอบอก (นิ้ว)
                                            </span>
                                        </th>
                                        <th className="px-6 py-4 text-center text-deep-blue font-bold">
                                            <span className="flex items-center justify-center gap-1">
                                                <ArrowUpDown className="w-4 h-4" /> ความยาว (นิ้ว)
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sizes.map((size) => (
                                        <tr key={size.name} className="group hover:bg-blue-50/40 transition-colors duration-200">
                                            <td className="px-6 py-3">
                                                <span className="inline-block w-10 h-10 leading-10 text-center rounded-lg bg-gray-100 font-black text-deep-blue group-hover:bg-deep-blue group-hover:text-neon-green transition-all">
                                                    {size.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center text-gray-600 font-medium group-hover:text-deep-blue group-hover:scale-110 transition-transform origin-center">
                                                {size.chest}"
                                            </td>
                                            <td className="px-6 py-3 text-center text-gray-600 font-medium group-hover:text-deep-blue group-hover:scale-110 transition-transform origin-center">
                                                {size.length}"
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeChartModal;