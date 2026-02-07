'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Loader2, AlertCircle, CheckCircle2, XCircle, CreditCard, Upload, RefreshCw } from 'lucide-react';
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
        <main className="min-h-screen bg-gray-50 font-sans selection:bg-neon-green selection:text-deep-blue flex flex-col relative">
            <Header />
            <div className="flex-grow w-full max-w-3xl mx-auto px-4 pt-24 pb-8 md:pt-36 md:pb-12 z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-deep-blue uppercase mb-3 tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-gray-600 font-medium">{t.subtitle}</p>
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

    // Search Logic
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchKey.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Search by National ID OR Phone
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .or(`national_id.eq.${searchKey.trim()},phone.eq.${searchKey.trim()}`)
                .order('created_at', { ascending: false }) // Get latest if multiple ??
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

    // --- Re-upload Logic ---
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!result || !e.target.files?.[0]) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            // 1. Compress
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
                fileType: "image/jpeg"
            });

            // 2. Upload to Storage
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

            // 3. Update Record
            const { error: updateError } = await supabase
                .from('registrations')
                .update({
                    payment_slip_url: publicUrl,
                    status: 'pending' // Reset to pending
                })
                .eq('id', result.id);

            if (updateError) throw new Error(t.alert.updateFailed);

            alert(t.alert.success);

            // Reload Data
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
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-6 md:p-10 min-h-[300px] transition-all">

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8 relative z-20">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    {t.searchLabel}
                </label>
                <div className="relative flex gap-2">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all font-medium text-deep-blue"
                            placeholder={t.placeholder}
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !searchKey}
                        className="px-6 rounded-xl bg-deep-blue text-white font-bold shadow-lg hover:bg-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : t.buttonCheck}
                    </button>
                </div>
            </form>

            <div className="border-t border-dashed border-gray-200 my-6"></div>

            {/* Results Area */}
            <div className="animate-fade-in">
                {error && (
                    <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center text-center gap-2 text-red-600">
                        <AlertCircle size={32} />
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                {result && (
                    <div>
                        <div className="flex flex-col md:flex-row gap-6 items-start">

                            {/* Status Card */}
                            <div className="w-full md:w-5/12 shrink-0">
                                <div className={`
                                    p-6 rounded-2xl border-2 flex flex-col items-center text-center gap-3
                                    ${result.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                        result.status === 'pending' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                                            'bg-red-50 border-red-100 text-red-700'}
                                `}>
                                    {result.status === 'approved' ? (
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-1">
                                            <CheckCircle2 size={32} />
                                        </div>
                                    ) : result.status === 'pending' ? (
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                                            <Loader2 size={32} className="animate-spin-slow" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-1">
                                            <XCircle size={32} />
                                        </div>
                                    )}

                                    <h2 className="text-xl font-black uppercase tracking-wide">
                                        {result.status === 'approved' ? t.status.approved :
                                            result.status === 'pending' ? t.status.pending :
                                                t.status.rejected}
                                    </h2>

                                    <p className="text-sm font-medium opacity-80 px-2 leading-relaxed">
                                        {result.status === 'approved'
                                            ? t.desc.approved
                                            : result.status === 'pending'
                                                ? t.desc.pending
                                                : t.desc.rejected}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 space-y-3">
                                    {/* {result.status === 'approved' && (
                                        <button className="w-full py-3 bg-deep-blue text-white rounded-xl font-bold hover:bg-navy shadow-lg transition-all flex items-center justify-center gap-2">
                                            <CreditCard size={18} /> {t.action.download}
                                        </button>
                                    )} */}

                                    {result.status === 'rejected' && !isReuploading && (
                                        <button
                                            onClick={() => setIsReuploading(true)}
                                            className="w-full py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:border-deep-blue hover:text-deep-blue transition-all flex items-center justify-center gap-2"
                                        >
                                            <Upload size={18} /> {t.action.reupload}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Info Details */}
                            <div className="w-full flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider">Runner Info</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500 text-sm">{t.info.name}</span>
                                        <span className="font-bold text-slate-800 text-right">{result.full_name_th}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500 text-sm">{t.info.category}</span>
                                        <span className="font-bold text-slate-800">{result.race_category}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500 text-sm">{t.info.size}</span>
                                        <span className="font-bold text-slate-800">{result.shirt_size}</span>
                                    </div>

                                    {result.bib_number && (
                                        <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                                            <span className="text-xs font-bold text-slate-400 uppercase">{t.info.bib}</span>
                                            <div className="text-4xl font-black text-neon-green tracking-tighter mt-1">
                                                {result.bib_number}
                                            </div>
                                        </div>
                                    )}

                                    {/* Re-upload Area */}
                                    {isReuploading && (
                                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-indigo-200 mt-4 animate-fade-in-up">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold text-deep-blue">{t.action.uploadTitle}</span>
                                                <button onClick={() => setIsReuploading(false)} className="text-xs text-red-500 font-bold hover:underline">{t.action.cancel}</button>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={handleReupload}
                                                disabled={uploading}
                                                className="block w-full text-sm text-slate-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-xs file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100 cursor-pointer
                                                "
                                            />
                                            {uploading && <p className="text-xs text-center mt-2 text-indigo-500 font-bold animate-pulse">{t.alert.uploading}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Initial State Hint */}
                {!result && !error && !loading && (
                    <div className="text-center py-10 opacity-50">
                        <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-sm">{t.searchLabel}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
