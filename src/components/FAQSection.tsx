'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, MapPin, Shirt, AlertCircle, Car } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FAQSection = () => {
    const { language } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Data based on PDF info & Standard Event Rules
    const faqs = [
        {
            category: "General",
            question: language === 'th' ? "งานจัดที่ไหน และปล่อยตัวกี่โมง?" : "Where is the event and what time does it start?",
            answer: language === 'th'
                ? "งานจัดที่ โรงเรียนบางปะกง \"บวรวิทยายน\" เวลาปล่อยตัว: 10.5KM (05:45 น.), 6KM (06:05 น.) และ 5KM (06:15 น.)"
                : "The event is at Bangpakong 'Bowonwittayayon' School. Start times: 10.5KM (05:45), 6KM (06:05), and 5KM (06:15).",
            icon: MapPin
        },
        {
            category: "Services",
            question: language === 'th' ? "มีสถานที่จอดรถให้บริการหรือไม่?" : "Is there parking available?",
            answer: language === 'th'
                ? "มีจุดจอดรถรองรับหลายจุด ได้แก่: 1. สภ.บางปะกง 2. ปั๊ม Esso 3. กรมพัฒนาที่ดินฉะเชิงเทรา 4. ด่านกักกันสัตว์ฉะเชิงเทรา"
                : "Parking is available at: 1. Bang Pakong Police Station 2. Esso Station 3. Chachoengsao Land Development Station 4. Animal Quarantine Station.",
            icon: Car
        },
        {
            category: "Race Kit",
            question: language === 'th' ? "รับเสื้อและ BIB ได้ที่ไหน?" : "Where to pick up the Race Kit?",
            answer: language === 'th'
                ? "สามารถเลือกรับได้ 2 ช่องทาง: 1. รับด้วยตนเอง ณ โรงเรียนบางปะกง 'บวรวิทยายน' (24-25 พ.ค.) 2. จัดส่งทางไปรษณีย์ (ค่าจัดส่ง 50 บาท)"
                : "Two options: 1. Pick up at Bangpakong 'Bowonwittayayon' School (May 24-25) 2. Postal delivery (50 THB fee).",
            icon: Shirt
        },
        {
            category: "Rules",
            question: language === 'th' ? "เด็กเข้าร่วมกิจกรรมได้หรือไม่?" : "Can children participate?",
            answer: language === 'th'
                ? "ได้ครับ เด็กอายุต่ำกว่า 12 ปี สามารถสมัครได้ แต่ต้องอยู่ภายใต้การดูแลของผู้ปกครองตลอดเวลาเพื่อความปลอดภัย"
                : "Yes, children under 12 can register but must be accompanied by a guardian at all times.",
            icon: AlertCircle
        },
        {
            category: "Policy",
            question: language === 'th' ? "สมัครแล้วขอคืนเงินได้หรือไม่?" : "Is the registration fee refundable?",
            answer: language === 'th'
                ? "ขอสงวนสิทธิ์ไม่คืนเงินค่าสมัครทุกกรณี แต่สามารถโอนสิทธิ์ให้ผู้อื่นได้ (มีค่าธรรมเนียมการโอนสิทธิ์)"
                : "Registration fees are non-refundable under any circumstances, but transfers are allowed (fees apply).",
            icon: HelpCircle
        }
    ];

    return (
        <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-deep-blue mb-4">
                        คำถามที่พบบ่อย (FAQ)
                    </h2>
                    <p className="text-gray-500">
                        ข้อสงสัยเกี่ยวกับการแข่งขัน การเดินทาง และบริการต่างๆ
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`
                                    bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                                    ${isOpen ? 'border-neon-green shadow-lg shadow-green-100' : 'border-gray-100 hover:border-gray-300'}
                                `}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                            ${isOpen ? 'bg-deep-blue text-neon-green' : 'bg-gray-100 text-gray-500'}
                                        `}>
                                            <faq.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                                {faq.category}
                                            </span>
                                            <h3 className={`font-bold text-lg ${isOpen ? 'text-deep-blue' : 'text-gray-700'}`}>
                                                {faq.question}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className={`
                                        p-2 rounded-full transition-all duration-300
                                        ${isOpen ? 'bg-neon-green text-deep-blue rotate-180' : 'bg-gray-50 text-gray-400'}
                                    `}>
                                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </div>
                                </button>

                                <div
                                    className={`
                                        transition-all duration-300 ease-in-out
                                        ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                                    `}
                                >
                                    <div className="p-6 pt-0 pl-[4.5rem] pr-8 text-gray-600 leading-relaxed border-t border-dashed border-gray-100 mt-2">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contact Support */}
                <div className="mt-12 text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-600 mb-4 font-medium">ยังไม่พบคำตอบที่คุณต้องการ?</p>
                    <a
                        href="https://m.me/mangroverun"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-deep-blue text-white rounded-xl font-bold hover:bg-navy transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <HelpCircle className="w-5 h-5" /> ติดต่อทีมงาน (Contact Support)
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;