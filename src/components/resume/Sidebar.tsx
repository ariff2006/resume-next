import React from 'react';
import { Mail, Phone, MapPin, Calendar, Globe, Award, GraduationCap } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface SidebarProps {
  data: ResumeData;
  lang: 'th' | 'en' | 'zh';
}

export const Sidebar: React.FC<SidebarProps> = ({ data, lang }) => {
  const pTr = data.personal.translations[lang] || data.personal.translations.th;
  const labels = data.labels[lang] || data.labels.th;

  const SidebarSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-2">
        <Icon className="w-5 h-5 text-blue-700" />
        <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-[0.1em]">
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );

  return (
    <aside className="w-full md:w-[320px] bg-white border-r-2 border-slate-100 flex flex-col print:border-none print:w-[30%]">
      
      {/* Profile Section */}
      <div className="p-10 pb-8 flex flex-col items-center text-center bg-slate-50/50 border-b border-slate-100">
        <div className="w-48 h-56 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white mb-6">
          <img 
            src={`/${data.personal.photo}`} 
            alt={pTr.name} 
            className="w-full h-full object-cover object-top"
          />
        </div>
        
        <h1 className="text-[30px] font-black text-slate-900 leading-tight mb-2 tracking-tight">
          {pTr.name}
        </h1>
        
        <div className="text-[15px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-5 py-2 rounded-full border border-blue-100 mt-2">
          {pTr.title}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="p-10 space-y-14 flex-1">
        
        {/* Contact Info */}
        <SidebarSection title={lang === 'th' ? 'ข้อมูลติดต่อ' : 'CONTACT'} icon={Globe}>
          <div className="space-y-5">
            {[
              { icon: Mail, value: data.personal.email, link: `mailto:${data.personal.email}` },
              { icon: Phone, value: data.personal.phone, link: `tel:${data.personal.phone}` },
              { icon: MapPin, value: pTr.location },
              { icon: Calendar, value: pTr.dob }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 border border-slate-200">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 pt-0.5">
                  {item.link ? (
                    <a href={item.link} className="text-[17px] font-bold text-slate-800 hover:text-blue-700 transition-colors break-all leading-snug">
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

        {/* Skills */}
        <SidebarSection title={labels.skillsTitle} icon={Award}>
          <div className="space-y-8">
            {data.skills.map((s) => {
              const sTr = s.translations[lang] || s.translations.th;
              return (
                <div key={s.id} className="space-y-3">
                  <h4 className="text-[14px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {sTr.label}
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {(sTr.tags || []).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[15px] font-bold text-slate-900 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all hover:bg-slate-100">
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
        <SidebarSection title={labels.educationTitle} icon={GraduationCap}>
          <div className="space-y-8">
            {data.education.map((item) => {
              const eTr = item.translations[lang] || item.translations.th;
              return (
                <div key={item.id} className="space-y-2 border-l-4 border-blue-100 pl-5">
                  <div className="text-[13px] font-black text-blue-600 uppercase tracking-wider">{eTr.meta}</div>
                  <h4 className="text-[18px] font-black text-slate-900 leading-snug">{eTr.title}</h4>
                  <div className="text-[16px] font-bold text-slate-500 leading-relaxed">{eTr.org}</div>
                </div>
              );
            })}
          </div>
        </SidebarSection>

      </div>

      <div className="p-8 text-[12px] font-bold text-slate-400 text-center border-t border-slate-100 mt-auto bg-slate-50/50">
        Professional Profile 2026
      </div>
    </aside>
  );
};
