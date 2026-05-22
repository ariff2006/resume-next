import React from 'react';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface SidebarProps {
  data: ResumeData;
  lang: 'th' | 'en' | 'zh';
}

export const Sidebar: React.FC<SidebarProps> = ({ data, lang }) => {
  const pTr = data.personal.translations[lang] || data.personal.translations.th;
  const labels = data.labels[lang] || data.labels.th;

  const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="space-y-6">
      <h3 className="text-[16px] font-bold text-slate-900 uppercase tracking-[0.1em] border-b-2 border-slate-900 pb-2">
        {title}
      </h3>
      <div className="space-y-5">{children}</div>
    </section>
  );

  return (
    <aside className="w-full md:w-[350px] bg-white border-r-2 border-slate-100 flex flex-col print:bg-white">
      
      {/* Profile Section - High Contrast */}
      <div className="p-10 pb-8 flex flex-col items-center text-center bg-slate-50 border-b border-slate-100">
        <div className="w-44 h-44 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white mb-6">
          <img 
            src={`/${data.personal.photo}`} 
            alt={pTr.name} 
            className="w-full h-full object-cover object-top"
          />
        </div>
        
        <h1 className="text-[28px] font-bold text-slate-900 leading-tight mb-2 uppercase tracking-tight">
          {pTr.name}
        </h1>
        
        <div className="text-[15px] font-bold text-slate-700 uppercase tracking-widest border-y border-slate-300 py-2 w-full mt-2">
          {pTr.title}
        </div>
      </div>

      {/* Sidebar Content - Large Text */}
      <div className="p-10 space-y-12 flex-1">
        
        {/* Contact Info */}
        <SidebarSection title={lang === 'th' ? 'ข้อมูลติดต่อ' : 'CONTACT INFO'}>
          <div className="space-y-5">
            {[
              { icon: Mail, value: data.personal.email, link: `mailto:${data.personal.email}` },
              { icon: Phone, value: data.personal.phone, link: `tel:${data.personal.phone}` },
              { icon: MapPin, value: pTr.location },
              { icon: Calendar, value: pTr.dob }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 flex-shrink-0 border border-slate-200">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 pt-0.5">
                  {item.link ? (
                    <a href={item.link} className="text-[17px] font-bold text-slate-800 hover:text-blue-700 transition-colors break-all leading-snug underline decoration-slate-200 underline-offset-4">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-[17px] font-bold text-slate-800 leading-snug">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SidebarSection>

        {/* Skills - Bold & Clear */}
        <SidebarSection title={labels.skillsTitle}>
          <div className="space-y-8">
            {data.skills.map((s) => {
              const sTr = s.translations[lang] || s.translations.th;
              return (
                <div key={s.id} className="space-y-3">
                  <h4 className="text-[14px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                    {sTr.label}
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {s.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[15px] font-bold text-slate-900 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all hover:bg-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SidebarSection>

        {/* Education */}
        <SidebarSection title={labels.educationTitle}>
          <div className="space-y-8">
            {data.education.map((item) => {
              const eTr = item.translations[lang] || item.translations.th;
              return (
                <div key={item.id} className="space-y-2 border-l-4 border-slate-100 pl-4">
                  <div className="text-[13px] font-bold text-blue-800 uppercase tracking-wider">{eTr.meta}</div>
                  <h4 className="text-[17px] font-bold text-slate-900 leading-snug">{eTr.title}</h4>
                  <div className="text-[15px] font-medium text-slate-600 leading-relaxed">{eTr.org}</div>
                </div>
              );
            })}
          </div>
        </SidebarSection>

      </div>

      <div className="p-8 text-[12px] font-bold text-slate-400 text-center border-t border-slate-100 mt-auto bg-slate-50">
        {labels.footer.split('—')[0]}
      </div>
    </aside>
  );
};
