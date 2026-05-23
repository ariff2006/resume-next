import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // Check Auth
  const session = (await cookies()).get('admin_session');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'photos';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${type}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

    // Convert to Buffer for better compatibility with Supabase in Node.js/Vercel
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`Uploading file: ${fileName}, size: ${buffer.length} bytes`);

    if (!supabaseAdmin) {
      console.error('Supabase client failed to initialize. Check environment variables.');
      return NextResponse.json({ error: 'Database connection failed (Supabase client is null)' }, { status: 500 });
    }

    // Upload to Supabase Storage using Admin client to bypass RLS
    const { data, error } = await supabaseAdmin.storage
      .from('resume-assets')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage error details:', error);
      return NextResponse.json({ 
        error: 'Upload failed: ' + error.message,
        details: error
      }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('resume-assets')
      .getPublicUrl(data.path);

    return NextResponse.json({
      ok: true,
      path: urlData.publicUrl,
    });
  } catch (err: any) {
    console.error('Upload error:', err?.message || String(err));
    return NextResponse.json({ error: 'Upload failed: ' + (err?.message || 'Unknown error') }, { status: 500 });
  }
}
