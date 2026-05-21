import React from 'react';
import { PreviewProps } from '@/features/blog/types/types';

export const GooglePreview: React.FC<PreviewProps> = ({ title, slug, description, siteDomain }) => {
  // Default values so it doesn't look empty
  const displayTitle = title || "Your post title - Site Name";
  const displayUrl = `https://${siteDomain}/${slug || 'your-friendly-url'}`;
  const displayDesc = description || "Write a meta description to see how this post will appear in Google search results...";

  return (
    <div className="bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-800 font-sans max-w-[600px] mt-4 shadow-sm group">
      {/* URL / Breadcrumb */}
      <div className="flex items-center gap-3 mb-1.5">
        <div className="w-7 h-7 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800">
          <div className="w-3.5 h-3.5 bg-slate-400 dark:bg-slate-600 rounded-full opacity-50" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-slate-700 dark:text-slate-300 font-medium leading-none mb-1">{siteDomain}</span>
          <span className="text-[12px] text-slate-500 dark:text-slate-400 leading-none truncate max-w-[300px]">{displayUrl}</span>
        </div>
      </div>

      {/* Título de Google (Azul) */}
      <h3 className="text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-normal leading-tight mb-1 truncate">
        {displayTitle}
      </h3>

      {/* Descripción */}
      <p className="text-[14px] text-[#4d5156] dark:text-slate-400 leading-relaxed line-clamp-2">
        {displayDesc}
      </p>
    </div>
  );
};
