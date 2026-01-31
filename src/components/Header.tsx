'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { id: 'home', href: '/#home', labelKey: 'home' },
    { id: 'race-info', href: '/#race-info', labelKey: 'categories' },
    { id: 'routes', href: '/#routes', labelKey: 'routes' },
    { id: 'awards', href: '/#awards', labelKey: 'awards' },
];

const Header = () => {
    const { language, toggleLanguage } = useLanguage();
    const pathname = usePathname();
    const t = translations[language].nav;

    // State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // 1. Scroll Effect & Active Section Spy
    useEffect(() => {
        const handleScroll = () => {
            // Header Background Logic
            setScrolled(window.scrollY > 20);

            // Active Section Logic (Scroll Spy)
            if (pathname === '/') {
                const sections = NAV_ITEMS.map(item => item.id);
                const current = sections.find(section => {
                    const element = document.getElementById(section);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        return rect.top <= 150 && rect.bottom >= 150;
                    }
                    return false;
                });
                if (current) setActiveSection(current);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    // 2. Logic สี Header: เรียบง่ายขึ้น (Predictable)
    // หน้า Home + ยังไม่ scroll + เมนูไม่เปิด = Transparent
    // นอกนั้น = Solid White ทั้งหมด
    const isHomePage = pathname === '/';
    const isTransparent = isHomePage && !scrolled && !isMenuOpen;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = !isMenuOpen ? 'hidden' : 'unset';
    };

    return (
        <>
            <header
                className={`
                    fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b
                    ${isTransparent
                        ? 'bg-transparent border-transparent py-6'
                        : 'bg-white border-slate-100 py-3 shadow-sm'}
                `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                    {/* --- Brand Identity --- */}
                    <Link href="/" className="flex items-center gap-3 group z-50">
                        <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                            ${isTransparent
                                ? 'bg-white/20 backdrop-blur-md text-white border border-white/20'
                                : 'bg-deep-blue text-neon-green shadow-lg shadow-blue-900/10'}
                        `}>
                            <Leaf className="w-6 h-6 fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-xl font-black leading-none tracking-tight transition-colors ${isTransparent ? 'text-white' : 'text-slate-900'}`}>
                                MANGROVE
                            </span>
                            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${isTransparent ? 'text-white/80' : 'text-slate-500'}`}>
                                RUN 2026
                            </span>
                        </div>
                    </Link>

                    {/* --- Desktop Nav (Clean & Active State Aware) --- */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeSection === item.id && isHomePage;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`
                                        relative px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all rounded-full
                                        ${isTransparent
                                            ? 'text-white hover:bg-white/10'
                                            : isActive
                                                ? 'text-deep-blue bg-slate-100' // Active State ชัดเจน
                                                : 'text-slate-500 hover:text-deep-blue hover:bg-slate-50'}
                                    `}
                                >
                                    {/* @ts-ignore */}
                                    {t[item.labelKey]}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* --- Desktop Actions --- */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all border
                                ${isTransparent
                                    ? 'border-white/20 text-white hover:bg-white/10'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                            `}
                        >
                            <Globe size={14} />
                            <span>{language === 'th' ? 'EN' : 'TH'}</span>
                        </button>

                        {/* CTA: Consistent Styling (Brand Anchor) */}
                        <Link href="/register">
                            <button className="bg-neon-green text-deep-blue px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wide shadow-lg shadow-green-400/20 hover:brightness-105 hover:-translate-y-0.5 transition-all active:scale-95">
                                {t.register}
                            </button>
                        </Link>
                    </div>

                    {/* --- Mobile Toggle --- */}
                    <button
                        onClick={toggleMenu}
                        className={`md:hidden p-2 rounded-lg transition-colors z-50 ${isTransparent ? 'text-white' : 'text-slate-800'}`}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>

            {/* --- Mobile Menu (Lighter & Faster) --- */}
            <div
                className={`
                    fixed inset-0 z-40 bg-white md:hidden transition-all duration-300 ease-out
                    ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
                `}
            >
                <div className="flex flex-col h-full pt-24 px-6 pb-8">
                    {/* Mobile Nav Links */}
                    <div className="flex flex-col gap-2">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={toggleMenu}
                                className={`
                                    text-2xl font-black uppercase py-4 border-b border-slate-100 flex items-center justify-between group
                                    ${activeSection === item.id && isHomePage ? 'text-deep-blue' : 'text-slate-400'}
                                `}
                            >
                                {/* @ts-ignore */}
                                {t[item.labelKey]}
                                <span className={`w-2 h-2 rounded-full ${activeSection === item.id && isHomePage ? 'bg-neon-green' : 'bg-transparent group-hover:bg-slate-200'}`} />
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Footer Actions */}
                    <div className="mt-auto space-y-4">
                        <button
                            onClick={() => { toggleLanguage(); toggleMenu(); }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 font-bold text-slate-600"
                        >
                            <Globe size={18} />
                            {language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
                        </button>

                        <Link href="/register" onClick={toggleMenu} className="block">
                            <button className="w-full py-4 bg-deep-blue text-neon-green font-black rounded-xl text-lg uppercase tracking-wider shadow-xl shadow-blue-900/10">
                                {t.register}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;