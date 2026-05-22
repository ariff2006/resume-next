'use client';

import React, { useState, useEffect, useMemo } from 'react';
import resumeDataRaw from '@/data/resume-data.json';
import { ResumeData } from '@/types/resume';
import { User, Printer, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Sub-components
import { Sidebar } from './resume/Sidebar';
import { ExperienceSection } from './resume/ExperienceSection';
import { CertsSection } from './resume/CertsSection';

const resumeData = resumeDataRaw as unknown as ResumeData;

export default function Resume() {
  const [lang, setLang] = useState<'th' | 'en' | 'zh'>('th');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('resume-lang') as 'th' | 'en' | 'zh';
    if (saved && ['th', 'en', 'zh'].includes(saved)) {
      setLang(saved);
    }
  }, []);

  const labels = useMemo(() => resumeData.labels[lang] || resumeData.labels.th, [lang]);
  const pTr = useMemo(() => resumeData.personal.translations[lang] || resumeData.personal.translations.th, [lang]);

  if (!mounted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
    </div>
  );

  const handleLangChange = (newLang: 'th' | 'en' | 'zh') => {
    setLang(newLang);
    localStorage.setItem('resume-lang', newLang);
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sarabun text-slate-800 antialiased selection:bg-slate-900 selection:text-white pb-12">
      
      {/* COMPACT NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 py-3 px-6 print:hidden shadow-sm">
        <div className="max-w-[1100px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-400 hover:text-slate-900 transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {(['th', 'en', 'zh'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLangChange(l)}
                  className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-all ${
                    lang === l 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {l === 'th' ? 'TH' : l === 'en' ? 'EN' : 'CN'}
                </button>
              ))}
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-bold transition-all uppercase"
            >
              <Printer className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>
      </nav>

      {/* A4 PAPER CONTAINER */}
      <div className="max-w-[1100px] mx-auto bg-white shadow-md mt-8 flex flex-col md:flex-row print:mt-0 print:shadow-none min-h-screen">
        
        <Sidebar data={resumeData} lang={lang} />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-10 md:p-14 space-y-12 bg-white">
           
           {/* Summary Section */}
           <section>
              <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-900 pb-2">
                <User className="w-5 h-5 text-slate-900" />
                <h2 className="text-[16px] font-bold uppercase tracking-widest text-slate-900">
                  {labels.summaryTitle}
                </h2>
              </div>
              <div className="text-[15px] text-slate-700 leading-relaxed font-medium text-justify">
                 {pTr.summary}
              </div>
           </section>

           <ExperienceSection data={resumeData} lang={lang} />

           <CertsSection data={resumeData} lang={lang} />

        </main>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap');
        
        body {
          background-color: #f1f5f9;
          font-family: 'Sarabun', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* STRICT CORPORATE RULES */
        em, i, .italic { font-style: normal !important; }

        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          @page { margin: 0; size: A4; }
          .max-w-\\[1100px\\] { max-width: 100% !important; margin: 0 !important; }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
