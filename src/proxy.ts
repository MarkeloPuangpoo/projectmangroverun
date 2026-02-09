import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function proxy(request: NextRequest) {
    try {
        // Query the 'registration_status' from the 'settings' table
        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'registration_status')
            .single();

        if (error) {
            console.error('Proxy: Error fetching registration status:', error);
            // In case of error, decided to err on side of caution or open? 
            // Let's assume open if DB fails to avoid blocking users unnecessarily, 
            // OR closed if we want strict security. 
            // For now, let's proceed (allow access) and let client handle critical failures, 
            // or we could return error.
            return NextResponse.next();
        }

        // If status is 'closed', redirect to the closed page
        if (data && data.value === 'closed') {
            const url = request.nextUrl.clone();
            url.pathname = '/registration-closed';
            return NextResponse.redirect(url);
        }

        // If status is 'open', allow request
        return NextResponse.next();

    } catch (err) {
        console.error('Proxy: Unexpected error:', err);
        return NextResponse.next();
    }
}

export const config = {
    matcher: '/register',
}
