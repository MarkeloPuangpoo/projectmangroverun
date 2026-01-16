'use client';

import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, Leaf, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';
import Link from 'next/link';

const Footer = () => {
    const { language } = useLanguage();
    const t = translations[language].footer;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-deep-blue text-white pt-20 pb-10 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-neon-green flex items-center justify-center text-deep-blue shadow-lg shadow-green-900/20">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black leading-none tracking-tight text-white">
                                    MANGROVE
                                </h2>
                                <span className="text-sm font-bold text-neon-green tracking-widest uppercase">
                                    BPK RUN 2026
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            {t.desc || "ร่วมเป็นส่วนหนึ่งของการวิ่งเพื่ออนุรักษ์ป่าชายเลนและส่งเสริมสุขภาพ เส้นทางธรรมชาติที่สวยงามของบางปะกง"}
                        </p>

                        {/* Organizer Badge */}
                        <div className="pt-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                Organized By (ผู้จัดงาน)
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-1 bg-neon-green rounded-full"></div>
                                <p className="font-medium text-white">สมาคมนักเรียนเก่าบวรวิทยายน</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                            Contact Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 group">
                                <MapPin className="w-5 h-5 text-neon-green mt-1 group-hover:text-white transition-colors shrink-0" />
                                <span className="group-hover:text-white transition-colors text-sm leading-relaxed">
                                    โรงเรียนบางปะกง "บวรวิทยายน"<br />
                                    อำเภอบางปะกง จังหวัดฉะเชิงเทรา
                                </span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400 group">
                                <Phone className="w-5 h-5 text-neon-green mt-1 group-hover:text-white transition-colors shrink-0" />
                                <div className="flex flex-col text-sm">
                                    <a href="tel:038531400" className="group-hover:text-white transition-colors hover:underline">038-531-400</a>
                                    <a href="tel:0630272725" className="group-hover:text-white transition-colors hover:underline">063-027-2725</a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 group">
                                <Mail className="w-5 h-5 text-neon-green group-hover:text-white transition-colors shrink-0" />
                                <a href="mailto:contact@mangroverun.com" className="group-hover:text-white transition-colors text-sm hover:underline">
                                    contact@mangroverun.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Links Column */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Follow Us</h3>
                        <div className="flex gap-4 mb-8">
                            <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] hover:scale-110 transition-all duration-300 border border-white/5">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:scale-110 transition-all duration-300 border border-white/5">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>

                        <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/register" className="hover:text-neon-green transition-colors flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span> สมัครแข่งขัน (Register)
                            </Link></li>
                            <li><a href="#routes" className="hover:text-neon-green transition-colors flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span> เส้นทางวิ่ง (Routes)
                            </a></li>
                            <li><a href="#race-info" className="hover:text-neon-green transition-colors flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span> รายละเอียด (Race Info)
                            </a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © 2026 Mangrove BPK RUN. All rights reserved.
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-neon-green hover:text-deep-blue text-sm font-bold text-gray-400 transition-all group"
                    >
                        Back to Top <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;