'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Registration } from '@/types/registration';
import {
    Search,
    Package,
    CheckCircle2,
    User,
    Shirt,
    MapPin,
    Hash,
    CreditCard,
    Phone,
    AlertTriangle,
    Activity,
    Calendar,
    XCircle
} from 'lucide-react';

export default function CheckInPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [runner, setRunner] = useState<Registration | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Search by Phone or ID Card
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setRunner(null);

        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .or(`phone.eq.${searchTerm},national_id.eq.${searchTerm}`)
                .single();

            if (error) throw error;
            if (data) setRunner(data as Registration);
        } catch (error) {
            setMessage({ type: 'error', text: 'ไม่พบข้อมูลนักวิ่ง (Runner not found)' });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPickup = async () => {
        if (!runner) return;
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

            setMessage({ type: 'success', text: `บันทึกการรับของเรียบร้อย (Checked in successfully)!` });

            // Re-fetch to update UI
            setRunner(prev => prev ? ({
                ...prev,
                kit_picked_up: true,
                checked_in_at: new Date().toISOString()
            }) : null);

        } catch (error: any) {
            console.error(error);
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
        } finally {
            setCheckingIn(false);
        }
    };

    const handleClear = () => {
        setRunner(null);
        setSearchTerm('');
        setMessage(null);
    };

    return (
        <AdminAuthGuard>
            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
                <AdminSidebar />

                <main className="flex-1 lg:ml-72 p-6 lg:p-10 transition-all duration-300 flex flex-col items-center justify-center min-h-screen">

                    <div className="w-full max-w-2xl">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black text-slate-800 mb-2">จุดรับอุปกรณ์ (Race Kit Collection)</h1>
                            <p className="text-slate-400">ค้นหาด้วย เบอร์โทร หรือ เลขบัตรประชาชน</p>
                        </div>

                        {/* Search Box */}
                        <form onSubmit={handleSearch} className="relative mb-8 z-20">
                            <input
                                type="text"
                                placeholder="กรอกเบอร์โทร หรือ เลขบัตร ปชช."
                                className="w-full pl-6 pr-20 py-5 text-xl rounded-[2rem] border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none shadow-xl shadow-slate-200/50 transition-all font-bold placeholder:font-normal"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />

                            {runner ? (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="absolute right-3 top-3 bottom-3 aspect-square bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-300 transition-colors"
                                >
                                    <XCircle size={24} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading || !searchTerm}
                                    className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-700 transition-colors disabled:bg-slate-200"
                                >
                                    {loading ? <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full" /> : <Search size={24} />}
                                </button>
                            )}
                        </form>

                        {/* Feedback Message */}
                        {message && (
                            <div className={`p-4 rounded-2xl text-center font-bold mb-6 animate-in fade-in slide-in-from-bottom-2 ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Runner Card Result */}
                        {runner && (
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">

                                {/* 1. Header Area: BIB & Status */}
                                <div className={`p-8 text-center relative ${runner.status === 'approved' ? 'bg-indigo-600' : 'bg-orange-500'}`}>
                                    {/* Status Badge */}
                                    <div className="absolute top-6 left-6">
                                        <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider">
                                            {runner.status === 'approved' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                                            {runner.status}
                                        </span>
                                    </div>

                                    {/* BIB Display */}
                                    <div className="mt-4">
                                        <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-1">BIB Number</p>
                                        <h2 className="text-6xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                                            {runner.bib_number ? (
                                                <><span className="opacity-50 text-4xl">#</span>{runner.bib_number}</>
                                            ) : (
                                                <span className="text-3xl opacity-50">No BIB Assigned</span>
                                            )}
                                        </h2>
                                    </div>
                                </div>

                                {/* 2. Main Info */}
                                <div className="p-8">
                                    <div className="text-center mb-8 pb-8 border-b border-slate-100">
                                        <h3 className="text-2xl font-black text-slate-800 mb-1">{runner.full_name_th}</h3>
                                        <p className="text-slate-400 font-medium uppercase tracking-wide">{runner.full_name_en}</p>
                                    </div>

                                    {/* Grid Layout for Critical Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-2">ประเภท (Category)</p>
                                            <p className="text-xl font-black text-slate-700">{runner.race_category}</p>
                                        </div>
                                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                            <Shirt className="absolute -right-2 -bottom-2 text-slate-200 w-16 h-16 transform -rotate-12" />
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-2">ไซส์เสื้อ (Size)</p>
                                            <p className="text-3xl font-black text-pink-500 relative z-10">{runner.shirt_size}</p>
                                        </div>
                                    </div>

                                    {/* Detailed List */}
                                    <div className="space-y-4 bg-white rounded-3xl p-2">
                                        <InfoRow
                                            icon={<CreditCard size={18} />}
                                            label="National ID / Passport"
                                            value={runner.national_id}
                                        />
                                        <InfoRow
                                            icon={<Phone size={18} />}
                                            label="Phone Number"
                                            value={runner.phone}
                                        />
                                        <InfoRow
                                            icon={<User size={18} />}
                                            label="Gender / Age"
                                            value={`${runner.gender.toUpperCase()} / ${runner.age} Years`}
                                        />
                                        <InfoRow
                                            icon={<MapPin size={18} />}
                                            label="Shipping Method"
                                            value={runner.shipping_method === 'postal' ? 'จัดส่งไปรษณีย์ (Postal)' : 'รับด้วยตนเอง (Self Pickup)'}
                                            highlight={runner.shipping_method === 'postal'}
                                        />
                                        {runner.medical_conditions && (
                                            <div className="bg-red-50 p-4 rounded-2xl flex gap-3 text-red-800 text-sm font-bold border border-red-100">
                                                <Activity size={20} className="shrink-0" />
                                                <div>
                                                    <span className="block text-xs opacity-70 uppercase mb-1">Medical Condition</span>
                                                    {runner.medical_conditions}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-8">
                                        {runner.kit_picked_up ? (
                                            <div className="w-full py-5 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-500 flex flex-col items-center justify-center gap-1 cursor-not-allowed">
                                                <div className="flex items-center gap-2 font-black text-lg">
                                                    <CheckCircle2 size={24} className="text-emerald-500" /> รับอุปกรณ์แล้ว (Picked Up)
                                                </div>
                                                <div className="text-xs font-medium opacity-70">
                                                    {new Date(runner.checked_in_at!).toLocaleString('th-TH')}
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleConfirmPickup}
                                                disabled={runner.status !== 'approved' || checkingIn}
                                                className={`
                                                    w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3
                                                    ${runner.status === 'approved'
                                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30'
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                                                `}
                                            >
                                                {checkingIn ? (
                                                    'Processing...'
                                                ) : runner.status === 'approved' ? (
                                                    <>
                                                        <Package size={24} /> ยืนยันการรับของ (Confirm Pickup)
                                                    </>
                                                ) : (
                                                    'Payment Not Approved (ยังไม่จ่ายเงิน)'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </AdminAuthGuard>
    );
}

// Helper Component for Info Rows
function InfoRow({ icon, label, value, highlight }: any) {
    return (
        <div className={`flex items-center justify-between p-4 rounded-2xl ${highlight ? 'bg-orange-50 border border-orange-100' : 'hover:bg-slate-50 transition-colors'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${highlight ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                    {icon}
                </div>
                <span className={`text-sm font-bold ${highlight ? 'text-orange-800' : 'text-slate-500'}`}>{label}</span>
            </div>
            <span className={`font-bold text-base ${highlight ? 'text-orange-900' : 'text-slate-800'}`}>{value}</span>
        </div>
    );
}