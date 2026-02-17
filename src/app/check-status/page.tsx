'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Loader2, AlertCircle, CheckCircle2, XCircle, Upload, ArrowRight, User, Shirt, Hash, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Registration } from '@/types/registration';
import imageCompression from 'browser-image-compression';

import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/translations";

export default function CheckStatusPage() {
    return (
        <LanguageProvider>
            <CheckStatusContent />
        </LanguageProvider>
    );
}

function CheckStatusContent() {
    const { language } = useLanguage();
    const t = translations[language].checkStatus;

    return (
        <main className="min-h-screen bg-slate-50 font-sans selection:bg-neon-green selection:text-deep-blue flex flex-col relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

            <Header />
            <div className="flex-grow w-full max-w-4xl mx-auto px-4 pt-28 pb-12 md:pt-40 md:pb-16 z-10">
                <div className="text-center mb-12 animate-fade-in-up">
                    <span className="bg-deep-blue/5 text-deep-blue border border-deep-blue/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                        Tracker
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-deep-blue uppercase mb-4 tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-slate-500 font-medium text-base md:text-lg max-w-xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <StatusChecker />
            </div>
            <Footer />
        </main>
    );
}

function StatusChecker() {
    const { language } = useLanguage();
    const t = translations[language].checkStatus;

    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Registration | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isReuploading, setIsReuploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Search Logic
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchKey.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .or(`national_id.eq.${searchKey.trim()},phone.eq.${searchKey.trim()}`)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new Error(t.alert.notFound);
                }
                throw error;
            }

            setResult(data as Registration);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Re-upload Logic
    const handleReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!result || !e.target.files?.[0]) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
                fileType: "image/jpeg"
            });

            const fileExt = "jpg";
            const fileName = `reupload_${result.id}_${Date.now()}.${fileExt}`;
            const filePath = `slips/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('payment-slips')
                .upload(filePath, compressedFile);

            if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);

            const { data: { publicUrl } } = supabase.storage
                .from('payment-slips')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('registrations')
                .update({
                    payment_slip_url: publicUrl,
                    status: 'pending'
                })
                .eq('id', result.id);

            if (updateError) throw new Error(t.alert.updateFailed);

            alert(t.alert.success);

            setResult({ ...result, status: 'pending', payment_slip_url: publicUrl });
            setIsReuploading(false);

        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            {/* --- Search Bar (Modern Integrated Style) --- */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 relative z-20 animate-fade-in-up delay-100">
                <div className="relative flex items-center bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-50 focus-within:border-indigo-200 transition-all duration-300">
                    <Search className="absolute left-6 text-slate-400" size={22} />
                    <input
                        type="text"
                        className="w-full pl-16 pr-4 py-4 rounded-xl bg-transparent outline-none text-base md:text-lg text-deep-blue font-medium placeholder:text-slate-300"
                        placeholder={t.placeholder}
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !searchKey}
                        className="px-6 py-4 rounded-xl bg-deep-blue text-white font-bold hover:bg-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                <span className="hidden sm:inline">{t.buttonCheck}</span>
                                <ArrowRight size={20} className="sm:hidden" />
                            </>
                        )}
                    </button>
                </div>
                <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                    {t.searchLabel}
                </p>
            </form>

            {/* --- Results Area --- */}
            <div className="transition-all duration-500 ease-in-out">
                {error && (
                    <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center text-center gap-3 text-red-600 animate-fade-in">
                        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                            <AlertCircle size={24} />
                        </div>
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 animate-fade-in-up">
                        <div className="grid md:grid-cols-12 gap-8 items-start">

                            {/* Status Card (Left Column) */}
                            <div className="md:col-span-5 w-full flex flex-col gap-4">
                                <div className={`
                                    p-8 rounded-3xl flex flex-col items-center text-center gap-4 transition-colors duration-300
                                    ${result.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                                        result.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                            'bg-rose-50 text-rose-700'}
                                `}>
                                    {result.status === 'approved' ? (
                                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm shadow-emerald-200/50">
                                            <CheckCircle2 size={40} className="text-emerald-500" />
                                        </div>
                                    ) : result.status === 'pending' ? (
                                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center shadow-sm shadow-amber-200/50">
                                            <Loader2 size={40} className="text-amber-500 animate-spin-slow" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center shadow-sm shadow-rose-200/50">
                                            <XCircle size={40} className="text-rose-500" />
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                                            {result.status === 'approved' ? t.status.approved :
                                                result.status === 'pending' ? t.status.pending :
                                                    t.status.rejected}
                                        </h2>
                                        <p className="text-sm font-medium opacity-80 leading-relaxed max-w-[250px] mx-auto">
                                            {result.status === 'approved'
                                                ? t.desc.approved
                                                : result.status === 'pending'
                                                    ? t.desc.pending
                                                    : t.desc.rejected}
                                        </p>
                                    </div>
                                </div>

                                {/* Re-upload Button for Rejected Status */}
                                {result.status === 'rejected' && !isReuploading && (
                                    <button
                                        onClick={() => setIsReuploading(true)}
                                        className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:border-deep-blue hover:text-deep-blue hover:shadow-md transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                                        {t.action.reupload}
                                    </button>
                                )}
                            </div>

                            {/* Info Details (Right Column) */}
                            <div className="md:col-span-7 w-full flex flex-col justify-center h-full">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        <User size={20} className="text-slate-400" />
                                        Runner Information
                                    </h3>
                                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                                        ID: {result.id.slice(0, 8)}...
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{t.info.name}</p>
                                        <p className="font-bold text-slate-800 text-lg">{result.full_name_th}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{t.info.category}</p>
                                        <p className="font-bold text-slate-800 text-lg">{result.race_category}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{t.info.size}</p>
                                            <p className="font-bold text-slate-800 text-lg">{result.shirt_size}</p>
                                        </div>
                                        <Shirt className="text-slate-200" size={32} />
                                    </div>
                                    {result.bib_number && (
                                        <div className="bg-neon-green/10 p-4 rounded-2xl border border-neon-green/20 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">{t.info.bib}</p>
                                                <p className="font-black text-emerald-700 text-2xl leading-none">{result.bib_number}</p>
                                            </div>
                                            <Hash className="text-emerald-200" size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Modern Re-upload Area */}
                                {isReuploading && (
                                    <div className="mt-6 p-6 bg-indigo-50/50 rounded-3xl border-2 border-dashed border-indigo-200 animate-fade-in">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm font-bold text-indigo-900">{t.action.uploadTitle}</span>
                                            <button onClick={() => setIsReuploading(false)} className="text-xs text-slate-500 font-bold hover:text-red-500 transition-colors">
                                                {t.action.cancel}
                                            </button>
                                        </div>

                                        <label className={`
                                            flex flex-col items-center justify-center w-full h-32 
                                            bg-white rounded-2xl border border-indigo-100 
                                            cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-300 transition-all group
                                            ${uploading ? 'opacity-50 pointer-events-none' : ''}
                                        `}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {uploading ? (
                                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-indigo-400 group-hover:text-indigo-600 group-hover:-translate-y-1 transition-all mb-2" />
                                                )}
                                                <p className="text-sm text-slate-500 font-medium">
                                                    {uploading ? t.alert.uploading : <><span className="text-indigo-600 font-bold">Click to upload</span> or drag and drop</>}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={handleReupload}
                                                disabled={uploading}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}