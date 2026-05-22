'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResumeData } from '@/types/resume';
import { User, Printer, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
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

    // Fetch data from API (Supabase)
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

  if (!mounted || !data) return (
    <div className="min-h-screen bg-[#0a1120] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-[#c9a961]/20 border-t-[#c9a961] rounded-full animate-spin"></div>
        <p className="text-[#c9a961] font-black uppercase tracking-[0.4em] text-xs">
          {error || 'Loading Professional Data...'}
        </p>
      </div>
    </div>
  );

  const handleLangChange = (newLang: 'th' | 'en' | 'zh') => {
    setLang(newLang);
    localStorage.setItem('resume-lang', newLang);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-prompt text-slate-800 antialiased selection:bg-[#c9a961] selection:text-slate-900">
      
      {/* COMPACT NAV */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl flex items-center gap-4 print:hidden transition-all hover:bg-slate-900">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/20 hover:text-white transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-0.5 bg-white/5 p-0.5 rounded-full">
            {(['th', 'en', 'zh'] as const).map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                  lang === l 
                    ? 'bg-[#c9a961] text-slate-900 shadow-md' 
                    : 'text-white/30 hover:text-white'
                }`}
              >
                {l === 'th' ? 'TH' : l === 'en' ? 'EN' : 'CN'}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-white/50 hover:text-[#c9a961] text-[10px] font-black transition-all uppercase tracking-widest group"
          >
            <Printer className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> 
            <span className="hidden xs:inline">PDF</span>
          </button>
        </div>
      </nav>

      <div className="max-w-[1240px] mx-auto bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] my-12 md:my-20 overflow-hidden flex flex-col md:flex-row print:my-0 print:shadow-none min-h-screen rounded-[48px] print:rounded-none border border-slate-100 relative">
        
        <Sidebar data={data} lang={lang} />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-10 md:p-20 lg:p-24 space-y-24 bg-white relative">
           {/* Decorative Background Elements */}
           <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none">
              <Sparkles className="w-96 h-96" />
           </div>
           
           {/* Executive Summary Section */}
           <section className="relative">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-14 h-14 rounded-3xl bg-[#0a1120] text-[#c9a961] flex items-center justify-center shadow-xl shadow-blue-900/10">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-[20px] md:text-[22px] font-black text-slate-900 uppercase tracking-tight mb-1">
                    {labels?.summaryTitle || ''}
                  </h2>
                  <div className="h-1.5 w-20 bg-[#c9a961] rounded-full"></div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-12 top-0 bottom-0 w-1.5 bg-slate-100 rounded-full"></div>
                <p className="text-[18px] md:text-[20px] text-slate-700 leading-[1.8] font-medium text-justify">
                   {pTr?.summary || ''}
                </p>
              </div>
           </section>

           <ExperienceSection data={data} lang={lang} />

           <CertsSection data={data} lang={lang} />

           {/* Brand Logos */}
           <div className="pt-20 flex flex-wrap justify-center items-center gap-20 opacity-20 grayscale filter transition-all hover:opacity-100 hover:grayscale-0 print:hidden">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Cisco_logo.svg" className="h-8" alt="Cisco" />
              <img src="https://www.fortinet.com/content/dam/fortinet/images/logos/fortinet-logo-rgb.svg" className="h-6" alt="Fortinet" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="h-6" alt="Microsoft" />
           </div>
        </main>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .font-prompt { font-family: 'Prompt', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }

        body {
          background-color: #f1f5f9;
          font-family: 'Prompt', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* STRICT PROFESSIONAL RULES */
        em, i { font-style: italic; }

        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          @page { margin: 1cm; size: A4; }
          .max-w-\\[1240px\\] { max-width: 100% !important; margin: 0 !important; }
          main { padding: 40px !important; }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #0a1120; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #1e293b; }
      `}</style>
    </div>
  );
}
