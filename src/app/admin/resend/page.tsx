'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Registration } from '@/types/registration';
import {
    Mail,
    Search,
    Send,
    RefreshCw,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Loader2,
    Inbox
} from 'lucide-react';

export default function ResendEmailPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State สำหรับบอกว่ากำลังส่งเมลให้ใครอยู่ (ป้องกันกดซ้ำ)
    const [sendingId, setSendingId] = useState<string | null>(null);
    const [sendingType, setSendingType] = useState<string | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100); // ดึงแค่ 100 คนล่าสุดก่อน เพื่อความเร็ว

            if (error) throw error;
            setRegistrations(data as Registration[]);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        return registrations.filter(reg =>
            reg.full_name_th.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.phone.includes(searchTerm) ||
            (reg.bib_number && reg.bib_number.includes(searchTerm))
        );
    }, [registrations, searchTerm]);

    // 🔥 Core Resend Logic
    const handleResend = async (runner: Registration, type: 'submission' | 'approval' | 'rejection') => {
        if (!confirm(`ยืนยันการส่งอีเมลแบบ "${type.toUpperCase()}" ไปยัง ${runner.email}?`)) return;

        setSendingId(runner.id);
        setSendingType(type);

        try {
            let emailPayload = {};

            // เตรียมข้อมูลตามประเภทอีเมล (ให้ตรงกับ src/lib/email.ts)
            if (type === 'submission') {
                emailPayload = {
                    name: runner.full_name_th
                };
            } else if (type === 'approval') {
                if (!runner.bib_number) throw new Error("ไม่สามารถส่งเมล Approval ได้เพราะยังไม่มี BIB");
                emailPayload = {
                    name: runner.full_name_th,
                    bib: runner.bib_number,
                    raceCategory: runner.race_category
                };
            } else if (type === 'rejection') {
                const reason = prompt("ระบุเหตุผล (Optional):", "หลักฐานไม่ถูกต้อง / ยอดเงินไม่ตรง");
                if (reason === null) return; // กด cancel
                emailPayload = {
                    name: runner.full_name_th,
                    reason: reason
                };
            }

            // ยิง API
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: runner.email,
                    type: type,
                    data: emailPayload
                })
            });

            const result = await res.json();
            if (!result.success) throw new Error(result.error);

            alert(`✅ ส่งอีเมลสำเร็จ: ${runner.email}`);

        } catch (error: any) {
            alert(`❌ ส่งไม่ผ่าน: ${error.message}`);
        } finally {
            setSendingId(null);
            setSendingType(null);
        }
    };

    return (
        <AdminAuthGuard>
            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
                <AdminSidebar />

                <main className="flex-1 lg:ml-72 p-6 lg:p-10">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Mail className="text-indigo-600" size={32} />
                            Email Resend Center
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">
                            ระบบส่งอีเมลแจ้งเตือนซ้ำ (ใช้กรณีอีเมลตกหล่นหรือผู้สมัครขอให้ส่งใหม่)
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="ค้นหาด้วย ชื่อ, อีเมล, เบอร์โทร, หรือ BIB..."
                                className="pl-12 pr-4 py-3 w-full bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-medium transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Runners List */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Runner Profile</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions (Resend)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={3} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></td></tr>
                                ) : filteredData.length === 0 ? (
                                    <tr><td colSpan={3} className="p-10 text-center text-slate-400">ไม่พบข้อมูล</td></tr>
                                ) : (
                                    filteredData.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                                            {/* Profile */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                                        {reg.full_name_en.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{reg.full_name_th}</div>
                                                        <div className="text-slate-500 text-xs flex items-center gap-1">
                                                            <Mail size={10} /> {reg.email}
                                                        </div>
                                                        {reg.bib_number && (
                                                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">
                                                                BIB: {reg.bib_number}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border w-fit
                                                    ${reg.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        reg.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                            'bg-red-50 text-red-600 border-red-100'}
                                                `}>
                                                    {reg.status === 'approved' ? <CheckCircle2 size={12} /> :
                                                        reg.status === 'pending' ? <Inbox size={12} /> : <XCircle size={12} />}
                                                    {reg.status.toUpperCase()}
                                                </div>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">

                                                    {/* 1. Resend Submission (Always Available) */}
                                                    <ActionButton
                                                        icon={<Inbox size={14} />}
                                                        label="Received"
                                                        color="slate"
                                                        onClick={() => handleResend(reg, 'submission')}
                                                        loading={sendingId === reg.id && sendingType === 'submission'}
                                                    />

                                                    {/* 2. Resend Approval (Only if Approved) */}
                                                    <ActionButton
                                                        icon={<CheckCircle2 size={14} />}
                                                        label="Approval"
                                                        color="emerald"
                                                        disabled={reg.status !== 'approved'}
                                                        onClick={() => handleResend(reg, 'approval')}
                                                        loading={sendingId === reg.id && sendingType === 'approval'}
                                                    />

                                                    {/* 3. Resend Rejection (Only if Rejected) */}
                                                    <ActionButton
                                                        icon={<XCircle size={14} />}
                                                        label="Reject"
                                                        color="red"
                                                        disabled={reg.status !== 'rejected'}
                                                        onClick={() => handleResend(reg, 'rejection')}
                                                        loading={sendingId === reg.id && sendingType === 'rejection'}
                                                    />

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}

// Micro Component for Buttons
function ActionButton({ icon, label, color, disabled, onClick, loading }: any) {
    const baseStyles = "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all active:scale-95";
    const colors: any = {
        slate: "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
        red: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
    };

    if (disabled) {
        return (
            <button disabled className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-50">
                {icon} {label}
            </button>
        );
    }

    return (
        <button onClick={onClick} className={`${baseStyles} ${colors[color]}`}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
            {label}
        </button>
    );
}