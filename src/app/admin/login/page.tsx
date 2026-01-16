'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Leaf, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/admin/dashboard');
    } catch (error: any) {
      setError(error.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 w-full max-w-md relative z-10 border border-slate-100">

        {/* Logo Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 transform rotate-3 hover:rotate-6 transition-transform">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Mangrove BPK RUN 2026</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-300"
                placeholder="admin@mangroverun.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                Sign In <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Authorized personnel only. <br />
            Contact IT support if you have trouble logging in.
          </p>
        </div>
      </div>
    </div>
  );
}