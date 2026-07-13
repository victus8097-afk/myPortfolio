'use client';

// ============================================================
// MediaSliderWrapper.tsx — غلاف عميل لتحميل MediaSlider بشكل ديناميكي
// Client Component: Lazy Loading للسلايدر فقط عند الحاجة
// ============================================================

import dynamic from 'next/dynamic';
import SkeletonCard from '@/components/SkeletonCard';
import type { ProjectMedia } from '@/types';

const MediaSlider = dynamic(() => import('@/components/MediaSlider'), {
  loading: () => <SkeletonCard type="project" count={1} />,
  ssr: false,
});

interface MediaSliderWrapperProps {
  media: ProjectMedia[];
}

export default function MediaSliderWrapper({ media }: MediaSliderWrapperProps) {
  return <MediaSlider media={media} />;
}
