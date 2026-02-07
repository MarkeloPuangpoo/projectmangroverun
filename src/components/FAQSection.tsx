'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, MapPin, Shirt, AlertCircle, Car } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';

const FAQSection = () => {
    const { language } = useLanguage();
    const t = translations[language].faq;
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Icon mapping matching the order in translations
    const icons = [MapPin, Car, Shirt, AlertCircle, HelpCircle];

    // Combine translation items with icons
    const faqs = t.items.map((item: any, index: number) => ({
        ...item,
        icon: icons[index]
    }));

    return (
        <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-deep-blue mb-4">
                        {t.title}
                    </h2>
                    <p className="text-gray-500">
                        {t.subtitle}
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
                    <p className="text-gray-600 mb-4 font-medium">{t.support.text}</p>
                    <a
                        href="https://m.me/mangroverun"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-deep-blue text-white rounded-xl font-bold hover:bg-navy transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <HelpCircle className="w-5 h-5" /> {t.support.button}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;