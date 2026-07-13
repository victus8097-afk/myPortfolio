// ============================================================
// 404 Not Found Page — صفحة غير موجودة
// ============================================================

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brutal-gray flex items-center justify-center px-4">
      <div className="brutal-card p-12 text-center max-w-lg">
        <div className="text-8xl mb-6">🤷</div>
        <h1
          className="text-4xl font-black text-[#111111] mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          404
        </h1>
        <p className="text-xl font-bold text-[#111111]/70 mb-2">الصفحة غير موجودة</p>
        <p className="text-[#111111]/50 mb-8">
          يبدو أنك ضللت الطريق! الصفحة التي تبحث عنها غير متاحة.
        </p>
        <Link href="/" className="brutal-btn brutal-btn-mint text-base">
          🏠 العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
