'use client';

// ============================================================
// صفحة تسجيل دخول الأدمن — Secure Authentication Gate
// Client Component: Zero-Trust Auth Policy
// المسار المموّه: /sys-gate-hq-99x
// ============================================================

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('بيانات الدخول غير صحيحة');
        return;
      }

      // إعادة التوجيه للوحة التحكم
      window.location.href = '/sys-gate-hq-99x/dashboard';
    } catch {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brutal-gray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* صندوق الدخول الكرتوني */}
        <div className="brutal-card p-8">
          {/* الرمز الكرتوني */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#111111] rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-[#111111] shadow-[4px_4px_0px_#111111]">
              <Lock size={32} className="text-white" />
            </div>
            <h1
              className="text-2xl font-black text-[#111111]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              🔐 بوابة الدخول الآمنة
            </h1>
          </div>

          {/* نموذج الدخول */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-brutal-red/10 border-2 border-brutal-red rounded-lg p-3 flex items-center gap-2 text-brutal-red">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="brutal-input"
                placeholder="admin@example.com"
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="brutal-input pl-12"
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/50 hover:text-[#111111]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="brutal-btn brutal-btn-mint w-full text-base py-3 disabled:opacity-50"
            >
              {isLoading ? '⏳ جاري التحقق...' : '🔓 تسجيل الدخول'}
            </button>
          </form>
        </div>

        {/* ملاحظة أمنية */}
        <p className="text-center text-xs text-[#111111]/40 mt-4">
          🔒 هذا النظام محمي بسياسة الصفر ثقة (Zero-Trust)
        </p>
      </div>
    </main>
  );
}
