import React from 'react';
import { Briefcase, Building2, Trophy } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { RichText } from './RichText';

interface ExperienceSectionProps {
  data: ResumeData;
  lang: 'th' | 'en' | 'zh';
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data, lang }) => {
  const labels = data.labels[lang] || data.labels.th;

  return (
    <section className="space-y-12">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-4 border-b-4 border-slate-900 pb-3">
        <Briefcase className="w-8 h-8 text-slate-900" />
        <h2 className="text-[22px] font-black text-slate-900 uppercase tracking-[0.2em]">
          {labels.experienceTitle}
        </h2>
      </div>

      <div className="space-y-16">
        {data.experience.map((item) => {
          const iTr = item.translations[lang] || item.translations.th;
          return (
            <div key={item.id} className="relative group">
              <div className="flex flex-col gap-6">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-[24px] font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                      {iTr.title}
                    </h3>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[18px]">
                      <Building2 className="w-5 h-5" />
                      <span>{iTr.org}</span>
                    </div>
                  </div>
                  <div className="text-slate-500 text-[13px] font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 whitespace-nowrap shadow-sm">
                    {iTr.meta}
                  </div>
                </div>
                
                {/* Content */}
                <div className="bg-white pl-0 sm:pl-4 border-l-2 border-slate-50">
                  <div className="text-[17px] text-slate-700 leading-relaxed">
                    <RichText text={iTr.bullets} />
                  </div>
                  
                  {/* Highlights Card */}
                  {iTr.highlight && (
                    <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
                      <div className="flex items-center gap-2 text-slate-900 font-black text-[14px] uppercase tracking-widest mb-4">
                        <Trophy className="w-5 h-5 text-blue-600" />
                        {labels.keyResult}
                      </div>
                      <div className="relative z-10 text-[16px]">
                        <RichText text={iTr.highlight} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
