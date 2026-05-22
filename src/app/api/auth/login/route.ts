import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Password is set here as requested. In production, use process.env.ADMIN_PASSWORD
const ADMIN_PASSWORD = 'Meekaeo2023';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ ok: true });
      
      // Set a simple auth cookie
      (await cookies()).set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
