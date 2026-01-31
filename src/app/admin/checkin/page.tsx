'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Registration } from '@/types/registration';
import confetti from 'canvas-confetti';
import {
    XCircle,
    AlertTriangle,
    Loader2,
    ScanLine,
    CheckCircle2,
    Phone,
    Mail,
    RotateCcw,
    Activity,
    CreditCard
} from 'lucide-react';

// Sound Assets (Base64 for offline reliability)
const BEEP_SUCCESS = 'data:audio/wav;base64,UklGRnoGAABXQVZDaG10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXIGAACBhYqFbF1fdJivrJBhNjVgodDbqWEzM2CfutunYTIyYKC726dhMzNgn7rbp2EyMmCgu9unYTIyYJ+626dhMi9fn7y+pGMzM2CfvLunYTIyYKC726dhMzNgn7rbp2EyMmCgutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rboWAvLl+LnonP3q1lNi9eoMHTr2EyM2CfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rboEA=';
const BEEP_ERROR = 'data:audio/wav;base64,UklGRloEAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoEAACBhYqFbF1fdJivrJBhNjVgodDbqWEzM2CfutunYTIyYKC726dhMzNgn7rbp2EyMmCgu9unYTIyYJ+626dhMi9fn7y+pGMzM2CfvLunYTIyYKC726dhMzNgn7rbp2EyMmCgutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutuvYTIyYJ+826dhMzNgn7rbp2EyMmCfutunYTIyYJG226dhMzJgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCfutunYTIyYJ+626dhMzNgn7rbp2EyMmCputg==';

