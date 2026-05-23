'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import { 
  Save, 
  Loader2, 
  Briefcase, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'th' | 'en' | 'zh';

export default function ExperienceAdmin() {
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
      } else {
        setMessage({ text: 'เกิดข้อผิดพลาดในการบันทึก', type: 'error' });
      }
    } catch (e) {
      setMessage({ text: 'Error saving data', type: 'error' });
    }
    setSaving(false);
  };

  const addItem = () => {
    if (!data) return;
    const newData = { ...data };
    const id = `exp-${Date.now()}`;
    newData.experience.unshift({
      id,
      translations: {
        th: { title: '', org: '', meta: '', bullets: [] },
        en: { title: '', org: '', meta: '', bullets: [] },
        zh: { title: '', org: '', meta: '', bullets: [] }
      }
    });
    setData(newData);
  };

  const removeItem = (id: string) => {
    if (!data || !confirm('ยืนยันการลบรายการนี้?')) return;
    const newData = { ...data };
    newData.experience = newData.experience.filter(item => item.id !== id);
    setData(newData);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const newData = { ...data };
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newData.experience.length) return;
    const temp = newData.experience[index];
    newData.experience[index] = newData.experience[targetIndex];
    newData.experience[targetIndex] = temp;
    setData(newData);
  };

  const updateItem = (index: number, field: string, value: any) => {
    if (!data) return;
    const newData = { ...data };
    if (field === 'bullets') {
      newData.experience[index].translations[activeLang].bullets = value.split('\n');
    } else if (field === 'highlight') {
      newData.experience[index].translations[activeLang].highlight = value;
    } else {
      (newData.experience[index].translations[activeLang] as any)[field] = value;
    }
    setData(newData);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
    </div>
  );

  if (!data) return <div>Error loading data</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">จัดการประสบการณ์ทำงาน</h1>
          <p className="text-slate-500 mt-1">เพิ่มหรือแก้ไขประวัติการทำงานในแต่ละช่วงเวลา</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={addItem}
            className="bg-white text-slate-700 px-5 py-2.5 rounded-xl card-shadow border border-slate-100 font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            เพิ่มรายการใหม่
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-blue text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-200 font-bold hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            บันทึกข้อมูล
          </button>
        </div>
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300",
          message.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
        )}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}

      {/* Language Switcher */}
      <div className="flex gap-2 bg-white p-1 rounded-2xl w-fit card-shadow border border-slate-50">
        {(['th', 'en', 'zh'] as const).map(lang => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all uppercase",
              activeLang === lang ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            {lang === 'th' ? 'ภาษาไทย' : lang === 'en' ? 'English' : 'Chinese'}
          </button>
        ))}
      </div>

      {/* List of Experiences */}
      <div className="space-y-6">
        {data.experience.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-3xl card-shadow border border-slate-50 overflow-hidden group">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400">
                  <GripVertical size={20} />
                </div>
                <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">ลำดับที่ #{idx + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-20"
                >
                  <ChevronUp size={20} />
                </button>
                <button 
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === data.experience.length - 1}
                  className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-20"
                >
                  <ChevronDown size={20} />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">ตำแหน่ง (Job Title)</label>
                  <input 
                    type="text" 
                    value={item.translations[activeLang].title}
                    onChange={(e) => updateItem(idx, 'title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">องค์กร (Organization)</label>
                  <input 
                    type="text" 
                    value={item.translations[activeLang].org}
                    onChange={(e) => updateItem(idx, 'org', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">ช่วงเวลา (Period)</label>
                  <input 
                    type="text" 
                    value={item.translations[activeLang].meta}
                    onChange={(e) => updateItem(idx, 'meta', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 flex items-center justify-between">
                  <span>รายละเอียดงาน (Responsibilities)</span>
                  <span className="text-[10px] font-normal text-slate-400 italic">* หนึ่งรายการต่อหนึ่งบรรทัด</span>
                </label>
                <textarea 
                  rows={10}
                  value={item.translations[activeLang].bullets.join('\n')}
                  onChange={(e) => updateItem(idx, 'bullets', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-100 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium leading-[1.8] text-[18px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">ผลงานเด่น (Key Highlights)</label>
                <textarea 
                  rows={4}
                  value={item.translations[activeLang].highlight || ''}
                  onChange={(e) => updateItem(idx, 'highlight', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-blue-50 bg-blue-50/10 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-800 leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}

        {data.experience.length === 0 && (
          <div className="bg-white rounded-3xl card-shadow border border-slate-50 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Briefcase size={32} />
            </div>
            <p className="text-slate-400 font-medium">ยังไม่มีข้อมูลประสบการณ์ทำงาน</p>
            <button onClick={addItem} className="mt-4 text-primary-blue font-bold hover:underline">
              + เพิ่มรายการแรก
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
