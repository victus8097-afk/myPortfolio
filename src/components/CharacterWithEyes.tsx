'use client';

// ============================================================
// CharacterWithEyes.tsx — شخصية كرتونية مع نقاط تتبع الماوس
// عدّل القيم أدناه للتحكم بالموقع والحجم
// ============================================================

import { useEffect, useRef, useState } from 'react';

// ──── اعدادات العيون — عدّل من هنا ────
const EYE_CONFIG = {
  // حجم النقطة بالبكسل
  size: 7,

  // موقع العين اليمنى (نسبة مئوية)
  rightEye: { top: 25, left: 56 },

  // موقع العين اليسرى (نسبة مئوية)
  leftEye: { top: 25, left: 61 },

  // أقصى حركة للنقطة مع الماوس
  maxMove: 1.5,
};
// ──── نهاية الإعدادات ────

export default function CharacterWithEyes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.32;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const max = EYE_CONFIG.maxMove;

      const ratio = Math.min(distance / 200, 1);
      const x = (dx / (distance || 1)) * max * ratio;
      const y = (dy / (distance || 1)) * max * ratio;

      setPupilOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* الشخصية — معكوسة لتنظر لليمين */}
      <img
        src="/character.png"
        alt="الشخصية"
        className="w-full select-none pointer-events-none"
        draggable={false}
      />

      {/* النقاط — معكوسة مع الصورة */}
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {/* النقطة اليمنى */}
        <div
          className="absolute bg-brutal-black rounded-full transition-transform duration-100 ease-out"
          style={{
            width: EYE_CONFIG.size,
            height: EYE_CONFIG.size,
            top: `${EYE_CONFIG.rightEye.top}%`,
            left: `${EYE_CONFIG.rightEye.left}%`,
            transform: `translate(-50%, -50%) translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
          }}
        />

        {/* النقطة اليسرى */}
        <div
          className="absolute bg-brutal-black rounded-full transition-transform duration-100 ease-out"
          style={{
            width: EYE_CONFIG.size,
            height: EYE_CONFIG.size,
            top: `${EYE_CONFIG.leftEye.top}%`,
            left: `${EYE_CONFIG.leftEye.left}%`,
            transform: `translate(-50%, -50%) translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
          }}
        />
      </div>
    </div>
  );
}
