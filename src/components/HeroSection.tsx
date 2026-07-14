'use client';

// ============================================================
// HeroSection.tsx — القسم الترحيبي
// ============================================================

import type { ProfileSettings } from '@/types';
import CharacterWithEyes from '@/components/CharacterWithEyes';

interface HeroSectionProps {
  profile: ProfileSettings;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section id="hero" className="min-h-screen relative overflow-hidden">
      {/* خلفية — أبيض مع شرائط مائلة */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      <div className="absolute inset-0 stripe-pattern pointer-events-none"></div>

      {/* المستطيل الأخضر الجريء */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="hero-highlight absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[360px] bg-mint/15 rotate-3 border-y-3 border-brutal-black/8"></div>
      </div>

      {/* المحتوى */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 relative z-10 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full py-20 lg:py-0">
          {/* الشخصية — تظهر على الشاشات الكبيرة فقط */}
          <div className="hidden lg:flex order-1 justify-center pt-8">
            <CharacterWithEyes />
          </div>

          {/* الكلام */}
          <div className="hero-copy order-2 text-center">
            <h1 className="text-4xl sm:text-4xl lg:text-5xl font-extrabold text-brutal-black leading-[1.1] mb-10">
              أنا{' '}
              <span className="relative inline-block">
                {profile.full_name}
                <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 8 Q25 2 50 8 Q75 14 100 8 Q125 2 150 8 Q175 14 200 8" stroke="#34D399" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>

            <h2 className="text-base sm:text-lg lg:text-xl font-extrabold text-brutal-black/80 mb-4">
              {profile.job_title}
            </h2>

            <p className="text-xs sm:text-sm text-brutal-black/70 leading-relaxed mb-8 max-w-lg mx-auto">
              {profile.bio_summary}
            </p>

            {profile.cv_url && (
              <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="brutal-btn brutal-btn-mint text-base">
                تحميل السيرة الذاتية
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
