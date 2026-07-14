'use client';

// ============================================================
// لوحة التحكم الإدارية — Admin Dashboard
// Client Component: محمية بنظام المصادقة
// ============================================================

import { useState, useEffect, useCallback, useMemo, type ChangeEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import CoverCropper from '@/components/CoverCropper';
import type { Project, ProjectMedia, Skill, ContactChannel, ProfileSettings, DashboardStats } from '@/types';
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  Settings,
  Shield,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

const MEDIA_BUCKET = 'project-media';

type ActiveTab = 'overview' | 'projects' | 'skills' | 'settings' | 'security';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalSkills: 0,
    totalMedia: 0,
    activeChannels: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [channels, setChannels] = useState<ContactChannel[]>([]);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);

  // حالة نافذة إضافة/تعديل مشروع
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // جلب البيانات
  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, skillsRes, channelsRes, profileRes] = await Promise.all([
        supabase.from('projects').select('*, project_media(*)').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true }),
        supabase.from('contact_channels').select('*'),
        supabase.from('profile_settings').select('*').single(),
      ]);

      const projectData = (projectsRes.data as Project[]) || [];
      const skillData = (skillsRes.data as Skill[]) || [];
      const channelData = (channelsRes.data as ContactChannel[]) || [];

      setProjects(projectData);
      setSkills(skillData);
      setChannels(channelData);
      setProfile((profileRes.data as unknown as ProfileSettings) || null);

      setStats({
        totalProjects: projectData.length,
        totalSkills: skillData.length,
        totalMedia: projectData.reduce((total, project) => total + (project.project_media?.length || 0), 0),
        activeChannels: channelData.filter((c) => c.is_active).length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // التحقق من المصادقة
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/sys-gate-hq-99x';
        return;
      }
      fetchData();
    };
    checkAuth();
  }, [supabase, fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/sys-gate-hq-99x';
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'نظرة عامة', icon: <LayoutDashboard size={18} /> },
    { id: 'projects', label: 'الأعمال', icon: <FolderOpen size={18} /> },
    { id: 'skills', label: 'الأدوات والتقنيات', icon: <Wrench size={18} /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings size={18} /> },
    { id: 'security', label: 'الأمان', icon: <Shield size={18} /> },
  ];

  if (isLoading) {
    return (
      <main className="dashboard-shell min-h-screen flex items-center justify-center">
        <div className="dashboard-loading brutal-card p-8 text-center">
          <div className="text-4xl mb-4 animate-pulse">⏳</div>
          <p className="font-bold text-[#111111]">جاري التحميل...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-shell min-h-screen">
      {/* Header */}
      <header className="dashboard-header px-6 py-4 flex items-center justify-between">
        <h1
          className="text-xl font-black text-[#111111]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          لوحة التحكم
        </h1>
        <div className="flex items-center gap-3">
          <Link href="/" className="brutal-btn bg-white text-sm">
            عرض الموقع
          </Link>
          <button onClick={handleLogout} className="brutal-btn brutal-btn-red text-sm">
            <LogOut size={16} />
            خروج
          </button>
        </div>
      </header>

      <div className="flex">
        {/* الشريط الجانبي */}
        <aside className="dashboard-sidebar w-64 min-h-[calc(100vh-64px)] p-4">
          <div className="dashboard-sidebar-title mb-5 px-4">إدارة الموقع</div>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'dashboard-tab-active bg-mint text-[#111111] border-2 border-[#111111]'
                    : 'dashboard-tab-idle text-white/55 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* المحتوى الرئيسي */}
        <div className="dashboard-content flex-1 p-6 lg:p-8">
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} />
          )}
          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              onRefresh={fetchData}
              showProjectForm={showProjectForm}
              setShowProjectForm={setShowProjectForm}
              editingProject={editingProject}
              setEditingProject={setEditingProject}
            />
          )}
          {activeTab === 'skills' && (
            <SkillsTab skills={skills} onRefresh={fetchData} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab profile={profile} channels={channels} onRefresh={fetchData} />
          )}
          {activeTab === 'security' && (
            <SecurityTab />
          )}
        </div>
      </div>
    </main>
  );
}

// ============================================================
// Tab Components
// ============================================================

