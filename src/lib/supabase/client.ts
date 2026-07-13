'use client';

// ============================================================
// Supabase Client Context — Browser/Client-side connection
// Uses ANON_KEY only — protected by RLS policies
// ============================================================

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
