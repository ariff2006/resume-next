'use client';
import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import {
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
type Language = 'th' | 'en' | 'zh';
export default function ProfileAdmin() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [activeLang, setActiveLang] = useState<Language>('th');
  const [uploading, setUploading] = useState(false);
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
      let result;
      try {
        result = await res.json();
      } catch (e) {
        result = { error: 'Invalid JSON response from server' };
      }
      if (res.ok) {
        setMessage({ text: 'บันทึกข้อมูลสำเร็จ', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorMsg = result.error || `Error ${res.status}: บันทึกล้มเหลว`;
        setMessage({ text: errorMsg, type: 'error' });
      }
    } catch (e) {
      setMessage({ text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (Network Error)', type: 'error' });
    }
    setSaving(false);
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'photos');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.ok) {
        setData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            personal: {
              ...prev.personal,
              photo: result.path
            }
          };
        });
        setMessage({ text: 'อัปโหลดรูปภาพสำเร็จ!', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: result.error || 'อัปโหลดล้มเหลว', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ', type: 'error' });
    } finally {
      setUploading(false);
    }
  };
  const updateField = (field: string, value: string, isTranslatable = false) => {
    setData(prev => {
      if (!prev) return prev;
      const newData = { ...prev };
      if (isTranslatable) {
        newData.personal = {
          ...newData.personal,
          translations: {
            ...newData.personal.translations,
            [activeLang]: {
              ...(newData.personal.translations as any)[activeLang],
              [field]: value
            }
          }
        };
      } else {
        newData.personal = {
          ...newData.personal,
          [field]: value
        };
      }
      return newData;
    });
  };
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
    </div>
  );
  if (!data) return <div className="text-lg">Error loading data</div>;
  // Helper to get image source
  const getImageSrc = (path: string = '') => {
    if (!path) return 'https://ui-avatars.com/api/?name=User&size=200';
    if (path.startsWith('http')) return path;
    return `/${path}`;
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-base">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">จัดการประวัติส่วนตัว</h1>
          <p className="text-slate-500 mt-2 text-lg">อัปเดตข้อมูลติดต่อและบทสรุปแนะนำตัวเอง</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-blue text-white px-7 py-3 rounded-xl shadow-lg shadow-blue-200 font-bold text-base hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          บันทึกข้อมูล
        </button>
      </div>
      {message && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300 text-base",
          message.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
        )}>
          {message.type === 'success' ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}
      {/* Main Form */}
      <div className="bg-white rounded-3xl card-shadow border border-slate-50 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex gap-2">
            {(['th', 'en', 'zh'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={cn(
                  "px-5 py-2 rounded-full text-base font-bold transition-all uppercase",
                  activeLang === lang ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">โหมดแก้ไขข้อมูล</span>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Photo Section */}
          <div className="md:col-span-4 flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="w-48 h-60 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                <img
                  src={getImageSrc(data.personal.photo || '')}
                  alt="Profile"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-3xl cursor-pointer">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white">
                  {uploading ? <Loader2 size={26} className="animate-spin" /> : <Camera size={26} />}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
            <p className="text-sm text-slate-500 text-center leading-relaxed">แนะนำรูปถ่ายหน้าตรง พื้นหลังเรียบ<br />ขนาดไฟล์ไม่เกิน 2MB</p>
          </div>
          {/* Form Fields */}
          <div className="md:col-span-8 space-y-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-base font-bold text-slate-600 flex items-center gap-2">
                  <Mail size={16} /> อีเมล (Email)
                </label>
                <input
                  type="email"
                  value={data.personal.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all text-base font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-base font-bold text-slate-600 flex items-center gap-2">
                  <Phone size={16} /> เบอร์โทรศัพท์ (Phone)
                </label>
                <input
                  type="text"
                  value={data.personal.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all text-base font-semibold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-600">ชื่อ-นามสกุล ({activeLang.toUpperCase()})</label>
              <input
                type="text"
                value={data.personal.translations[activeLang].name}
                onChange={(e) => updateField('name', e.target.value, true)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all text-xl font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-600">ตำแหน่งงาน (Job Title)</label>
              <input
                type="text"
                value={data.personal.translations[activeLang].title}
                onChange={(e) => updateField('title', e.target.value, true)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all text-base font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-600">บทสรุปแนะนำตัวเอง (Summary)</label>
              <textarea
                rows={8}
                value={data.personal.translations[activeLang].summary}
                onChange={(e) => updateField('summary', e.target.value, true)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all text-base font-medium leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
