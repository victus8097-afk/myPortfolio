// ============================================================
// TypeScript Schema Definitions — Supabase Data Models
// ============================================================

/** جدول الإعدادات العامة والتفاصيل الشخصية */
export interface ProfileSettings {
  id: string;
  full_name: string;
  job_title: string;
  bio_summary: string;
  cv_url: string | null;
  updated_at: string;
}

/** جدول قنوات التواصل المباشر */
export interface ContactChannel {
  id: number;
  channel_name: 'WhatsApp' | 'Email' | 'Phone' | string;
  channel_value: string;
  is_active: boolean;
}

/** جدول المهارات والخبرات التقنية */
export interface Skill {
  id: number;
  skill_name: string;
  category: string;
  skill_tags: string[];
  sort_order: number;
}

/** جدول المشاريع والأعمال */
export interface Project {
  id: string;
  title: string;
  description: string | null;
  project_type: 'mobile_app' | 'web_app' | 'other' | string;
  tags: string[];
  live_url: string | null;
  store_url: string | null;
  is_visible: boolean;
  is_featured: boolean;
  created_at: string;
  completed_at: string | null;
  // Joined relation (optional)
  project_media?: ProjectMedia[];
}

/** جدول وسائط المشاريع */
export interface ProjectMedia {
  id: number;
  project_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  sort_order: number;
}

/** أنواع مساعدية */
export type ProjectType = 'mobile_app' | 'web_app' | 'other';
export type MediaType = 'image' | 'video';

/** فلاتر المشاريع */
export interface ProjectFilters {
  type?: ProjectType | 'all';
}

/** بيانات تسجيل الدخول */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** إحصائيات لوحة التحكم */
export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalMedia: number;
  activeChannels: number;
}
