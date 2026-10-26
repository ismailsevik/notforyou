import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { ConfigOptions, GeneratedFile } from './types';
import { generateAllFiles } from './utils/codeGenerator';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { TwitterSimulator } from './components/TwitterSimulator';
import { CodeViewer } from './components/CodeViewer';
import { GithubGuide } from './components/GithubGuide';
import { ShieldCheck, Sparkles, Download, Github, CheckCircle, Code } from 'lucide-react';

export default function App() {
  const [options, setOptions] = useState<ConfigOptions>({
    hideForYou: true,
    autoSwitchToFollowing: true,
    hideGrok: true,
    hidePremium: true,
    hideSidebarTrends: false,
    hideWhoToFollow: true,
    hideVerifiedTab: false,
    targetLanguages: ['tr', 'en', 'es', 'de', 'fr', 'ja'],
  });

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Dynamically generated files based on selected options
  const generatedFiles = useMemo(() => {
    return generateAllFiles(options);
  }, [options]);

  // Download all files as a clean GitHub Repository ZIP archive
  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();

      generatedFiles.forEach((file) => {
        zip.file(file.filename, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'twitter-x-hide-foryou-brave.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP indirme hatası:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download individual file
  const handleDownloadFile = (file: GeneratedFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header onDownloadZip={handleDownloadZip} isDownloading={isDownloading} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Brave Browser & GitHub Uyumlu Kod Jeneratörü</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Twitter/X <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">"Sana Özel"</span> Sekmesini Gizleyin
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Algoritmik Twitter akışını kapatıp temiz, kronolojik <strong>"Takip Edilenler"</strong> akışına geçin. 
            GitHub üzerinde barındırmaya hazır eklenti (Manifest V3), UserScript ve Brave Shields kuralları 1 tıkla elinizin altında!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 font-semibold text-white text-sm shadow-xl shadow-orange-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Tüm GitHub Projesini İndir (.ZIP)</span>
            </button>
            <a
              href="#guide"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Kurulum Rehberi</span>
            </a>
          </div>
        </div>

        {/* 1. Customization Configurator */}
        <ConfigPanel options={options} onChangeOptions={setOptions} />

        {/* 2. Live Interactive Twitter Simulator */}
        <TwitterSimulator options={options} />

        {/* 3. Generated Code Viewer & File Downloads */}
        <CodeViewer files={generatedFiles} onDownloadFile={handleDownloadFile} />

        {/* 4. GitHub Hosting & Brave Setup Step-by-Step Guide */}
        <GithubGuide />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-slate-400">Brave Browser Twitter For You Hider</span>
          </div>
          <div>
            Açık Kaynak Kod Paketi · GitHub Uyumlu · Manifest V3
          </div>
        </div>
      </footer>
    </div>
  );
}
