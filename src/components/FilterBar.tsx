'use client';

// ============================================================
// FilterBar.tsx — شريط الفلترة الكرتوني
// Client Component: يحدث URL Query Params
// ============================================================

import { useRouter, useSearchParams } from 'next/navigation';
import type { ProjectType } from '@/types';

const filterOptions: {
  label: string;
  value: ProjectType | 'all';
  activeClass: string;
  idleClass: string;
}[] = [
  {
    label: 'كل الأعمال',
    value: 'all',
    activeClass: 'bg-mint',
    idleClass: 'bg-white hover:bg-mint/20',
  },
  {
    label: 'تطبيقات جوال',
    value: 'mobile_app',
    activeClass: 'bg-warm',
    idleClass: 'bg-warm/15 hover:bg-warm/40',
  },
  {
    label: 'مواقع ويب',
    value: 'web_app',
    activeClass: 'bg-sky',
    idleClass: 'bg-sky/15 hover:bg-sky/40',
  },
  {
    label: 'أعمال أخرى',
    value: 'other',
    activeClass: 'bg-purple',
    idleClass: 'bg-purple/15 hover:bg-purple/40',
  },
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
    <div className="projects-filter-bar flex flex-wrap justify-center gap-3 mb-10">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilter(option.value)}
          className={`brutal-btn text-sm ${
            currentType === option.value ? option.activeClass : option.idleClass
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
