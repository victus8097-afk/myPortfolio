// ============================================================
// ProjectCard.tsx — بطاقة المشروع الهيكلية
// Server Component: صورة غلاف واحدة محسنة فقط
// ============================================================

import type { Project } from '@/types';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

const typeLabel: Record<string, string> = {
  mobile_app: 'تطبيق جوال',
  web_app: 'موقع ويب',
  other: 'عمل آخر',
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const slug = project.title
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  const coverImage = getCoverImage(project);
  const typeCardClass =
    project.project_type === 'mobile_app'
      ? 'project-card-type-mobile'
      : project.project_type === 'web_app'
        ? 'project-card-type-web'
        : 'project-card-type-other';

  return (
    <div className={`brutal-card brutal-card-hover ${typeCardClass} p-0 overflow-hidden group`}>
      {/* صورة الغلاف من project_media في قاعدة البيانات */}
      <div className="project-card-cover h-48 bg-gradient-to-br from-sky/20 to-mint/20 border-b-3 border-[#111111] flex items-center justify-center relative overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={`صورة مشروع ${project.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-sm font-bold text-[#111111]/45">لا توجد صورة مضافة</span>
        )}
        {project.is_featured && (
          <span className="absolute top-3 right-3 brutal-tag bg-warm text-[#111111] rotate-3">
            مميز
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

function getCoverImage(project: Project): string | null {
  return (
    project.project_media
      ?.filter((media) => media.media_type === 'image' && media.media_url.trim().length > 0)
      .sort((a, b) => a.sort_order - b.sort_order)[0]?.media_url || null
  );
}
