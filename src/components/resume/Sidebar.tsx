import React from 'react';
import { Mail, Phone, MapPin, Calendar, Globe, Award, Languages } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { cn } from '@/lib/utils';

interface SidebarProps {
  data: ResumeData;
  lang: 'th' | 'en' | 'zh';
}

export const Sidebar: React.FC<SidebarProps> = ({ data, lang }) => {
  const pTr = data.personal.translations[lang] || data.personal.translations.th;
  const labels = data.labels[lang] || data.labels.th;

  // Split skills into technical and languages
  const technicalSkills = data.skills.filter(s => s.id !== 'sk-8');
  const languageSkills = data.skills.find(s => s.id === 'sk-8');

  const SidebarSection = ({ title, icon: Icon, children, className }: { title: string, icon: any, children: React.ReactNode, className?: string }) => (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3 border-b border-slate-700/50 pb-2">
        <Icon className="w-5 h-5 text-blue-400" />
        <h3 className="text-[14px] font-black text-white uppercase tracking-[0.2em]">
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );

  return (
    <aside className="w-full md:w-[350px] bg-[#001f3f] text-slate-300 flex flex-col print:w-[32%] print:bg-[#001f3f] print:text-white">
      
      {/* Profile Section */}
      <div className="p-10 pb-12 flex flex-col items-center text-center bg-slate-900/20">
        <div className="relative mb-8">
          <div className="w-44 h-44 rounded-full border-4 border-blue-500/30 overflow-hidden shadow-2xl relative z-10">
            <img 
              src={`/${data.personal.photo}`} 
              alt={pTr.name} 
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-[#001f3f] z-20">
            <Globe className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <h1 className="text-[28px] font-black text-white leading-tight mb-2 tracking-tight">
          {pTr.name}
        </h1>
        
        <div className="text-[13px] font-black text-blue-400 uppercase tracking-widest mt-2 border-t border-slate-700/50 pt-3 w-full">
          {pTr.title}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="p-10 space-y-12 flex-1 overflow-y-auto">
        
        {/* Contact Info */}
        <SidebarSection title={lang === 'th' ? 'ข้อมูลติดต่อ' : 'CONTACT'} icon={Globe}>
          <div className="space-y-4">
            {[
              { icon: Mail, value: data.personal.email, link: `mailto:${data.personal.email}` },
              { icon: Phone, value: data.personal.phone, link: `tel:${data.personal.phone}` },
              { icon: MapPin, value: pTr.location },
              { icon: Calendar, value: pTr.dob }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 pt-1">
                  {item.link ? (
                    <a href={item.link} className="text-[15px] font-bold text-slate-300 hover:text-white transition-colors break-all leading-snug">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-[15px] font-bold text-slate-300 leading-snug">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SidebarSection>

        {/* Skills */}
        <SidebarSection title={labels.skillsTitle} icon={Award}>
          <div className="space-y-6">
            {technicalSkills.map((s) => {
              const sTr = s.translations[lang] || s.translations.th;
              return (
                <div key={s.id} className="space-y-2">
                  <h4 className="text-[12px] font-black text-blue-400/80 uppercase tracking-widest">
                    {sTr.label}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(sTr.tags || []).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[13px] font-bold text-white bg-slate-800/50 px-3 py-1 rounded-md border border-slate-700/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SidebarSection>

        {/* Languages */}
        {languageSkills && (
          <SidebarSection title={lang === 'th' ? 'ภาษา' : 'LANGUAGES'} icon={Languages}>
            <div className="space-y-4">
              {((languageSkills.translations[lang] || languageSkills.translations.th).tags || []).map((langItem, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-bold text-white">{langItem.split('(')[0].trim()}</span>
                    <span className="text-[12px] font-bold text-blue-400">{langItem.includes('(') ? langItem.match(/\(([^)]+)\)/)?.[1] : ''}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: langItem.toLowerCase().includes('native') ? '100%' : '30%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

      </div>

      <div className="p-8 text-[11px] font-bold text-slate-500 text-center border-t border-slate-800 bg-slate-900/20 mt-auto">
        PORTFOLIO 2026 • IT MANAGER
      </div>
    </aside>
  );
};
