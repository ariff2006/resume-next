'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData, Personal, Experience, Education, Skill, Cert } from '@/types/resume';
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
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  FileText
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
        setMessage({ text: 'บันทึกข้อมูลสำเร็จ!', type: 'success' });
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
        <p className="text-slate-500 font-medium">กำลังโหลดข้อมูล...</p>
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

  const updatePersonal = (field: keyof Personal | string, value: any, isTranslatable = false) => {
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
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#343a40] text-slate-300 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700 bg-[#3f474e] flex items-center gap-3">
          <Settings className="w-6 h-6 text-[#007bff]" />
          <span className="font-bold text-lg text-white tracking-tight">RESUME ADMIN</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4 mt-2">Main Menu</div>
          <NavItem section="personal" icon={User} label="ข้อมูลส่วนตัว" />
          <NavItem section="experience" icon={Briefcase} label="ประสบการณ์ทำงาน" />
          <NavItem section="education" icon={GraduationCap} label="การศึกษา" />
          <NavItem section="skills" icon={Settings} label="ทักษะ" />
          <NavItem section="certs" icon={Award} label="ใบรับรอง / อบรม" />
          
          <div className="pt-8 border-t border-slate-700 mt-8">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
              <ArrowLeft className="w-5 h-5" />
              ดูหน้า Resume
            </Link>
          </div>
        </nav>
        
        <div className="p-4 bg-[#2c3136] text-[10px] text-center text-slate-500">
          Logged in as <span className="text-slate-300">Patiwat Admin</span>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white h-16 shadow-sm border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            <h2 className="font-bold text-slate-700 uppercase text-xs tracking-widest">
              {activeSection === 'personal' && 'ข้อมูลส่วนตัว'}
              {activeSection === 'experience' && 'ประสบการณ์ทำงาน'}
              {activeSection === 'education' && 'การศึกษา'}
              {activeSection === 'skills' && 'ทักษะ'}
              {activeSection === 'certs' && 'ใบรับรอง / อบรม'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {message && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold animate-fade-in ${
                message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#28a745] hover:bg-[#218838] text-white px-6 py-2 rounded-lg font-bold shadow-md disabled:opacity-50 transition-all text-sm uppercase tracking-wide"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </header>

        {/* Section Content */}
        <div className="p-8 max-w-5xl mx-auto w-full">
          <LangTabs />

          {/* PERSONAL INFO */}
          {activeSection === 'personal' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-[#007bff]" />
                  <h3 className="font-bold text-slate-700">รูปโปรไฟล์</h3>
                </div>
                <div className="p-6 flex flex-col items-center sm:flex-row gap-8">
                  <div className="relative group">
                    <img 
                      src={`/${data.personal.photo || 'photos/placeholder.jpg'}`} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-lg"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                    />
                    {uploading === 'photos' && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="text-sm text-slate-500 mb-2">
                      <p className="font-bold text-slate-700 mb-1">เปลี่ยนรูปโปรไฟล์</p>
                      <p>รองรับไฟล์ JPG, PNG หรือ WebP (แนะนำขนาด 400x400px)</p>
                    </div>
                    <label className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-[#007bff] hover:text-[#007bff] px-6 py-2 rounded-xl font-bold cursor-pointer transition-all shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>เลือกไฟล์รูปภาพ</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'photos', (path) => updatePersonal('photo', path))}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                  <User className="w-5 h-5 text-[#007bff]" />
                  <h3 className="font-bold text-slate-700">ข้อมูลติดต่อ</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none transition-all"
                      value={data.personal.email}
                      onChange={(e) => updatePersonal('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none transition-all"
                      value={data.personal.phone}
                      onChange={(e) => updatePersonal('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-[#f8f9fa] px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#007bff]" />
                  <h3 className="font-bold text-slate-700">ข้อมูลที่แปล ({activeLang.toUpperCase()})</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none transition-all"
                        value={data.personal.translations[activeLang].name}
                        onChange={(e) => updatePersonal(`${activeLang}.name`, e.target.value, true)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ตำแหน่ง</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none transition-all"
                        value={data.personal.translations[activeLang].title}
                        onChange={(e) => updatePersonal(`${activeLang}.title`, e.target.value, true)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ที่อยู่</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none transition-all"
                        value={data.personal.translations[activeLang].location}
                        onChange={(e) => updatePersonal(`${activeLang}.location`, e.target.value, true)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">วันเกิด / อายุ</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none transition-all"
                        value={data.personal.translations[activeLang].dob}
                        onChange={(e) => updatePersonal(`${activeLang}.dob`, e.target.value, true)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">สรุปเกี่ยวกับฉัน</label>
                    <textarea 
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none transition-all resize-none"
                      value={data.personal.translations[activeLang].summary}
                      onChange={(e) => updatePersonal(`${activeLang}.summary`, e.target.value, true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-slate-700">รายการประสบการณ์</h3>
                <button 
                  onClick={() => addItem('experience')}
                  className="flex items-center gap-2 bg-[#17a2b8] text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-[#138496] transition-all"
                >
                  <Plus className="w-4 h-4" /> เพิ่มประสบการณ์
                </button>
              </div>

              {data.experience.map((item, idx) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                  <div className="bg-[#f8f9fa] px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#007bff] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-700">
                        {item.translations[activeLang].title || '(ยังไม่ระบุตำแหน่ง)'}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveItem('experience', idx, 'up')} className="p-1.5 text-slate-400 hover:text-[#007bff] disabled:opacity-20" disabled={idx === 0}><ChevronUp className="w-4 h-4" /></button>
                      <button onClick={() => moveItem('experience', idx, 'down')} className="p-1.5 text-slate-400 hover:text-[#007bff] disabled:opacity-20" disabled={idx === data.experience.length - 1}><ChevronDown className="w-4 h-4" /></button>
                      <button onClick={() => removeItem('experience', item.id)} className="p-1.5 text-slate-400 hover:text-red-500 ml-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ตำแหน่ง</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none"
                          value={item.translations[activeLang].title}
                          onChange={(e) => {
                            const newData = { ...data };
                            newData.experience[idx].translations[activeLang].title = e.target.value;
                            setData(newData);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">บริษัท / องค์กร</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none"
                          value={item.translations[activeLang].org}
                          onChange={(e) => {
                            const newData = { ...data };
                            newData.experience[idx].translations[activeLang].org = e.target.value;
                            setData(newData);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ช่วงเวลา</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none"
                          value={item.translations[activeLang].meta}
                          onChange={(e) => {
                            const newData = { ...data };
                            newData.experience[idx].translations[activeLang].meta = e.target.value;
                            setData(newData);
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">หน้าที่ / รายละเอียด (บรรทัดละข้อ)</label>
                      <textarea 
                        rows={5}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none resize-none"
                        value={item.translations[activeLang].bullets.join('\n')}
                        onChange={(e) => {
                          const newData = { ...data };
                          newData.experience[idx].translations[activeLang].bullets = e.target.value.split('\n');
                          setData(newData);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ไฮไลท์ / ผลงานเด่น</label>
                      <textarea 
                        rows={4}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none resize-none bg-amber-50/30"
                        value={item.translations[activeLang].highlight || ''}
                        onChange={(e) => {
                          const newData = { ...data };
                          newData.experience[idx].translations[activeLang].highlight = e.target.value;
                          setData(newData);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {activeSection === 'education' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-slate-700">ประวัติการศึกษา</h3>
                <button 
                  onClick={() => addItem('education')}
                  className="flex items-center gap-2 bg-[#17a2b8] text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-[#138496] transition-all"
                >
                  <Plus className="w-4 h-4" /> เพิ่มการศึกษา
                </button>
              </div>

              {data.education.map((item, idx) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                  <div className="bg-[#f8f9fa] px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#007bff] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-700">
                        {item.translations[activeLang].title || '(ยังไม่ระบุวุฒิการศึกษา)'}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => removeItem('education', item.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">วุฒิ / สาขาวิชา</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none"
                        value={item.translations[activeLang].title}
                        onChange={(e) => {
                          const newData = { ...data };
                          newData.education[idx].translations[activeLang].title = e.target.value;
                          setData(newData);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">สถานศึกษา</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none"
                        value={item.translations[activeLang].org}
                        onChange={(e) => {
                          const newData = { ...data };
                          newData.education[idx].translations[activeLang].org = e.target.value;
                          setData(newData);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ปีที่จบ / GPA</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none"
                        value={item.translations[activeLang].meta}
                        onChange={(e) => {
                          const newData = { ...data };
                          newData.education[idx].translations[activeLang].meta = e.target.value;
                          setData(newData);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-slate-700">หมวดหมู่ทักษะ</h3>
                <button 
                  onClick={() => addItem('skills')}
                  className="flex items-center gap-2 bg-[#17a2b8] text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-[#138496] transition-all"
                >
                  <Plus className="w-4 h-4" /> เพิ่มหมวดหมู่
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.skills.map((item, idx) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                    <div className="bg-[#f8f9fa] px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                      <h4 className="font-bold text-slate-700">
                        {item.translations[activeLang].label || '(ยังไม่ระบุชื่อหมวด)'}
                      </h4>
                      <button onClick={() => removeItem('skills', item.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ชื่อหมวดหมู่ทักษะ ({activeLang.toUpperCase()})</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none"
                          value={item.translations[activeLang].label}
                          onChange={(e) => {
                            const newData = { ...data };
                            newData.skills[idx].translations[activeLang].label = e.target.value;
                            setData(newData);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ทักษะย่อย (Tags - คั่นด้วยคอมม่า ,)</label>
                        <textarea 
                          rows={3}
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none resize-none"
                          value={item.tags.join(', ')}
                          onChange={(e) => {
                            const newData = { ...data };
                            newData.skills[idx].tags = e.target.value.split(',').map(t => t.trim()).filter(t => t !== '');
                            setData(newData);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTS */}
          {activeSection === 'certs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-slate-700">ใบรับรองและผลงาน</h3>
                <button 
                  onClick={() => addItem('certs')}
                  className="flex items-center gap-2 bg-[#17a2b8] text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-[#138496] transition-all"
                >
                  <Plus className="w-4 h-4" /> เพิ่มใบรับรอง
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certs.map((item, idx) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#f8f9fa] px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                      <h4 className="font-bold text-slate-700 truncate mr-4">
                        {item.translations[activeLang].name || '(ยังไม่ระบุชื่อใบรับรอง)'}
                      </h4>
                      <button onClick={() => removeItem('certs', item.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ชื่อใบรับรอง</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none"
                          value={item.translations[activeLang].name}
                          onChange={(e) => {
                            const newData = { ...data };
                            newData.certs[idx].translations[activeLang].name = e.target.value;
                            setData(newData);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">สถานบัน / ปีที่ได้รับ</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#007bff] outline-none"
                          value={item.translations[activeLang].org}
                          onChange={(e) => {
                            const newData = { ...data };
                            newData.certs[idx].translations[activeLang].org = e.target.value;
                            setData(newData);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ไฟล์ใบรับรอง (PDF หรือรูปภาพ)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            readOnly
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none"
                            value={item.file || 'ยังไม่ได้อัปโหลด'}
                          />
                          <label className="flex items-center gap-1 bg-white border border-slate-200 hover:border-[#007bff] hover:text-[#007bff] px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-sm">
                            <Upload className="w-3 h-3" />
                            อัปโหลด
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => handleFileUpload(e, 'certs', (path) => {
                                const newData = { ...data };
                                newData.certs[idx].file = path;
                                setData(newData);
                              })}
                            />
                          </label>
                          {item.file && (
                            <button 
                              onClick={() => window.open(`/${item.file}`, '_blank')}
                              className="p-1.5 text-slate-400 hover:text-[#007bff] border border-slate-200 rounded-lg"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