function OverviewTab({ stats }: { stats: DashboardStats }) {
  const statCards = [
    { label: 'إجمالي الأعمال', value: stats.totalProjects, icon: <FolderOpen size={22} />, color: 'bg-mint' },
    { label: 'الأدوات والتقنيات', value: stats.totalSkills, icon: <Wrench size={22} />, color: 'bg-sky' },
    { label: 'الوسائط', value: stats.totalMedia, icon: <ImageIcon size={22} />, color: 'bg-warm' },
    { label: 'قنوات فعالة', value: stats.activeChannels, icon: <Settings size={22} />, color: 'bg-purple-300' },
  ];

  return (
    <div>
      <div className="dashboard-section-heading mb-6">
        <p className="text-sm font-bold text-[#111111]/45 mb-1">ملخص سريع</p>
        <h2 className="text-2xl font-black text-[#111111]">نظرة عامة</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="dashboard-stat-card brutal-card p-5">
            <div className={`dashboard-stat-icon ${card.color} w-12 h-12 rounded-xl border-3 border-[#111111] flex items-center justify-center mb-4`}>
              {card.icon}
            </div>
            <p className="text-3xl font-black text-[#111111] mb-1">{card.value}</p>
            <p className="text-sm text-[#111111]/60 font-medium">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsTab({
  projects,
  onRefresh,
  showProjectForm,
  setShowProjectForm,
  editingProject,
  setEditingProject,
}: {
  projects: Project[];
  onRefresh: () => void;
  showProjectForm: boolean;
  setShowProjectForm: (v: boolean) => void;
  editingProject: Project | null;
  setEditingProject: (v: Project | null) => void;
}) {
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    await supabase.from('projects').delete().eq('id', id);
    onRefresh();
  };

  const toggleVisibility = async (project: Project) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from('projects').update({ is_visible: !project.is_visible } as any).eq('id', project.id);
    onRefresh();
  };

  const toggleFeatured = async (project: Project) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from('projects').update({ is_featured: !project.is_featured } as any).eq('id', project.id);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#111111]">إدارة الأعمال</h2>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowProjectForm(true);
          }}
          className="brutal-btn brutal-btn-mint"
        >
          <Plus size={18} />
          إضافة مشروع
        </button>
      </div>

      {/* جدول المشاريع */}
      <div className="brutal-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#111111] text-white">
              <th className="px-4 py-3 text-right font-bold">العنوان</th>
              <th className="px-4 py-3 text-right font-bold">النوع</th>
              <th className="px-4 py-3 text-center font-bold">الوسائط</th>
              <th className="px-4 py-3 text-center font-bold">ظاهر</th>
              <th className="px-4 py-3 text-center font-bold">مميز</th>
              <th className="px-4 py-3 text-center font-bold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b-2 border-[#111111]/10 hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">{project.title}</td>
                <td className="px-4 py-3">{project.project_type}</td>
                <td className="px-4 py-3 text-center font-bold text-[#111111]/65">
                  {project.project_media?.length || 0}
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleVisibility(project)}>
                    {project.is_visible ? <Eye size={16} className="text-mint-dark mx-auto" /> : <EyeOff size={16} className="text-[#111111]/30 mx-auto" />}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleFeatured(project)}>
                    <Star size={16} className={project.is_featured ? 'text-warm-dark fill-warm mx-auto' : 'text-[#111111]/30 mx-auto'} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setShowProjectForm(true);
                      }}
                      className="p-1.5 rounded-lg border-2 border-[#111111] hover:bg-sky/20"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1.5 rounded-lg border-2 border-[#111111] hover:bg-brutal-red/20"
                    >
                      <Trash2 size={14} className="text-brutal-red" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="text-center py-12 text-[#111111]/50">
            <p>لا توجد مشاريع بعد. أضف مشروعك الأول!</p>
          </div>
        )}
      </div>

      {/* نافذة إضافة/تعديل مشروع */}
      {showProjectForm && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
          onSaved={onRefresh}
        />
      )}
    </div>
  );
}

