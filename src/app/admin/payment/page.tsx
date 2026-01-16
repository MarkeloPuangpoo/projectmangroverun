'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Registration } from '@/types/registration';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    ZoomIn,
    ZoomOut,
    RotateCw,
    ExternalLink,
    FileText,
    AlertCircle,
    Inbox,
    Eye,
    ChevronRight,
    Hash // เพิ่ม icon
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const PRICE_MAP: Record<string, number> = {
    'VIP': 2000,
    '10.5KM': 500,
    '5KM': 500,
    '6KM': 500
};

export default function PaymentAuditPage() {
    // ... (ตัวแปรเดิม)
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialId = searchParams.get('id');

    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
    const [rotate, setRotate] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // ✅ เพิ่ม State สำหรับ BIB Input
    const [bibInput, setBibInput] = useState('');

    useEffect(() => {
        fetchRegistrations();
    }, []);

    // ... (fetchRegistrations เหมือนเดิม) ...
    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRegistrations(data as Registration[]);

            if (initialId) {
                const target = (data as Registration[]).find(r => r.id === initialId);
                if (target) setSelectedId(initialId);
            } else {
                const pending = (data as Registration[]).find(r => r.status === 'pending');
                if (pending) setSelectedId(pending.id);
            }

        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Reset BIB Input เมื่อเปลี่ยนคน
    useEffect(() => {
        if (selectedId) {
            const reg = registrations.find(r => r.id === selectedId);
            setBibInput(reg?.bib_number || ''); // ถ้ามีอยู่แล้วให้แสดง ถ้าไม่มีเป็นค่าว่าง
        }
    }, [selectedId, registrations]);

    // ... (selectedRegistration, filteredRegistrations, stats เหมือนเดิม) ...
    const selectedRegistration = useMemo(() =>
        registrations.find(r => r.id === selectedId),
        [registrations, selectedId]);

    const filteredRegistrations = useMemo(() => {
        return registrations.filter(r => {
            const matchesStatus = filter === 'all' || r.status === filter;
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                r.full_name_th.toLowerCase().includes(term) ||
                r.full_name_en.toLowerCase().includes(term) ||
                r.phone.includes(term);
            return matchesStatus && matchesSearch;
        });
    }, [registrations, filter, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: registrations.length,
            pending: registrations.filter(r => r.status === 'pending').length,
            approved: registrations.filter(r => r.status === 'approved').length,
            rejected: registrations.filter(r => r.status === 'rejected').length,
        };
    }, [registrations]);

    const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
        if (!selectedId) return;

        // ✅ ถ้ากด Approve ต้องเช็คว่าใส่ BIB หรือยัง
        if (status === 'approved' && !bibInput.trim()) {
            alert('กรุณาระบุเลข BIB ก่อนอนุมัติ (Please enter BIB Number)');
            return;
        }

        // Optimistic update
        setRegistrations(prev => prev.map(r => r.id === selectedId ? {
            ...r,
            status,
            bib_number: status === 'approved' ? bibInput : r.bib_number // บันทึก BIB ใน state
        } : r));

        const currentIndex = filteredRegistrations.findIndex(r => r.id === selectedId);
        if (currentIndex !== -1 && currentIndex < filteredRegistrations.length - 1) {
            setSelectedId(filteredRegistrations[currentIndex + 1].id);
        }

        const { error } = await supabase
            .from('registrations')
            .update({
                status,
                bib_number: status === 'approved' ? bibInput : null // บันทึกลง DB
            })
            .eq('id', selectedId);

        if (error) {
            alert('Error updating status');
            fetchRegistrations();
        }
    };

    const getPublicUrl = (path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const { data } = supabase.storage.from('payment-slips').getPublicUrl(path);
        return data.publicUrl;
    };

    return (
        <AdminAuthGuard>
            <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
                <AdminSidebar pendingCount={stats.pending} />

                <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden transition-all duration-300">

                    {/* ... (Top Bar เหมือนเดิม) ... */}
                    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shrink-0 z-20 shadow-sm">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Payment Audit</h2>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize flex items-center gap-2 ${filter === f
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                            }`}
                                    >
                                        {f}
                                        {f === 'pending' && stats.pending > 0 && (
                                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filter === f ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-200 text-orange-700'}`}>
                                                {stats[f]}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 flex overflow-hidden">

                        {/* 1. List Pane (เหมือนเดิม) */}
                        <div className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col z-10">
                            {/* ... (Search Bar & List เหมือนเดิม) ... */}
                            <div className="p-4 border-b border-slate-100">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search transactions..."
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="p-10 text-center text-slate-400 text-sm font-medium animate-pulse">Loading list...</div>
                                ) : filteredRegistrations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                                        <Inbox size={24} className="opacity-50 mb-2" />
                                        <p className="text-sm font-medium">No transactions found</p>
                                    </div>
                                ) : (
                                    filteredRegistrations.map(reg => (
                                        <div
                                            key={reg.id}
                                            onClick={() => { setSelectedId(reg.id); setRotate(0); setZoom(1); }}
                                            className={`
                                                p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 relative group
                                                ${selectedId === reg.id ? 'bg-indigo-50/60' : ''}
                                            `}
                                        >
                                            {selectedId === reg.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-sm font-bold truncate ${selectedId === reg.id ? 'text-indigo-900' : 'text-slate-700'}`}>{reg.full_name_th}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{new Date(reg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500 font-medium">{reg.race_category}</span>
                                                    <span className="text-xs font-bold text-slate-800 mt-0.5">฿ {PRICE_MAP[reg.race_category]}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/* Show BIB if assigned */}
                                                    {reg.bib_number && (
                                                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                                            #{reg.bib_number}
                                                        </span>
                                                    )}
                                                    <StatusBadge status={reg.status} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 2. Viewer Pane (เหมือนเดิม) */}
                        <div className="flex-1 bg-slate-100/50 flex flex-col relative min-w-0 overflow-hidden">
                            {/* ... (Viewer ToolBar & Image เหมือนเดิม) ... */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 rounded-2xl p-1.5 flex items-center gap-1 border border-slate-200">
                                <ToolBtn icon={<ZoomIn size={18} />} onClick={() => setZoom(z => Math.min(z + 0.5, 3))} tooltip="Zoom In" />
                                <ToolBtn icon={<ZoomOut size={18} />} onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))} tooltip="Zoom Out" />
                                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                <ToolBtn icon={<RotateCw size={18} />} onClick={() => setRotate(r => r + 90)} tooltip="Rotate" />
                                <ToolBtn icon={<ExternalLink size={18} />} onClick={() => window.open(getPublicUrl(selectedRegistration?.payment_slip_url || '') || '', '_blank')} tooltip="Open Original" />
                            </div>

                            <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
                                {selectedRegistration?.payment_slip_url ? (
                                    <div
                                        className="relative transition-transform duration-300 ease-in-out shadow-2xl shadow-slate-400/20"
                                        style={{ transform: `scale(${zoom}) rotate(${rotate}deg)` }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={getPublicUrl(selectedRegistration.payment_slip_url) || ''}
                                            alt="Payment Slip"
                                            className="max-h-[85vh] max-w-full object-contain rounded-xl bg-white border border-slate-200"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-300 flex flex-col items-center">
                                        <FileText size={40} className="opacity-50 mb-4" />
                                        <p className="text-lg font-bold text-slate-400">No Slip Selected</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Detail Pane (เพิ่ม BIB Input) */}
                        <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20">
                            {selectedRegistration ? (
                                <>
                                    <div className="p-8 border-b border-slate-100 flex-1 overflow-y-auto">
                                        {/* ... (Runner Details เหมือนเดิม) ... */}
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                {selectedRegistration.full_name_en.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applicant</div>
                                                <h3 className="font-bold text-slate-800 leading-tight">{selectedRegistration.full_name_th}</h3>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                                <p className="text-xs font-bold text-slate-400 uppercase mb-3">Payment Info</p>
                                                <DetailRow label="Category" value={selectedRegistration.race_category} />
                                                <DetailRow label="Amount" value={`฿ ${PRICE_MAP[selectedRegistration.race_category] || 500}`} highlight />
                                                <DetailRow label="Date" value={new Date(selectedRegistration.created_at).toLocaleDateString()} />
                                                <DetailRow label="Time" value={new Date(selectedRegistration.created_at).toLocaleTimeString()} />
                                            </div>

                                            {/* Contact Details */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-slate-400 uppercase">Contact Details</p>
                                                <DetailField label="Phone" value={selectedRegistration.phone} />
                                                <DetailField label="Email" value={selectedRegistration.email} />
                                            </div>

                                            {/* ✅ BIB Input Area */}
                                            <div className="pt-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assign BIB Number</label>
                                                <div className="relative">
                                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="text"
                                                        className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono font-bold text-slate-800 placeholder:text-slate-300 transition-all uppercase"
                                                        placeholder="e.g. A1001"
                                                        value={bibInput}
                                                        onChange={(e) => setBibInput(e.target.value)}
                                                        disabled={selectedRegistration.status === 'approved'} // ถ้า Approve แล้วไม่ให้แก้ (หรือจะให้แก้ก็ได้แล้วแต่ Policy)
                                                    />
                                                    {selectedRegistration.status === 'approved' && (
                                                        <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                                                    Enter BIB number found in the registration sheet.
                                                </p>
                                            </div>

                                            <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-xs font-medium border border-orange-100 flex gap-3 leading-relaxed">
                                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                                <span>Verify transfer amount matches. Assign BIB before approving.</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-6 border-t border-slate-100 bg-slate-50">
                                        {selectedRegistration.status === 'pending' ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => handleUpdateStatus('approved')}
                                                    className="group flex flex-col items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all transform active:scale-95"
                                                >
                                                    <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                                                    <span className="text-xs">Approve & Save BIB</span>
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus('rejected')}
                                                    className="group flex flex-col items-center justify-center gap-1.5 bg-white border-2 border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500 py-3.5 rounded-2xl font-bold transition-all hover:bg-red-50"
                                                >
                                                    <XCircle size={20} className="group-hover:scale-110 transition-transform" />
                                                    <span className="text-xs">Reject</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center p-2">
                                                <p className="text-sm font-bold text-slate-500">
                                                    Status: <span className={`uppercase ${selectedRegistration.status === 'approved' ? 'text-emerald-600' : 'text-red-600'}`}>{selectedRegistration.status}</span>
                                                </p>
                                                <button
                                                    onClick={() => handleUpdateStatus('pending')} // เผื่อกดผิด อยากแก้กลับ
                                                    className="text-xs text-indigo-500 hover:underline mt-2"
                                                >
                                                    Revert to Pending
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center bg-slate-50/50">
                                    <Eye size={48} className="mb-4 opacity-50" />
                                    <p className="font-bold text-slate-400">View Details</p>
                                    <p className="text-xs mt-2 max-w-[150px]">Select a transaction to view runner details and take action</p>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}

// ... (Helper Components: ToolBtn, DetailRow, DetailField, StatusBadge เหมือนเดิม)
function ToolBtn({ icon, onClick, tooltip }: any) {
    return (
        <button onClick={onClick} title={tooltip} className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95">
            {icon}
        </button>
    );
}
function DetailRow({ label, value, highlight }: any) {
    return (
        <div className="flex justify-between items-center mb-2 last:mb-0">
            <span className="text-xs text-slate-500 font-medium">{label}</span>
            <span className={`text-sm font-bold ${highlight ? 'text-emerald-600 text-base' : 'text-slate-800'}`}>{value}</span>
        </div>
    );
}
function DetailField({ label, value, monospace }: any) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
            <span className="text-xs text-slate-400 font-medium">{label}</span>
            <span className={`text-sm font-bold text-slate-700 ${monospace ? 'font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs' : ''}`}>{value}</span>
        </div>
    );
}
function StatusBadge({ status }: { status: string }) {
    if (status === 'approved') return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100"><CheckCircle2 size={12} /> Paid</span>;
    if (status === 'rejected') return <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100"><XCircle size={12} /> Rejected</span>;
    return <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 animate-pulse"><Clock size={12} /> Review</span>;
}