import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('API GET /api/users hit');
  try {
    // 1. Try to fetch from profiles table first (if created via SQL script)
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*');
    
    if (!error && profiles.length > 0) {
      return NextResponse.json({ users: profiles });
    }

    // 2. Fallback: Fetch from auth.users (requires admin privilege)
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) throw authError;

    // Map auth users to a consistent structure
    const mappedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      role: u.user_metadata?.role || 'admin',
      created_at: u.created_at
    }));

    return NextResponse.json({ users: mappedUsers });
  } catch (err) {
    console.error('List Users Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'staff' }
    });

    if (error) throw error;

    await supabaseAdmin.from('profiles').insert([{
      id: data.user.id,
      email: data.user.email,
      role: 'staff'
    }]);

    return NextResponse.json({ user: data.user });
  } catch (err) {
    console.error('Create User Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) throw error;

    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete User Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
