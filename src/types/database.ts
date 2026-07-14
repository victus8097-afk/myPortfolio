// ============================================================
// Supabase Database Type Definitions
// Auto-generated schema types for type-safe queries
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profile_settings: {
        Row: {
          id: string;
          full_name: string;
          job_title: string;
          bio_summary: string;
          cv_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          job_title: string;
          bio_summary: string;
          cv_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          job_title?: string;
          bio_summary?: string;
          cv_url?: string | null;
          updated_at?: string;
        };
      };
      contact_channels: {
        Row: {
          id: number;
          channel_name: string;
          channel_value: string;
          is_active: boolean;
        };
        Insert: {
          id?: number;
          channel_name: string;
          channel_value: string;
          is_active?: boolean;
        };
        Update: {
          id?: number;
          channel_name?: string;
          channel_value?: string;
          is_active?: boolean;
        };
      };
      skills: {
        Row: {
          id: number;
          skill_name: string;
          category: string;
          skill_tags: string[];
          sort_order: number;
        };
        Insert: {
          id?: number;
          skill_name: string;
          category: string;
          skill_tags?: string[];
          sort_order?: number;
        };
        Update: {
          id?: number;
          skill_name?: string;
          category?: string;
          skill_tags?: string[];
          sort_order?: number;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          project_type: string;
          tags: string[];
          live_url: string | null;
          store_url: string | null;
          is_visible: boolean;
          is_featured: boolean;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          project_type: string;
          tags?: string[];
          live_url?: string | null;
          store_url?: string | null;
          is_visible?: boolean;
          is_featured?: boolean;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          project_type?: string;
          tags?: string[];
          live_url?: string | null;
          store_url?: string | null;
          is_visible?: boolean;
          is_featured?: boolean;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      project_media: {
        Row: {
          id: number;
          project_id: string;
          media_url: string;
          media_type: 'image' | 'video';
          sort_order: number;
        };
        Insert: {
          id?: number;
          project_id: string;
          media_url: string;
          media_type: 'image' | 'video';
          sort_order?: number;
        };
        Update: {
          id?: number;
          project_id?: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          sort_order?: number;
        };
      };
    };
  };
}
