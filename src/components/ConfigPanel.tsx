import React from 'react';
import { ConfigOptions } from '../types';
import { Sliders, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConfigPanelProps {
  options: ConfigOptions;
  onChangeOptions: (newOptions: ConfigOptions) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ options, onChangeOptions }) => {
  const toggleOption = (key: keyof ConfigOptions) => {
    if (typeof options[key] === 'boolean') {
      onChangeOptions({
        ...options,
        [key]: !options[key],
      });
    }
  };

  return (
    <div id="config" className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-950/60 border border-orange-800/40 text-orange-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Eklenti ve Kod Kuralları</h2>
            <p className="text-xs text-slate-400">GitHub deponuzda ve Brave Browser'da aktif olacak temizlik kurallarını seçin.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Main Option 1: Hide For You */}
        <div
          onClick={() => toggleOption('hideForYou')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            options.hideForYou
              ? 'bg-orange-950/30 border-orange-500/60 text-white'
              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm mb-1 text-slate-100 flex items-center gap-2">
              <span>"Sana Özel" Sekmesini Gizle</span>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.hideForYou ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>
              ✓
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Twitter/X üst barındaki algoritma tabanlı "Sana Özel" (For You) sekmesini tamamen gizler.
          </p>
        </div>

        {/* Option 2: Auto switch to Following */}
        <div
          onClick={() => toggleOption('autoSwitchToFollowing')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            options.autoSwitchToFollowing
              ? 'bg-orange-950/30 border-orange-500/60 text-white'
              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm mb-1 text-slate-100 flex items-center gap-2">
              <span>Otomatik "Takip Edilenler" Sekmesine Geç</span>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.autoSwitchToFollowing ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>
              ✓
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sayfa ilk açıldığında doğrudan "Takip Edilenler" akışına tıklar ve yönlendirir.
          </p>
        </div>

        {/* Option 3: Hide Grok */}
        <div
          onClick={() => toggleOption('hideGrok')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            options.hideGrok
              ? 'bg-orange-950/30 border-orange-500/60 text-white'
              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm mb-1 text-slate-100 flex items-center gap-2">
              <span>Grok AI Sekmesini Gizle</span>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.hideGrok ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>
              ✓
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sol navigasyon menüsündeki "Grok" bağlantısını ve sekmesini kaldırır.
          </p>
        </div>

        {/* Option 4: Hide Premium */}
        <div
          onClick={() => toggleOption('hidePremium')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            options.hidePremium
              ? 'bg-orange-950/30 border-orange-500/60 text-white'
              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm mb-1 text-slate-100 flex items-center gap-2">
              <span>Premium & Abone Ol Butonlarını Gizle</span>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.hidePremium ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>
              ✓
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sol menüdeki "Premium" ve rozet alma tekliflerini tamamen gizler.
          </p>
        </div>

        {/* Option 5: Hide Who to follow */}
        <div
          onClick={() => toggleOption('hideWhoToFollow')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            options.hideWhoToFollow
              ? 'bg-orange-950/30 border-orange-500/60 text-white'
              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm mb-1 text-slate-100 flex items-center gap-2">
              <span>"Kimi Takip Etmeli" Kartını Gizle</span>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.hideWhoToFollow ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>
              ✓
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sağ sütundaki tavsiye hesap kutularını kaldırır.
          </p>
        </div>

        {/* Option 6: Multi-language Support */}
        <div className="p-4 rounded-lg border bg-slate-950/50 border-slate-800 text-slate-400">
          <div className="flex items-start justify-between mb-1">
            <span className="font-semibold text-sm text-slate-100">Çoklu Dil Desteği</span>
            <span className="text-[10px] font-mono bg-slate-800 text-orange-400 px-2 py-0.5 rounded">Otomatik</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            "Sana Özel", "For You", "Für dich", "Pour vous", "Para ti" gibi tüm dilleri kapsar.
          </p>
          <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-500">
            <span>TR</span> · <span>EN</span> · <span>DE</span> · <span>FR</span> · <span>ES</span> · <span>JA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
