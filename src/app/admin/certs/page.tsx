'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import { Save, Loader2, Award, Plus, Trash2, CheckCircle2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'th' | 'en' | 'zh';

export default function CertsAdmin() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [activeLang, setActiveLang] = useState<Language>('th');

  useEffect(() => {
    fetch('/api/resume').then(res => res.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    await fetch('/api/resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setMessage({ text: 'บันทึกสำเร็จ', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
    setSaving(false);
  };

  const addItem = () => {
    if (!data) return;
    const newData = { ...data };
    newData.certs.push({ id: `cert-${Date.now()}`, translations: { th: { name: '', org: '' }, en: { name: '', org: '' }, zh: { name: '', org: '' } } });
    setData(newData);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-blue" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">ใบรับรองและการอบรม</h1>
          <p className="text-slate-500">จัดการใบประกาศนียบัตรและประวัติการฝึกอบรม</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addItem} className="bg-white text-slate-700 px-5 py-2.5 rounded-xl card-shadow border border-slate-100 font-bold hover:bg-slate-50 transition-all flex items-center gap-2"><Plus size={18} /> เพิ่มใหม่</button>
          <button onClick={handleSave} disabled={saving} className="bg-primary-blue text-white px-6 py-2.5 rounded-xl shadow-lg font-bold flex items-center gap-2">{saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} บันทึก</button>
        </div>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-2xl w-fit card-shadow border border-slate-50">
        {(['th', 'en', 'zh'] as const).map(l => (
          <button key={l} onClick={() => setActiveLang(l)} className={cn("px-6 py-2 rounded-xl text-sm font-bold uppercase transition-all", activeLang === l ? "bg-slate-900 text-white" : "text-slate-400")}>{l}</button>
        ))}
      </div>

      <div className="grid gap-6">
        {data?.certs.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-3xl card-shadow border border-slate-50 p-8 flex items-start gap-6 relative">
            <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl"><Award size={32} /></div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={item.translations[activeLang].name} onChange={(e) => { const newData = { ...data! }; newData.certs[idx].translations[activeLang].name = e.target.value; setData(newData); }} placeholder="ชื่อใบรับรอง" className="text-lg font-bold text-slate-900 outline-none border-b border-slate-50 focus:border-primary-blue bg-transparent py-1" />
                <input value={item.translations[activeLang].org} onChange={(e) => { const newData = { ...data! }; newData.certs[idx].translations[activeLang].org = e.target.value; setData(newData); }} placeholder="หน่วยงานที่ออกให้ / ปี" className="text-slate-500 font-bold outline-none border-b border-slate-50 focus:border-primary-blue bg-transparent py-1" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FileText size={14} />
                <span>{item.file || 'ไม่มีไฟล์แนบ'}</span>
              </div>
            </div>
            <button onClick={() => { if (confirm('ลบ?')) { const newData = { ...data! }; newData.certs = newData.certs.filter(c => c.id !== item.id); setData(newData); } }} className="text-slate-200 hover:text-red-500"><Trash2 size={20} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
