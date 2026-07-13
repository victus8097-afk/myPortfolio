// ============================================================
// صفحة تفاصيل المشروع — Project Details Page
// Server Component: Dynamic Route عبر [slug]
// ============================================================

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ProjectMetaBox from '@/components/ProjectMetaBox';
import MediaSliderWrapper from '@/components/MediaSliderWrapper';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project, ProjectMedia } from '@/types';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

const typeLabels: Record<string, string> = {
  mobile_app: 'تطبيق جوال',
  web_app: 'موقع ويب',
  other: 'عمل آخر',
};

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return {
    title: project ? `${project.title} | Portfolio` : 'المشروع غير موجود',
    description: project?.description?.substring(0, 160) || 'مشروع من مشاريعي',
  };
}

async function getProjectBySlug(slug: string) {
  const supabase = await createClient();

  // البحث عن المشروع — نحاول أولاً بالـ slug ثم بالعنوان
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('is_visible', true);

  if (!projects) return null;

  const project = (projects as Project[]).find((p) => {
    const projectSlug = p.title
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return projectSlug === slug;
  });

  if (!project) return null;

  // جلب وسائط المشروع مرتبة من قاعدة البيانات
  const { data: media } = await supabase
    .from('project_media')
    .select('*')
    .eq('project_id', project.id)
    .order('sort_order', { ascending: true });

  return {
    ...project,
    project_media: (media as ProjectMedia[]) || [],
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const typeClass = getProjectTypeClass(project.project_type);
  const typeLabel = typeLabels[project.project_type] || project.project_type;

  return (
    <main className="project-detail-page min-h-screen bg-brutal-gray">
      <Navbar />

      <div className="section-padding pt-28 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="project-detail-toolbar flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link href="/projects" className="brutal-btn bg-white text-sm">
              <ArrowRight size={16} />
              العودة للمعرض
            </Link>
            <span className={`project-detail-type ${typeClass}`}>{typeLabel}</span>
          </div>

          <header className={`project-detail-header ${typeClass} mb-10`}>
            <p className="text-sm font-bold text-[#111111]/45 mb-3">تفاصيل المشروع</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] leading-tight">
              {project.title}
            </h1>
          </header>

          <div className="project-detail-layout grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.75fr)] gap-8 items-start">
            <div className="space-y-8">
              <MediaSliderWrapper media={project.project_media || []} />

              {project.description && (
                <article className="project-detail-description brutal-card p-6 sm:p-8">
                  <h2 className="text-2xl font-black text-[#111111] mb-4">
                    عن المشروع
                  </h2>
                  <div
                    className="prose prose-lg max-w-none text-[#111111]/80 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: project.description.replace(/\n/g, '<br/>'),
                    }}
                  />
                </article>
              )}
            </div>

            <aside className="lg:sticky lg:top-24">
              <ProjectMetaBox project={project} />
            </aside>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}

function getProjectTypeClass(projectType: string): string {
  if (projectType === 'mobile_app') return 'project-type-mobile';
  if (projectType === 'web_app') return 'project-type-web';
  return 'project-type-other';
}
