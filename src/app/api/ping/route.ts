import { NextResponse } from 'next/server';

// ============================================================
// Keep-Alive Ping — prevents Supabase from pausing the project
// Called by Vercel Cron every 2 days
// ============================================================

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { status: 'error', message: 'Supabase env vars not set' },
      { status: 500 }
    );
  }

  try {
    // Simple health check — hit the Supabase REST API
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    // Any response (even 404/406) means the project is awake
    if (res.ok || res.status === 404 || res.status === 406) {
      return NextResponse.json({
        status: 'success',
        message: 'Supabase project is awake ✅',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { status: 'warning', message: `Supabase returned ${res.status}` },
      { status: 502 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to reach Supabase', error: String(error) },
      { status: 502 }
    );
  }
}