function ProjectFormModal({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    project_type: project?.project_type || 'web_app',
    tags: project?.tags?.join(', ') || '',
    live_url: project?.live_url || '',
    store_url: project?.store_url || '',
    is_visible: project?.is_visible ?? true,
    is_featured: project?.is_featured ?? false,
  });
  const [mediaItems, setMediaItems] = useState<ProjectMedia[]>(project?.project_media || []);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropQueue, setCropQueue] = useState<File[]>([]);

  const startCropQueue = (files: File[]) => {
    const [nextFile, ...remaining] = files;
    if (!nextFile) return;
    setCropFile(nextFile);
    setCropQueue(remaining);
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    const images = files.filter((file) => file.type.startsWith('image/'));
    const videos = files.filter((file) => file.type.startsWith('video/'));

    setPendingFiles((current) => [...current, ...videos]);
    if (images.length > 0) {
      if (cropFile) {
        setCropQueue((current) => [...current, ...images]);
      } else {
        startCropQueue(images);
      }
    }
    event.target.value = '';
  };

  const handleCropConfirmed = (croppedFile: File) => {
    setPendingFiles((current) => [...current, croppedFile]);
    if (cropQueue.length > 0) {
      startCropQueue(cropQueue);
    } else {
      setCropFile(null);
    }
  };

  const handleCropCancelled = () => {
    if (cropQueue.length > 0) {
      startCropQueue(cropQueue);
    } else {
      setCropFile(null);
    }
  };

  const uploadFiles = async (projectId: string) => {
    if (pendingFiles.length === 0) return;

    setUploading(true);
    const uploadQueue = [
      ...pendingFiles.filter((file) => file.type.startsWith('image/')),
      ...pendingFiles.filter((file) => file.type.startsWith('video/')),
    ];
    try {
      for (const [index, file] of uploadQueue.entries()) {
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
        const filePath = `${projectId}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(filePath, file, { contentType: file.type, upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicFile } = supabase.storage
          .from(MEDIA_BUCKET)
          .getPublicUrl(filePath);
        const { error: mediaError } = await supabase.from('project_media').insert({
          project_id: projectId,
          media_url: publicFile.publicUrl,
          media_type: file.type.startsWith('video/') ? 'video' : 'image',
          sort_order: mediaItems.length + index,
        });

        if (mediaError) throw mediaError;
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;

    setSaving(true);
    setError('');
    try {
      const data = {
        ...form,
        title: form.title.trim(),
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };
      let projectId = project?.id;

      if (projectId) {
        const { error: updateError } = await supabase.from('projects').update(data).eq('id', projectId);
        if (updateError) throw updateError;
      } else {
        const { data: createdProject, error: insertError } = await supabase
          .from('projects')
          .insert(data)
          .select('id')
          .single();
        if (insertError) throw insertError;
        projectId = createdProject.id;
      }

      if (projectId) await uploadFiles(projectId);
      onSaved();
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ العمل أو رفع الوسائط');
    } finally {
      setSaving(false);
    }
  };

  const handleSetCover = async (media: ProjectMedia) => {
    if (!project) {
      setError('احفظ العمل أولاً حتى تتمكن من تحديد الغلاف');
      return;
    }

    const ordered = [media, ...mediaItems.filter((item) => item.id !== media.id)];
    const results = await Promise.all(
      ordered.map((item, index) =>
        supabase.from('project_media').update({ sort_order: index }).eq('id', item.id)
      )
    );
    const failed = results.find((result) => result.error);
    if (failed?.error) {
      setError(failed.error.message);
      return;
    }
    setMediaItems(ordered.map((item, index) => ({ ...item, sort_order: index })));
  };

  const handleDeleteMedia = async (media: ProjectMedia) => {
    if (!confirm('هل تريد حذف هذه الوسيطة؟')) return;

    const storagePath = getStoragePath(media.media_url);
    if (storagePath) {
      await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
    }
    const { error: deleteError } = await supabase.from('project_media').delete().eq('id', media.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setMediaItems((items) => items.filter((item) => item.id !== media.id));
  };

  const orderedMedia = [...mediaItems].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="dashboard-modal fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
      <div className="dashboard-modal-card brutal-card p-6 max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-[#111111]/45 mb-1">إدارة الأعمال</p>
            <h3 className="text-xl font-black text-[#111111]">
              {project ? 'تعديل العمل' : 'إضافة عمل جديد'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg border-2 border-[#111111] hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">عنوان العمل *</label>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="brutal-input"
              placeholder="اسم العمل"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">الوصف</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="brutal-input min-h-[100px]"
              placeholder="وصف مختصر وواضح للعمل"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">نوع العمل</label>
            <select
              value={form.project_type}
              onChange={(event) => setForm({ ...form, project_type: event.target.value })}
              className="brutal-input"
            >
              <option value="web_app">موقع ويب</option>
              <option value="mobile_app">تطبيق جوال</option>
              <option value="other">أعمال أخرى</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">التقنيات</label>
            <input
              value={form.tags}
              onChange={(event) => setForm({ ...form, tags: event.target.value })}
              className="brutal-input"
              placeholder="React, Next.js, TypeScript"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">الرابط الحي</label>
              <input
                value={form.live_url}
                onChange={(event) => setForm({ ...form, live_url: event.target.value })}
                className="brutal-input"
                placeholder="https://"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">رابط المتجر</label>
              <input
                value={form.store_url}
                onChange={(event) => setForm({ ...form, store_url: event.target.value })}
                className="brutal-input"
                placeholder="https://"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(event) => setForm({ ...form, is_visible: event.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold">ظاهر للعامة</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(event) => setForm({ ...form, is_featured: event.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold">يظهر ضمن الأعمال البارزة</span>
            </label>
          </div>

          {/* رفع الصور والفيديوهات واختيار الغلاف */}
          <div className="dashboard-media-panel">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h4 className="font-black text-[#111111]">الصور والفيديوهات</h4>
                <p className="text-xs text-[#111111]/50 mt-1">أول وسيطة بترتيب صفر تستخدم كغلاف للعمل.</p>
              </div>
              <span className="dashboard-media-count">{mediaItems.length} وسائط</span>
            </div>

            <label className="dashboard-upload-zone">
              <Upload size={22} />
              <span className="font-bold">اختر صوراً أو فيديوهات</span>
              <span className="text-xs text-[#111111]/50">يمكنك اختيار أكثر من ملف في نفس الوقت</span>
              <input type="file" accept="image/*,video/*" multiple onChange={handleFiles} className="sr-only" />
            </label>

            {pendingFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-bold text-[#111111]/55">ملفات جاهزة للرفع</p>
                {pendingFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 bg-white border-2 border-[#111111]/10 rounded-lg px-3 py-2 text-sm">
                    <span className="truncate" dir="ltr">{file.name}</span>
                    <button type="button" onClick={() => setPendingFiles((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="text-brutal-red font-bold">
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            )}

            {project && orderedMedia.length > 0 && (
              <div className="dashboard-media-grid mt-4">
                {orderedMedia.map((media) => (
                  <div key={media.id} className="dashboard-media-item">
                    <div className="dashboard-media-preview">
                      {media.media_type === 'image' ? (
                        <img src={media.media_url} alt="وسائط العمل" />
                      ) : (
                        <video src={media.media_url} muted preload="metadata" />
                      )}
                      {media.sort_order === 0 && <span className="dashboard-cover-badge">الغلاف</span>}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      {media.media_type === 'image' ? (
                        <button
                          type="button"
                          onClick={() => handleSetCover(media)}
                          disabled={media.sort_order === 0}
                          className="text-xs font-bold text-[#111111] disabled:opacity-40"
                        >
                          {media.sort_order === 0 ? <Check size={14} className="inline ml-1" /> : 'تعيين كغلاف'}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#111111]/45">فيديو</span>
                      )}
                      <button type="button" onClick={() => handleDeleteMedia(media)} className="text-xs font-bold text-brutal-red">
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!project && <p className="text-xs text-[#111111]/45 mt-3">سيتم رفع الملفات بعد حفظ العمل لأول مرة.</p>}
          </div>

          {error && <p className="dashboard-form-error">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving || uploading || !form.title.trim()}
            className="brutal-btn brutal-btn-mint w-full"
          >
            <Save size={16} />
            {saving || uploading ? 'جاري الحفظ والرفع...' : 'حفظ العمل'}
          </button>
        </div>
      </div>

      {cropFile && (
        <CoverCropper
          file={cropFile}
          onCancel={handleCropCancelled}
          onConfirm={handleCropConfirmed}
        />
      )}
    </div>
  );
}

function getStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const markerIndex = url.indexOf(marker);
  return markerIndex === -1 ? null : decodeURIComponent(url.slice(markerIndex + marker.length));
}

function SkillsTab({ skills, onRefresh }: { skills: Skill[]; onRefresh: () => void }) {
  const supabase = createClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    skill_name: '',
    category: '',
    skill_tags: '',
    sort_order: 0,
  });

  const handleAdd = async () => {
    await supabase.from('skills').insert({
      ...form,
      skill_tags: form.skill_tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setForm({ skill_name: '', category: '', skill_tags: '', sort_order: 0 });
    setShowForm(false);
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('حذف هذه المهارة؟')) return;
    await supabase.from('skills').delete().eq('id', id);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#111111]">🧩 إدارة المهارات</h2>
        <button onClick={() => setShowForm(!showForm)} className="brutal-btn brutal-btn-mint">
          <Plus size={18} />
          إضافة مهارة
        </button>
      </div>

      {showForm && (
        <div className="brutal-card p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">اسم المهارة *</label>
              <input
                value={form.skill_name}
                onChange={(e) => setForm({ ...form, skill_name: e.target.value })}
                className="brutal-input"
                placeholder="مثل: Flutter"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">التصنيف *</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="brutal-input"
                placeholder="مثل: تطبيقات جوال"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">الوسوم (مفصولة بفواصل)</label>
              <input
                value={form.skill_tags}
                onChange={(e) => setForm({ ...form, skill_tags: e.target.value })}
                className="brutal-input"
                placeholder="Dart, BLoC"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">ترتيب الظهور</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="brutal-input"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!form.skill_name || !form.category}
            className="brutal-btn brutal-btn-mint mt-4"
          >
            <Save size={16} />
            حفظ المهارة
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="brutal-card p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#111111]">{skill.skill_name}</p>
              <p className="text-xs text-[#111111]/50">{skill.category}</p>
            </div>
            <button
              onClick={() => handleDelete(skill.id)}
              className="p-1.5 rounded-lg border-2 border-[#111111] hover:bg-brutal-red/20"
            >
              <Trash2 size={14} className="text-brutal-red" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({
  profile,
  channels,
  onRefresh,
}: {
  profile: ProfileSettings | null;
  channels: ContactChannel[];
  onRefresh: () => void;
}) {
  const supabase = createClient();
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    job_title: profile?.job_title || '',
    bio_summary: profile?.bio_summary || '',
  });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async () => {
    setSaving(true);
    if (profile) {
      await supabase.from('profile_settings').update(profileForm).eq('id', profile.id);
    }
    setSaving(false);
    onRefresh();
    alert('تم الحفظ بنجاح ✅');
  };

  const toggleChannel = async (channel: ContactChannel) => {
    await supabase
      .from('contact_channels')
      .update({ is_active: !channel.is_active })
      .eq('id', channel.id);
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black text-[#111111]">⚙️ الإعدادات العامة</h2>

      {/* إعدادات الملف الشخصي */}
      <div className="brutal-card p-6">
        <h3 className="text-lg font-black text-[#111111] mb-4">👤 المعلومات الشخصية</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">الاسم الكامل</label>
            <input
              value={profileForm.full_name}
              onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
              className="brutal-input"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">المسمى الوظيفي</label>
            <input
              value={profileForm.job_title}
              onChange={(e) => setProfileForm({ ...profileForm, job_title: e.target.value })}
              className="brutal-input"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">النبذة التعريفية</label>
            <textarea
              value={profileForm.bio_summary}
              onChange={(e) => setProfileForm({ ...profileForm, bio_summary: e.target.value })}
              className="brutal-input min-h-[100px]"
            />
          </div>
          <button
            onClick={handleProfileSave}
            disabled={saving}
            className="brutal-btn brutal-btn-mint"
          >
            <Save size={16} />
            {saving ? '⏳ جاري الحفظ...' : '💾 حفظ التغييرات'}
          </button>
        </div>
      </div>

      {/* قنوات التواصل */}
      <div className="brutal-card p-6">
        <h3 className="text-lg font-black text-[#111111] mb-4">📡 قنوات التواصل</h3>
        <div className="space-y-3">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between p-3 border-2 border-[#111111]/10 rounded-lg"
            >
              <div>
                <p className="font-bold text-[#111111] text-sm">{channel.channel_name}</p>
                <p className="text-xs text-[#111111]/50">{channel.channel_value}</p>
              </div>
              <button
                onClick={() => toggleChannel(channel)}
                className={`brutal-btn text-xs py-1 px-3 ${
                  channel.is_active ? 'brutal-btn-mint' : 'brutal-btn-dark'
                }`}
              >
                {channel.is_active ? '✅ مفعلة' : '⛔ معطلة'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div>
      <h2 className="text-2xl font-black text-[#111111] mb-6">🛡️ سجلات الأمان</h2>
      <div className="brutal-card p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-xl font-bold text-[#111111] mb-2">نظام مراقبة الأمان</h3>
        <p className="text-[#111111]/60 max-w-md mx-auto">
          يتم تسجيل جميع محاولات الدخول والتعديلات تلقائياً. يتكامل هذا النظام مع سياسات الحماية وهندسة الأمن السيبراني.
        </p>
      </div>
    </div>
  );
}
