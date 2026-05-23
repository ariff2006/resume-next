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
      <div className="flex items-center gap-6 mb-12 border-b-4 border-slate-900 pb-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
          <Briefcase className="w-9 h-9" />
        </div>
        <h2 className="text-[26px] font-bold text-slate-900 uppercase tracking-widest">
          {labels.experienceTitle}
        </h2>
      </div>

      <div className="space-y-20">
        {data.experience.map((item) => {
          const iTr = item.translations[lang] || item.translations.th;
          return (
            <div key={item.id} className="relative border-l-4 border-slate-100 pl-8 ml-2">
              {/* Timeline Marker */}
              <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-white border-4 border-slate-900 shadow-sm"></div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-2">
                    <h3 className="text-[28px] font-bold text-slate-900 leading-tight">
                      {iTr.title}
                    </h3>
                    <div className="flex items-center gap-3 text-slate-700 font-bold text-[18px]">
                      <Building2 className="w-5 h-5 text-blue-700" />
                      <span className="border-b-2 border-blue-100">{iTr.org}</span>
                    </div>
                  </div>
                  <div className="px-5 py-2 bg-slate-100 text-slate-900 text-[14px] font-bold uppercase tracking-wider rounded border border-slate-200 whitespace-nowrap shadow-sm">
                    {iTr.meta}
                  </div>
                </div>
                
                <div className="bg-white">
                  <RichText text={iTr.bullets} />
                  
                  {iTr.highlight && (
                    <div className="mt-10 bg-slate-50 p-10 rounded-2xl border-2 border-slate-200 relative overflow-hidden shadow-inner">
                      <div className="flex items-center gap-4 text-slate-900 font-bold text-[18px] uppercase tracking-wide mb-6 pb-4 border-b border-slate-300">
                        <Trophy className="w-7 h-7 text-blue-800" />
                        {labels.keyResult}
                      </div>
                      <div className="relative z-10 text-[17px] font-medium text-slate-800 leading-relaxed">
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
