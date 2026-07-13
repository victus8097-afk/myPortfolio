// ============================================================
// ContactSection.tsx — قسم التواصل
// ============================================================

import type { ReactNode } from 'react';
import type { ContactChannel } from '@/types';
import { MessageCircle, Mail, Phone, Send } from 'lucide-react';

interface ContactSectionProps {
  channels: ContactChannel[];
}

const channelStyles: Record<string, { icon: ReactNode; color: string; label: string }> = {
  WhatsApp: { icon: <MessageCircle size={22} />, color: 'bg-green-400', label: 'واتساب' },
  Email: { icon: <Mail size={22} />, color: 'bg-sky', label: 'البريد الإلكتروني' },
  Phone: { icon: <Phone size={22} />, color: 'bg-warm', label: 'اتصال هاتفي' },
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
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brutal-black mb-4">
            لنبني شيئاً معاً
          </h2>
          <p className="text-brutal-black/45 text-lg max-w-xl mx-auto">
            هل لديك مشروع أو فكرة؟ لا تتردد في التواصل معي
          </p>
        </div>

        {/* قنوات التواصل في شبكة واحدة */}
        {activeChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto items-stretch">
            {activeChannels.map((channel) => {
              const style = channelStyles[channel.channel_name] || {
                icon: <Send size={22} />,
                color: 'bg-gray-300',
                label: channel.channel_name,
              };

              let href = '';
              let target = '_self';

              if (channel.channel_name === 'WhatsApp') {
                href = `https://wa.me/${channel.channel_value.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً! زرت موقعك الشخصي وأود التواصل معك')}`;
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
                  className="brutal-card brutal-card-hover p-5 flex items-center gap-4 group bg-white/90 backdrop-blur-sm min-h-[108px]"
                >
                  <div className={`${style.color} w-12 h-12 rounded-xl border-3 border-brutal-black flex items-center justify-center shrink-0 shadow-[3px_3px_0_#0F0F0F] group-hover:shadow-[5px_5px_0_#0F0F0F] group-hover:-translate-y-0.5 transition-all`}>
                    {style.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-brutal-black text-base">{style.label}</p>
                    <p className="text-brutal-black/45 text-sm font-medium truncate">
                      {channel.channel_name === 'WhatsApp' ? 'راسلني الآن' : channel.channel_value}
                    </p>
                  </div>
                  <span className="text-xl text-brutal-black/30 transition-transform group-hover:-translate-x-1" aria-hidden="true">
                    ←
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-brutal-black/50">
            <p>لا توجد قنوات تواصل مفعلة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
}
