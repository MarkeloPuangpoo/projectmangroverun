'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
    const { language, toggleLanguage } = useLanguage();
    const pathname = usePathname();
    const t = translations[language].nav;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    // ✅ FIXED: Logic สี Header
    // ถ้าอยู่หน้า Home ('/') และยังไม่ scroll -> โปร่งใส (ตัวหนังสือขาว)
    // ถ้าอยู่หน้าอื่น (เช่น /register) -> ทึบเสมอ (ตัวหนังสือดำ)
    const isHomePage = pathname === '/';
    const isTransparent = isHomePage && !scrolled && !isMenuOpen;

    const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => (
        <a
            href={href}
            onClick={() => mobile && toggleMenu()}
            className={`
                relative font-bold transition-all duration-300 group
                ${mobile
                    ? 'text-3xl text-deep-blue hover:text-neon-green'
                    : `text-sm uppercase tracking-wider ${isTransparent
                        ? 'text-white/90 hover:text-neon-green drop-shadow-md'
                        : 'text-gray-600 hover:text-deep-blue'}` // ✅ หน้า Register จะเข้าเงื่อนไขนี้ (สีเทาเข้ม)
                }
            `}
        >
            {children}
            {!mobile && (
                <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 group-hover:w-full w-0 ${isTransparent ? 'bg-neon-green' : 'bg-deep-blue'}`} />
            )}
        </a>
    );

    return (
        <>
            <header
                className={`
                    fixed top-0 left-0 right-0 z-50 transition-all duration-300
                    ${!isTransparent
                        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b leading-relaxed border-gray-100 py-0'
                        : 'bg-transparent py-4'}
                `}
            >
                <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">

                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-2 group z-50 relative">
                        <div className={`
                            w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105
                            ${isTransparent ? 'bg-white/20 backdrop-blur-md border border-white/30' : 'bg-deep-blue shadow-blue-900/20'}
                        `}>
                            <Leaf className={`w-5 h-5 md:w-6 md:h-6 ${isTransparent ? 'text-white' : 'text-neon-green'}`} />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-lg md:text-xl font-black leading-none tracking-tight transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-deep-blue'} group-hover:text-neon-green`}>
                                Mangrove
                            </span>
                            <span className={`text-[10px] md:text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${isTransparent ? 'text-white/80' : 'text-gray-500'}`}>
                                BPK RUN 2026
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink href="/#home">{t.home}</NavLink>
                        <NavLink href="/#race-info">{t.categories}</NavLink>
                        <NavLink href="/#routes">{t.routes}</NavLink>
                        <NavLink href="/#awards">{t.awards}</NavLink>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all
                                ${isTransparent
                                    ? 'border-white/30 text-white hover:bg-white/10'
                                    : 'border-gray-200 text-deep-blue hover:bg-gray-50 hover:border-gray-300'}
                            `}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{language === 'th' ? 'EN' : 'TH'}</span>
                        </button>

                        <Link href="/register">
                            {/* ✅ ปรับปุ่มให้มองเห็นชัดเจนในทุกสถานะ */}
                            <button className={`
                                px-6 py-2.5 font-black rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5
                                ${isTransparent
                                    ? 'bg-neon-green text-deep-blue hover:bg-white shadow-green-500/20'
                                    : 'bg-neon-green text-deep-blue hover:bg-deep-blue hover:text-white shadow-green-500/20'}
                            `}>
                                {t.register}
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-2 z-50 relative rounded-lg transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-deep-blue hover:bg-gray-100'}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay (ส่วนนี้เหมือนเดิม เพราะพื้นหลังขาว ตัวหนังสือสีเข้มอยู่แล้ว) */}
            <div
                className={`
                    fixed inset-0 z-40 bg-white md:hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                    ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
                `}
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-deep-blue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="flex flex-col h-full pt-28 pb-10 px-6 relative z-10">
                    <nav className="flex flex-col gap-6 items-start">
                        <NavLink href="/#home" mobile>{t.home}</NavLink>
                        <NavLink href="/#race-info" mobile>{t.categories}</NavLink>
                        <NavLink href="/#routes" mobile>{t.routes}</NavLink>
                        <NavLink href="/#awards" mobile>{t.awards}</NavLink>
                        <NavLink href="/#highlights" mobile>{t.raceKit}</NavLink>
                    </nav>

                    <div className="mt-auto space-y-4">
                        <div className="h-px w-full bg-gray-100 mb-6" />

                        <button
                            onClick={() => { toggleLanguage(); toggleMenu(); }}
                            className="w-full flex items-center justify-between px-4 py-4 rounded-2xl bg-gray-50 font-bold text-deep-blue active:scale-95 transition-transform"
                        >
                            <span className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                {language === 'th' ? 'เปลี่ยนภาษา' : 'Language'}
                            </span>
                            <span className="text-neon-green bg-deep-blue px-2 py-1 rounded text-xs">
                                {language === 'th' ? 'TH' : 'EN'}
                            </span>
                        </button>

                        <Link href="/register" onClick={toggleMenu} className="block">
                            <button className="w-full py-4 bg-deep-blue text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
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