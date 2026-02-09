'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
    Settings,
    Save,
    Power,
    Target,
    Loader2,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Settings State
    const [runnerGoal, setRunnerGoal] = useState<string>('2000');
    const [isRegOpen, setIsRegOpen] = useState<boolean>(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('settings')
                .select('*');

            if (error) throw error;

            if (data) {
                const goalSetting = data.find(s => s.key === 'runner_goal');
                if (goalSetting) setRunnerGoal(goalSetting.value);

                const statusSetting = data.find(s => s.key === 'registration_status');
                if (statusSetting) setIsRegOpen(statusSetting.value === 'open');
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGoal = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({ key: 'runner_goal', value: runnerGoal });

            if (error) throw error;
            alert('Runner Goal Updated!');
        } catch (error) {
            console.error('Error saving goal:', error);
            alert('Failed to update goal');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleRegistration = async () => {
        const newState = !isRegOpen;
        setIsRegOpen(newState); // Optimistic update

        try {
            const { error } = await supabase
                .from('settings')
                .upsert({ key: 'registration_status', value: newState ? 'open' : 'closed' });

            if (error) {
                setIsRegOpen(!newState); // Revert on error
                throw error;
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update registration status');
        }
    };

    return (
        <AdminAuthGuard>
            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
                <AdminSidebar />

                <main className="flex-1 lg:ml-72 p-6 lg:p-10">
                    <div className="max-w-3xl mx-auto">

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Settings size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
                                <p className="text-slate-500 font-medium">Configure global application parameters</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin text-indigo-500" size={32} />
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {/* --- Registration Status Card --- */}
                                <div className="bg-white rounded-[1.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 p-32 opacity-5 rounded-full blur-3xl ${isRegOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${isRegOpen ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                <Power size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800">Registration Status</h3>
                                                <p className="text-slate-500 text-sm mt-1 max-w-sm">
                                                    Control whether new runners can access the registration form.
                                                    Currently <span className={`font-black ${isRegOpen ? 'text-emerald-600' : 'text-rose-600'}`}>{isRegOpen ? 'OPEN' : 'CLOSED'}</span>.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleToggleRegistration}
                                            className={`
                                                relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-100
                                                ${isRegOpen ? 'bg-emerald-500' : 'bg-slate-200'}
                                            `}
                                        >
                                            <span className="sr-only">Toggle Registration</span>
                                            <span
                                                className={`
                                                    inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out
                                                    ${isRegOpen ? 'translate-x-11' : 'translate-x-1'}
                                                `}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* --- Runner Goal Card --- */}
                                <div className="bg-white rounded-[1.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                                            <Target size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">Runner Goal Target</h3>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Set the target number of runners for the dashboard progress visualization.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                value={runnerGoal}
                                                onChange={(e) => setRunnerGoal(e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="e.g. 2000"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Runners</span>
                                        </div>
                                        <button
                                            onClick={handleSaveGoal}
                                            disabled={saving}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                            Update Goal
                                        </button>
                                    </div>
                                </div>

                                {/* --- Danger Zone (Future) --- */}
                                <div className="border border-red-100 bg-red-50/50 rounded-[1.5rem] p-8 opacity-60 pointer-events-none">
                                    <div className="flex items-center gap-3 mb-4 text-red-800">
                                        <AlertTriangle size={24} />
                                        <h3 className="text-lg font-bold">Danger Zone</h3>
                                    </div>
                                    <p className="text-red-600/70 text-sm mb-4">
                                        Reset system data or clear all registrations (Coming Soon).
                                    </p>
                                    <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-bold text-sm bg-white">
                                        Clear Database
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}