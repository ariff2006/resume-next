'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResumeData } from '@/types/resume';
import { User, Printer, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Sub-components
import { Sidebar } from './resume/Sidebar';
import { ExperienceSection } from './resume/ExperienceSection';
import { CertsSection } from './resume/CertsSection';

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
    <div className="bg-slate-100 min-h-screen text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 pb-20">
      
      {/* CLEAN NAVIGATION */}
      <nav className="fixed top-6 right-6 z-50 flex items-center gap-3 print:hidden">
        <div className="flex bg-white shadow-xl rounded-full p-1 border border-slate-200 items-center">
          <div className="flex">
            {(['th', 'en', 'zh'] as const).map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold uppercase transition-all ${
                  lang === l 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-600'
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
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
        <Link href="/admin" className="w-10 h-10 bg-white text-slate-300 hover:text-slate-900 rounded-full shadow-lg flex items-center justify-center border border-slate-100 transition-all">
          <ShieldCheck className="w-5 h-5" />
        </Link>
      </nav>

      {/* PORTFOLIO CONTAINER */}
      <div className="max-w-[1080px] mx-auto pt-10 px-4 sm:px-6">
        <div className="bg-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-screen rounded-2xl border border-slate-100 print:shadow-none print:border-none print:rounded-none">
          
          <Sidebar data={data} lang={lang} />

          {/* MAIN CONTENT */}
          <main className="flex-1 p-12 md:p-16 space-y-24 bg-white">
            
            {/* ABOUT ME SECTION */}
            <section className="space-y-10">
              <div className="flex items-center gap-5 border-b-4 border-slate-900 pb-4">
                <User className="w-9 h-9 text-slate-900" />
                <h2 className="text-[24px] font-black text-slate-900 uppercase tracking-widest">
                  {labels?.summaryTitle || ''}
                </h2>
              </div>
              <p className="text-[21px] text-slate-700 leading-[1.9] font-medium text-justify">
                 {pTr?.summary || ''}
              </p>
            </section>

            <ExperienceSection data={data} lang={lang} />

            <CertsSection data={data} lang={lang} />

          </main>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap');
        
        body {
          background-color: #f1f5f9;
          font-family: 'Sarabun', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        @media print {
          body { background: white !important; }
          @page { margin: 0; size: A4; }
          .max-w-\\[1200px\\] { max-width: 100% !important; width: 100% !important; pt: 0 !important; }
          main { padding: 40px !important; }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
