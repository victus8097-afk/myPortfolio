// ============================================================
// ProjectCard.tsx — بطاقة العمل الهيكلية
// Server Component: صورة غلاف واحدة محسنة فقط
// ============================================================

import type { Project } from '@/types';
import { generateSlug } from '@/lib/slug';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const slug = generateSlug(project.title);
  const coverImage = getCoverImage(project);

  return (
    <Link href={`/projects/${slug}`} className="featured-project-card-link">
      <article className={`brutal-card brutal-card-hover featured-project-card ${coverImage ? '' : 'featured-project-card-no-image'} p-0 overflow-hidden group`}>
      {/* صورة الغلاف من project_media في قاعدة البيانات */}
      {coverImage && (
        <div className="featured-project-card-media bg-brutal-gray border-b-3 border-brutal-black flex items-center justify-center relative overflow-hidden">
          <img
            src={coverImage}
            alt={`صورة ${project.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* المعلومات الأساسية فقط */}
      <div className={`featured-project-card-content p-6 ${coverImage ? '' : 'featured-project-card-content-no-image'}`}>
        <h3 className="text-xl font-extrabold text-[#111111] mb-2 group-hover:text-mint-dark transition-colors">
          {project.title}
        </h3>

        {project.description && (
          <p className="featured-project-description text-[#111111]/50 text-sm mb-5 line-clamp-2 leading-relaxed">
            {getShortDescription(project.description)}
          </p>
        )}

        <span className="brutal-btn brutal-btn-warm w-full text-sm">
          عرض التفاصيل ←
        </span>
      </div>
    </article>
    </Link>
  );
}

function getCoverImage(project: Project): string | null {
  const cover = project.project_media
    ?.filter((media) => media.media_type === 'image' && media.media_url.trim().length > 0)
    .find((media) => media.sort_order === 0);

  return cover?.media_url || null;
}

function getShortDescription(description: string): string {
  const limit = 110;
  return description.length > limit ? `${description.substring(0, limit)}...` : description;
}
