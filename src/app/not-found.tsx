// ============================================================
// 404 Not Found Page — صفحة غير موجودة
// ============================================================

import BackToPrevious from '@/components/BackToPrevious';

export default function NotFound() {
  return (
    <main className="not-found-page min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 stripe-pattern pointer-events-none"></div>

      <div className="brutal-card not-found-card p-8 sm:p-12 text-center max-w-lg relative z-10">
        <div className="not-found-mascot mx-auto mb-8" aria-hidden="true">
          <span className="not-found-mascot-eye not-found-mascot-eye-left"></span>
          <span className="not-found-mascot-eye not-found-mascot-eye-right"></span>
          <span className="not-found-mascot-mouth"></span>
        </div>

        <p className="text-sm font-extrabold text-brutal-black/45 mb-2">خطأ 404</p>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111111] mb-4">
          الصفحة غير موجودة
        </h1>
        <p className="text-[#111111]/55 leading-relaxed mb-8">
          يبدو أن هذا الرابط غير متاح أو أن الصفحة انتقلت إلى مكان آخر.
        </p>

        <BackToPrevious />
      </div>
    </main>
  );
}
