'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Registration } from '@/types/registration';
import {
    Search,
    UserPlus,
    FileSpreadsheet,
    Calendar,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Filter,
    // MoreHorizontal, // ลบออก
    // Hash 
} from 'lucide-react';

const CATEGORY_STYLES: Record<string, string> = {
    '10.5KM': 'bg-orange-100 text-orange-700 border-orange-200',
    '5KM': 'bg-pink-100 text-pink-700 border-pink-200',
    '6KM': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'VIP': 'bg-yellow-100 text-yellow-700 border-yellow-200'
};

const STATUS_STYLES: Record<string, string> = {
    'approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'pending': 'bg-orange-50 text-orange-600 border-orange-100',
    'rejected': 'bg-red-50 text-red-600 border-red-100'
};

export default function RunnerListPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

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

    const filteredRegistrations = useMemo(() => {
        return registrations.filter(reg => {
            const term = searchTerm.toLowerCase();
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
    }, [registrations, searchTerm, categoryFilter, statusFilter]);

    const handleExportCSV = () => {
        const headers = ['ID,BIB,Date,FullName(TH),FullName(EN),NationalID,BirthDate,Age,Gender,BloodType,MedCond,Phone,Email,Category,ShirtSize,Shipping,Status'];
        const rows = filteredRegistrations.map(r => [
            r.id,
            `"${r.bib_number || ''}"`,
            new Date(r.created_at).toISOString().split('T')[0],
            `"${r.full_name_th}"`,
            `"${r.full_name_en}"`,
            `"${r.national_id}"`,
            r.birth_date,
            r.age,
            r.gender,
            r.blood_type,
            `"${r.medical_conditions || ''}"`,
            r.phone,
            r.email,
            r.race_category,
            r.shirt_size,
            r.shipping_method,
            r.status
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `mangrove_runners_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <AdminAuthGuard>
            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
                <AdminSidebar />

                <main className="flex-1 lg:ml-72 p-6 lg:p-10 transition-all duration-300">

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Runner Directory</h1>
                            <p className="text-slate-400 font-medium mt-1">Manage and monitor all registered runners</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
                            >
                                <FileSpreadsheet size={18} />
                                Export CSV
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
                                <UserPlus size={18} />
                                Add Runner
                            </button>
                        </div>
                    </div>

                    {/* Filters & Search Card */}
                    <div className="bg-white p-5 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, BIB, ID, phone..."
                                className="pl-12 pr-4 py-3 w-full bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
                            <div className="h-10 w-px bg-slate-100 mx-1 hidden md:block"></div>

                            {/* Category Filter */}
                            <div className="relative min-w-[160px]">
                                <select
                                    className="w-full appearance-none px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    <option value="10.5KM">10.5KM Mini</option>
                                    <option value="5KM">5KM Walk-Run</option>
                                    <option value="6KM">6KM Fun Run</option>
                                    <option value="VIP">VIP</option>
                                </select>
                                <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative min-w-[140px]">
                                <select
                                    className="w-full appearance-none px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                    <div className={`w-2 h-2 rounded-full ${statusFilter === 'approved' ? 'bg-emerald-500' : statusFilter === 'pending' ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-8 py-5">Full Name / Details</th>
                                        <th className="px-6 py-5 text-center">BIB</th>
                                        <th className="px-6 py-5">National ID</th>
                                        <th className="px-6 py-5">Contact Info</th>
                                        <th className="px-6 py-5">Kit & Shipping</th>
                                        <th className="px-6 py-5">Status</th>
                                        {/* ลบ Action Header */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-medium">Loading directory...</td></tr>
                                    ) : filteredRegistrations.length === 0 ? (
                                        <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-medium">No runners found matching your filters.</td></tr>
                                    ) : (
                                        filteredRegistrations.map((reg) => (
                                            <tr key={reg.id} className="group hover:bg-slate-50/80 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md
                                                            ${reg.gender === 'male' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 'bg-gradient-to-br from-pink-400 to-rose-500'}
                                                        `}>
                                                            {reg.full_name_en.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-800 text-base">{reg.full_name_th}</div>
                                                            <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">{reg.full_name_en}</div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                                                    {reg.gender === 'male' ? 'MALE' : 'FEMALE'}
                                                                </span>
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                                                    AGE {reg.age}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* BIB Column */}
                                                <td className="px-6 py-5 text-center">
                                                    {reg.bib_number ? (
                                                        <div className="inline-flex flex-col items-center justify-center bg-white border-2 border-slate-100 rounded-xl px-4 py-1.5 shadow-sm">
                                                            <span className="text-[10px] font-bold text-slate-300 leading-none">BIB</span>
                                                            <span className="font-mono text-lg font-black text-slate-700 leading-none">{reg.bib_number}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300 font-bold text-xl">-</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="font-mono text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                                                        {reg.national_id}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
                                                        <Calendar size={12} />
                                                        {new Date(reg.birth_date).toLocaleDateString('en-GB')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                            <Phone size={14} className="text-slate-300" /> {reg.phone}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                            <Mail size={14} className="text-slate-300 group-hover:text-indigo-400" /> {reg.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-2">
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border w-fit ${CATEGORY_STYLES[reg.race_category] || 'bg-slate-100'}`}>
                                                            {reg.race_category}
                                                        </span>
                                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                                            <span className="flex items-center gap-1"><span className="font-bold text-slate-700">SIZE:</span> {reg.shirt_size}</span>
                                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                            <span className="flex items-center gap-1">
                                                                {reg.shipping_method === 'postal' ? <MapPin size={12} /> : null}
                                                                {reg.shipping_method === 'postal' ? 'POSTAL' : 'PICKUP'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize inline-flex items-center gap-1.5 ${STATUS_STYLES[reg.status] || 'bg-slate-100'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${reg.status === 'approved' ? 'bg-emerald-500' : reg.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                                        {reg.status}
                                                    </span>
                                                </td>
                                                {/* ลบ Action Column */}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                Showing {filteredRegistrations.length} runners
                            </p>
                            <div className="flex gap-2">
                                <button disabled className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50 hover:bg-white transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <button disabled className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50 hover:bg-white transition-colors">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </AdminAuthGuard>
    );
}