import React from 'react';

interface RichTextProps {
  text: string | string[];
}

export const RichText: React.FC<RichTextProps> = ({ text }) => {
  const lines = Array.isArray(text) ? text : text.split('\n');
  
  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        if (/^[━─=]{3,}$/.test(trimmed)) return <hr key={i} className="my-8 border-slate-200" />;
        
        if (/^[🔹🔸◆◇►▪★]/u.test(trimmed)) {
          return (
            <div key={i} className="mt-10 mb-6 flex items-center gap-4">
              <div className="h-8 w-2 bg-slate-900 rounded-full"></div>
              <span className="text-[18px] font-bold text-slate-900 uppercase tracking-wide">
                {trimmed.replace(/^[🔹🔸◆◇►▪★]\s*/u, '')}
              </span>
            </div>
          );
        }

        const isPoint = /^[-•○*-–]/.test(trimmed);
        return (
          <div key={i} className={`flex items-start gap-4 text-[18px] text-slate-800 leading-[1.8] font-medium ${isPoint ? 'pl-4' : ''}`}>
            <div className="mt-2.5 w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
            <span className="flex-1">{trimmed.replace(/^[-•○*-–]\s*/, '')}</span>
          </div>
        );
      })}
    </div>
  );
};
