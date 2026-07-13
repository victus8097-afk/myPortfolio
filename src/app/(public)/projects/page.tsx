// ============================================================
// صفحة معرض الأعمال الشامل — Projects Showcase Page
// Server Component: مفلترة عبر URL Query Params
// ============================================================

import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import FilterBar from '@/components/FilterBar';
import ProjectCard from '@/components/ProjectCard';
import SkeletonCard from '@/components/SkeletonCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Link from 'next/link';
import type { Project, ProjectType } from '@/types';

interface ProjectsPageProps {
  searchParams: Promise<{ type?: string }>;
}

async function getProjects(type?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('projects')
    .select('*, project_media(*)')
    .eq('is_visible', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (type && type !== 'all') {
    query = query.eq('project_type', type as ProjectType);
  }

  const { data, error } = await query;
  if (error) console.error('Error fetching projects:', error);
  return (data as Project[]) || [];
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const projects = await getProjects(params.type);

  return (
    <main className="projects-page min-h-screen bg-brutal-gray">
      <Navbar />

      <div className="section-padding pt-28 pb-20">
        <div className="max-w-6xl mx-auto">
          <header className="projects-page-header text-center mb-12">
            <div className="featured-heading-mark mb-5" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] mb-4">
              معرض الأعمال
            </h1>
            <p className="text-[#111111]/55 text-base sm:text-lg max-w-xl mx-auto">
              جميع الأعمال المنجزة
            </p>
          </header>

          <div className="projects-filter-shell">
            <Suspense>
              <FilterBar />
            </Suspense>
          </div>

          <Suspense fallback={<SkeletonCard type="project" count={6} />}>
            {projects.length > 0 ? (
              <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="brutal-card p-12 max-w-md mx-auto">
                  <div className="featured-empty-mark mx-auto mb-5" aria-hidden="true"></div>
                  <h3 className="text-xl font-bold text-[#111111] mb-2">
                    لا توجد أعمال حالياً
                  </h3>
                  <p className="text-[#111111]/60 mb-6">
                    سيتم إضافة أعمال جديدة قريباً!
                  </p>
                  <Link href="/" className="brutal-btn brutal-btn-mint">
                    ← العودة للرئيسية
                  </Link>
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
