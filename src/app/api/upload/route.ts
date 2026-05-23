import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

    // Convert to ArrayBuffer → Uint8Array (works on Vercel serverless)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('resume-assets')
      .upload(fileName, uint8Array, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage error:', error.message);
      return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
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
