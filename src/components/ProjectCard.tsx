// ============================================================
// ProjectCard.tsx — بطاقة المشروع الهيكلية
// Server Component: صورة غلاف واحدة محسنة فقط
// ============================================================

import type { Project } from '@/types';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

const typeConfig: Record<string, { color: string; label: string; cardClass: string; gradient: string }> = {
  mobile_app: {
    color: 'bg-warm',
    label: 'تطبيق جوال',
    cardClass: 'project-card-type-mobile',
    gradient: 'from-warm/35 to-coral/20',
  },
  web_app: {
    color: 'bg-sky',
    label: 'موقع ويب',
    cardClass: 'project-card-type-web',
    gradient: 'from-sky/35 to-purple/20',
  },
  other: {
    color: 'bg-purple',
    label: 'عمل آخر',
    cardClass: 'project-card-type-other',
    gradient: 'from-purple/35 to-mint/20',
  },
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const slug = project.title
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  const coverImage = getCoverImage(project);
  const config = typeConfig[project.project_type] || typeConfig.other;

  return (
    <article className={`brutal-card brutal-card-hover ${config.cardClass} ${coverImage ? '' : 'project-card-no-image'} p-0 overflow-hidden group`}>
      {/* صورة الغلاف من project_media في قاعدة البيانات */}
      {coverImage && (
        <div className={`project-card-cover bg-gradient-to-br ${config.gradient} border-b-3 border-[#111111] flex items-center justify-center relative overflow-hidden`}>
          <img
            src={coverImage}
            alt={`صورة العمل ${project.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className={`absolute bottom-3 left-3 brutal-tag ${config.color} text-brutal-black`}>
            {config.label}
          </span>
        </div>
      )}

      {/* محتوى الكرت */}
      <div className={`project-card-content p-6 ${coverImage ? '' : 'project-card-content-no-image'}`}>
        {!coverImage && (
          <span className={`project-type-label brutal-tag ${config.color} text-brutal-black mb-3 self-start`}>
            {config.label}
          </span>
        )}
        <h3 className="text-xl font-extrabold text-[#111111] mb-2 group-hover:text-mint-dark transition-colors">
          {project.title}
        </h3>

        {project.description && (
          <p className="project-card-description text-[#111111]/50 text-sm mb-5 line-clamp-2 leading-relaxed">
            {project.description.substring(0, 120)}...
          </p>
        )}

        {/* تقنيات المشروع كملصقات */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="brutal-tag bg-brutal-gray text-[#111111] text-xs">
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="brutal-tag bg-brutal-gray text-[#111111]/40 text-xs">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        )}

        <Link
          href={`/projects/${slug}`}
          className="brutal-btn brutal-btn-warm w-full text-sm"
        >
          عرض التفاصيل ←
        </Link>
      </div>
    </article>
  );
}

function getCoverImage(project: Project): string | null {
  return (
    project.project_media
      ?.filter((media) => media.media_type === 'image' && media.media_url.trim().length > 0)
      .sort((a, b) => a.sort_order - b.sort_order)[0]?.media_url || null
  );
}
