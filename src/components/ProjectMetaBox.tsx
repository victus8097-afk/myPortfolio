// ============================================================
// ProjectMetaBox.tsx — صندوق البيانات الوصفية والتقنيات
// Server Component: عرض تفاصيل العمل التقنية
// ============================================================

import type { Project } from '@/types';
import { Calendar, Code, Tag, ExternalLink, Download } from 'lucide-react';

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
    <div className={`project-meta-box brutal-card p-6 project-meta-${project.project_type}`}>
      <h3
        className="text-lg font-black text-[#111111] mb-4"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        تفاصيل العمل
      </h3>

      <div className="space-y-4">
        {/* نوع العمل */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky/30 rounded-lg flex items-center justify-center border-2 border-[#111111]">
            <Tag size={16} />
          </div>
          <div>
            <p className="text-xs text-[#111111]/50">النوع</p>
            <p className="font-bold text-[#111111] text-sm">
              {typeLabels[project.project_type] || project.project_type}
            </p>
          </div>
        </div>

        {/* تاريخ التنفيذ */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-warm/30 rounded-lg flex items-center justify-center border-2 border-[#111111]">
            <Calendar size={16} />
          </div>
          <div>
            <p className="text-xs text-[#111111]/50">تاريخ التنفيذ</p>
            <p className="font-bold text-[#111111] text-sm">
              {new Date(project.created_at).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>

        {/* التقنيات المستخدمة */}
        {project.tags && project.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-mint/30 rounded-lg flex items-center justify-center border-2 border-[#111111]">
                <Code size={16} />
              </div>
              <p className="text-xs text-[#111111]/50">التقنيات المستخدمة</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="brutal-skill-cube bg-mint text-[#111111] text-xs py-1 px-3"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="pt-4 space-y-3 border-t-2 border-[#111111]/10">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn brutal-btn-mint w-full text-sm"
            >
              <ExternalLink size={16} />
              الرابط الحي للعمل
            </a>
          )}
          {project.store_url && (
            <a
              href={project.store_url}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn brutal-btn-sky w-full text-sm"
            >
              <Download size={16} />
              رابط المتجر
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
