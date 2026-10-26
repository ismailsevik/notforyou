import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { ConfigOptions, GeneratedFile } from './types';
import { generateAllFiles } from './utils/codeGenerator';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { TwitterSimulator } from './components/TwitterSimulator';
import { CodeViewer } from './components/CodeViewer';
import { GithubGuide } from './components/GithubGuide';
import { ShieldCheck, Download, Github, Sparkles, MegaphoneOff } from 'lucide-react';

export default function App() {
  const [options, setOptions] = useState<ConfigOptions>({
    hideForYou: true,
    autoSwitchToFollowing: true,
    hideEntireTablist: true,
    hidePromotedTweets: true, // Enabled by default as requested
    hideGrok: true,
    hidePremium: true,
    hideSidebarTrends: false,
    hideWhoToFollow: true,
    hideVerifiedTab: false,
    targetLanguages: ['tr', 'en', 'es', 'de', 'fr', 'ja'],
  });

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const generatedFiles = useMemo(() => {
    return generateAllFiles(options);
  }, [options]);

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
      link.download = 'classic-twitter-brave-cleaner.zip';
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
      <Header onDownloadZip={handleDownloadZip} isDownloading={isDownloading} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <MegaphoneOff className="w-4 h-4 text-emerald-400" />
            <span>Sponsorlu Tweet & Sekme Temizliği Aktif</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Twitter/X Sekmelerini ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Sponsorlu Tweetleri</span> Temizleyin
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            "Sana Özel" sekmesini, + ikonunu ve akıştaki <strong>Sponsorlu (Reklam)</strong> tweetleri kaldırarak temiz bir akış elde edin.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 font-semibold text-white text-sm shadow-xl shadow-orange-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Tüm Güncellenmiş Dosyaları İndir (.ZIP)</span>
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

        <ConfigPanel options={options} onChangeOptions={setOptions} />
        <TwitterSimulator options={options} />
        <CodeViewer files={generatedFiles} onDownloadFile={handleDownloadFile} />
        <GithubGuide />

      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-slate-400">Classic Twitter & Promoted Hider for Brave</span>
          </div>
          <div>
            Eski Twitter Görünümü · %100 Reklamsız Temiz Akış
          </div>
        </div>
      </footer>
    </div>
  );
}
