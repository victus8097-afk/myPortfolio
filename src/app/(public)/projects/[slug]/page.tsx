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

  // جلب وسائط المشروع
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

  return (
    <main className="min-h-screen bg-brutal-gray">
      <Navbar />

      <div className="section-padding pt-24">
        <div className="max-w-7xl mx-auto">
          {/* مسار التنقل */}
          <div className="mb-8">
            <Link
              href="/projects"
              className="brutal-btn bg-white text-sm mb-4"
            >
              <ArrowRight size={16} />
              العودة للمعرض
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* العمود الرئيسي — معرض الوسائط + الوصف */}
            <div className="lg:col-span-2 space-y-8">
              {/* معرض الوسائط الكرتوني */}
              <MediaSliderWrapper media={project.project_media || []} />

              {/* وصف المشروع التفصيلي */}
              {project.description && (
                <div className="brutal-card p-6">
                  <h2
                    className="text-2xl font-black text-[#111111] mb-4"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    📝 عن المشروع
                  </h2>
                  <div
                    className="prose prose-lg max-w-none text-[#111111]/80 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: project.description.replace(/\n/g, '<br/>'),
                    }}
                  />
                </div>
              )}
            </div>

            {/* العمود الجانبي — البيانات الوصفية */}
            <div className="space-y-6">
              <ProjectMetaBox project={project} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
