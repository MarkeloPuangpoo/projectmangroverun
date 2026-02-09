'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Ghost } from 'lucide-react';
import Link from 'next/link';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function NotFound() {
    return (
        <LanguageProvider>
            <main className="min-h-screen bg-gray-50 font-sans flex flex-col relative overflow-x-hidden selection:bg-neon-green selection:text-deep-blue">
                {/* Background Texture */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
                />

                <Header />

                <div className="flex-grow flex items-center justify-center p-6 mt-20">
                    <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-xl p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-400 rotate-12 transform shadow-inner">
                            <Ghost size={48} />
                        </div>

                        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-deep-blue to-neon-green mb-2 opacity-20 select-none">
                            404
                        </h1>

                        <h2 className="text-2xl md:text-3xl font-black text-deep-blue mb-4 uppercase tracking-tight">
                            Page Not Found
                        </h2>

                        <p className="text-gray-500 mb-8 text-lg font-medium">
                            ขออภัย ไม่พบหน้าที่คุณต้องการ
                            <br />
                            <span className="text-sm opacity-75">The page you are looking for does not exist.</span>
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold bg-deep-blue text-white hover:bg-navy transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-1"
                            >
                                Back to Home
                            </Link>
                            {/* <button 
                                onClick={() => window.history.back()}
                                className="text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
                            >
                                Go Back
                            </button> */}
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </LanguageProvider>
    );
}
