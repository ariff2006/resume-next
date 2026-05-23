'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import { 
  Save, 
  ArrowLeft, 
  Loader2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Settings, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Globe, 
  LayoutDashboard, 
  FileText,
  ShieldCheck,
  Menu
} from 'lucide-react';
import Link from 'next/link';

type Section = 'personal' | 'experience' | 'education' | 'skills' | 'certs';
type Language = 'th' | 'en' | 'zh';

export default function AdminPage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [activeLang, setActiveLang] = useState<Language>('th');
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/resume')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setMessage({ text: 'บันทึกข้อมูลสำเร็จ', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: 'เกิดข้อผิดพลาดในการบันทึก', type: 'error' });
      }
    } catch (e) {
      setMessage({ text: 'Error saving data', type: 'error' });
    }
    setSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'certs', callback: (path: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(type);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.ok) {
        callback(result.path);
        setMessage({ text: 'อัปโหลดสำเร็จ!', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: result.error || 'อัปโหลดล้มเหลว', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ', type: 'error' });
    } finally {
      setUploading(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-prompt text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 pb-20">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Console...</p>
      </div>
    </div>
  );

  if (!data) return <div className="p-20 text-center font-bold text-red-500 font-prompt">Failed to load system data.</div>;

  const NavItem = ({ section, icon: Icon, label }: { section: Section, icon: any, label: string }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
        activeSection === section 
          ? 'bg-slate-900 text-white shadow-lg translate-x-1' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeSection === section ? 'text-white' : 'text-slate-400'}`} />
      <span className="font-bold text-[18px]">{label}</span>
    </button>
  );

  const LangTabs = () => (
    <div className="flex gap-2 bg-slate-100 p-1.5 rounded-full mb-10 w-fit border border-slate-200">
      {(['th', 'en', 'zh'] as const).map(l => (
        <button
          key={l}
          onClick={() => setActiveLang(l)}
          className={`px-8 py-2 rounded-full text-[14px] font-black uppercase transition-all ${
            activeLang === l 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {l === 'th' ? 'Thai' : l === 'en' ? 'English' : 'Chinese'}
        </button>
      ))}
    </div>
  );

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-5 border-b-4 border-slate-900 pb-4 mb-10">
      <Icon className="w-8 h-8 text-slate-900" />
      <h3 className="text-[28px] font-black text-slate-900 uppercase tracking-widest">{title}</h3>
    </div>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[16px] font-black text-slate-500 uppercase tracking-wide block mb-2">
      {children}
    </label>
  );

  const updatePersonal = (field: string, value: any, isTranslatable = false) => {
    const newData = { ...data };
    if (isTranslatable) {
      const [lang, key] = field.split('.');
      (newData.personal.translations as any)[lang][key] = value;
    } else {
      (newData.personal as any)[field] = value;
    }
    setData(newData);
  };

  const addItem = (section: 'experience' | 'education' | 'skills' | 'certs') => {
    const newData = { ...data };
    const id = `${section.substring(0, 3)}-${Date.now()}`;
    let newItem: any;
    
    if (section === 'experience') {
      newItem = { id, translations: { th: { title: '', org: '', meta: '', bullets: [] }, en: { title: '', org: '', meta: '', bullets: [] }, zh: { title: '', org: '', meta: '', bullets: [] } } };
    } else if (section === 'education') {
      newItem = { id, translations: { th: { title: '', org: '', meta: '' }, en: { title: '', org: '', meta: '' }, zh: { title: '', org: '', meta: '' } } };
    } else if (section === 'skills') {
      newItem = { id, tags: [], translations: { th: { label: '' }, en: { label: '' }, zh: { label: '' } } };
    } else if (section === 'certs') {
      newItem = { id, translations: { th: { name: '', org: '' }, en: { name: '', org: '' }, zh: { name: '', org: '' } } };
    }
    
    (newData[section] as any).push(newItem);
    setData(newData);
  };

  const removeItem = (section: 'experience' | 'education' | 'skills' | 'certs', id: string) => {
    if (!confirm('ยืนยันการลบ?')) return;
    const newData = { ...data };
    (newData[section] as any) = (newData[section] as any).filter((item: any) => item.id !== id);
    setData(newData);
  };

  const moveItem = (section: 'experience', index: number, direction: 'up' | 'down') => {
    const newData = { ...data };
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newData[section].length) return;
    const temp = newData[section][index];
    newData[section][index] = newData[section][targetIndex];
    newData[section][targetIndex] = temp;
    setData(newData);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 antialiased font-sarabun selection:bg-blue-100 selection:text-blue-900">
      
      {/* ALIGNED SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-r-2 border-slate-200 flex flex-col shadow-sm print:hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[20px] text-slate-900 tracking-tight leading-none uppercase">Admin</span>
            <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest mt-1">Management</span>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <NavItem section="personal" icon={User} label="ข้อมูลส่วนตัว" />
          <NavItem section="experience" icon={Briefcase} label="ประสบการณ์ทำงาน" />
          <NavItem section="education" icon={GraduationCap} label="การศึกษา" />
          <NavItem section="skills" icon={Settings} label="ทักษะ" />
          <NavItem section="certs" icon={Award} label="ใบรับรอง / อบรม" />
          
          <div className="pt-8 mt-8 border-t border-slate-100">
            <Link href="/" className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-slate-900 transition-all text-sm font-bold group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> ดูหน้า Resume
            </Link>
          </div>
        </nav>
      </aside>

      {/* MAIN EDITOR AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="bg-white h-20 border-b-2 border-slate-100 flex items-center justify-between px-10 sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-4">
            <Menu className="w-5 h-5 text-slate-300" />
            <h2 className="font-black text-slate-900 text-[20px] uppercase tracking-widest">{activeSection}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            {message && (
              <div className={`px-6 py-2 rounded-full text-[14px] font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-4 ${
                message.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {message.text}
              </div>
            )}
            <button 
              onClick={handleSave} 
              disabled={saving} 
              className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-3 rounded-full font-black text-[15px] uppercase tracking-widest shadow-xl disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Save className="w-5 h-5" />}
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 md:p-14 bg-slate-50/50">
          <div className="max-w-[1100px] mx-auto w-full space-y-12 pb-32">
            
            <div className="flex items-center justify-between">
               <LangTabs />
               <span className="text-[13px] font-black text-slate-300 uppercase tracking-widest">Editing Workspace v2.0</span>
            </div>

            {/* PERSONAL SECTION */}
            {activeSection === 'personal' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <SectionHeader icon={User} title="Personal Details" />
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 flex flex-col md:flex-row gap-16">
                  <div className="flex flex-col items-center gap-6 flex-shrink-0">
                    <div className="w-52 h-64 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-lg bg-slate-100">
                      <img src={`/${data.personal.photo || 'photos/placeholder.jpg'}`} className="w-full h-full object-cover object-top" />
                    </div>
                    {uploading === 'photos' && <Loader2 className="w-8 h-8 animate-spin text-blue-600" />}
                    <label className="cursor-pointer text-[14px] font-black text-blue-700 hover:underline uppercase tracking-wider">
                      Change Profile Photo <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photos', (path) => updatePersonal('photo', path))} />
                    </label>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-1">
                      <Label>Email Address</Label>
                      <input className="w-full px-6 py-3 border-b-2 border-slate-100 focus:border-slate-900 outline-none transition-all text-slate-900 font-bold text-[20px] bg-transparent" value={data.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Phone Number</Label>
                      <input className="w-full px-6 py-3 border-b-2 border-slate-100 focus:border-slate-900 outline-none transition-all text-slate-900 font-bold text-[20px] bg-transparent" value={data.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
                    </div>
                    
                    <div className="md:col-span-2 pt-10 space-y-12">
                      <div className="space-y-1">
                        <Label>Full Name ({activeLang.toUpperCase()})</Label>
                        <input className="w-full px-6 py-3 border-b-4 border-slate-100 focus:border-slate-900 outline-none transition-all text-[30px] text-slate-900 font-black bg-transparent" value={data.personal.translations[activeLang].name} onChange={(e) => updatePersonal(`${activeLang}.name`, e.target.value, true)} />
                      </div>
                      <div className="space-y-1">
                        <Label>Job Title</Label>
                        <input className="w-full px-6 py-3 border-b-2 border-slate-100 focus:border-slate-900 outline-none transition-all text-slate-900 font-bold text-[20px] bg-transparent" value={data.personal.translations[activeLang].title} onChange={(e) => updatePersonal(`${activeLang}.title`, e.target.value, true)} />
                      </div>
                      <div className="space-y-3">
                        <Label>Executive Summary</Label>
                        <textarea rows={12} className="w-full p-8 rounded-3xl border-2 border-slate-100 focus:border-slate-900 outline-none transition-all text-slate-700 font-medium text-[19px] leading-relaxed bg-slate-50/30" value={data.personal.translations[activeLang].summary} onChange={(e) => updatePersonal(`${activeLang}.summary`, e.target.value, true)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EXPERIENCE SECTION */}
            {activeSection === 'experience' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <SectionHeader icon={Briefcase} title="Experience Timeline" />
                  <button onClick={() => addItem('experience')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-black text-[14px] uppercase tracking-wider shadow-lg flex items-center gap-3">
                    <Plus className="w-5 h-5" /> Add New Role
                  </button>
                </div>
                
                <div className="space-y-12">
                  {data.experience.map((item, idx) => (
                    <div key={item.id} className="bg-white rounded-[2rem] border-2 border-slate-100 p-12 space-y-12 shadow-sm relative overflow-hidden">
                      <div className="flex justify-between items-start border-b-2 border-slate-50 pb-6">
                        <span className="text-[32px] font-black text-slate-100 tracking-tighter">#0{idx + 1}</span>
                        <div className="flex gap-3">
                          <button onClick={() => moveItem('experience', idx, 'up')} disabled={idx === 0} className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 disabled:opacity-10"><ChevronUp className="w-6 h-6" /></button>
                          <button onClick={() => moveItem('experience', idx, 'down')} disabled={idx === data.experience.length - 1} className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 disabled:opacity-10"><ChevronDown className="w-6 h-6" /></button>
                          <button onClick={() => removeItem('experience', item.id)} className="p-3 hover:bg-red-50 rounded-xl text-red-300 hover:text-red-500"><Trash2 className="w-6 h-6" /></button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-1">
                          <Label>Job Title</Label>
                          <input className="w-full py-3 border-b-2 border-slate-100 focus:border-slate-900 outline-none text-slate-900 font-bold text-[20px] bg-transparent" value={item.translations[activeLang].title} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].title = e.target.value; setData(newData); }} />
                        </div>
                        <div className="space-y-1">
                          <Label>Organization</Label>
                          <input className="w-full py-3 border-b-2 border-slate-100 focus:border-slate-900 outline-none text-slate-900 font-bold text-[20px] bg-transparent" value={item.translations[activeLang].org} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].org = e.target.value; setData(newData); }} />
                        </div>
                        <div className="space-y-1">
                          <Label>Period</Label>
                          <input className="w-full py-3 border-b-2 border-slate-100 focus:border-slate-900 outline-none text-slate-900 font-bold text-[20px] bg-transparent" value={item.translations[activeLang].meta} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].meta = e.target.value; setData(newData); }} />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Responsibilities (One per line)</Label>
                        <textarea rows={14} className="w-full p-8 rounded-3xl border-2 border-slate-50 focus:border-slate-900 outline-none transition-all font-medium text-slate-600 text-[18px] leading-[1.8] bg-slate-50/50" value={item.translations[activeLang].bullets.join('\n')} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].bullets = e.target.value.split('\n'); setData(newData); }} />
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Key Achievements / Highlights</Label>
                        <textarea rows={6} className="w-full p-8 rounded-3xl border-2 border-blue-50 bg-blue-50/10 focus:border-slate-900 outline-none transition-all font-bold text-slate-800 text-[18px] leading-[1.8]" value={item.translations[activeLang].highlight || ''} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].highlight = e.target.value; setData(newData); }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION SECTION */}
            {activeSection === 'education' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <SectionHeader icon={GraduationCap} title="Education History" />
                  <button onClick={() => addItem('education')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-black text-[14px] uppercase tracking-wider shadow-lg flex items-center gap-3">
                    <Plus className="w-5 h-5" /> Add New Entry
                  </button>
                </div>
                
                <div className="space-y-10">
                  {data.education.map((item, idx) => (
                    <div key={item.id} className="bg-white rounded-3xl border-2 border-slate-100 p-10 space-y-10 shadow-sm relative overflow-hidden">
                      <div className="flex justify-between items-center border-b-2 border-slate-50 pb-6">
                        <div className="flex items-center gap-5 text-blue-700">
                           <GraduationCap className="w-10 h-10" />
                           <span className="font-black uppercase tracking-widest text-[18px]">Degree #{idx + 1}</span>
                        </div>
                        <button onClick={() => removeItem('education', item.id)} className="p-3 hover:bg-red-50 rounded-xl text-red-300 hover:text-red-500"><Trash2 className="w-6 h-6" /></button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-1">
                          <Label>Degree Title</Label>
                          <input className="w-full py-3 border-b-2 border-slate-100 focus:border-slate-900 outline-none text-slate-900 font-bold text-[20px] bg-transparent" value={item.translations[activeLang].title} onChange={(e) => { const newData = { ...data }; newData.education[idx].translations[activeLang].title = e.target.value; setData(newData); }} />
                        </div>
                        <div className="space-y-1">
                          <Label>Institution</Label>
                          <input className="w-full py-3 border-b-2 border-slate-100 focus:border-slate-900 outline-none text-slate-900 font-bold text-[20px] bg-transparent" value={item.translations[activeLang].org} onChange={(e) => { const newData = { ...data }; newData.education[idx].translations[activeLang].org = e.target.value; setData(newData); }} />
                        </div>
                        <div className="space-y-1">
                          <Label>GPA / Graduation</Label>
                          <input className="w-full py-3 border-b-2 border-slate-100 focus:border-slate-900 outline-none text-slate-900 font-bold text-[20px] bg-transparent" value={item.translations[activeLang].meta} onChange={(e) => { const newData = { ...data }; newData.education[idx].translations[activeLang].meta = e.target.value; setData(newData); }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SKILLS SECTION */}
            {activeSection === 'skills' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <SectionHeader icon={Settings} title="Skills & Competencies" />
                  <button onClick={() => addItem('skills')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-black text-[14px] uppercase tracking-wider shadow-lg flex items-center gap-3">
                    <Plus className="w-5 h-5" /> Add Category
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {data.skills.map((item, idx) => (
                    <div key={item.id} className="bg-white rounded-3xl border-2 border-slate-100 p-10 space-y-8 shadow-sm hover:border-slate-200 transition-all">
                      <div className="flex justify-between items-center border-b-2 border-slate-50 pb-6">
                        <input className="text-[22px] font-black text-slate-900 border-none outline-none focus:ring-0 bg-transparent w-full uppercase tracking-tight" value={item.translations[activeLang].label} onChange={(e) => { const newData = { ...data }; newData.skills[idx].translations[activeLang].label = e.target.value; setData(newData); }} placeholder="CATEGORY NAME" />
                        <button onClick={() => removeItem('skills', item.id)} className="text-slate-200 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                      </div>
                      <div className="space-y-3">
                        <Label>Tags (Comma separated)</Label>
                        <textarea rows={5} className="w-full text-[18px] border-2 border-slate-50 rounded-2xl p-6 focus:border-slate-900 outline-none transition-all text-slate-900 font-bold bg-slate-50/30 leading-relaxed" value={item.tags.join(', ')} onChange={(e) => { const newData = { ...data }; newData.skills[idx].tags = e.target.value.split(',').map(t => t.trim()).filter(t => t !== ''); setData(newData); }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CERTS SECTION */}
            {activeSection === 'certs' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <SectionHeader icon={Award} title="Certificates" />
                  <button onClick={() => addItem('certs')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-black text-[14px] uppercase tracking-wider shadow-lg flex items-center gap-3">
                    <Plus className="w-5 h-5" /> Add Certificate
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {data.certs.map((item, idx) => (
                    <div key={item.id} className="bg-white rounded-3xl border-2 border-slate-100 p-10 space-y-8 shadow-sm relative">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-8">
                          <div className="space-y-1">
                            <Label>Certificate Name</Label>
                            <input className="font-black text-slate-900 text-[20px] w-full border-b-2 border-slate-50 focus:border-slate-900 outline-none bg-transparent" value={item.translations[activeLang].name} onChange={(e) => { const newData = { ...data }; newData.certs[idx].translations[activeLang].name = e.target.value; setData(newData); }} />
                          </div>
                          <div className="space-y-1">
                            <Label>Issuer / Organization</Label>
                            <input className="w-full text-[17px] text-slate-500 font-bold border-b-2 border-slate-50 focus:border-slate-900 outline-none bg-transparent" value={item.translations[activeLang].org} onChange={(e) => { const newData = { ...data }; newData.certs[idx].translations[activeLang].org = e.target.value; setData(newData); }} />
                          </div>
                        </div>
                        <button onClick={() => removeItem('certs', item.id)} className="text-slate-200 hover:text-red-500 transition-all"><Trash2 className="w-6 h-6" /></button>
                      </div>
                      
                      <div className="pt-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <Label>Supporting Document</Label>
                        <div className="flex gap-4 items-center">
                          <FileText className="w-6 h-6 text-slate-300" />
                          <input className="flex-1 text-[13px] bg-transparent outline-none text-slate-400 font-mono" readOnly value={item.file || 'No file attached'} />
                          <label className="cursor-pointer bg-white px-6 py-2 rounded-full shadow-sm text-blue-700 text-[13px] font-black border border-slate-100 hover:bg-slate-900 hover:text-white transition-all">
                            UPLOAD <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'certs', (p) => { const newData = { ...data }; newData.certs[idx].file = p; setData(newData); })} />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap');
        
        body {
          background-color: #f1f5f9;
        }

        .font-sarabun {
          font-family: 'Sarabun', sans-serif;
        }

        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #0a1120; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #1e293b; }

        input, textarea {
          font-family: 'Sarabun', sans-serif;
        }

        input::placeholder, textarea::placeholder {
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
