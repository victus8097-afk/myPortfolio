// ============================================================
// ProjectMetaBox.tsx — معلومات العمل والتقنيات
// Server Component: عرض بيانات العمل التقنية
// ============================================================

import type { Project } from '@/types';
import { Calendar, CalendarCheck, Code, Tag, ExternalLink, Download } from 'lucide-react';

interface ProjectMetaBoxProps {
  project: Project;
}

const typeLabels: Record<string, string> = {
  mobile_app: 'تطبيق جوال',
  web_app: 'موقع ويب',
  other: 'عمل آخر',
};

export default function ProjectMetaBox({ project }: ProjectMetaBoxProps) {
  return (
    <div className="project-meta-stack space-y-4">
      <section className={`project-meta-box brutal-card p-6 project-meta-${project.project_type}`}>
        <h3 className="text-lg font-black text-[#111111] mb-5">
          المعلومات الأساسية
        </h3>

        <div className="space-y-4">
          <MetaRow icon={<Tag size={16} />} color="bg-sky/30" label="النوع">
            {typeLabels[project.project_type] || project.project_type}
          </MetaRow>
          <MetaRow icon={<Calendar size={16} />} color="bg-warm/30" label="تاريخ التنفيذ">
            {formatDate(project.created_at)}
          </MetaRow>
          <MetaRow icon={<CalendarCheck size={16} />} color="bg-mint/30" label="تاريخ الانتهاء">
            {project.completed_at ? formatDate(project.completed_at) : 'لم يحدد بعد'}
          </MetaRow>
        </div>
      </section>

      {project.tags && project.tags.length > 0 && (
        <section className="project-meta-box project-meta-technologies brutal-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-mint/30 rounded-lg flex items-center justify-center border-2 border-[#111111]">
              <Code size={16} />
            </div>
            <h3 className="text-lg font-black text-[#111111]">التقنيات المستخدمة</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="brutal-skill-cube bg-mint text-[#111111] text-xs py-1 px-3">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {(project.live_url || project.store_url) && (
        <section className="project-meta-box project-meta-links brutal-card p-6">
          <h3 className="text-lg font-black text-[#111111] mb-4">الروابط</h3>
          <div className="space-y-3">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="brutal-btn brutal-btn-mint w-full text-sm">
                <ExternalLink size={16} />
                الرابط الحي للعمل
              </a>
            )}
            {project.store_url && (
              <a href={project.store_url} target="_blank" rel="noopener noreferrer" className="brutal-btn brutal-btn-sky w-full text-sm">
                <Download size={16} />
                رابط المتجر
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function MetaRow({
  icon,
  color,
  label,
  children,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center border-2 border-[#111111] shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[#111111]/50">{label}</p>
        <p className="font-bold text-[#111111] text-sm">{children}</p>
      </div>
    </div>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
