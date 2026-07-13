// ============================================================
// FeaturedProjects.tsx — قسم المشاريع البارزة
// ============================================================

import type { Project } from '@/types';
import Link from 'next/link';

interface FeaturedProjectsProps {
  projects: Project[];
}

const typeConfig: Record<string, { color: string; label: string }> = {
  mobile_app: { color: 'bg-warm', label: 'تطبيق جوال' },
  web_app: { color: 'bg-sky', label: 'موقع ويب' },
  other: { color: 'bg-purple', label: 'عمل آخر' },
};

const gradients = [
  'from-mint/25 to-sky/20',
  'from-sky/25 to-purple/20',
  'from-warm/25 to-coral/20',
];

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.is_featured).slice(0, 3);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* خلفية — أبيض مع شرائط مائلة */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      <div className="absolute inset-0 stripe-pattern pointer-events-none"></div>
      <div className="featured-projects-highlight absolute pointer-events-none"></div>
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky/12 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-coral/10 rounded-full blur-[100px] pointer-events-none"></div>

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

        {/* كروت المشاريع */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((project, idx) => {
            const config = typeConfig[project.project_type] || typeConfig.other;
            const coverImage = getCoverImage(project);
            const slug = generateSlug(project.title);

            return (
              <article key={project.id} className="brutal-card brutal-card-hover featured-project-card p-0 overflow-hidden group">
                <div className={`h-52 bg-gradient-to-br ${gradients[idx % 3]} border-b-3 border-brutal-black flex items-center justify-center relative overflow-hidden`}>
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
          <div className="text-center mt-12">
            <Link href="/projects" className="brutal-btn brutal-btn-dark text-base px-8 py-3">
              استعرض كل المشاريع
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
