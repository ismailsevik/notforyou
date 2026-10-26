import React, { useState } from 'react';
import { GeneratedFile } from '../types';
import { Code, Copy, Check, Download, FileCode, Terminal } from 'lucide-react';

interface CodeViewerProps {
  files: GeneratedFile[];
  onDownloadFile: (file: GeneratedFile) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ files, onDownloadFile }) => {
  const [selectedFilename, setSelectedFilename] = useState<string>(files[0]?.filename || 'content.js');
  const [copied, setCopied] = useState<boolean>(false);

  const currentFile = files.find((f) => f.filename === selectedFilename) || files[0];

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="code" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-950/60 border border-orange-800/40 text-orange-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Oluşturulan Kod Dosyaları</h2>
            <p className="text-xs text-slate-400">GitHub'da yayınlamaya veya tarayıcınızda çalıştırmaya hazır dosyalar.</p>
          </div>
        </div>

        {/* Category file buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
          </button>
          <button
            onClick={() => currentFile && onDownloadFile(currentFile)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>İndir ({currentFile?.filename})</span>
          </button>
        </div>
      </div>

      {/* File Navigation Tabs */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-4 flex flex-wrap items-center gap-1 overflow-x-auto">
        {files.map((file) => {
          const isActive = file.filename === selectedFilename;
          return (
            <button
              key={file.filename}
              onClick={() => setSelectedFilename(file.filename)}
              className={`px-4 py-3 text-xs font-mono flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-orange-500 text-orange-400 font-bold bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>{file.filename}</span>
            </button>
          );
        })}
      </div>

      {/* Description Header */}
      <div className="bg-slate-950/40 px-6 py-2.5 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>{currentFile?.description}</span>
        <span className="font-mono text-[11px] text-slate-500 uppercase">{currentFile?.language}</span>
      </div>

      {/* Code Area */}
      <div className="p-6 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed select-all">
        <pre>{currentFile?.content}</pre>
      </div>
    </div>
  );
};
