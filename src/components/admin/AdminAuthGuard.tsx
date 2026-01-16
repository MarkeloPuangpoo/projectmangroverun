'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/admin/login');
        } else {
          setAuthorized(true);
        }
      } catch (error) {
        console.error('Auth check failed', error);
        router.replace('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setAuthorized(false);
        router.replace('/admin/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-deep-blue" />
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
