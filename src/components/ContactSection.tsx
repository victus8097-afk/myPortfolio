// ============================================================
// ContactSection.tsx — قسم التواصل
// ============================================================

import type { ContactChannel } from '@/types';
import { MessageCircle, Mail, Phone, Send } from 'lucide-react';

interface ContactSectionProps {
  channels: ContactChannel[];
}

const channelStyles: Record<string, { icon: React.ReactNode; color: string; label: string; emoji: string }> = {
  WhatsApp: { icon: <MessageCircle size={22} />, color: 'bg-green-400', label: 'واتساب', emoji: '💬' },
  Email: { icon: <Mail size={22} />, color: 'bg-sky', label: 'البريد الإلكتروني', emoji: '📧' },
  Phone: { icon: <Phone size={22} />, color: 'bg-warm', label: 'اتصال هاتفي', emoji: '📞' },
};

export default function ContactSection({ channels }: ContactSectionProps) {
  const activeChannels = channels.filter((c) => c.is_active);

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* خلفية — أبيض مع شرائط مائلة */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      <div className="absolute inset-0 stripe-pattern pointer-events-none"></div>
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-coral/12 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-mint/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* العنوان */}
        <div className="text-center mb-14">
          <span className="brutal-tag bg-coral text-brutal-black mb-4 inline-block">📞 التواصل</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brutal-black mb-4">
            لنبني شيئاً معاً
          </h2>
          <p className="text-brutal-black/45 text-lg max-w-xl mx-auto">هل لديك مشروع أو فكرة؟ لا تتردد في التواصل معي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* أزرار التواصل */}
          <div className="lg:col-span-3 space-y-4">
            {activeChannels.map((channel) => {
              const style = channelStyles[channel.channel_name] || {
                icon: <Send size={22} />,
                color: 'bg-gray-300',
                label: channel.channel_name,
                emoji: '🔗',
              };

              let href = '';
              let target = '_self';

              if (channel.channel_name === 'WhatsApp') {
                href = `https://wa.me/${channel.channel_value.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً! زرت موقعك الشخصي وأود التواصل معك 🙋')}`;
                target = '_blank';
              } else if (channel.channel_name === 'Email') {
                href = `mailto:${channel.channel_value}?subject=${encodeURIComponent('تواصل من الموقع الشخصي')}`;
              } else if (channel.channel_name === 'Phone') {
                href = `tel:${channel.channel_value}`;
              }

              return (
                <a
                  key={channel.id}
                  href={href}
                  target={target}
                  rel="noopener noreferrer"
                  className="brutal-card brutal-card-hover p-5 flex items-center gap-5 group bg-white/90 backdrop-blur-sm"
                >
                  <div className={`${style.color} w-14 h-14 rounded-xl border-3 border-brutal-black flex items-center justify-center shrink-0 shadow-[3px_3px_0_#0F0F0F] group-hover:shadow-[5px_5px_0_#0F0F0F] group-hover:-translate-y-0.5 transition-all`}>
                    {style.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-brutal-black text-lg">{style.label}</p>
                    <p className="text-brutal-black/45 text-sm font-medium">
                      {channel.channel_name === 'WhatsApp' ? 'راسلني الآن' : channel.channel_value}
                    </p>
                  </div>
                  <span className="text-2xl">{style.emoji}</span>
                </a>
              );
            })}

            {activeChannels.length === 0 && (
              <div className="text-center py-12 text-brutal-black/50">
                <p>🚧 لا توجد قنوات تواصل مفعلة حالياً</p>
              </div>
            )}
          </div>

          {/* كرت جانبي */}
          <div className="lg:col-span-2 space-y-4">
            <div className="brutal-card p-8 bg-gradient-to-br from-mint/10 via-sky/5 to-warm/10 relative bg-white/90 backdrop-blur-sm">
              <div className="absolute top-3 left-3 w-2 h-2 bg-coral rounded-full border border-brutal-black animate-float"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-mint rounded-full border border-brutal-black animate-float" style={{ animationDelay: '1.5s' }}></div>

              <div className="text-center py-4">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-xl font-extrabold text-brutal-black mb-3">
                  مستعد لعملك القادم!
                </h3>
                <p className="text-brutal-black/50 text-sm leading-relaxed">
                  أرحب بجميع الاستفسارات والفرص التعاونية. رد سريع مضمون ⚡
                </p>
              </div>
            </div>

            <div className="brutal-card p-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-warm rounded-lg border-2 border-brutal-black flex items-center justify-center text-lg shadow-[2px_2px_0_#0F0F0F]">🕐</span>
                <div>
                  <p className="font-bold text-brutal-black text-sm">متاح للتواصل</p>
                  <p className="text-brutal-black/40 text-xs">السبت - الخميس • 9ص - 6م</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
