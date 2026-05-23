'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import { 
  Save, 
  Loader2, 
  GraduationCap, 
  Plus, 
  Trash2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'th' | 'en' | 'zh';

export default function EducationAdmin() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [activeLang, setActiveLang] = useState<Language>('th');

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
      }
    } catch (e) {
      setMessage({ text: 'Error', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    if (!data) return;
    const newData = { ...data };
    newData.education.unshift({
      id: `edu-${Date.now()}`,
      translations: {
        th: { title: '', org: '', meta: '' },
        en: { title: '', org: '', meta: '' },
        zh: { title: '', org: '', meta: '' }
      }
    });
    setData(newData);
  };

  const removeItem = (id: string) => {
    if (!data || !confirm('ลบรายการนี้?')) return;
    const newData = { ...data };
    newData.education = newData.education.filter(item => item.id !== id);
    setData(newData);
  };

  const updateItem = (index: number, field: string, value: string) => {
    if (!data) return;
    const newData = { ...data };
    (newData.education[index].translations[activeLang] as any)[field] = value;
    setData(newData);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-blue" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">จัดการการศึกษา</h1>
          <p className="text-slate-500">ประวัติการศึกษาและวุฒิการศึกษาต่างๆ</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addItem} className="bg-white text-slate-700 px-5 py-2.5 rounded-xl card-shadow border border-slate-100 font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <Plus size={18} /> เพิ่มใหม่
          </button>
          <button onClick={handleSave} disabled={saving} className="bg-primary-blue text-white px-6 py-2.5 rounded-xl shadow-lg font-bold flex items-center gap-2">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} บันทึก
          </button>
        </div>
      </div>

      {message && (
        <div className={cn("p-4 rounded-2xl flex items-center gap-3 font-bold", message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
          <CheckCircle2 size={20} /> {message.text}
        </div>
      )}

      <div className="flex gap-2 bg-white p-1 rounded-2xl w-fit card-shadow border border-slate-50">
        {(['th', 'en', 'zh'] as const).map(l => (
          <button key={l} onClick={() => setActiveLang(l)} className={cn("px-6 py-2 rounded-xl text-sm font-bold uppercase transition-all", activeLang === l ? "bg-slate-900 text-white" : "text-slate-400")}>
            {l}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {data?.education.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-3xl card-shadow border border-slate-50 p-8 space-y-6">
            <div className="flex justify-between items-center text-slate-400">
              <GraduationCap size={24} />
              <button onClick={() => removeItem(item.id)} className="hover:text-red-500"><Trash2 size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">วุฒิการศึกษา</label>
                <input value={item.translations[activeLang].title} onChange={(e) => updateItem(idx, 'title', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-primary-blue outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">สถานบัน</label>
                <input value={item.translations[activeLang].org} onChange={(e) => updateItem(idx, 'org', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-primary-blue outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">เกรด / ปีที่จบ</label>
                <input value={item.translations[activeLang].meta} onChange={(e) => updateItem(idx, 'meta', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-primary-blue outline-none font-bold" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
