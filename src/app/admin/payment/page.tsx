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
    Hash,
    AlertTriangle,
    Loader2,
    ChevronRight,
    X,
    ShieldCheck
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// Configuration
const PRICE_MAP: Record<string, number> = {
    'VIP': 2000,
    '10.5KM': 500,
    '5KM': 500,
    '6KM': 500
};

const REJECT_REASONS = [
    "Slip Amount Mismatch (ยอดเงินไม่ตรง)",
    "Duplicate Slip (สลิปซ้ำ)",
    "Unreadable / Blurry (รูปไม่ชัด)",
    "Wrong Account / Date (โอนผิดบัญชี/ผิดเวลา)",
    "Other (อื่นๆ)"
];

export default function PaymentAuditPage() {
    const searchParams = useSearchParams();
    const initialId = searchParams.get('id');

    // Data State
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

    // Viewer State
    const [rotate, setRotate] = useState(0);
    const [zoom, setZoom] = useState(1);

    // Action State
    const [searchTerm, setSearchTerm] = useState('');
    const [bibInput, setBibInput] = useState('');
    const [isAmountVerified, setIsAmountVerified] = useState(false); // ✅ Checkbox state

    // Modals State
    const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject', payload?: any } | null>(null);
    const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
    const [customReason, setCustomReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // --- 1. Fetch Data ---
    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false }); // Newest first

            if (error) throw error;
            setRegistrations(data as Registration[]);

            // Auto-select logic
            if (initialId) {
                const target = (data as Registration[]).find(r => r.id === initialId);
                if (target) setSelectedId(initialId);
            } else {
                const pending = (data as Registration[]).find(r => r.status === 'pending');
                if (pending) setSelectedId(pending.id);
            }
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. State Management on Selection Change ---
    useEffect(() => {
        if (selectedId) {
            const reg = registrations.find(r => r.id === selectedId);
            setBibInput(reg?.bib_number || '');
            setIsAmountVerified(reg?.status === 'approved'); // Auto-verify if already approved
            setRotate(0);
            setZoom(1);
        }
    }, [selectedId, registrations]);

    // --- 3. Computed Values ---
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

    const stats = useMemo(() => ({
        total: registrations.length,
        pending: registrations.filter(r => r.status === 'pending').length,
        approved: registrations.filter(r => r.status === 'approved').length,
        rejected: registrations.filter(r => r.status === 'rejected').length,
    }), [registrations]);

    // 🔥 Real-time Duplicate BIB Check
    const isDuplicateBIB = useMemo(() => {
        if (!bibInput.trim()) return false;
        return registrations.some(r =>
            r.bib_number?.trim() === bibInput.trim() &&
            r.id !== selectedId
        );
    }, [bibInput, registrations, selectedId]);

    // --- 4. Action Handlers ---

    // Step 1: Trigger Modal
    const initiateAction = (type: 'approve' | 'reject') => {
        setConfirmAction({ type });
    };

    // Step 2: Confirm & Execute
    const executeAction = async () => {
        if (!selectedId || !selectedRegistration) return;
        setIsProcessing(true);

        const actionType = confirmAction?.type;
        const finalStatus = actionType === 'approve' ? 'approved' : 'rejected';
        const finalBib = actionType === 'approve' ? bibInput : selectedRegistration.bib_number;
        const finalReason = actionType === 'reject' ? (rejectReason === 'Other (อื่นๆ)' ? customReason : rejectReason) : null;

        try {
            // 1. Update DB
            const { error } = await supabase
                .from('registrations')
                .update({
                    status: finalStatus,
                    bib_number: finalStatus === 'approved' ? finalBib : null
                })
                .eq('id', selectedId);

            if (error) throw error;

            // 2. Optimistic UI Update
            setRegistrations(prev => prev.map(r => r.id === selectedId ? {
                ...r,
                status: finalStatus,
                bib_number: finalBib
            } : r));

            // 3. Send Email (Background)
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: selectedRegistration.email,
                    type: actionType === 'approve' ? 'approval' : 'rejection',
                    data: actionType === 'approve'
                        ? { name: selectedRegistration.full_name_th, bib: finalBib, raceCategory: selectedRegistration.race_category }
                        : { name: selectedRegistration.full_name_th, reason: finalReason }
                })
            }).catch(console.error);

            // 4. Move to next pending item
            const nextPending = filteredRegistrations.find(r => r.status === 'pending' && r.id !== selectedId);
            if (nextPending && filter === 'pending') {
                setSelectedId(nextPending.id);
            }

            // Close Modal
            setConfirmAction(null);
            setCustomReason('');

        } catch (err) {
            alert('Error updating transaction');
        } finally {
            setIsProcessing(false);
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

                <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden transition-all duration-300 relative">

                    {/* Header */}
                    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shrink-0 z-20 shadow-sm">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Payment Audit</h2>
                            <div className="h-6 w-px bg-slate-200"></div>

                            {/* Filter Tabs */}
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

                        {/* 1. List Pane (Left) */}
                        <div className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col z-10">

                            {/* 🚀 Progress Bar */}
                            {filter === 'pending' && stats.pending > 0 && (
                                <div className="px-4 pt-4 pb-2">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                                        <span>Pending Queue</span>
                                        <span>{stats.total - stats.pending} / {stats.total} Reviewed</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-500"
                                            style={{ width: `${((stats.total - stats.pending) / stats.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Search */}
                            <div className="p-4 border-b border-slate-100">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search transactions..."
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* List Items */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></div>
                                ) : filteredRegistrations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                                        <Inbox size={24} className="opacity-50 mb-2" />
                                        <p className="text-sm font-medium">All cleared!</p>
                                    </div>
                                ) : (
                                    filteredRegistrations.map(reg => (
                                        <div
                                            key={reg.id}
                                            onClick={() => setSelectedId(reg.id)}
                                            className={`
                                                p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 relative
                                                ${selectedId === reg.id ? 'bg-indigo-50/60' : reg.status !== 'pending' ? 'opacity-60 bg-slate-50/30' : ''}
                                            `}
                                        >
                                            {selectedId === reg.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-sm font-bold truncate ${selectedId === reg.id ? 'text-indigo-900' : 'text-slate-700'}`}>{reg.full_name_th}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{new Date(reg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{reg.race_category}</span>
                                                    <span className="text-xs font-bold text-slate-800">฿ {PRICE_MAP[reg.race_category]?.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
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

                        {/* 2. Viewer Pane (Middle) */}
                        <div className="flex-1 bg-slate-200/50 flex flex-col relative min-w-0 overflow-hidden">
                            {/* Image Controls */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-1.5 flex items-center gap-1 border border-slate-200">
                                <ToolBtn icon={<ZoomIn size={18} />} onClick={() => setZoom(z => Math.min(z + 0.5, 3))} tooltip="Zoom In" />
                                <ToolBtn icon={<ZoomOut size={18} />} onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))} tooltip="Zoom Out" />
                                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                <ToolBtn icon={<RotateCw size={18} />} onClick={() => setRotate(r => r + 90)} tooltip="Rotate" />
                                <ToolBtn icon={<ExternalLink size={18} />} onClick={() => window.open(getPublicUrl(selectedRegistration?.payment_slip_url || '') || '', '_blank')} tooltip="Original" />
                            </div>

                            <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
                                {selectedRegistration?.payment_slip_url ? (
                                    <div
                                        className="relative transition-transform duration-300 ease-in-out shadow-2xl shadow-slate-900/20"
                                        style={{ transform: `scale(${zoom}) rotate(${rotate}deg)` }}
                                    >
                                        <img
                                            src={getPublicUrl(selectedRegistration.payment_slip_url) || ''}
                                            alt="Payment Slip"
                                            className="max-h-[85vh] max-w-full object-contain rounded-lg bg-white border-4 border-white"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <FileText size={48} className="mx-auto mb-4 opacity-30" />
                                        <p className="font-bold opacity-50">Select a transaction</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Detail Pane (Right) */}
                        <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20">
                            {selectedRegistration ? (
                                <>
                                    <div className="p-8 border-b border-slate-100 flex-1 overflow-y-auto">

                                        {/* Profile Header */}
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
                                                {selectedRegistration.full_name_en.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg leading-tight">{selectedRegistration.full_name_th}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">ID: {selectedRegistration.national_id}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">

                                            {/* 💰 Cognitive Aid: Expected Price */}
                                            <div className={`p-5 rounded-2xl border-2 transition-colors ${isAmountVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Expected Slip Amount</span>
                                                    <span className="text-xs font-bold text-indigo-500 uppercase">{selectedRegistration.race_category}</span>
                                                </div>
                                                <div className="text-4xl font-black text-slate-800 tracking-tight">
                                                    ฿ {PRICE_MAP[selectedRegistration.race_category]?.toLocaleString()}
                                                </div>

                                                {/* Verification Toggle */}
                                                <div className="mt-4 pt-4 border-t border-slate-200/50">
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAmountVerified ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white group-hover:border-emerald-400'}`}>
                                                            {isAmountVerified && <CheckCircle2 size={16} className="text-white" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={isAmountVerified}
                                                            onChange={(e) => setIsAmountVerified(e.target.checked)}
                                                            disabled={selectedRegistration.status !== 'pending'}
                                                        />
                                                        <span className={`text-sm font-bold ${isAmountVerified ? 'text-emerald-700' : 'text-slate-500 group-hover:text-emerald-600'}`}>
                                                            I verified the amount matches
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <DetailBox label="Phone" value={selectedRegistration.phone} />
                                                <DetailBox label="Time" value={new Date(selectedRegistration.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                                            </div>

                                            {/* #️⃣ Smart BIB Input */}
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Assign BIB</label>
                                                    {isDuplicateBIB && (
                                                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-pulse">
                                                            <AlertTriangle size={12} /> Duplicate BIB
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDuplicateBIB ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                                                    <input
                                                        type="text"
                                                        className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl font-mono font-bold text-lg uppercase transition-all
                                                            ${isDuplicateBIB
                                                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 text-red-600'
                                                                : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-slate-800'
                                                            }
                                                        `}
                                                        placeholder="A####"
                                                        value={bibInput}
                                                        onChange={(e) => setBibInput(e.target.value.toUpperCase())}
                                                        disabled={selectedRegistration.status !== 'pending'}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-6 border-t border-slate-100 bg-white z-20">
                                        {selectedRegistration.status === 'pending' ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => initiateAction('approve')}
                                                    disabled={!isAmountVerified || !bibInput.trim() || isDuplicateBIB}
                                                    className="col-span-1 group relative flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 disabled:shadow-none transition-all active:scale-[0.98]"
                                                >
                                                    <CheckCircle2 size={20} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => initiateAction('reject')}
                                                    className="col-span-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 hover:bg-red-50 py-4 rounded-xl font-bold transition-all"
                                                >
                                                    <XCircle size={20} />
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-2">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm uppercase ${selectedRegistration.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                    {selectedRegistration.status === 'approved' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                                    Transaction {selectedRegistration.status}
                                                </div>
                                                <button onClick={() => { /* Revert Logic if needed */ }} className="block mx-auto mt-2 text-xs text-slate-400 hover:text-indigo-500 underline">
                                                    Revert Status (Admin Only)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/50">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <Eye size={32} className="opacity-50" />
                                    </div>
                                    <p className="font-bold text-slate-400">No Selection</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- CONFIRMATION MODALS --- */}
                    {confirmAction && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">

                                {confirmAction.type === 'approve' ? (
                                    <>
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 mx-auto">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <h3 className="text-xl font-black text-center text-slate-800 mb-2">Confirm Approval</h3>
                                        <p className="text-center text-slate-500 text-sm mb-6">Checking this transaction will assign the BIB and notify the runner.</p>

                                        <div className="bg-slate-50 p-4 rounded-2xl space-y-3 mb-6 border border-slate-100">
                                            <DetailRow label="Runner" value={selectedRegistration?.full_name_th} />
                                            <DetailRow label="Amount Verified" value={`฿ ${PRICE_MAP[selectedRegistration?.race_category || '']}`} highlight />
                                            <DetailRow label="Assigned BIB" value={bibInput} highlight />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => setConfirmAction(null)} className="py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button>
                                            <button
                                                onClick={executeAction}
                                                disabled={isProcessing}
                                                className="py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                                            >
                                                {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirm Approve'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 mx-auto">
                                            <AlertTriangle size={28} />
                                        </div>
                                        <h3 className="text-xl font-black text-center text-slate-800 mb-2">Reject Transaction</h3>
                                        <p className="text-center text-slate-500 text-sm mb-6">Please select a reason. This will be sent to the runner.</p>

                                        <div className="space-y-3 mb-6">
                                            {REJECT_REASONS.map(reason => (
                                                <button
                                                    key={reason}
                                                    onClick={() => setRejectReason(reason)}
                                                    className={`w-full text-left p-3 rounded-xl text-sm font-bold border transition-all ${rejectReason === reason ? 'bg-red-50 border-red-200 text-red-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                >
                                                    {reason}
                                                </button>
                                            ))}
                                            {rejectReason === 'Other (อื่นๆ)' && (
                                                <textarea
                                                    className="w-full p-3 border border-slate-300 rounded-xl text-sm mt-2 focus:ring-2 focus:ring-red-100 outline-none"
                                                    placeholder="Specify reason..."
                                                    rows={2}
                                                    value={customReason}
                                                    onChange={e => setCustomReason(e.target.value)}
                                                />
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => setConfirmAction(null)} className="py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button>
                                            <button
                                                onClick={executeAction}
                                                disabled={isProcessing || (rejectReason === 'Other (อื่นๆ)' && !customReason.trim())}
                                                className="py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                                            >
                                                {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirm Reject'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </AdminAuthGuard>
    );
}

// --- Micro Components ---

function ToolBtn({ icon, onClick, tooltip }: any) {
    return (
        <button onClick={onClick} title={tooltip} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-95">
            {icon}
        </button>
    );
}

function DetailBox({ label, value }: any) {
    return (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</div>
            <div className="text-sm font-bold text-slate-700 truncate">{value}</div>
        </div>
    );
}

function DetailRow({ label, value, highlight }: any) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 font-medium">{label}</span>
            <span className={`text-sm font-bold ${highlight ? 'text-slate-900' : 'text-slate-700'}`}>{value}</span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'approved') return <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" title="Approved"></div>;
    if (status === 'rejected') return <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-200" title="Rejected"></div>;
    return <div className="w-2 h-2 rounded-full bg-orange-400 shadow-sm shadow-orange-200 animate-pulse" title="Pending"></div>;
}