// ============================================================
// ProjectCard.tsx — بطاقة المشروع الهيكلية
// Server Component: صورة غلاف واحدة محسنة فقط
// ============================================================

import type { Project } from '@/types';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const slug = project.title
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const typeEmoji: Record<string, string> = {
    mobile_app: '📱',
    web_app: '🌐',
    other: '🎨',
  };

  const typeLabel: Record<string, string> = {
    mobile_app: 'تطبيق جوال',
    web_app: 'موقع ويب',
    other: 'عمل آخر',
  };

  return (
    <div className="brutal-card p-0 overflow-hidden">
      {/* صورة الغلاف */}
      <div className="h-48 bg-gradient-to-br from-sky/20 to-mint/20 border-b-3 border-[#111111] flex items-center justify-center relative">
        <span className="text-7xl">{typeEmoji[project.project_type] || '💻'}</span>
        {project.is_featured && (
          <span className="absolute top-3 right-3 brutal-tag bg-warm text-[#111111] rotate-3">
            ⭐ مميز
          </span>
        )}
      </div>

      {/* محتوى الكرت */}
      <div className="p-5">
        <h3
          className="text-lg font-black text-[#111111] mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {project.title}
        </h3>

        <p className="text-xs text-[#111111]/50 mb-2 font-medium">
          {typeLabel[project.project_type] || project.project_type}
        </p>

        {project.description && (
          <p className="text-[#111111]/60 text-sm mb-4 line-clamp-2">
            {project.description.substring(0, 100)}...
          </p>
        )}

        {/* تقنيات المشروع كملصقات */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="brutal-tag bg-sky/30 text-[#111111]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* زر التفاصيل */}
        <Link
          href={`/projects/${slug}`}
          className="brutal-btn brutal-btn-mint w-full text-sm"
        >
          عرض التفاصيل ←
        </Link>
      </div>
    </div>
  );
}
