// ============================================================
// Footer.tsx — تذييل الصفحة
// ============================================================

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer bg-brutal-dark text-white border-t-3 border-brutal-black relative overflow-hidden">
      <div className="absolute inset-0 stripe-pattern pointer-events-none" style={{ opacity: 0.06 }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-1 bg-gradient-to-r from-coral via-warm to-mint"></div>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-14 relative z-10">
        <div className="flex flex-col items-center text-center">
          <Link href="/#hero" className="inline-flex items-center gap-3 group">
            <img
              src="/icon.png"
              alt="بورتفوليو خالد"
              className="w-11 h-11 rounded-xl object-contain border-2 border-mint/70 bg-white transition-transform duration-200 group-hover:-translate-y-1"
            />
            <span className="text-xl font-black tracking-tight text-white">خالد</span>
          </Link>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/50">
            مطور ويب وتطبيقات، أبني تجارب رقمية واضحة وعملية تجمع بين الفكرة والتصميم.
          </p>
        </div>

        <div className="mt-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-white/35">
          <p>© {currentYear} خالد — جميع الحقوق محفوظة</p>
          <p className="whitespace-nowrap">أعمال وخبرات خالد</p>
        </div>
      </div>
    </footer>
  );
}