export default function CheckInPage() {
    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [runner, setRunner] = useState<Registration | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [todayCount, setTodayCount] = useState(0);
    const [recentCheckins, setRecentCheckins] = useState<Registration[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Audio Refs
    const successAudio = useRef<HTMLAudioElement | null>(null);
    const errorAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Audio
        successAudio.current = new Audio(BEEP_SUCCESS);
        errorAudio.current = new Audio(BEEP_ERROR);
        successAudio.current.volume = 0.5;
        errorAudio.current.volume = 0.5;

        // Fetch Stats
        fetchStats();
    }, []);

    // ⌨️ Keyboard Shortcuts (Power User Feature)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ESC: Clear
            if (e.key === 'Escape') {
                handleClear();
            }
            // Enter: Confirm Pickup (Only if runner approved & not already matched)
            if (e.key === 'Enter' && runner && runner.status === 'approved' && !runner.kit_picked_up && !checkingIn) {
                e.preventDefault();
                handleCheckIn();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        inputRef.current?.focus();
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [runner, checkingIn]);

    const playSound = (type: 'success' | 'error') => {
        if (type === 'success') successAudio.current?.play().catch(() => { });
        else errorAudio.current?.play().catch(() => { });
    };

    const fetchStats = async () => {
        // Today Check-ins
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const { count } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('kit_picked_up', true)
            .gte('checked_in_at', startOfDay.toISOString());

        setTodayCount(count || 0);

        // Recent 5
        const { data } = await supabase
            .from('registrations')
            .select('*')
            .eq('kit_picked_up', true)
            .order('checked_in_at', { ascending: false })
            .limit(5);

        if (data) setRecentCheckins(data as Registration[]);
    };

    // 🚀 Performance Optimized Confetti (Lite Version)
    const triggerLiteConfetti = () => {
        confetti({
            particleCount: 50,
            spread: 40,
            origin: { y: 0.7 },
            disableForReducedMotion: true,
            colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d']
        });
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const term = searchTerm.trim();
        if (!term) return;

        setLoading(true);
        setErrorMsg(null);
        setRunner(null);

        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .or(`phone.eq.${term},national_id.eq.${term},bib_number.eq.${term}`)
                .maybeSingle();

            if (error) throw error;

            if (!data) {
                setErrorMsg(`❌ ไม่พบข้อมูล: "${term}"`);
                playSound('error');
                triggerShake();
            } else {
                setRunner(data as Registration);
                setSearchTerm('');
            }
        } catch (error) {
            console.error(error);
            setErrorMsg('⚠️ เกิดข้อผิดพลาดของระบบ');
            playSound('error');
        } finally {
            setLoading(false);
            // Ensure focus returns to input
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    };

    const handleCheckIn = async () => {
        if (!runner || checkingIn) return;
        setCheckingIn(true);

        try {
            const { error } = await supabase
                .from('registrations')
                .update({
                    kit_picked_up: true,
                    checked_in_at: new Date().toISOString()
                })
                .eq('id', runner.id);

            if (error) throw error;

            setRunner(prev => prev ? ({
                ...prev,
                kit_picked_up: true,
                checked_in_at: new Date().toISOString()
            }) : null);

            playSound('success');
            triggerLiteConfetti();
            fetchStats(); // Update stats

        } catch (error: any) {
            alert('Error: ' + error.message);
            playSound('error');
        } finally {
            setCheckingIn(false);
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    };

    const handleClear = () => {
        setRunner(null);
        setSearchTerm('');
        setErrorMsg(null);
        inputRef.current?.focus();
    };

    // Shake Animation
    const [shake, setShake] = useState(false);
    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 300);
    };

    return (
        <AdminAuthGuard>
            <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
                <AdminSidebar />

                <main className="flex-1 lg:ml-72 p-4 flex flex-col items-center">

                    {/* --- Top Sticky Search Bar --- */}
                    <div className="w-full max-w-2xl mt-4 mb-6 sticky top-4 z-50">
                        <div className={`bg-white p-2 rounded-2xl shadow-xl border-2 transition-all ${shake ? 'border-red-400 translate-x-2' : 'border-slate-100'}`}>
                            <form onSubmit={handleSearch} className="relative flex items-center">
                                <div className="absolute left-4 text-slate-400">
                                    {loading ? <Loader2 className="animate-spin" /> : <ScanLine />}
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Scan QR / Type Phone / BIB..."
                                    className="w-full pl-12 pr-14 py-4 text-xl font-bold bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                )}
                            </form>

                            {/* Sticky Error Message (Inside Container) */}
                            {errorMsg && (
                                <div className="mx-2 mb-2 p-3 bg-red-100/50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2 animate-in slide-in-from-top-2 text-sm">
                                    <AlertTriangle size={18} />
                                    {errorMsg}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Content Area --- */}
                    <div className="w-full max-w-2xl flex-1 flex flex-col justify-start">
                        {runner ? (
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 pb-10">

                                {/* Header Status */}
                                <div className={`px-6 py-4 flex items-center justify-between ${runner.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                    <div className="flex items-center gap-2 font-black uppercase tracking-wider text-sm">
                                        {runner.status === 'approved' ? (
                                            <><CheckCircle2 size={20} /> Payment Verified</>
                                        ) : (
                                            <><XCircle size={20} /> NOT PAID / PENDING</>
                                        )}
                                    </div>
                                    <div className="text-white/80 text-xs font-mono">ID: {runner.national_id}</div>
                                </div>

                                {/* Main Card Content */}
                                <div className="px-8 pt-8 text-center">

                                    {/* BIB & Size */}
                                    <div className="flex justify-center items-end gap-6 mb-8">
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">BIB Number</div>
                                            <div className="text-8xl font-black text-slate-800 leading-none">
                                                {runner.bib_number || '---'}
                                            </div>
                                        </div>
                                        <div className="h-20 w-px bg-slate-100 mx-2"></div>
                                        <div className="text-center">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Size</div>
                                            <div className="text-6xl font-black text-indigo-600 leading-none">
                                                {runner.shirt_size}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Runner Details */}
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{runner.full_name_th}</h2>
                                    <p className="text-slate-500 font-medium mb-6 uppercase tracking-wide">{runner.race_category}</p>

                                    {/* Medical Alert */}
                                    {runner.medical_conditions && (
                                        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold border border-red-100">
                                            <Activity size={16} /> Med: {runner.medical_conditions}
                                        </div>
                                    )}

                                    {/* Contact Quick Links */}
                                    <div className="flex justify-center gap-4 mb-8">
                                        <a href={`tel:${runner.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-colors">
                                            <Phone size={16} /> {runner.phone}
                                        </a>
                                        {runner.payment_slip_url && (
                                            <a
                                                href={supabase.storage.from('payment-slips').getPublicUrl(runner.payment_slip_url).data.publicUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-bold hover:bg-indigo-100 transition-colors"
                                            >
                                                <CreditCard size={16} /> View Slip
                                            </a>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-4">
                                        {runner.kit_picked_up ? (
                                            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-100 flex flex-col items-center gap-3">
                                                <div className="text-emerald-500 font-black text-2xl flex items-center gap-2">
                                                    <CheckCircle2 size={32} /> ALREADY RECEIVED
                                                </div>
                                                <p className="text-slate-400 text-sm font-medium">
                                                    Checked in at: {new Date(runner.checked_in_at!).toLocaleString('th-TH')}
                                                </p>
                                                <button
                                                    onClick={handleClear}
                                                    className="mt-4 w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <RotateCcw size={20} />
                                                    SCAN NEXT (ESC)
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleCheckIn}
                                                disabled={runner.status !== 'approved' || checkingIn}
                                                className={`
                                                    w-full py-6 rounded-2xl font-black text-2xl shadow-xl transition-all transform active:scale-[0.98]
                                                    ${runner.status === 'approved'
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/40 ring-4 ring-indigo-50'
                                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                                                `}
                                            >
                                                {checkingIn ? (
                                                    <Loader2 className="animate-spin mx-auto w-8 h-8" />
                                                ) : runner.status === 'approved' ? (
                                                    'CONFIRM PICKUP (ENTER)'
                                                ) : (
                                                    '❌ CANNOT PICKUP'
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Cancel Link */}
                                    {!runner.kit_picked_up && (
                                        <button onClick={handleClear} className="mt-6 text-slate-400 text-sm font-bold hover:text-slate-600 underline decoration-slate-300 underline-offset-4">
                                            Cancel / Scan Next (ESC)
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Idle State Dashboard */
                            <div className="mt-8 grid gap-6">
                                {/* Daily Stats */}
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
                                    <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Total Checked-in Today</h3>
                                    <div className="text-5xl font-black text-indigo-600">{todayCount}</div>
                                    <div className="text-slate-300 text-sm mt-1">Runners</div>
                                </div>

                                {/* Recent List */}
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                    <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">Recent Pickups</h3>
                                    <div className="space-y-3">
                                        {recentCheckins.length === 0 ? (
                                            <div className="text-center text-slate-300 py-4 italic">No pickups yet today</div>
                                        ) : (
                                            recentCheckins.map(r => (
                                                <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                                                            {r.shirt_size}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-700 text-sm">{r.full_name_th}</div>
                                                            <div className="text-xs text-slate-400">{r.bib_number || 'No BIB'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs font-mono text-slate-400">
                                                        {new Date(r.checked_in_at!).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="text-center text-slate-300 mt-4 text-sm">
                                    Ready to scan QR Code or type phone number...
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}