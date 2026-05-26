'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Briefcase,
  GraduationCap,
  Settings,
  Award,
  ArrowRight,
  Eye,
  Loader2
} from 'lucide-react';
import { ResumeData } from '@/types/resume';

export default function AdminDashboard() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resume')
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      href: '/admin/profile',
      icon: User,
      title: 'ประวัติส่วนตัว',
      desc: 'แก้ไขชื่อ, ตำแหน่ง, อีเมล, รูปโปรไฟล์, บทสรุป',
      count: '1',
      color: 'from-blue-500 to-blue-600'
    },
    {
      href: '/admin/experience',
      icon: Briefcase,
      title: 'ประสบการณ์ทำงาน',
      desc: 'จัดการรายการประสบการณ์ทำงานในแต่ละบริษัท',
      count: data?.experience?.length?.toString() || '0',
      color: 'from-purple-500 to-purple-600'
    },
    {
      href: '/admin/education',
      icon: GraduationCap,
      title: 'การศึกษา',
      desc: 'แก้ไขประวัติการศึกษา / วุฒิ',
      count: data?.education?.length?.toString() || '0',
      color: 'from-green-500 to-green-600'
    },
    {
      href: '/admin/skills',
      icon: Settings,
      title: 'ทักษะความสามารถ',
      desc: 'จัดหมวดทักษะและ Tags',
      count: data?.skills?.length?.toString() || '0',
      color: 'from-orange-500 to-orange-600'
    },
    {
      href: '/admin/certs',
      icon: Award,
      title: 'ใบรับรอง / อบรม',
      desc: 'อัปโหลดใบประกาศนียบัตรและจัดการรายการ',
      count: data?.certs?.length?.toString() || '0',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">ภาพรวม Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">เลือกหมวดที่ต้องการแก้ไขข้อมูล Resume ของคุณ</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.href} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <div className="text-3xl font-black text-slate-900">{c.count}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">{c.title}</div>
          </div>
        ))}
      </div>

      {/* Main cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group bg-white border border-gray-100 rounded-3xl p-7 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{c.title}</h3>
              <p className="text-base text-gray-500 leading-relaxed mb-4">{c.desc}</p>
              <div className="flex items-center text-blue-600 hover:text-blue-700 font-semibold text-base group-hover:gap-3 transition-all gap-2">
                แก้ไข <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}

        {/* View resume card — now WHITE to match others */}
        <Link
          href="/"
          target="_blank"
          className="group bg-white border border-gray-100 rounded-3xl p-7 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
            <Eye className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">ดู Resume สาธารณะ</h3>
          <p className="text-base text-gray-500 leading-relaxed mb-4">
            เปิดหน้า Resume ที่คนทั่วไปเห็น (เปิดในแท็บใหม่)
          </p>
          <div className="flex items-center text-blue-600 hover:text-blue-700 font-semibold text-base group-hover:gap-3 transition-all gap-2">
            เปิดดู <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
