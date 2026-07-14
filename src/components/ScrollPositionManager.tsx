'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_PREFIX = 'portfolio-scroll-position:';

export default function ScrollPositionManager() {
  const pathname = usePathname();

  useEffect(() => {
    const storageKey = `${STORAGE_PREFIX}${pathname}`;
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

    const savePosition = () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    window.addEventListener('scroll', savePosition, { passive: true });
    return () => {
      savePosition();
      window.removeEventListener('scroll', savePosition);
    };
  }, [pathname]);

  return null;
}
