import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

async function checkAuth() {
  const session = (await cookies()).get('admin_session');
  return !!session;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('content')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data.content);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to read data from Supabase' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newData = await request.json();
    
    // Update meta lastUpdated
    newData.meta = {
      ...newData.meta,
      lastUpdated: new Date().toISOString().replace('T', ' ').split('.')[0]
    };

    const { error } = await supabase
      .from('resumes')
      .update({ content: newData })
      .eq('id', 1);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save data to Supabase' }, { status: 500 });
  }
}
