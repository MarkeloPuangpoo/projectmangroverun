'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import EditRunnerModal from '@/components/admin/EditRunnerModal';
import { Registration } from '@/types/registration';
import {
    Search,
    UserPlus,
    FileSpreadsheet,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Filter,
    X,
    MoreHorizontal,
    CreditCard,
    CheckCircle2,
    AlertTriangle,
    MapPin,
    Shirt,
    Loader2,
    Download,
    Edit // Added Edit icon
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import RunnerReportPDF from '@/components/admin/RunnerReportPDF';

// --- Utility: Highlight Text ---
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} className="bg-yellow-200 text-slate-900 px-0.5 rounded">{part}</span>
                ) : (
                    part
                )
            )}
        </span>
    );
};

// --- Constant Styles ---
const CATEGORY_STYLES: Record<string, string> = {
    '10.5KM': 'bg-orange-100 text-orange-700 border-orange-200',
    '5KM': 'bg-pink-100 text-pink-700 border-pink-200',
    '6KM': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'VIP': 'bg-yellow-100 text-yellow-700 border-yellow-200'
};

export default function RunnerListPage() {
    // Data State
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Modal State
    const [selectedRunner, setSelectedRunner] = useState<Registration | null>(null);
    const [editingRunner, setEditingRunner] = useState<Registration | null>(null); // New State
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
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRegistrations(data as Registration[]);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Debounce Search (UX improvement) ---
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
            setCurrentPage(1); // Reset page on search
        }, 300); // 300ms delay
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // --- 3. Filter Logic ---
    const filteredData = useMemo(() => {
        return registrations.filter(reg => {
            const term = debouncedTerm.toLowerCase();
            const matchesSearch =
                reg.full_name_th.toLowerCase().includes(term) ||
                reg.full_name_en.toLowerCase().includes(term) ||
                reg.national_id.includes(term) ||
                reg.phone.includes(term) ||
                (reg.bib_number && reg.bib_number.toLowerCase().includes(term));

            const matchesCategory = categoryFilter === 'all' || reg.race_category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [registrations, debouncedTerm, categoryFilter, statusFilter]);

    // --- 4. Pagination Logic ---
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // --- Actions ---
    const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
        if (!selectedRunner) return;
        setIsProcessing(true);
        try {
            const { error } = await supabase
                .from('registrations')
                .update({ status })
                .eq('id', selectedRunner.id);

            if (error) throw error;

            // Optimistic Update
            setRegistrations(prev => prev.map(r => r.id === selectedRunner.id ? { ...r, status } : r));
            setSelectedRunner(null);
        } catch (err) {
            alert('Error updating status');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateRunner = (updatedRunner: Registration) => {
        setRegistrations(prev => prev.map(r => r.id === updatedRunner.id ? updatedRunner : r));
        setEditingRunner(null);
        // Also update selectedRunner if it's the one being edited
        if (selectedRunner?.id === updatedRunner.id) {
            setSelectedRunner(updatedRunner);
        }
    };

    const handleExportCSV = () => {
        if (filteredData.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = [
            "ID", "Created At", "Status",
            "Bib Number", "Race Category", "Shirt Size",
            "Full Name (TH)", "Full Name (EN)", "Gender", "Birth Date", "Age", "National ID",
            "Phone", "Email", "Shipping Method", "Address", "Medical Conditions", "Payment Slip URL"
        ];

        const escapeCsv = (str: string | null | undefined) => {
            if (!str) return "";
            return `"${String(str).replace(/"/g, '""')}"`; // Escape double quotes
        };

        const rows = filteredData.map(reg => [
            escapeCsv(reg.id),
            escapeCsv(reg.created_at),
            escapeCsv(reg.status),
            escapeCsv(reg.bib_number || 'N/A'),
            escapeCsv(reg.race_category),
            escapeCsv(reg.shirt_size),
            escapeCsv(reg.full_name_th),
            escapeCsv(reg.full_name_en),
            escapeCsv(reg.gender),
            escapeCsv(reg.birth_date),
            escapeCsv(reg.age?.toString()), // Fix: Convert number to string
            escapeCsv(reg.national_id),
            escapeCsv(reg.phone),
            escapeCsv(reg.email),
            escapeCsv(reg.shipping_method),
            escapeCsv(reg.address),
            escapeCsv(reg.medical_conditions),
            escapeCsv(reg.payment_slip_url)
        ].join(","));

        const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n"); // Add BOM for Excel Thai support
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `MangroveRun_Export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = async () => {
        if (registrations.length === 0) {
            alert("No data to export");
            return;
        }

        try {
            const blob = await pdf(<RunnerReportPDF data={filteredData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `MangroveRun_Runners_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
        }
    };

    return (
        <AdminAuthGuard>
            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
                <AdminSidebar />

                <main className="flex-1 lg:ml-72 p-6 lg:p-10">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Runners</h1>
                            <p className="text-slate-500 font-medium">Manage registrations & payments</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-bold text-slate-600 text-sm">
                                <Download size={16} /> Export CSV
                            </button>
                            <button onClick={handleExportPDF} className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-bold text-slate-600 text-sm">
                                <FileSpreadsheet size={16} /> Export PDF
                            </button>
                            <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-sm shadow-lg shadow-indigo-200">
                                <UserPlus size={16} /> New Runner
                            </button>
                        </div>
                    </div>

                    {/* Controls Card */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search Name, BIB, Phone..."
                                    className="pl-12 pr-4 py-3 w-full bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-medium transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-3">
                                <select
                                    className="bg-slate-50 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 border-none focus:ring-2 focus:ring-indigo-100"
                                    value={categoryFilter}
                                    onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="all">All Categories</option>
                                    <option value="10.5KM">10.5KM</option>
                                    <option value="5KM">5KM</option>
                                    <option value="VIP">VIP</option>
                                </select>
                                <select
                                    className="bg-slate-50 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 border-none focus:ring-2 focus:ring-indigo-100"
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filters Chips (Visual Feedback) */}
                        {(categoryFilter !== 'all' || statusFilter !== 'all' || debouncedTerm) && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                                <span className="text-xs font-bold text-slate-400 uppercase self-center mr-2">Active Filters:</span>
                                {debouncedTerm && (
                                    <span className="chip bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 border border-indigo-100">
                                        Search: "{debouncedTerm}" <button onClick={() => setSearchTerm('')}><X size={12} /></button>
                                    </span>
                                )}
                                {categoryFilter !== 'all' && (
                                    <span className="chip bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 border border-orange-100">
                                        Cat: {categoryFilter} <button onClick={() => setCategoryFilter('all')}><X size={12} /></button>
                                    </span>
                                )}
                                {statusFilter !== 'all' && (
                                    <span className="chip bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 border border-emerald-100">
                                        Status: {statusFilter} <button onClick={() => setStatusFilter('all')}><X size={12} /></button>
                                    </span>
                                )}
                                <button
                                    onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                                    className="text-xs text-slate-400 hover:text-red-500 font-bold underline ml-auto"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4 w-[35%]">Runner Profile</th>
                                    <th className="px-6 py-4 w-[20%]">Status & BIB</th>
                                    <th className="px-6 py-4 w-[25%]">Contact & Kit</th>
                                    <th className="px-6 py-4 w-[10%] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-slate-400"><Loader2 className="animate-spin mx-auto mb-2" />Loading...</td></tr>
                                ) : paginatedData.length === 0 ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-slate-400">No runners found.</td></tr>
                                ) : (
                                    paginatedData.map((reg) => (
                                        <tr
                                            key={reg.id}
                                            onClick={() => setSelectedRunner(reg)}
                                            className="group hover:bg-indigo-50/50 transition-colors cursor-pointer"
                                        >
                                            {/* Column 1: Identity */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`
                                                        w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-sm shadow-sm mt-1
                                                        ${reg.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}
                                                    `}>
                                                        {reg.full_name_en.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-base line-clamp-1">
                                                            <HighlightText text={reg.full_name_th} highlight={debouncedTerm} />
                                                        </div>
                                                        <div className="text-slate-500 text-xs uppercase tracking-wide mb-1">
                                                            <HighlightText text={reg.full_name_en} highlight={debouncedTerm} />
                                                        </div>
                                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${CATEGORY_STYLES[reg.race_category]}`}>
                                                            {reg.race_category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 2: Status & BIB (Critical Info) */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    {/* Status Pill */}
                                                    <div className={`
                                                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border w-fit
                                                        ${reg.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                            reg.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                                'bg-red-100 text-red-700 border-red-200'}
                                                    `}>
                                                        {reg.status === 'approved' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                                                        {reg.status.toUpperCase()}
                                                    </div>

                                                    {/* BIB Number */}
                                                    {reg.bib_number ? (
                                                        <div className="font-mono font-black text-slate-800 text-xl tracking-tight">
                                                            BIB <span className="text-indigo-600">{reg.bib_number}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-slate-300 text-xs font-bold font-mono">NO BIB</div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 3: Essentials */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                        <Phone size={12} className="text-slate-400" />
                                                        <HighlightText text={reg.phone} highlight={debouncedTerm} />
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                        <Shirt size={12} className="text-slate-400" /> Size: <span className="font-bold text-slate-800">{reg.shirt_size}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                        <MapPin size={12} className="text-slate-400" /> {reg.shipping_method === 'postal' ? 'Postal Delivery' : 'Self Pickup'}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 4: Action */}
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">
                                Showing {paginatedData.length} of {filteredData.length}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-500"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                                    Page {currentPage} / {totalPages || 1}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-500"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* --- Audit Modal (Review) --- */}
                {selectedRunner && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                            {/* Left: Proof */}
                            <div className="w-full md:w-1/2 bg-slate-100 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 relative">
                                {selectedRunner.payment_slip_url ? (
                                    <img
                                        src={selectedRunner.payment_slip_url}
                                        alt="Slip"
                                        className="max-h-[400px] object-contain rounded-lg shadow-sm"
                                    />
                                ) : (
                                    <div className="text-slate-400 flex flex-col items-center">
                                        <CreditCard size={48} className="mb-2 opacity-50" />
                                        <span className="font-bold">No Slip Uploaded</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-white">
                                    Proof of Payment
                                </div>
                            </div>

                            {/* Right: Details & Action */}
                            <div className="w-full md:w-1/2 p-8 flex flex-col bg-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800">{selectedRunner.full_name_th}</h2>
                                        <p className="text-slate-500 font-medium">{selectedRunner.race_category} • {selectedRunner.gender.toUpperCase()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingRunner(selectedRunner)}
                                            className="p-2 hover:bg-slate-100 rounded-full text-indigo-500"
                                            title="Edit Runner"
                                        >
                                            <Edit size={24} />
                                        </button>
                                        <button onClick={() => setSelectedRunner(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 flex-1 overflow-y-auto">
                                    <InfoItem label="National ID" value={selectedRunner.national_id} />
                                    <InfoItem label="Phone" value={selectedRunner.phone} />
                                    <InfoItem label="Email" value={selectedRunner.email} />
                                    <InfoItem label="Shirt Size" value={selectedRunner.shirt_size} />
                                    <InfoItem label="BIB Number" value={selectedRunner.bib_number || '-'} />
                                    <InfoItem label="Shipping" value={selectedRunner.shipping_method} />
                                    <InfoItem label="Address" value={selectedRunner.address || '-'} />
                                    <InfoItem label="Registered At" value={new Date(selectedRunner.created_at).toLocaleString('th-TH')} />
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                    {selectedRunner.status === 'approved' ? (
                                        <button disabled className="col-span-2 py-3 bg-emerald-50 text-emerald-600 font-bold rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
                                            <CheckCircle2 size={18} /> Payment Approved
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus('rejected')}
                                                disabled={isProcessing}
                                                className="py-3 text-red-600 font-bold bg-white border border-red-100 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus('approved')}
                                                disabled={isProcessing}
                                                className="py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                {isProcessing ? <Loader2 className="animate-spin" /> : 'Approve Payment'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Edit Modal --- */}
                {editingRunner && (
                    <EditRunnerModal
                        runner={editingRunner}
                        onClose={() => setEditingRunner(null)}
                        onUpdate={handleUpdateRunner}
                    />
                )}
            </div>
        </AdminAuthGuard>
    );
}

// Sub-component
const InfoItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
        <span className="text-slate-400 text-sm font-bold uppercase">{label}</span>
        <span className="text-slate-800 font-medium text-right max-w-[200px] truncate" title={value}>{value}</span>
    </div>
);