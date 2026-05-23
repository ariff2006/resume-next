import React from 'react';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface CertsSectionProps {
  data: ResumeData;
  lang: 'th' | 'en' | 'zh';
}

export const CertsSection: React.FC<CertsSectionProps> = ({ data, lang }) => {
  const labels = data.labels[lang] || data.labels.th;

  return (
    <section className="space-y-12">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-4 mb-10 border-b-4 border-slate-900 pb-3">
        <Award className="w-8 h-8 text-slate-900" />
        <h2 className="text-[22px] font-black text-slate-900 uppercase tracking-widest">
          {labels.certsTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.certs.map((c) => {
          const cTr = c.translations[lang] || c.translations.th;
          return (
            <div 
              key={c.id} 
              className={`group flex items-start gap-4 p-6 rounded-xl border border-slate-100 bg-white transition-all duration-300 hover:border-blue-200 hover:shadow-md ${c.file ? 'cursor-pointer' : ''}`}
              onClick={() => c.file && window.open(`/${c.file}`, '_blank')}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-[17px] leading-snug mb-1 group-hover:text-blue-700 transition-colors">{cTr.name}</h4>
                <div className="text-slate-500 font-bold text-[14px] uppercase tracking-wider">{cTr.org}</div>
              </div>
              
              {c.file && (
                <div className="text-slate-300 group-hover:text-blue-400 transition-colors">
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
