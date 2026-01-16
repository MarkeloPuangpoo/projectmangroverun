'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Registration } from '@/types/registration';
import {
    Search,
    Bell,
    MoreHorizontal,
    FileText,
    CreditCard,
    Users,
    Shirt,
    CheckCircle2,
    Clock,
    XCircle,
    TrendingUp,
    Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Prices for revenue calculation
const PRICE_MAP: Record<string, number> = {
    'VIP': 2000,
    '10.5KM': 500,
    '5KM': 500,
    '6KM': 500
};

const CATEGORY_LABEL: Record<string, string> = {
    '10.5KM': 'Mini Marathon (10.5K)',
    '5KM': 'Walk-Run (5K)',
    '6KM': 'Fun Run (6K)',
    'VIP': 'VIP Runner'
};

const CATEGORY_STYLE: Record<string, string> = {
    '10.5KM': 'bg-orange-100 text-orange-700 border-orange-200',
    '5KM': 'bg-pink-100 text-pink-700 border-pink-200',
    '6KM': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'VIP': 'bg-yellow-100 text-yellow-700 border-yellow-200'
};

const PROGRESS_COLOR: Record<string, string> = {
    '10.5KM': 'bg-orange-500',
    '5KM': 'bg-pink-500',
    '6KM': 'bg-emerald-500',
    'VIP': 'bg-yellow-500'
};

export default function AdminDashboard() {
    const router = useRouter();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [runnerGoal, setRunnerGoal] = useState(1500);

    useEffect(() => {
        fetchRegistrations();
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'runner_goal')
            .single();

        if (data?.value) {
            setRunnerGoal(parseInt(data.value));
        }
    };

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

    const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            setRegistrations(regs => regs.map(r => r.id === id ? { ...r, status: newStatus } : r));
            const { error } = await supabase
                .from('registrations')
                .update({ status: newStatus })
                .eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error('Error updating status:', error);
            fetchRegistrations();
        }
    };

    const getPublicUrl = (path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const { data } = supabase.storage.from('payment-slips').getPublicUrl(path);
        return data.publicUrl;
    };

    const stats = useMemo(() => {
        const totalRunners = registrations.length;
        const totalRevenue = registrations
            .filter(r => r.status !== 'rejected')
            .reduce((sum, r) => sum + (PRICE_MAP[r.race_category] || 500), 0);
        const pendingPayment = registrations.filter(r => r.status === 'pending').length;
        const shirtSizes = registrations.reduce((acc, r) => {
            const size = r.shirt_size || 'Unk';
            acc[size] = (acc[size] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const categoryCounts = registrations.reduce((acc, r) => {
            acc[r.race_category] = (acc[r.race_category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return { totalRunners, totalRevenue, pendingPayment, shirtSizes, categoryCounts };
    }, [registrations]);

    const filteredRegistrations = useMemo(() => {
        return registrations.filter(reg => {
            const term = searchTerm.toLowerCase();
            return (
                reg.full_name_th.toLowerCase().includes(term) ||
                reg.full_name_en.toLowerCase().includes(term) ||
                reg.email.toLowerCase().includes(term) ||
                reg.phone.includes(term)
            );
        });
    }, [registrations, searchTerm]);

    return (
        <AdminAuthGuard>
            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">

                <AdminSidebar pendingCount={stats.pendingPayment} />

                {/* Main Content */}
                <main className="flex-1 lg:ml-72 p-6 lg:p-10 transition-all duration-300">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard</h1>
                            <p className="text-slate-400 font-medium mt-1">Welcome back, Admin 👋</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search Bar */}
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search runner..."
                                    className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all text-sm w-full md:w-72 shadow-sm placeholder:text-slate-300 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Notification */}
                            <button className="relative p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-indigo-500 hover:shadow-md transition-all">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            title="Total Runners"
                            value={stats.totalRunners.toLocaleString()}
                            icon={<Users size={22} className="text-white" />}
                            gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
                            trend="+12%"
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`฿ ${stats.totalRevenue.toLocaleString()}`}
                            icon={<CreditCard size={22} className="text-white" />}
                            gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                            trend="+8.2%"
                        />
                        <StatCard
                            title="Pending Audit"
                            value={stats.pendingPayment.toString()}
                            icon={<Clock size={22} className="text-white" />}
                            gradient="bg-gradient-to-br from-orange-400 to-pink-500"
                            action="Action Needed"
                        />

                        {/* Shirt Mini-Chart */}
                        <div className="bg-white p-6 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500">
                                    <Shirt size={20} />
                                </div>
                                <span className="text-sm font-bold text-slate-500">Top Sizes</span>
                            </div>
                            <div className="flex gap-3 relative z-10">
                                {['M', 'L', 'XL', '2XL'].map(size => (
                                    <div key={size} className="text-center">
                                        <div className="text-[10px] font-bold text-slate-400 mb-1">{size}</div>
                                        <div className="h-10 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm shadow-sm">
                                            {stats.shirtSizes[size] || 0}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left: Registration Goal & Categories */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Goal Card */}
                            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg text-slate-800">Runner Goal</h3>
                                    <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                        <TrendingUp size={18} />
                                    </span>
                                </div>
                                <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                        <circle
                                            cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                                            strokeDasharray={440}
                                            strokeDashoffset={440 - (440 * Math.min(stats.totalRunners / runnerGoal, 1))}
                                            className="text-indigo-500 transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-slate-800">{Math.round((stats.totalRunners / runnerGoal) * 100)}%</span>
                                        <span className="text-xs text-slate-400 font-bold uppercase">Completed</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-500 font-medium">
                                        <span className="text-indigo-600 font-bold">{stats.totalRunners}</span> / {runnerGoal.toLocaleString()} Registered
                                    </p>
                                </div>
                            </div>

                            {/* Categories List */}
                            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                                <h3 className="font-bold text-lg text-slate-800 mb-6">Categories</h3>
                                <div className="space-y-5">
                                    {Object.entries(CATEGORY_LABEL).map(([key, label]) => {
                                        const count = stats.categoryCounts[key] || 0;
                                        const percent = Math.round((count / (stats.totalRunners || 1)) * 100);
                                        return (
                                            <div key={key}>
                                                <div className="flex justify-between text-sm mb-2 font-bold">
                                                    <span className="text-slate-600">{label}</span>
                                                    <span className="text-slate-800">{count}</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${PROGRESS_COLOR[key]}`} style={{ width: `${percent}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right: Recent Registrations Table */}
                        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Recent Registrations</h3>
                                    <p className="text-slate-400 text-sm mt-1">Latest runners joining the event</p>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                    <Filter size={20} />
                                </button>
                            </div>

                            <div className="overflow-x-auto flex-1 p-2">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4 pl-8">Runner Profile</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right pr-8">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr><td colSpan={4} className="p-10 text-center text-slate-400">Loading data...</td></tr>
                                        ) : filteredRegistrations.slice(0, 8).map((reg) => (
                                            <tr key={reg.id} className="group hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 pl-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-sm border-2 border-white shadow-sm">
                                                            {reg.full_name_en.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800">{reg.full_name_th}</div>
                                                            <div className="text-xs text-slate-400 font-medium">{reg.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${CATEGORY_STYLE[reg.race_category] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                        {reg.race_category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {reg.status === 'approved' && (
                                                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full text-xs font-bold">
                                                            <CheckCircle2 size={14} /> Approved
                                                        </div>
                                                    )}
                                                    {reg.status === 'pending' && (
                                                        <div className="flex items-center gap-2 text-orange-500 bg-orange-50 w-fit px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                                            <Clock size={14} /> Pending
                                                        </div>
                                                    )}
                                                    {reg.status === 'rejected' && (
                                                        <div className="flex items-center gap-2 text-red-500 bg-red-50 w-fit px-3 py-1 rounded-full text-xs font-bold">
                                                            <XCircle size={14} /> Rejected
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right pr-8">
                                                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {reg.status === 'pending' ? (
                                                            <button
                                                                onClick={() => router.push(`/admin/payment?id=${reg.id}`)}
                                                                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                                            >
                                                                Verify
                                                            </button>
                                                        ) : (
                                                            <>
                                                                {reg.payment_slip_url && (
                                                                    <a
                                                                        href={getPublicUrl(reg.payment_slip_url) || '#'}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                                        title="View Slip"
                                                                    >
                                                                        <FileText size={18} />
                                                                    </a>
                                                                )}
                                                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                                                    <MoreHorizontal size={18} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </AdminAuthGuard>
    );
}

function StatCard({ title, value, icon, gradient, trend, action }: any) {
    return (
        <div className="bg-white p-6 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-xl ${gradient}`}></div>

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-2xl shadow-lg shadow-gray-200 ${gradient}`}>
                    {icon}
                </div>
                {trend && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">{trend}</span>}
                {action && <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-1 rounded-lg shadow-sm animate-bounce">{action}</span>}
            </div>
            <div className="relative z-10">
                <p className="text-slate-400 text-sm font-bold tracking-wide">{title}</p>
                <h4 className="text-2xl font-black text-slate-800 mt-1">{value}</h4>
            </div>
        </div>
    );
}