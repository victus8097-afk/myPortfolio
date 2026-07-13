// ============================================================
// Footer.tsx — تذييل الصفحة
// ============================================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer bg-brutal-dark text-white border-t-3 border-brutal-black relative overflow-hidden">
      <div className="absolute inset-0 stripe-pattern pointer-events-none" style={{ opacity: 0.06 }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-1 bg-gradient-to-r from-coral via-warm to-mint"></div>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_auto] gap-10 md:gap-14 items-start">
          {/* الهوية */}
          <div className="text-center md:text-right">
            <a href="#hero" className="inline-flex items-center gap-3 group">
              <img
                src="/icon.png"
                alt="بورتفوليو خالد"
                className="w-11 h-11 rounded-xl object-contain border-2 border-mint/70 bg-white transition-transform duration-200 group-hover:-translate-y-1"
              />
              <span className="text-xl font-black tracking-tight text-white">خالد</span>
            </a>
            <p className="mt-4 max-w-sm mx-auto md:mx-0 text-sm leading-7 text-white/50">
              مطور ويب وتطبيقات، أبني تجارب رقمية واضحة وعملية تجمع بين الفكرة والتصميم.
            </p>
          </div>

          {/* روابط الصفحة */}
          <nav aria-label="روابط الفوتر" className="text-center md:text-right">
            <p className="text-xs font-bold tracking-wide text-white/35 mb-4">روابط سريعة</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-3">
              <a href="#hero" className="text-sm font-bold text-white/65 hover:text-mint transition-colors">الرئيسية</a>
              <a href="#skills" className="text-sm font-bold text-white/65 hover:text-mint transition-colors">المهارات</a>
              <a href="#projects" className="text-sm font-bold text-white/65 hover:text-mint transition-colors">المشاريع</a>
            </div>
          </nav>

          {/* دعوة للتواصل */}
          <div className="flex justify-center md:justify-end">
            <a href="#contact" className="brutal-btn brutal-btn-coral text-sm px-6 py-3">
              لنتحدث
            </a>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-white/35">
          <p>© {currentYear} خالد — جميع الحقوق محفوظة</p>
          <p>موقع شخصي لعرض الأعمال والخبرات</p>
        </div>
      </div>
    </footer>
  );
}
