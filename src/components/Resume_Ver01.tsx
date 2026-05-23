'use client';

import React, { useState, useEffect } from 'react';
import resumeDataRaw from '@/data/resume-data.json';
import { ResumeData } from '@/types/resume';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Cake,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  ExternalLink,
  ChevronRight,
  Check
} from 'lucide-react';

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

  if (!mounted) return <div className="min-h-screen bg-slate-100 flex items-center justify-center">Loading...</div>;

  const labels = resumeData.labels[lang] || resumeData.labels.th;
  const personal = resumeData.personal;
  const pTr = personal.translations[lang] || personal.translations.th;

  const handleLangChange = (newLang: 'th' | 'en' | 'zh') => {
    setLang(newLang);
    localStorage.setItem('resume-lang', newLang);
  };

  const renderRichText = (text: string | string[]) => {
    const lines = Array.isArray(text) ? text : text.split('\n');
    return (
      <div className="space-y-1 text-sm text-slate-600">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          
          if (/^[━─=]{3,}$/.test(trimmed)) return <hr key={i} className="my-3 border-dashed border-slate-300" />;
          if (/^[🔹🔸◆◇►▪]/u.test(trimmed)) return <div key={i} className="font-bold text-slate-800 border-l-4 border-[#c9a961] pl-3 mt-4 mb-2">{trimmed.replace(/^[🔹🔸◆◇►▪]\s*/u, '')}</div>;
          if (/^★/.test(trimmed)) return <div key={i} className="font-bold text-[#0f2942] my-2">★ {trimmed.replace(/^★\s*/, '')}</div>;
          if (/^[✓✔]/.test(trimmed)) return <div key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /><span>{trimmed.replace(/^[✓✔]\s*/, '')}</span></div>;
          if (/^[➤►▶]/.test(trimmed)) return <div key={i} className="flex items-start gap-2 font-semibold text-[#0f2942]"><ChevronRight className="w-4 h-4 text-[#c9a961] mt-0.5 flex-shrink-0" /><span>{trimmed.replace(/^[➤►▶]\s*/, '')}</span></div>;
          if (/^\d+\.\s/.test(trimmed)) return <div key={i} className="font-bold text-[#0f2942] mt-3 mb-1">{trimmed}</div>;
          if (/^[•○]\s/.test(trimmed)) return <div key={i} className="flex items-start gap-2 pl-4 text-slate-500 text-xs"><span>•</span><span>{trimmed.replace(/^[•○]\s*/, '')}</span></div>;
          if (/^[*-–]\s/.test(trimmed)) return <div key={i} className="flex items-start gap-2 pl-2"><span>•</span><span>{trimmed.replace(/^[*-–]\s*/, '')}</span></div>;
          
          return <div key={i} className="flex items-start gap-2 pl-2"><span>•</span><span>{trimmed}</span></div>;
        })}
      </div>
    );
  };

  return (
    <div className="max-w-[1100px] mx-auto p-4 md:p-6 lg:p-8 font-sans">
      {/* Top Bar */}
      <div className="flex justify-end mb-6 gap-2">
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex">
          {(['th', 'en', 'zh'] as const).map((l) => (
            <button
              key={l}
              onClick={() => handleLangChange(l)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                lang === l 
                  ? 'bg-[#0f2942] text-white shadow-md' 
                  : 'text-slate-500 hover:text-[#0f2942]'
              }`}
            >
              {l === 'th' ? 'ไทย' : l === 'en' ? 'EN' : '中文'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Resume Sheet */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[1000px]">
        {/* Sidebar */}
        <aside className="w-full md:w-[320px] bg-gradient-to-b from-[#0f2942] to-[#1e3a5f] text-slate-200 p-8 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#c9a961]/10 blur-3xl" />
          
          <div className="relative z-10">
            {/* Photo */}
            <div className="flex justify-center mb-6">
              {personal.photo ? (
                <img 
                  src={`/${personal.photo}`} 
                  alt={pTr.name} 
                  className="w-40 h-40 rounded-full object-cover border-4 border-[#c9a961] shadow-xl bg-white"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-white/10 border-4 border-[#c9a961] flex items-center justify-center shadow-xl">
                  <User className="w-20 h-20 text-slate-400" />
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2 leading-tight">{pTr.name}</h1>
              <div className="text-[#c9a961] text-xs font-semibold uppercase tracking-widest border-b border-white/10 pb-6 mb-6">
                {pTr.title}
              </div>
            </div>

            {/* Contact */}
            <div className="mb-8">
              <h2 className="text-[#c9a961] text-[11px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#c9a961]/30 pb-2">
                <Mail className="w-4 h-4" />
                {lang === 'th' ? 'ติดต่อ' : lang === 'en' ? 'Contact' : '联系方式'}
              </h2>
              <div className="space-y-3 text-sm">
                <a href={`mailto:${personal.email}`} className="flex items-start gap-3 hover:text-[#c9a961] transition-colors">
                  <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-[#c9a961]" />
                  <span className="break-all">{personal.email}</span>
                </a>
                <a href={`tel:${personal.phone}`} className="flex items-start gap-3 hover:text-[#c9a961] transition-colors">
                  <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-[#c9a961]" />
                  <span>{personal.phone}</span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[#c9a961]" />
                  <span>{pTr.location}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Cake className="w-4 h-4 mt-1 flex-shrink-0 text-[#c9a961]" />
                  <span>{pTr.dob}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-[#c9a961] text-[11px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#c9a961]/30 pb-2">
                <Briefcase className="w-4 h-4" />
                {labels.skillsTitle}
              </h2>
              <div className="space-y-4">
                {resumeData.skills.map((s) => {
                  const sTr = s.translations[lang] || s.translations.th;
                  return (
                    <div key={s.id}>
                      <div className="text-[#c9a961] text-[10px] font-bold uppercase tracking-wider mb-2">
                        {sTr.label}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="bg-white/10 text-slate-100 text-[10px] px-2 py-0.5 rounded border border-white/10 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 bg-white">
          {/* About Me */}
          <section className="mb-10">
            <h2 className="text-[#0f2942] text-[13px] font-bold uppercase tracking-[0.15em] mb-4 flex items-center gap-3 relative pb-3 border-b-2 border-[#0f2942]">
              <User className="w-5 h-5 text-[#c9a961]" />
              {labels.summaryTitle}
              <div className="absolute bottom-[-2px] left-0 w-16 h-0.5 bg-[#c9a961]" />
            </h2>
            <p className="text-slate-600 leading-relaxed text-justify text-[14.5px]">
              {pTr.summary}
            </p>
          </section>

          {/* Experience */}
          <section className="mb-10">
            <h2 className="text-[#0f2942] text-[13px] font-bold uppercase tracking-[0.15em] mb-6 flex items-center gap-3 relative pb-3 border-b-2 border-[#0f2942]">
              <Briefcase className="w-5 h-5 text-[#c9a961]" />
              {labels.experienceTitle}
              <div className="absolute bottom-[-2px] left-0 w-16 h-0.5 bg-[#c9a961]" />
            </h2>
            <div className="relative pl-6 space-y-8 before:absolute before:left-[6px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#0f2942] before:to-[#c9a961]">
              {resumeData.experience.map((item) => {
                const iTr = item.translations[lang] || item.translations.th;
                return (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[24px] top-1 w-[14px] h-[14px] rounded-full bg-white border-2 border-[#c9a961] shadow-[0_0_0_4px_white,0_2px_8px_rgba(201,169,97,0.4)] z-10" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                      <h3 className="font-bold text-[#0f2942] text-lg">{iTr.title}</h3>
                      <span className="text-[10px] font-bold text-[#c9a961] bg-[#c9a961]/10 px-2 py-0.5 rounded border border-[#c9a961]/20 uppercase tracking-wider">
                        {iTr.meta}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm mb-3">
                      <Briefcase className="w-3.5 h-3.5" />
                      {iTr.org}
                    </div>
                    <div>{renderRichText(iTr.bullets)}</div>
                    {iTr.highlight && (
                      <div className="mt-4 bg-amber-50 border-l-4 border-[#c9a961] p-4 rounded-r-lg shadow-sm">
                        <div className="flex items-center gap-2 text-[#0f2942] font-bold text-xs uppercase tracking-wider mb-2">
                          <Trophy className="w-4 h-4 text-[#c9a961]" />
                          {labels.keyResult}
                        </div>
                        {renderRichText(iTr.highlight)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Education */}
          <section className="mb-10">
            <h2 className="text-[#0f2942] text-[13px] font-bold uppercase tracking-[0.15em] mb-6 flex items-center gap-3 relative pb-3 border-b-2 border-[#0f2942]">
              <GraduationCap className="w-5 h-5 text-[#c9a961]" />
              {labels.educationTitle}
              <div className="absolute bottom-[-2px] left-0 w-16 h-0.5 bg-[#c9a961]" />
            </h2>
            <div className="relative pl-6 space-y-6 before:absolute before:left-[6px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#0f2942] before:to-[#c9a961]">
              {resumeData.education.map((item) => {
                const eTr = item.translations[lang] || item.translations.th;
                return (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[24px] top-1 w-[14px] h-[14px] rounded-full bg-white border-2 border-[#c9a961] shadow-[0_0_0_4px_white,0_2px_8px_rgba(201,169,97,0.4)] z-10" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                      <h3 className="font-bold text-[#0f2942] text-md">{eTr.title}</h3>
                      <span className="text-[10px] font-bold text-[#c9a961] bg-[#c9a961]/10 px-2 py-0.5 rounded border border-[#c9a961]/20 uppercase tracking-wider">
                        {eTr.meta}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {eTr.org}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Certifications */}
          <section>
            <h2 className="text-[#0f2942] text-[13px] font-bold uppercase tracking-[0.15em] mb-6 flex items-center gap-3 relative pb-3 border-b-2 border-[#0f2942]">
              <Award className="w-5 h-5 text-[#c9a961]" />
              {labels.certsTitle}
              <div className="absolute bottom-[-2px] left-0 w-16 h-0.5 bg-[#c9a961]" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resumeData.certs.map((c) => {
                const cTr = c.translations[lang] || c.translations.th;
                return (
                  <div 
                    key={c.id} 
                    className={`flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 transition-all hover:bg-white hover:border-[#c9a961] hover:shadow-lg group ${c.file ? 'cursor-pointer' : ''}`}
                    onClick={() => c.file && window.open(`/${c.file}`, '_blank')}
                  >
                    <div className="bg-gradient-to-br from-[#0f2942] to-[#1e3a5f] p-2 rounded-lg text-[#c9a961] shadow-sm">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#0f2942] text-xs leading-tight mb-1">
                        {cTr.name}
                        {c.file && (
                          <span className="ml-2 inline-flex items-center gap-1 bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                            <ExternalLink className="w-2.5 h-2.5" /> View
                          </span>
                        )}
                      </h4>
                      <div className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {cTr.org}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      <footer className="mt-8 text-center text-slate-400 text-[10px] font-medium">
        {labels.footer}
      </footer>
    </div>
  );
}
