'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Award,
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
  { title: 'ประวัติส่วนตัว', href: '/admin/profile', icon: <User size={20} /> },
  { title: 'ประสบการณ์ทำงาน', href: '/admin/experience', icon: <Briefcase size={20} /> },
  { title: 'การศึกษา', href: '/admin/education', icon: <GraduationCap size={20} /> },
  { title: 'ทักษะความสามารถ', href: '/admin/skills', icon: <Code2 size={20} /> },
  { title: 'ใบรับรอง / อบรม', href: '/admin/certs', icon: <Award size={20} /> },
  { title: 'ตั้งค่าระบบ', href: '/admin/settings', icon: <Settings size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#f8fafc] text-[#1e293b]">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-[260px]" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center h-16 px-6 border-b border-slate-100 mb-4">
            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center text-white font-bold shrink-0">
              P
            </div>
            {isSidebarOpen && (
              <span className="ml-3 font-bold text-xl tracking-tight">IT Manager</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 rounded-xl transition-colors duration-200 group",
                  pathname === item.href 
                    ? "bg-blue-50 text-primary-blue font-semibold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className={cn(
                  "shrink-0",
                  pathname === item.href ? "text-primary-blue" : "text-slate-400 group-hover:text-slate-600"
                )}>
                  {item.icon}
                </span>
                {isSidebarOpen && (
                  <span className="ml-3 text-[17px]">{item.title}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Section Bottom */}
          <div className="p-4 border-t border-slate-100">
            <button onClick={handleLogout} className="flex items-center w-full px-3 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200">
              <LogOut size={20} />
              {isSidebarOpen && <span className="ml-3 text-[17px]">ออกจากระบบ</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "ml-[260px]" : "ml-20"
        )}
      >
        {/* Top Header */}
        <header className="h-16 glass-header sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full w-64">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหาข้อมูล..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">Patiwat M.</p>
                <p className="text-xs text-slate-500 mt-1">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                <img 
                  src="/photos/profile.jpg" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Patiwat+Meekaeo&background=0071e3&color=fff';
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
>
  );
}
