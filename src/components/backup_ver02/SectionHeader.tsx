import React from 'react';

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-4 mb-10">
    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200">
      <Icon className="w-5 h-5" />
    </div>
    <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-slate-800 border-b-2 border-slate-900 pb-1">
      {title}
    </h2>
    <div className="flex-1 h-px bg-slate-100"></div>
  </div>
);
