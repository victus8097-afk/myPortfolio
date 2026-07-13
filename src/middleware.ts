// ============================================================
// Next.js Middleware — حماية مسارات لوحة التحكم
// سياسة الصفر ثقة: التحقق من الجلسة قبل السماح بالوصول
// Cookie Security: HttpOnly, Secure, SameSite=Strict
// ============================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            })
          );
        },
      },
    }
  );

  // التحقق من جلسة المستخدم
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // حماية مسار لوحة التحكم
  const isAdminPath = request.nextUrl.pathname.includes('sys-gate-hq-99x');
  const isLoginPage = request.nextUrl.pathname === '/sys-gate-hq-99x';
  const isDashboardPath = request.nextUrl.pathname.includes('/dashboard');

  if (isAdminPath && !isLoginPage && !user) {
    // إعادة توجيه لصفحة تسجيل الدخول إذا لم يكن مسجلاً
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/sys-gate-hq-99x';
    return NextResponse.redirect(redirectUrl);
  }

  // منع الدخول لصفحة تسجيل الدخول إذا كان مسجلاً بالفعل
  if (isLoginPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/sys-gate-hq-99x/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/sys-gate-hq-99x/:path*',
  ],
};
