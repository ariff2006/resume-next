import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // Check Auth
  const session = (await cookies()).get('admin_session');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'photos' or 'certs'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = path.extname(file.name);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    const relativePath = `${type}/${fileName}`;
    const uploadPath = path.join(process.cwd(), 'public', relativePath);

    // Ensure directory exists
    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(uploadPath, buffer);

    return NextResponse.json({ 
      ok: true, 
      path: relativePath 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
