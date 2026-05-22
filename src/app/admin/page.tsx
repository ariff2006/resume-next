'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import { Save, ArrowLeft, Loader2, User, Briefcase, GraduationCap, Award, Settings, Plus, Trash2, ChevronUp, ChevronDown, Globe, LayoutDashboard, CheckCircle2, AlertCircle, Upload, Image as ImageIcon, FileText } from 'lucide-react';
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
        setMessage({ text: 'บันทึกข้อมูลเข้า Supabase สำเร็จ!', type: 'success' });
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
        setMessage({ text: 'อัปโหลดไฟล์สำเร็จ!', type: 'success' });
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
    <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#007bff] mx-auto mb-4" />
        <p className="text-slate-500 font-medium">กำลังโหลดจาก Supabase...</p>
      </div>
    </div>
  );

  if (!data) return <div>Failed to load data</div>;

  const NavItem = ({ section, icon: Icon, label }: { section: Section, icon: any, label: string }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activeSection === section 
          ? 'bg-[#007bff] text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );

  const LangTabs = () => (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-6 w-fit">
      {(['th', 'en', 'zh'] as const).map(l => (
        <button
          key={l}
          onClick={() => setActiveLang(l)}
          className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
            activeLang === l 
              ? 'bg-white text-[#007bff] shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {l === 'th' ? 'Thai' : l === 'en' ? 'English' : 'Chinese'}
        </button>
      ))}
    </div>
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
    const id = `${section.substring(0, 3)}-${Math.random().toString(36).substr(2, 9)}`;
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
    if (!confirm('ยืนยันการลบข้อมูลนี้?')) return;
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
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#343a40] text-slate-300 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700 bg-[#3f474e] flex items-center gap-3">
          <Settings className="w-6 h-6 text-[#007bff]" />
          <span className="font-bold text-lg text-white tracking-tight">RESUME ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem section="personal" icon={User} label="ข้อมูลส่วนตัว" />
          <NavItem section="experience" icon={Briefcase} label="ประสบการณ์ทำงาน" />
          <NavItem section="education" icon={GraduationCap} label="การศึกษา" />
          <NavItem section="skills" icon={Settings} label="ทักษะ" />
          <NavItem section="certs" icon={Award} label="ใบรับรอง / อบรม" />
          <div className="pt-8 border-t border-slate-700 mt-8">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
              <ArrowLeft className="w-5 h-5" /> ดูหน้า Resume
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col font-prompt">
        <header className="bg-white h-16 shadow-sm border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            <h2 className="font-bold text-slate-700 uppercase text-xs tracking-widest">{activeSection}</h2>
          </div>
          <div className="flex items-center gap-4">
            {message && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {message.text}
              </div>
            )}
            <button onClick={handleSave} disabled={saving} className="bg-[#28a745] hover:bg-[#218838] text-white px-6 py-2 rounded-lg font-bold shadow-md disabled:opacity-50">
              {saving ? 'Saving...' : 'Save to Supabase'}
            </button>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto w-full">
          <LangTabs />

          {activeSection === 'personal' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 flex flex-col sm:flex-row gap-8">
                <div className="relative">
                  <img src={`/${data.personal.photo || 'photos/placeholder.jpg'}`} className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-lg" />
                  {uploading === 'photos' && <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white" /></div>}
                  <label className="block mt-4 text-center cursor-pointer text-xs font-bold text-blue-600 hover:underline">
                    เปลี่ยนรูปภาพ <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photos', (path) => updatePersonal('photo', path))} />
                  </label>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                    <input className="w-full px-4 py-2 rounded-lg border border-slate-200 mt-1" value={data.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                    <input className="w-full px-4 py-2 rounded-lg border border-slate-200 mt-1" value={data.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Name ({activeLang})</label>
                      <input className="w-full px-4 py-2 rounded-lg border border-slate-200 mt-1" value={data.personal.translations[activeLang].name} onChange={(e) => updatePersonal(`${activeLang}.name`, e.target.value, true)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Title ({activeLang})</label>
                      <input className="w-full px-4 py-2 rounded-lg border border-slate-200 mt-1" value={data.personal.translations[activeLang].title} onChange={(e) => updatePersonal(`${activeLang}.title`, e.target.value, true)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Summary ({activeLang})</label>
                      <textarea rows={5} className="w-full px-4 py-2 rounded-lg border border-slate-200 mt-1" value={data.personal.translations[activeLang].summary} onChange={(e) => updatePersonal(`${activeLang}.summary`, e.target.value, true)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="space-y-6">
              <button onClick={() => addItem('experience')} className="bg-[#17a2b8] text-white px-4 py-2 rounded-lg font-bold">Add Experience</button>
              {data.experience.map((item, idx) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <h4 className="font-bold">{item.translations[activeLang].title || 'New Item'}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => moveItem('experience', idx, 'up')} disabled={idx === 0}><ChevronUp className="w-4 h-4" /></button>
                      <button onClick={() => moveItem('experience', idx, 'down')} disabled={idx === data.experience.length - 1}><ChevronDown className="w-4 h-4" /></button>
                      <button onClick={() => removeItem('experience', item.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="w-full px-3 py-2 border rounded" placeholder="Title" value={item.translations[activeLang].title} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].title = e.target.value; setData(newData); }} />
                    <input className="w-full px-3 py-2 border rounded" placeholder="Org" value={item.translations[activeLang].org} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].org = e.target.value; setData(newData); }} />
                    <input className="w-full px-3 py-2 border rounded" placeholder="Period" value={item.translations[activeLang].meta} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].meta = e.target.value; setData(newData); }} />
                  </div>
                  <textarea rows={6} className="w-full px-3 py-2 border rounded" placeholder="Bullets (one per line)" value={item.translations[activeLang].bullets.join('\n')} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].bullets = e.target.value.split('\n'); setData(newData); }} />
                  <textarea rows={4} className="w-full px-3 py-2 border rounded bg-amber-50" placeholder="Highlight" value={item.translations[activeLang].highlight || ''} onChange={(e) => { const newData = { ...data }; newData.experience[idx].translations[activeLang].highlight = e.target.value; setData(newData); }} />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="space-y-6">
              <button onClick={() => addItem('skills')} className="bg-[#17a2b8] text-white px-4 py-2 rounded-lg font-bold">Add Skill Category</button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.skills.map((item, idx) => (
                  <div key={item.id} className="bg-white border rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <input className="font-bold border-b outline-none" value={item.translations[activeLang].label} onChange={(e) => { const newData = { ...data }; newData.skills[idx].translations[activeLang].label = e.target.value; setData(newData); }} />
                      <button onClick={() => removeItem('skills', item.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea rows={3} className="w-full text-sm border rounded p-2" value={item.tags.join(', ')} onChange={(e) => { const newData = { ...data }; newData.skills[idx].tags = e.target.value.split(',').map(t => t.trim()).filter(t => t !== ''); setData(newData); }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'certs' && (
            <div className="space-y-6">
              <button onClick={() => addItem('certs')} className="bg-[#17a2b8] text-white px-4 py-2 rounded-lg font-bold">Add Certificate</button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certs.map((item, idx) => (
                  <div key={item.id} className="bg-white border rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <input className="font-bold w-full mr-4 border-b outline-none" value={item.translations[activeLang].name} onChange={(e) => { const newData = { ...data }; newData.certs[idx].translations[activeLang].name = e.target.value; setData(newData); }} />
                      <button onClick={() => removeItem('certs', item.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <input className="w-full text-sm border-b" value={item.translations[activeLang].org} onChange={(e) => { const newData = { ...data }; newData.certs[idx].translations[activeLang].org = e.target.value; setData(newData); }} />
                    <div className="flex gap-2 items-center">
                      <input className="flex-1 text-[10px] bg-slate-50 p-1" readOnly value={item.file || ''} />
                      <label className="cursor-pointer text-blue-600 text-xs font-bold">
                        Upload <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'certs', (p) => { const newData = { ...data }; newData.certs[idx].file = p; setData(newData); })} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
