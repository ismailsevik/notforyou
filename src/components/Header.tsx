import React from 'react';
import { Download, ShieldCheck, Github } from 'lucide-react';

interface HeaderProps {
  onDownloadZip: () => void;
  isDownloading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onDownloadZip, isDownloading }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950 text-slate-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      {/* Zone 1: Single text wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-9 h-9 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Brave Twitter/X Hider Kit
        </span>
      </div>

      {/* Zone 2: Concise single-line navigation links */}
      <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400">
        <a href="#simulator" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
          Canlı Simülatör
        </a>
        <a href="#config" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
          Kuralları Özelleştir
        </a>
        <a href="#code" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
          Kod Dosyaları
        </a>
        <a href="#guide" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
          GitHub Kurulum Rehberi
        </a>
      </nav>

      {/* Zone 3: Primary Action Button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onDownloadZip}
          disabled={isDownloading}
          className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 rounded-lg transition-all shadow-md hover:shadow-orange-900/30 flex items-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="inline-block animate-spin font-mono">...</span>
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>GitHub Repo ZIP İndir</span>
        </button>
      </div>
    </header>
  );
};
