'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RegistrationClosedPage() {
    return (
        <LanguageProvider>
            <main className="min-h-screen bg-gray-50 font-sans flex flex-col relative overflow-x-hidden">
                {/* Background Texture */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
                />

                <Header />

                <div className="flex-grow flex items-center justify-center p-6 mt-20">
                    <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-xl p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Lock size={40} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-800 mb-4">Registration Closed</h1>
                        <p className="text-gray-500 mb-8 text-lg">
                            ขณะนี้ปิดรับสมัครแล้ว / Registration is currently closed.
                            <br />
                            Please check back later or contact admin.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold bg-deep-blue text-white hover:bg-navy transition-all shadow-lg shadow-blue-900/20"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                <Footer />
            </main>
        </LanguageProvider>
    );
}

