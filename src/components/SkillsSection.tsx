// ============================================================
// SkillsSection.tsx — قسم المهارات
// ============================================================

import type { Skill } from '@/types';

interface SkillsSectionProps {
  skills: Skill[];
}

const cubeColors = [
  'bg-mint', 'bg-sky', 'bg-warm', 'bg-coral', 'bg-purple',
  'bg-mint-light', 'bg-sky-light', 'bg-warm-light',
];

const categoryBanners = [
  { bg: 'bg-warm/20', rotate: '1deg' },
  { bg: 'bg-sky/15', rotate: '-1deg' },
  { bg: 'bg-mint/15', rotate: '0.5deg' },
  { bg: 'bg-purple/15', rotate: '-0.5deg' },
];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  Object.keys(grouped).forEach((cat) => {
    grouped[cat].sort((a, b) => a.sort_order - b.sort_order);
  });

  const categories = Object.entries(grouped);

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* خلفية */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      <div className="absolute inset-0 stripe-pattern pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* العنوان */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brutal-black mb-4">
            المهارات
          </h2>
          <p className="text-brutal-black/45 text-lg max-w-xl mx-auto">التقنيات والأدوات التي أستخدمها لبناء حلول رقمية مبتكرة</p>
        </div>

        {/* المهارات */}
        {categories.map(([category, categorySkills], groupIdx) => {
          const banner = categoryBanners[groupIdx % categoryBanners.length];

          return (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-lg sm:text-xl font-extrabold text-brutal-black mb-3 text-center">
                {category}
              </h3>

              <div
                className="relative -left-[5vw] -right-[8vw] w-[100vw] overflow-hidden"
                style={{ transform: `rotate(${banner.rotate})`, transformOrigin: 'center' }}
              >
                {/* خلفية المستطيل */}
                <div className={`absolute inset-0 ${banner.bg} border-y-3 border-brutal-black/8`}></div>

                {/* المكعبات */}
                <div className="relative z-10 py-6 px-4 flex flex-wrap gap-4 justify-center">
                  {categorySkills.map((skill, idx) => (
                    <div
                      key={skill.id}
                      className={`brutal-skill-cube ${cubeColors[(groupIdx * 3 + idx) % cubeColors.length]} text-brutal-black text-center`}
                    >
                      <span className="text-base font-extrabold">{skill.skill_name}</span>
                      {skill.skill_tags && skill.skill_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 justify-center">
                          {skill.skill_tags.map((tag) => (
                            <span key={tag} className="text-xs bg-white/60 px-2 py-0.5 rounded-md border border-brutal-black/15 font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {skills.length === 0 && (
          <div className="text-center py-16">
            <div className="brutal-card p-12 max-w-sm mx-auto">
              <span className="text-5xl mb-4 block">🚧</span>
              <p className="text-lg font-bold text-brutal-black">لا توجد مهارات مضافة بعد</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
