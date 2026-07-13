// ============================================================
// Footer.tsx — تذييل الصفحة
// ============================================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brutal-dark text-white border-t-3 border-brutal-black relative overflow-hidden">
      <div className="absolute inset-0 stripe-pattern pointer-events-none" style={{ opacity: 0.06 }}></div>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="bg-mint px-2 py-1 border-2 border-white/20 rounded-lg text-sm font-extrabold text-brutal-black">
              &lt;/&gt;
            </span>
            <span className="text-lg font-extrabold tracking-tight">Portfolio</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#hero" className="text-sm text-white/40 hover:text-mint transition-colors font-medium">الرئيسية</a>
            <a href="#skills" className="text-sm text-white/40 hover:text-mint transition-colors font-medium">المهارات</a>
            <a href="#projects" className="text-sm text-white/40 hover:text-mint transition-colors font-medium">المشاريع</a>
          </div>

          <p className="text-sm text-white/25 font-medium">© {currentYear} — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
