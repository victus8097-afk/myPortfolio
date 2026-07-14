'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_PREFIX = 'portfolio-scroll-position:';

export default function ScrollPositionManager() {
  const pathname = usePathname();

  useEffect(() => {
    const storageKey = `${STORAGE_PREFIX}${pathname}`;
    const savePosition = () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        if (hash === '#hero') {
          window.scrollTo(0, 0);
        } else {
          document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'auto' });
        }
      });
    } else {
      const savedPosition = sessionStorage.getItem(storageKey);
      if (savedPosition) {
        const position = Number(savedPosition);
        if (Number.isFinite(position)) {
          requestAnimationFrame(() => window.scrollTo(0, position));
        }
      }
    }

    // حفظ الموضع لحظة ضغط رابط داخلي، قبل أن ينتقل Next.js إلى الصفحة الجديدة.
    const saveBeforeNavigation = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a');
      if (!link || link.origin !== window.location.origin) return;
      if (link.pathname !== window.location.pathname) savePosition();
    };

    window.addEventListener('scroll', savePosition, { passive: true });
    document.addEventListener('click', saveBeforeNavigation, true);

    return () => {
      savePosition();
      window.removeEventListener('scroll', savePosition);
      document.removeEventListener('click', saveBeforeNavigation, true);
    };
  }, [pathname]);

  return null;
}
