import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const session = (await cookies()).get('admin_session');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return NextResponse.json({
    SUPABASE_URL_set: !!url,
    SUPABASE_URL_length: url.length,
    ANON_KEY_set: !!anon,
    ANON_KEY_length: anon.length,
    SERVICE_ROLE_KEY_set: !!svc,
    SERVICE_ROLE_KEY_length: svc.length,
    SERVICE_ROLE_KEY_prefix: svc.substring(0, 20) + '...',
  });
}
