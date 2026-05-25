'use client';
import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import {
  Save,
  Loader2,
  Mail,
  Phone,
  Camera,
  CheckCircle2,
  AlertCircle,
  User
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
      .then(d => { setData(d); setLoading(false); });
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
      const result = await res.json().catch(() => ({ error: 'Invalid response' }));
      if (res.ok) {
        setMessage({ text: 'บันทึกข้อมูลสำเร็จ', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: result.error || 'บันทึกล้มเหลว', type: 'error' });
      }
    } catch {
      setMessage({ text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์', type: 'error' });
    }
    setSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', 'photos');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const result = await res.json();
      if (result.ok) {
        setData(prev => prev ? { ...prev, personal: { ...prev.personal, photo: result.path } } : prev);
        setMessage({ text: 'อัปโหลดรูปสำเร็จ', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: result.error || 'อัปโหลดล้มเหลว', type: 'error' });
      }
    } catch {
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
            [activeLang]: { ...(newData.personal.translations as any)[activeLang], [field]: value }
          }
        };
      } else {
        newData.personal = { ...newData.personal, [field]: value };
      }
      return newData;
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
    </div>
  );
  if (!data) return <div>Error loading data</div>;

  const getImageSrc = (path: string = '') => {
    if (!path) return 'https://ui-avatars.com/api/?name=User&size=200';
    if (path.startsWith('http')) return path;
    return `/${path}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">จัดการประวัติส่วนตัว</h1>
          <p className="text-slate-500 mt-1">อัปเดตข้อมูลติดต่อและบทสรุปแนะนำตัวเอง</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-blue text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          บันทึกข้อมูล
        </button>
      </div>

      {/* Status message */}
      {message && (
        <div className={cn(
          'p-4 rounded-xl flex items-center gap-3',
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        )}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Photo + Contact Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
          {/* Photo (compact) */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="w-44 h-44 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-100">
                <img
                  src={getImageSrc(data.personal.photo || '')}
                  alt="Profile"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl text-white">
                  {uploading ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              รูปหน้าตรง พื้นหลังเรียบ<br />
              ไฟล์ไม่เกิน 2MB
            </p>
          </div>

          {/* Contact: Email + Phone (full-width 2 cols) */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                <Mail size={16} /> อีเมล (Email)
              </label>
              <input
                type="email"
                value={data.personal.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                <Phone size={16} /> เบอร์โทรศัพท์ (Phone)
              </label>
              <input
                type="text"
                value={data.personal.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Language tabs + per-lang fields */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 md:px-8 pt-6 pb-3 border-b border-slate-50 flex items-center justify-between">
          <div className="flex gap-2">
            {(['th', 'en', 'zh'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={cn(
                  'px-5 py-2 rounded-full font-bold transition-all uppercase',
                  activeLang === lang ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {lang}
              </button>
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">โหมดแก้ไขข้อมูล</span>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 flex items-center gap-2">
              <User size={16} /> ชื่อ-นามสกุล ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={data.personal.translations[activeLang].name}
              onChange={(e) => updateField('name', e.target.value, true)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">ตำแหน่งงาน (Job Title)</label>
            <input
              type="text"
              value={data.personal.translations[activeLang].title}
              onChange={(e) => updateField('title', e.target.value, true)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500">บทสรุปแนะนำตัวเอง (Summary)</label>
            <textarea
              rows={10}
              value={data.personal.translations[activeLang].summary}
              onChange={(e) => updateField('summary', e.target.value, true)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all leading-relaxed resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
