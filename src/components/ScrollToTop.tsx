'use client';

// ============================================================
// ScrollToTop.tsx — زر الصعود العائم
// Client Component: يظهر عند اختفاء الـ Navbar
// ============================================================

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="scroll-top-btn"
      aria-label="العودة للأعلى"
    >
      <ArrowUp size={20} className="text-[#111111]" />
    </button>
  );
}
