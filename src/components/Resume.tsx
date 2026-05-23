'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResumeData } from '@/types/resume';
import { User, Printer, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Sub-components
import { Sidebar } from './resume/Sidebar';
import { ExperienceSection } from './resume/ExperienceSection';
import { CertsSection } from './resume/CertsSection';
import { EducationSection } from './resume/EducationSection';

export default function Resume() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [lang, setLang] = useState<'th' | 'en' | 'zh'>('th');
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('resume-lang') as 'th' | 'en' | 'zh';
    if (saved && ['th', 'en', 'zh'].includes(saved)) {
      setLang(saved);
    }

    // Fetch data from API
    fetch('/api/resume')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(d => setData(d))
      .catch(err => {
        console.error(err);
        setError('ไม่สามารถโหลดข้อมูลจากระบบได้ โปรดลองอีกครั้งภายหลัง');
      });
  }, []);

  const labels = useMemo(() => data?.labels[lang] || data?.labels.th, [data, lang]);
  const pTr = useMemo(() => data?.personal.translations[lang] || data?.personal.translations.th, [data, lang]);

  const handleLangChange = (newLang: 'th' | 'en' | 'zh') => {
    setLang(newLang);
    localStorage.setItem('resume-lang', newLang);
    document.documentElement.lang = newLang;
  };

  if (!mounted || !data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          {error || 'Loading...'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f0f2f5] min-h-screen text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 pb-20 print:p-0 print:bg-white">
      
      {/* NAVIGATION */}
      <nav className="fixed top-6 right-6 z-50 flex items-center gap-3 print:hidden">
        <div className="flex bg-white/80 backdrop-blur-md shadow-2xl rounded-full p-1 border border-white/20 items-center">
          <div className="flex">
            {(['th', 'en', 'zh'] as const).map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-black uppercase transition-all ${
                  lang === l 
                    ? 'bg-[#001f3f] text-white shadow-lg scale-105' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l === 'th' ? 'TH' : l === 'en' ? 'EN' : 'CN'}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-slate-200 mx-2"></div>
          <button 
            onClick={() => window.print()}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            title="Print Resume"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
        <Link href="/admin" className="w-10 h-10 bg-white text-slate-300 hover:text-[#001f3f] rounded-full shadow-lg flex items-center justify-center border border-slate-100 transition-all hover:scale-110 active:scale-95">
          <ShieldCheck className="w-5 h-5" />
        </Link>
      </nav>

      {/* RESUME CONTAINER */}
      <div className="max-w-[1150px] mx-auto pt-10 px-4 sm:px-6 print:pt-0 print:px-0 print:max-w-none">
        <div className="bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row min-h-screen rounded-3xl border border-slate-100 print:shadow-none print:border-none print:rounded-none">
          
          {/* LEFT SIDEBAR (NAVY) */}
          <Sidebar data={data} lang={lang} />

          {/* MAIN CONTENT (WHITE) */}
          <main className="flex-1 p-10 md:p-16 space-y-20 bg-white print:p-12">
            
            {/* SUMMARY SECTION */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b-4 border-slate-900 pb-3">
                <User className="w-8 h-8 text-slate-900" />
                <h2 className="text-[22px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  {labels?.summaryTitle || ''}
                </h2>
              </div>
              <p className="text-[19px] text-slate-700 leading-[1.8] font-medium text-justify">
                 {pTr?.summary || ''}
              </p>
            </section>

            <ExperienceSection data={data} lang={lang} />

            <div className="grid grid-cols-1 gap-20">
              <EducationSection data={data} lang={lang} />
              <CertsSection data={data} lang={lang} />
            </div>

          </main>
        </div>
      </div>

      <footer className="mt-12 text-center text-slate-400 text-sm print:hidden">
        {labels?.footer}
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap');
        
        body {
          background-color: #f0f2f5;
          font-family: 'Sarabun', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        @media print {
          body { background: white !important; }
          @page { margin: 0; size: A4; }
          footer { display: none !important; }
          nav { display: none !important; }
          .min-h-screen { min-height: 0 !important; }
          .pb-20 { padding-bottom: 0 !important; }
        }

        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #001f3f; border-radius: 10px; border: 3px solid #f1f5f9; }
        ::-webkit-scrollbar-thumb:hover { background: #003366; }
      `}</style>
    </div>
  );
}
