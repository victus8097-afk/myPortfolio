'use client';

// ============================================================
// ErrorFallback.tsx — واجهة معالجة الأخطاء الذكية
// Client Component: Crash Isolation
// ============================================================

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title = 'حدث خطأ ما',
}: ErrorFallbackProps) {
  return (
    <div className="brutal-card p-8 text-center max-w-lg mx-auto my-8">
      <div className="text-6xl mb-4">⚠️</div>
      <h3
        className="text-xl font-black text-[#111111] mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h3>
      <p className="text-[#111111]/60 mb-6">
        عذراً، حدث خطأ أثناء تحميل هذا القسم. يرجى المحاولة مرة أخرى.
      </p>
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="brutal-btn brutal-btn-mint"
        >
          🔄 إعادة محاولة الاتصال بالشبكة
        </button>
      )}
    </div>
  );
}
