// ============================================================
// FeaturedProjects.tsx — قسم المشاريع البارزة
// ============================================================

import type { Project } from '@/types';
import Link from 'next/link';

interface FeaturedProjectsProps {
  projects: Project[];
}

const typeConfig: Record<string, { color: string; label: string; cardClass: string; gradient: string }> = {
  mobile_app: {
    color: 'bg-warm',
    label: 'تطبيق جوال',
    cardClass: 'featured-project-card-mobile',
    gradient: 'from-warm/35 to-coral/20',
  },
  web_app: {
    color: 'bg-sky',
    label: 'موقع ويب',
    cardClass: 'featured-project-card-web',
    gradient: 'from-sky/35 to-purple/20',
  },
  other: {
    color: 'bg-purple',
    label: 'عمل آخر',
    cardClass: 'featured-project-card-other',
    gradient: 'from-purple/35 to-mint/20',
  },
};

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
          <p className="text-brutal-black/45 text-lg max-w-xl mx-auto">نماذج من أفضل المشاريع التي أنجزتها</p>
        </div>

        {/* كروت المشاريع — الأول في الوسط بحجم أكبر، ثم الثاني يساراً والثالث يميناً */}
        <div className="featured-projects-grid">
          {featured.map((project, idx) => {
            const config = typeConfig[project.project_type] || typeConfig.other;
            const coverImage = getCoverImage(project);
            const slug = generateSlug(project.title);
            const placement =
              idx === 0
                ? 'featured-project-card-primary'
                : idx === 1
                  ? 'featured-project-card-secondary'
                  : 'featured-project-card-tertiary';

            return (
              <article key={project.id} className={`brutal-card brutal-card-hover featured-project-card ${config.cardClass} ${placement} p-0 overflow-hidden group`}>
                <div className={`featured-project-card-media bg-gradient-to-br ${config.gradient} border-b-3 border-brutal-black flex items-center justify-center relative overflow-hidden`}>
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={`صورة مشروع ${project.title}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="featured-project-no-image">لا توجد صورة مضافة</div>
                  )}
                  <span className={`absolute bottom-3 left-3 brutal-tag ${config.color} text-brutal-black`}>
                    {config.label}
                  </span>
                </div>

                <div className="featured-project-card-content p-6">
                  <h3 className="text-xl font-extrabold text-brutal-black mb-2 group-hover:text-mint-dark transition-colors">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-brutal-black/50 text-sm mb-5 line-clamp-2 leading-relaxed">
                      {project.description.substring(0, 120)}...
                    </p>
                  )}

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="brutal-tag bg-brutal-gray text-brutal-black text-xs">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="brutal-tag bg-brutal-gray text-brutal-black/40 text-xs">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>
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
              <p className="text-lg font-bold text-brutal-black">لا توجد مشاريع مميزة بعد</p>
            </div>
          </div>
        )}

        {featured.length > 0 && (
          <div className="featured-projects-cta-wrap text-center mt-12">
            <p className="featured-projects-cta-label">اكتشف جميع الأعمال والتفاصيل</p>
            <Link href="/projects" className="brutal-btn brutal-btn-coral featured-projects-cta text-base px-10 py-3.5">
              استعرض كل المشاريع <span aria-hidden="true">←</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function getCoverImage(project: Project): string | null {
  return (
    project.project_media
      ?.filter((media) => media.media_type === 'image' && media.media_url.trim().length > 0)
      .sort((a, b) => a.sort_order - b.sort_order)[0]?.media_url || null
  );
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^\w\s\u0600-\u06FF-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}
