import React from 'react';
import { ConfigOptions } from '../types';
import { Sliders, Sparkles } from 'lucide-react';

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
        
        {/* NEW PRIMARY OPTION: Classic Twitter Look (Hide Entire Tab Bar) */}
        <div
          onClick={() => toggleOption('hideEntireTablist')}
          className={`p-4 rounded-lg border cursor-pointer transition-all col-span-1 md:col-span-2 lg:col-span-3 ${
            options.hideEntireTablist
              ? 'bg-gradient-to-r from-orange-950/60 via-amber-950/30 to-slate-950 border-orange-500 text-white shadow-lg shadow-orange-950/20'
              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="font-bold text-sm mb-1 text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Eski Twitter Görünümü (Her İki Sekmeyi ve Üst Barı Tamamen Kaldır)</span>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                KULLANICI İSTEĞİ
              </span>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.hideEntireTablist ? 'bg-orange-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'}`}>
              ✓
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            Hem "Sana Özel" hem de "Takip Edilenler" sekmelerini üstten tamamen siler. Twitter/X ana sayfasını tıpkı <strong>eski klasik Twitter</strong> tasarımında olduğu gibi sekmesiz, sade ve temiz bir akışa dönüştürür.
          </p>
        </div>

        {/* Option: Hide For You only */}
        {!options.hideEntireTablist && (
          <div
            onClick={() => toggleOption('hideForYou')}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              options.hideForYou
                ? 'bg-orange-950/30 border-orange-500/60 text-white'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="font-semibold text-sm mb-1 text-slate-100">"Sana Özel" Sekmesini Gizle</div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.hideForYou ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>
                ✓
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yalnızca algoritma tabanlı "Sana Özel" (For You) sekmesini gizler.
            </p>
          </div>
        )}

        {/* Option: Grok */}
        <div
          onClick={() => toggleOption('hideGrok')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            options.hideGrok
              ? 'bg-orange-950/30 border-orange-500/60 text-white'
              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm mb-1 text-slate-100">Grok AI Sekmesini Gizle</div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.hideGrok ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>
              ✓
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sol menüdeki "Grok" bağlantısını ve sekmesini kaldırır.
          </p>
        </div>

        {/* Option: Premium */}
        <div
          onClick={() => toggleOption('hidePremium')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            options.hidePremium
              ? 'bg-orange-950/30 border-orange-500/60 text-white'
              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm mb-1 text-slate-100">Premium Butonlarını Gizle</div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.hidePremium ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>
              ✓
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sol menüdeki "Premium" ve reklam butonlarını gizler.
          </p>
        </div>

        {/* Option: Who to follow */}
        <div
          onClick={() => toggleOption('hideWhoToFollow')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            options.hideWhoToFollow
              ? 'bg-orange-950/30 border-orange-500/60 text-white'
              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="font-semibold text-sm mb-1 text-slate-100">"Kimi Takip Etmeli" Kartını Gizle</div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${options.hideWhoToFollow ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>
              ✓
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sağ sütundaki tavsiye hesap kutularını kaldırır.
          </p>
        </div>

      </div>
    </div>
  );
};
