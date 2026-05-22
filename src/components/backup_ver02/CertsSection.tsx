import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface CertsSectionProps {
  data: ResumeData;
  lang: 'th' | 'en' | 'zh';
}

export const CertsSection: React.FC<CertsSectionProps> = ({ data, lang }) => {
  const labels = data.labels[lang] || data.labels.th;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-slate-900 pb-2">
        <Award className="w-5 h-5 text-slate-900" />
        <h2 className="text-[16px] font-bold text-slate-900 uppercase tracking-widest">
          {labels.certsTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.certs.map((c) => {
          const cTr = c.translations[lang] || c.translations.th;
          return (
            <div 
              key={c.id} 
              className={`flex items-start gap-4 p-4 rounded border border-slate-200 bg-white transition-all hover:bg-slate-50 ${c.file ? 'cursor-pointer hover:border-slate-400' : ''}`}
              onClick={() => c.file && window.open(`/${c.file}`, '_blank')}
            >
              <Award className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-[14px] leading-tight mb-1">{cTr.name}</h4>
                <div className="text-slate-500 text-[12px]">{cTr.org}</div>
              </div>
              
              {c.file && (
                <div className="text-slate-300">
                  <ExternalLink className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
