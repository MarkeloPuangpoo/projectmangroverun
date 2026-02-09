'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
    Shirt,
    Download,
    TrendingUp,
    Package,
    CheckCircle2,
    Clock,
    Printer,
    BarChart3,
    Edit2,
    Save,
    X
} from 'lucide-react';

const ALL_SIZES = ['5XS', '4XS', '3XS', '2XS', 'SS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

export default function ShirtStockPage() {
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [shirtLimits, setShirtLimits] = useState<Record<string, number>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [tempLimits, setTempLimits] = useState<Record<string, number>>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [regRes, settingsRes] = await Promise.all([
                supabase.from('registrations').select('shirt_size, status'),
                supabase.from('settings').select('value').eq('key', 'shirt_limits').single()
            ]);

            if (regRes.error) throw regRes.error;
            setRegistrations(regRes.data || []);

            if (settingsRes.data?.value) {
                try {
                    const parsed = JSON.parse(settingsRes.data.value);
                    setShirtLimits(parsed);
                    setTempLimits(parsed);
                } catch (e) {
                    console.error("Failed to parse shirt limits", e);
                }
            } else {
                // Initialize default limits if not set (e.g., 100 per size)
                const defaults = ALL_SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {});
                setShirtLimits(defaults);
                setTempLimits(defaults);
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLimits = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('settings')
                .upsert({ key: 'shirt_limits', value: JSON.stringify(tempLimits) });

            if (error) throw error;

            setShirtLimits(tempLimits);
            setIsEditing(false);
            alert("Stock limits updated successfully!");
        } catch (error) {
            console.error("Error saving limits:", error);
            alert("Failed to save limits");
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const counts: Record<string, { total: number, approved: number, pending: number, limit: number, remaining: number }> = {};

        // Initialize
        ALL_SIZES.forEach(size => {
            const limit = shirtLimits[size] || 0;
            counts[size] = { total: 0, approved: 0, pending: 0, limit, remaining: limit };
        });

        // Count
        registrations.forEach(reg => {
            const size = reg.shirt_size;
            if (counts[size]) {
                counts[size].total++;
                if (reg.status === 'approved') counts[size].approved++;
                if (reg.status === 'pending') counts[size].pending++;

                // Remaining logic: Limit - (Approved + Pending) ... or just Approved? Usually Approved+Pending holds stock.
                counts[size].remaining = Math.max(0, counts[size].limit - counts[size].total);
            }
        });

        const totalNeeded = registrations.filter(r => r.status === 'approved').length;
        const totalPending = registrations.filter(r => r.status === 'pending').length;

        // Find Top Size
        const sortedSizes = Object.entries(counts).sort((a, b) => b[1].total - a[1].total);
        const topSize = sortedSizes[0]?.[0] || '-';

        return { counts, totalNeeded, totalPending, topSize };
    }, [registrations, shirtLimits]);

    const handleExport = () => {
        const headers = ['Size,Limit,Used (Total),Remaining,Approved (Paid),Pending'];
        const rows = ALL_SIZES.map(size => [
            size,
            stats.counts[size].limit,
            stats.counts[size].total,
            stats.counts[size].remaining,
            stats.counts[size].approved,
            stats.counts[size].pending
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `shirt_stock_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    // 🖨️ Print Handler
    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminAuthGuard>
            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
                {/* Hide Sidebar on Print */}
                <div className="print:hidden">
                    <AdminSidebar />
                </div>

                <main className="flex-1 lg:ml-72 p-6 lg:p-10 transition-all duration-300 print:ml-0 print:p-0">

                    {/* --- WEB VIEW --- */}
                    <div className="print:hidden">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Shirt Inventory</h1>
                                <p className="text-slate-400 font-medium mt-1">Track shirt sizes and manage stock limits</p>
                            </div>
                            <div className="flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
                                        >
                                            <X size={18} /> Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveLimits}
                                            disabled={loading}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                                        >
                                            <Save size={18} /> Save Limits
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all"
                                    >
                                        <Edit2 size={18} /> Edit Limits
                                    </button>
                                )}
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                                >
                                    <Printer size={18} /> Print
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                                >
                                    <Download size={18} /> CSV
                                </button>
                            </div>
                        </div>

                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Package size={100} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2 text-indigo-100">
                                        <CheckCircle2 size={18} />
                                        <span className="text-sm font-bold uppercase tracking-wider">Confirmed Order</span>
                                    </div>
                                    <div className="text-4xl font-black mb-1">{stats.totalNeeded}</div>
                                    <div className="text-sm opacity-80">Shirts ready to produce</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
                                    <Clock size={80} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2 text-orange-500">
                                        <Clock size={18} />
                                        <span className="text-sm font-bold uppercase tracking-wider">Pending</span>
                                    </div>
                                    <div className="text-4xl font-black text-slate-800 mb-1">{stats.totalPending}</div>
                                    <div className="text-sm text-slate-400">Potential additional orders</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={80} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2 text-emerald-500">
                                        <BarChart3 size={18} />
                                        <span className="text-sm font-bold uppercase tracking-wider">Most Popular</span>
                                    </div>
                                    <div className="text-4xl font-black text-slate-800 mb-1">{stats.topSize}</div>
                                    <div className="text-sm text-slate-400">Highest demand size</div>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid: Size Cards */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                <Shirt size={20} className="text-indigo-500" />
                                Size Breakdown
                            </h3>

                            {loading ? (
                                <div className="text-center p-10 text-slate-400">Loading stock data...</div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {ALL_SIZES.map(size => {
                                        const data = stats.counts[size];
                                        const isPopular = size === stats.topSize;
                                        const percentageUsed = data.limit > 0 ? (data.total / data.limit) * 100 : 0;
                                        const isCritical = percentageUsed >= 90;
                                        const isWarning = percentageUsed >= 75;

                                        return (
                                            <div
                                                key={size}
                                                className={`
                                                    relative p-5 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 hover:shadow-md
                                                    ${isPopular ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:bg-white'}
                                                    ${isCritical && !isEditing ? 'ring-2 ring-red-500 ring-offset-2' : ''}
                                                `}
                                            >
                                                {isPopular && (
                                                    <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                        POPULAR
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-start mb-3">
                                                    <div className={`
                                                        w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm
                                                        ${isPopular ? 'bg-white text-indigo-600 shadow-sm' : 'bg-white text-slate-600 border border-slate-100'}
                                                    `}>
                                                        {size}
                                                    </div>
                                                    <div className="text-right">
                                                        {isEditing ? (
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Set Limit</span>
                                                                <input
                                                                    type="number"
                                                                    className="w-16 p-1 text-right font-black text-slate-800 border rounded bg-white focus:ring-2 focus:ring-indigo-500"
                                                                    value={tempLimits[size] || 0}
                                                                    onChange={(e) => setTempLimits({ ...tempLimits, [size]: parseInt(e.target.value) || 0 })}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className={`text-2xl font-black ${isCritical ? 'text-red-500' : 'text-slate-800'}`}>
                                                                    {data.total} <span className="text-xs text-slate-400 font-bold">/ {data.limit}</span>
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 font-bold uppercase">Used / Limit</div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    {/* Progress Bar (Limit Utilization) */}
                                                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-indigo-500'}`}
                                                            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                                                        ></div>
                                                    </div>

                                                    {/* Approved Bar */}
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Paid
                                                        </span>
                                                        <span className="font-bold text-slate-700">{data.approved}</span>
                                                    </div>

                                                    {/* Pending Bar */}
                                                    <div className="flex justify-between items-center text-xs pt-1">
                                                        <span className="text-orange-500 font-bold flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span> Wait
                                                        </span>
                                                        <span className="font-bold text-slate-700">{data.pending}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- 🖨️ PRINT VIEW (Hidden on Screen) --- */}
                    <div className="hidden print:block p-8 bg-white text-black">
                        <div className="text-center mb-8 border-b pb-6 border-slate-900">
                            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Mangrove Run 2026</h1>
                            <h2 className="text-xl font-bold text-slate-600">Inventory Report Breakdown</h2>
                            <p className="text-sm mt-2 text-slate-500">
                                Printed on: {new Date().toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="p-4 border border-slate-300 rounded-lg">
                                <div className="text-sm font-bold uppercase text-slate-500 mb-1">Total Confirmed (Paid)</div>
                                <div className="text-5xl font-black">{stats.totalNeeded}</div>
                            </div>
                            <div className="p-4 border border-slate-300 rounded-lg">
                                <div className="text-sm font-bold uppercase text-slate-500 mb-1">Pending Orders</div>
                                <div className="text-3xl font-black text-slate-400">{stats.totalPending}</div>
                            </div>
                        </div>

                        <table className="w-full text-left border-collapse border border-slate-300">
                            <thead>
                                <tr className="bg-slate-100 text-slate-900 uppercase text-sm font-black">
                                    <th className="p-4 border border-slate-300">Size</th>
                                    <th className="p-4 border border-slate-300 bg-emerald-50 text-emerald-900 w-1/4">Confirmed (Paid)</th>
                                    <th className="p-4 border border-slate-300 text-slate-500 w-1/4">Pending</th>
                                    <th className="p-4 border border-slate-300 text-slate-900 w-1/4">Order Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ALL_SIZES.map((size) => {
                                    const d = stats.counts[size];
                                    if (d.total === 0) return null; // Don't print empty sizes to save space/ink

                                    return (
                                        <tr key={size} className="text-sm">
                                            <td className="p-3 border border-slate-300 font-bold text-lg">{size}</td>
                                            <td className="p-3 border border-slate-300 font-bold text-lg bg-emerald-50 text-black">
                                                {d.approved}
                                            </td>
                                            <td className="p-3 border border-slate-300 text-slate-500">
                                                {d.pending}
                                            </td>
                                            <td className="p-3 border border-slate-300 font-black text-lg">
                                                {d.total}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="mt-10 text-center text-xs text-slate-400">
                            --- End of Report ---
                        </div>
                    </div>

                </main>
            </div>
        </AdminAuthGuard>
    );
}