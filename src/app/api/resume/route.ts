import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

async function checkAuth() {
  const session = (await cookies()).get('admin_session');
  return !!session;
}

export async function GET() {
  try {
    // Try Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('resumes')
        .select('content')
        .eq('id', 1)
        .single();

      // Only use Supabase data if content is non-empty
      if (!error && data && data.content && Object.keys(data.content).length > 0) {
        return NextResponse.json(data.content);
      }
      console.log('Supabase fetch failed or no data, falling back to local JSON');
    }

    // Fallback to local JSON for development
    const filePath = path.join(process.cwd(), 'src/data/resume-data.json');
    if (fs.existsSync(filePath)) {
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return NextResponse.json(jsonData);
    }

    throw new Error('No data source available');
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
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

    let supabaseError = null;

    // Try Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { error } = await supabase
        .from('resumes')
        .upsert({ id: 1, content: newData, updated_at: new Date().toISOString() });
      supabaseError = error;
    }

    // Try to save to local JSON (works in dev, may fail on Vercel - that's OK)
    try {
      const filePath = path.join(process.cwd(), 'src/data/resume-data.json');
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
    } catch (fsError) {
      console.log('Local JSON write skipped (read-only filesystem):', fsError);
    }

    if (supabaseError) {
      console.error('Supabase save error:', supabaseError);
      return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
