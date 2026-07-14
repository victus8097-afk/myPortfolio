'use client';

// ============================================================
// Navbar.tsx — شريط تنقل كرتوني عائم (sticky)
// ============================================================

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'الأدوات والتقنيات', href: '#skills' },
  { label: 'الأعمال', href: '#projects' },
];

const allSections = [...navLinks.map((l) => l.href), '#contact'];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(pathname === '/' ? '#hero' : '');
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const onScroll = () => {
      let current = '#hero';
      for (const id of allSections) {
        const el = document.querySelector(id);
        if (el && el.getBoundingClientRect().top <= 160) {
          current = id;
        }
      }
      setActiveSection(current === '#contact' ? '' : current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomePage]);

  const getHref = (href: string) => {
    if (isHomePage) return href;
    if (href === '#projects') return '/projects';
    return `/${href}`;
  };

  const goToSection = (href: string) => {
    setMobileOpen(false);
    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHomePage) {
      event.preventDefault();
      goToSection(href);
    } else {
      setMobileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div
          className="bg-white border-3 border-brutal-black rounded-2xl px-4 sm:px-5 py-2.5 flex items-center gap-2 shadow-[4px_4px_0_#0F0F0F]"
        >
          {/* اليمين: الشعار */}
          <a
            href={isHomePage ? '#hero' : '/'}
            onClick={(event) => handleNavigation(event, '#hero')}
            className="flex items-center gap-2 shrink-0"
          >
            <img
              src="/icon.png"
              alt="بورتفوليو"
              className="w-9 h-9 rounded-lg object-contain"
            />
            <div className="hidden sm:flex flex-col leading-none mr-1">
              <span className="text-sm font-extrabold text-brutal-black">خالد</span>
              <span className="h-[1.5px] bg-gradient-to-l from-brutal-black/50 to-transparent rounded-full mt-1.5"></span>
              <span className="text-[10px] font-bold text-brutal-black/50 mt-1.5">مطور ويب وتطبيقات</span>
            </div>
          </a>

          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = isHomePage && activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={getHref(link.href)}
                    onClick={(event) => handleNavigation(event, link.href)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'text-brutal-black bg-white shadow-[2px_3px_0_#0F0F0F]'
                        : 'text-brutal-black/45 hover:text-brutal-black'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* اليسار: زر التواصل */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={isHomePage ? '#contact' : '/#contact'}
              onClick={(event) => handleNavigation(event, '#contact')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-mint border-3 border-brutal-black shadow-[3px_3px_0_#0F0F0F] hover:shadow-[5px_5px_0_#0F0F0F] hover:-translate-y-0.5 active:shadow-[1px_1px_0_#0F0F0F] active:translate-y-0.5 rounded-xl text-sm font-bold py-2 px-5 text-brutal-black transition-all duration-150"
            >
              لنتحدث
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-xl border-3 border-brutal-black shadow-[2px_2px_0_#0F0F0F] flex items-center justify-center text-brutal-black hover:bg-brutal-black/[0.03] active:shadow-[1px_1px_0_#0F0F0F] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              aria-label="القائمة"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* قائمة الموبايل */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-80 opacity-100 mt-2' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-3 border-brutal-black rounded-2xl shadow-[4px_4px_0_#0F0F0F] p-3 space-y-1.5">
            {navLinks.map((link) => {
              const isActive = isHomePage && activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={getHref(link.href)}
                  onClick={(event) => handleNavigation(event, link.href)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'text-brutal-black bg-white shadow-[2px_3px_0_#0F0F0F]'
                      : 'text-brutal-black/45 hover:text-brutal-black'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href={isHomePage ? '#contact' : '/#contact'}
              onClick={(event) => handleNavigation(event, '#contact')}
              className="block bg-mint border-3 border-brutal-black shadow-[3px_3px_0_#0F0F0F] rounded-xl text-sm font-bold py-2.5 text-center text-brutal-black"
            >
              لنتحدث
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
