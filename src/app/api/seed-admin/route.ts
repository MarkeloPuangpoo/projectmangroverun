import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error: 'Missing Environment Variables',
        details: 'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file.'
      },
      { status: 500 }
    );
  }

  // Create a Supabase client with the Service Role Key
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const email = 'mangeoverunadmin@gmail.com';
  const password = 'mangrovebbv2026';

  try {
    // Attempt to create the user
    // createUser with admin rights can set email_confirm to true
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (error) {
      // Handle case where user already exists
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { message: 'User already exists', email },
          { status: 200 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
