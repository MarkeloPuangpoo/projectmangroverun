'use client';

import {
    LogOut,
    LayoutDashboard,
    Users,
    CheckCircle2,
    Shirt,
    Settings,
    Leaf,
    LifeBuoy
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminSidebar({ pendingCount = 0 }: { pendingCount?: number }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 fixed inset-y-0 z-30 shadow-xl shadow-slate-200/50">
            {/* Logo Section */}
            <div className="p-8 pb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 transform hover:rotate-12 transition-transform duration-300">
                    <Leaf className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-black text-slate-800 text-lg leading-none tracking-tight">Mangrove</h1>
                    <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-1">Admin Portal</p>
                </div>
            </div>

            <div className="px-6 mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-3 mb-2">Main Menu</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <NavItem
                    href="/admin/dashboard"
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    active={isActive('/admin/dashboard')}
                />
                <NavItem
                    href="/admin/runners"
                    icon={<Users size={20} />}
                    label="Runner List"
                    active={isActive('/admin/runners')}
                />
                <NavItem
                    href="/admin/payment"
                    icon={<CheckCircle2 size={20} />}
                    label="Payment Audit"
                    active={isActive('/admin/payment')}
                    badge={pendingCount}
                />
                <NavItem
                    href="/admin/checkin"
                    icon={<CheckCircle2 size={20} />}
                    label="Check-in"
                    active={isActive('/admin/checkin')}
                />

                <div className="pt-6 pb-2 px-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-3 mb-2">Management</p>
                </div>

                <NavItem
                    href="/admin/stock"
                    icon={<Shirt size={20} />}
                    label="Shirt Stock"
                    active={isActive('/admin/stock')}
                />
                <NavItem
                    href="/admin/settings"
                    icon={<Settings size={20} />}
                    label="System Settings"
                    active={isActive('/admin/settings')}
                />
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 m-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4 p-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                        AD
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-700 truncate">Super Admin</p>
                        <p className="text-xs text-slate-400 truncate">admin@mangrove.run</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all px-4 py-2.5 text-sm font-bold w-full rounded-xl"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, active, badge }: any) {
    return (
        <Link
            href={href}
            className={`
                group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 relative overflow-hidden
                ${active
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }
            `}
        >
            {/* Active Indicator Strip */}
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full"></div>
            )}

            <div className="flex items-center gap-3 relative z-10">
                <span className={`transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {icon}
                </span>
                <span className="text-sm">{label}</span>
            </div>

            {badge > 0 && (
                <span className={`
                    text-xs font-bold px-2 py-0.5 rounded-md shadow-sm relative z-10
                    ${active ? 'bg-indigo-200 text-indigo-800' : 'bg-orange-100 text-orange-600'}
                `}>
                    {badge}
                </span>
            )}
        </Link>
    );
}