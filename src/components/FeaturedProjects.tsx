// ============================================================
// FeaturedProjects.tsx — قسم الأعمال البارزة
// ============================================================

import type { Project } from '@/types';
import Link from 'next/link';

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.is_featured).slice(0, 3);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* خلفية — أبيض مع شرائط مائلة */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      <div className="absolute inset-0 stripe-pattern pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* العنوان */}
        <div className="text-center mb-12">
          <div className="featured-heading-mark mb-5" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brutal-black mb-4">
            أعمال بارزة
          </h2>
          <p className="text-brutal-black/45 text-lg max-w-xl mx-auto">نماذج من أفضل الأعمال التي أنجزتها</p>
        </div>

        {/* البطاقات — معلومات أساسية فقط */}
        <div className="featured-projects-grid">
          {featured.map((project, idx) => {
            const coverImage = getCoverImage(project);
            const slug = generateSlug(project.title);
            const placement =
              idx === 0
                ? 'featured-project-card-primary'
                : idx === 1
                  ? 'featured-project-card-secondary'
                  : 'featured-project-card-tertiary';

            return (
              <article
                key={project.id}
                className={`brutal-card brutal-card-hover featured-project-card ${placement} ${coverImage ? '' : 'featured-project-card-no-image'} p-0 overflow-hidden group`}
              >
                {coverImage && (
                  <div className="featured-project-card-media bg-brutal-gray border-b-3 border-brutal-black flex items-center justify-center relative overflow-hidden">
                    <img
                      src={coverImage}
                      alt={`صورة ${project.title}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className={`featured-project-card-content p-6 ${coverImage ? '' : 'featured-project-card-content-no-image'}`}>
                  <h3 className="text-xl font-extrabold text-brutal-black mb-2 group-hover:text-mint-dark transition-colors">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="featured-project-description text-brutal-black/50 text-sm mb-5 line-clamp-2 leading-relaxed">
                      {getShortDescription(project.description)}
                    </p>
                  )}

                  <Link href={`/projects/${slug}`} className="brutal-btn brutal-btn-warm w-full text-sm">
                    عرض التفاصيل ←
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {featured.length === 0 && (
          <div className="text-center py-16">
            <div className="brutal-card p-12 max-w-sm mx-auto">
              <div className="featured-empty-mark mx-auto mb-5" aria-hidden="true"></div>
              <p className="text-lg font-bold text-brutal-black">لا توجد أعمال بارزة بعد</p>
            </div>
          </div>
        )}

        {featured.length > 0 && (
          <div className="featured-projects-cta-wrap text-center mt-12">
            <p className="featured-projects-cta-label">اكتشف جميع الأعمال والتفاصيل</p>
            <Link href="/projects" className="brutal-btn brutal-btn-coral featured-projects-cta text-base px-10 py-3.5">
              عرض جميع الأعمال <span aria-hidden="true">←</span>
            </Link>
          </div>
        )}
      </div>
    </section>
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

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^\w\s\u0600-\u06FF-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}
