// ============================================================
// الصفحة الرئيسية — Single Page Layout
// Server Component: تجلب البيانات من Supabase
// ============================================================

import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SkillsSection from '@/components/SkillsSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SkeletonCard from '@/components/SkeletonCard';
import type { ProfileSettings, Skill, Project, ContactChannel } from '@/types';

async function getData() {
  const supabase = await createClient();

  const [profileRes, skillsRes, projectsRes, channelsRes] = await Promise.all([
    supabase.from('profile_settings').select('*').single(),
    supabase.from('skills').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('projects')
      .select('*, project_media(*)')
      .eq('is_visible', true)
      .order('created_at', { ascending: false }),
    supabase.from('contact_channels').select('*').eq('is_active', true),
  ]);

  return {
    profile: (profileRes.data as ProfileSettings) || fallbackProfile,
    skills: (skillsRes.data as Skill[]) || [],
    projects: (projectsRes.data as Project[]) || [],
    channels: (channelsRes.data as ContactChannel[]) || [],
  };
}

const fallbackProfile: ProfileSettings = {
  id: '1',
  full_name: 'مطور تطبيقات',
  job_title: 'مطور تطبيقات ويب وجوال',
  bio_summary: 'مرحباً بك في موقعي الشخصي — مطور شغوف ببناء تطبيقات مبتكرة وحلول رقمية متكاملة.',
  cv_url: null,
  updated_at: new Date().toISOString(),
};

export default async function HomePage() {
  let data;
  try {
    data = await getData();
  } catch {
    data = {
      profile: fallbackProfile,
      skills: [],
      projects: [],
      channels: [],
    };
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <Suspense fallback={<SkeletonCard type="hero" />}>
        <HeroSection profile={data.profile} />
      </Suspense>

      <Suspense fallback={<SkeletonCard type="skill" count={8} />}>
        <SkillsSection skills={data.skills} />
      </Suspense>

      <Suspense fallback={<SkeletonCard type="project" count={3} />}>
        <FeaturedProjects projects={data.projects} />
      </Suspense>

      <Suspense>
        <ContactSection channels={data.channels} />
      </Suspense>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
