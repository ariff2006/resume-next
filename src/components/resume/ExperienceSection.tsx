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
    <section className="space-y-16">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-5 mb-14 border-b-4 border-slate-900 pb-4">
        <Briefcase className="w-9 h-9 text-slate-900" />
        <h2 className="text-[26px] font-black text-slate-900 uppercase tracking-widest">
          {labels.experienceTitle}
        </h2>
      </div>

      <div className="space-y-24">
        {data.experience.map((item) => {
          const iTr = item.translations[lang] || item.translations.th;
          return (
            <div key={item.id} className="relative group">
              <div className="flex flex-col gap-8">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-2">
                    <h3 className="text-[30px] font-black text-slate-900 leading-tight">
                      {iTr.title}
                    </h3>
                    <div className="flex items-center gap-3 text-blue-700 font-black text-[20px]">
                      <Building2 className="w-6 h-6" />
                      <span>{iTr.org}</span>
                    </div>
                  </div>
                  <div className="text-slate-500 text-[15px] font-black uppercase tracking-wider bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 whitespace-nowrap shadow-sm">
                    {iTr.meta}
                  </div>
                </div>
                
                {/* Content */}
                <div className="bg-white">
                  <RichText text={iTr.bullets} />
                  
                  {/* Highlights Card */}
                  {iTr.highlight && (
                    <div className="mt-10 bg-blue-50/50 p-8 rounded-2xl border border-blue-100 relative overflow-hidden shadow-sm">
                      <div className="flex items-center gap-3 text-blue-900 font-black text-[16px] uppercase tracking-wide mb-6">
                        <Trophy className="w-6 h-6 text-blue-600" />
                        {labels.keyResult}
                      </div>
                      <div className="relative z-10">
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
