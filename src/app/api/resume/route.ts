import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const DATA_PATH = path.join(process.cwd(), 'src/data/resume-data.json');

async function checkAuth() {
  const session = (await cookies()).get('admin_session');
  return !!session;
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
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

    fs.writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2), 'utf8');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
