'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import { 
  Save, 
  Loader2, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'th' | 'en' | 'zh';

export default function SkillsAdmin() {
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
      await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setMessage({ text: 'บันทึกสำเร็จ', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setMessage({ text: 'Error', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    if (!data) return;
    const newData = { ...data };
    newData.skills.push({
      id: `skill-${Date.now()}`,
      translations: {
        th: { label: '', tags: [] },
        en: { label: '', tags: [] },
        zh: { label: '', tags: [] }
      }
    });
    setData(newData);
  };

  const removeItem = (id: string) => {
    if (!data || !confirm('ลบ?')) return;
    const newData = { ...data };
    newData.skills = newData.skills.filter(s => s.id !== id);
    setData(newData);
  };

  const updateItem = (index: number, label: string, tags: string) => {
    if (!data) return;
    const newData = { ...data };
    newData.skills[index].translations[activeLang].label = label;
    newData.skills[index].translations[activeLang].tags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
    setData(newData);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-blue" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">ทักษะและความสามารถ</h1>
          <p className="text-slate-500">จัดการหมวดหมู่และรายการทักษะต่างๆ</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addItem} className="bg-white text-slate-700 px-5 py-2.5 rounded-xl card-shadow border border-slate-100 font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <Plus size={18} /> เพิ่มหมวดหมู่
          </button>
          <button onClick={handleSave} disabled={saving} className="bg-primary-blue text-white px-6 py-2.5 rounded-xl shadow-lg font-bold flex items-center gap-2">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} บันทึก
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-2xl w-fit card-shadow border border-slate-50">
        {(['th', 'en', 'zh'] as const).map(l => (
          <button key={l} onClick={() => setActiveLang(l)} className={cn("px-6 py-2 rounded-xl text-sm font-bold uppercase transition-all", activeLang === l ? "bg-slate-900 text-white" : "text-slate-400")}>
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.skills.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-3xl card-shadow border border-slate-50 p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <input 
                value={item.translations[activeLang].label} 
                onChange={(e) => updateItem(idx, e.target.value, item.translations[activeLang].tags.join(', '))}
                placeholder="ชื่อหมวดหมู่ (เช่น Web Dev)"
                className="text-xl font-bold text-slate-900 outline-none w-full bg-transparent"
              />
              <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={20} /></button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">รายการทักษะ (คั่นด้วย ,)</label>
              <textarea 
                rows={4}
                value={item.translations[activeLang].tags.join(', ')}
                onChange={(e) => updateItem(idx, item.translations[activeLang].label, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-primary-blue outline-none font-semibold text-slate-600 leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
