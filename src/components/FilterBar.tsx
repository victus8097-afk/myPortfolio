'use client';

// ============================================================
// FilterBar.tsx — شريط الفلترة الكرتوني
// Client Component: يحدث URL Query Params
// ============================================================

import { useRouter, useSearchParams } from 'next/navigation';
import type { ProjectType } from '@/types';

const filterOptions: { label: string; value: ProjectType | 'all'; emoji: string }[] = [
  { label: 'كل الأعمال', value: 'all', emoji: '🎯' },
  { label: 'تطبيقات جوال', value: 'mobile_app', emoji: '📱' },
  { label: 'مواقع ويب', value: 'web_app', emoji: '🌐' },
  { label: 'أعمال أخرى', value: 'other', emoji: '🎨' },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = (searchParams.get('type') as ProjectType | 'all') || 'all';

  const handleFilter = (type: ProjectType | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    const newUrl = params.toString() ? `/projects?${params.toString()}` : '/projects';
    router.push(newUrl);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilter(option.value)}
          className={`brutal-btn text-sm ${
            currentType === option.value
              ? 'brutal-btn-mint'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <span>{option.emoji}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
