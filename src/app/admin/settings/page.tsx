'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
    Save,
    Trophy,
    Settings,
    AlertCircle,
    CheckCircle2,
    Target,
    Calendar,
    Power
} from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [runnerGoal, setRunnerGoal] = useState('');

    // Fake state for UI demonstration (ถ้ามีตาราง settings จริงก็ผูกค่าได้)
    const [isRegOpen, setIsRegOpen] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'runner_goal')
                .single();

            if (data) {
                setRunnerGoal(data.value);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const { error } = await supabase
                .from('settings')
                .upsert({ key: 'runner_goal', value: runnerGoal });

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminAuthGuard>
            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 lg:ml-72 p-6 lg:p-10 transition-all duration-300">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <Settings className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Settings</h1>
                            <p className="text-slate-400 font-medium text-sm">Configure event parameters and global options</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">

                        {/* Main Settings Card */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSave} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">

                                <div className="p-8 border-b border-slate-50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Target size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Event Goals</h3>
                                            <p className="text-xs text-slate-400">Set targets for registration dashboard</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Total Runner Capacity
                                            </label>
                                            <div className="relative group">
                                                <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                                <input
                                                    type="number"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300"
                                                    placeholder="e.g. 1500"
                                                    value={runnerGoal}
                                                    onChange={(e) => setRunnerGoal(e.target.value)}
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md shadow-sm">
                                                    Runners
                                                </div>
                                            </div>
                                            <div className="mt-3 flex gap-2 items-start p-3 bg-blue-50 rounded-xl text-blue-700 text-xs leading-relaxed border border-blue-100">
                                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                                <p>This number is used to calculate the percentage progress circle on the main dashboard. It does not automatically close registration.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Example of another section (Disabled UI for now just for looks) */}
                                <div className="p-8 bg-slate-50/50">
                                    <div className="flex items-center justify-between opacity-60 pointer-events-none grayscale">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">Event Date</h3>
                                                <p className="text-xs text-slate-400">May 25, 2026</p>
                                            </div>
                                        </div>
                                        <button type="button" className="text-sm font-bold text-indigo-600">Edit</button>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
                                    <div className="h-8">
                                        {success && (
                                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-left-2">
                                                <CheckCircle2 size={16} />
                                                <span className="text-xs font-bold">Settings saved successfully</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Column: Status Card */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* System Status */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Power size={20} className="text-slate-400" />
                                    System Status
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Registration</p>
                                            <p className="text-xs text-slate-400">Allow new runners</p>
                                        </div>
                                        <button
                                            onClick={() => setIsRegOpen(!isRegOpen)}
                                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isRegOpen ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isRegOpen ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Maintenance Mode</p>
                                            <p className="text-xs text-slate-400">Close site for updates</p>
                                        </div>
                                        <div className="w-12 h-6 rounded-full bg-slate-300 relative cursor-not-allowed">
                                            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[2rem] shadow-lg text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <h3 className="font-bold text-lg mb-2 relative z-10">Admin Tips</h3>
                                <p className="text-indigo-100 text-sm leading-relaxed relative z-10">
                                    Setting the runner goal helps visualize progress. You can check the "Dashboard" page to see the circular progress bar based on this value.
                                </p>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}