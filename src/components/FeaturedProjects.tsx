// ============================================================
// FeaturedProjects.tsx — قسم المشاريع البارزة
// ============================================================

import type { Project } from '@/types';
import Link from 'next/link';

interface FeaturedProjectsProps {
  projects: Project[];
}

const typeConfig: Record<string, { emoji: string; color: string; label: string }> = {
  mobile_app: { emoji: '📱', color: 'bg-warm', label: 'تطبيق جوال' },
  web_app: { emoji: '🌐', color: 'bg-sky', label: 'موقع ويب' },
  other: { emoji: '🎨', color: 'bg-purple', label: 'عمل آخر' },
};

const gradients = [
  'from-mint/25 to-sky/20',
  'from-sky/25 to-purple/20',
  'from-warm/25 to-coral/20',
];

const ranks = [
  { emoji: '🥇', label: 'المركز الأول', color: 'bg-warm' },
  { emoji: '🥈', label: 'المركز الثاني', color: 'bg-brutal-gray' },
  { emoji: '🥉', label: 'المركز الثالث', color: 'bg-coral/60' },
];

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.is_featured).slice(0, 3);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* خلفية — أبيض مع شرائط مائلة */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      <div className="absolute inset-0 stripe-pattern pointer-events-none"></div>

      {/* شريط أزرق باهت ممتد من طرف الشاشة إلى الطرف الآخر، بدون ميلان */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="featured-projects-band absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky/12 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-coral/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brutal-black mb-4">
            أعمال بارزة
          </h2>
          <p className="text-brutal-black/45 text-lg max-w-xl mx-auto">نماذج من أفضل المشاريع التي أنجزتها</p>
        </div>

        {/* البطاقات: الأول في الوسط بحجم أكبر، الثاني يساره، والثالث في الجهة الأخرى */}
        {featured.length > 0 && (
          <div className="featured-projects-grid">
            {featured.map((project, idx) => {
              const config = typeConfig[project.project_type] || typeConfig.other;
              const rank = ranks[idx];
              const slug = generateSlug(project.title);
              const placement =
                idx === 0
                  ? 'featured-project-item-primary'
                  : idx === 1
                    ? 'featured-project-item-secondary'
                    : 'featured-project-item-tertiary';

              return (
                <div key={project.id} className={`featured-project-item ${placement}`}>
                  <div className="featured-project-card-frame">
                    <article className="brutal-card brutal-card-hover featured-project-card p-0 overflow-hidden group">
                    <div className={`featured-project-card-media bg-gradient-to-br ${gradients[idx % 3]} border-b-3 border-brutal-black flex items-center justify-center relative`}>
                      <span className={`${idx === 0 ? 'text-7xl' : 'text-6xl'} group-hover:scale-110 transition-transform duration-300`}>
                        {config.emoji}
                      </span>
                      {project.is_featured && (
                        <span className="absolute top-3 right-3 brutal-tag bg-warm text-brutal-black rotate-3 animate-wiggle">
                          ⭐ مميز
                        </span>
                      )}
                      <span className={`absolute bottom-3 left-3 brutal-tag ${config.color} text-brutal-black`}>
                        {config.label}
                      </span>
                    </div>

                    <div className={`featured-project-card-body ${idx === 0 ? 'featured-project-card-body-primary' : ''}`}>
                      <h3 className={`${idx === 0 ? 'text-xl' : 'text-lg'} font-extrabold text-brutal-black mb-2 line-clamp-1 group-hover:text-mint-dark transition-colors`}>
                        {project.title}
                      </h3>

                      {project.description && (
                        <p className="featured-project-description text-brutal-black/50 text-xs mb-2 line-clamp-1 leading-relaxed">
                          {project.description.substring(0, 100)}...
                        </p>
                      )}

                      {project.tags && project.tags.length > 0 && (
                        <div className="featured-project-tags flex flex-wrap gap-1.5 mb-2">
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

                      <Link href={`/projects/${slug}`} className="featured-project-card-button brutal-btn brutal-btn-warm w-full text-sm">
                        عرض التفاصيل ←
                      </Link>
                    </div>
                    </article>
                  </div>

                  {/* شارة ترتيب المشروع أسفل البطاقة */}
                  <div className="featured-project-rank-wrap">
                    <span className={`brutal-tag ${rank.color} text-brutal-black`}>
                      {rank.emoji} {rank.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {featured.length === 0 && (
          <div className="text-center py-16">
            <div className="brutal-card p-12 max-w-sm mx-auto">
              <span className="text-5xl mb-4 block">🚧</span>
              <p className="text-lg font-bold text-brutal-black">لا توجد مشاريع مميزة بعد</p>
            </div>
          </div>
        )}

        {featured.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/projects" className="brutal-btn brutal-btn-dark text-base px-8 py-3">
              🎯 استعرض كل المشاريع
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^\w\s\u0600-\u06FF-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}
