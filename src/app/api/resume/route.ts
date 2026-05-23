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

      if (!error && data) {
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
        .update({ content: newData })
        .eq('id', 1);
      supabaseError = error;
    }

    // Always save to local JSON for development/backup
    const filePath = path.join(process.cwd(), 'src/data/resume-data.json');
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');

    if (supabaseError) {
      console.error('Supabase save error (but local saved):', supabaseError);
      // We return OK because local save was successful, making it usable in dev
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
