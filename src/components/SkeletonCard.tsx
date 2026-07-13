// ============================================================
// SkeletonCard.tsx — مكون المحاكاة الهيكلية (Shimmer)
// Server Component: يحل مشكلة CLS
// ============================================================

interface SkeletonCardProps {
  type?: 'project' | 'skill' | 'hero';
  count?: number;
}

export default function SkeletonCard({ type = 'project', count = 1 }: SkeletonCardProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === 'hero') {
    return (
      <div className="section-padding min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-4">
              <div className="skeleton-shimmer h-8 w-32"></div>
              <div className="skeleton-shimmer h-16 w-3/4"></div>
              <div className="skeleton-shimmer h-8 w-1/2"></div>
              <div className="skeleton-shimmer h-24 w-full"></div>
              <div className="flex gap-4">
                <div className="skeleton-shimmer h-12 w-48"></div>
                <div className="skeleton-shimmer h-12 w-36"></div>
              </div>
            </div>
            <div className="skeleton-shimmer h-80 w-full max-w-md mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'skill') {
    return (
      <div className="flex flex-wrap gap-3">
        {skeletons.map((i) => (
          <div key={i} className="skeleton-shimmer h-14 w-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((i) => (
        <div key={i} className="brutal-card overflow-hidden">
          <div className="skeleton-shimmer h-48 w-full"></div>
          <div className="p-5 space-y-3">
            <div className="skeleton-shimmer h-6 w-3/4"></div>
            <div className="skeleton-shimmer h-4 w-full"></div>
            <div className="flex gap-2">
              <div className="skeleton-shimmer h-6 w-16"></div>
              <div className="skeleton-shimmer h-6 w-16"></div>
            </div>
            <div className="skeleton-shimmer h-10 w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
