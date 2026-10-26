import React, { useState } from 'react';
import { ConfigOptions } from '../types';
import { Eye, EyeOff, Home, Search, Bell, Mail, Bookmark, User, Settings, ShieldCheck } from 'lucide-react';

interface TwitterSimulatorProps {
  options: ConfigOptions;
}

export const TwitterSimulator: React.FC<TwitterSimulatorProps> = ({ options }) => {
  const [extensionEnabled, setExtensionEnabled] = useState<boolean>(true);

  return (
    <div id="simulator" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Simulator Top Controls Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-2 text-xs font-mono text-slate-400">Canlı Önizleme: Twitter / X (x.com)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Brave Eklentisi / Kodu:</span>
          <button
            onClick={() => setExtensionEnabled(!extensionEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              extensionEnabled
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {extensionEnabled ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Eklenti AKTİF (+ Satırı & Premium/Reklamlar Gizli)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Varsayılan Twitter (+ Satırı & Tüm Menüler Var)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Twitter App View Mockup */}
      <div className="bg-black text-slate-100 min-h-[520px] flex justify-center text-sm font-sans">
        <div className="w-full max-w-5xl flex border-x border-slate-800 min-h-[520px]">
          
          {/* Left Navigation Bar - RESTORED ORIGINAL MENU EXCEPT PREMIUM, CREATOR STUDIO, ADS */}
          <div className="w-16 sm:w-60 border-r border-slate-800 p-3 flex flex-col justify-between shrink-0">
            <div className="space-y-2">
              <div className="p-2 text-white font-bold text-xl hover:bg-slate-900 rounded-full w-fit">
                𝕏
              </div>

              <nav className="space-y-1">
                <div className="flex items-center gap-4 p-3 font-bold hover:bg-slate-900 rounded-full text-white cursor-pointer">
                  <Home className="w-6 h-6" />
                  <span className="hidden sm:inline">Anasayfa</span>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-300 hover:text-white cursor-pointer">
                  <Search className="w-6 h-6" />
                  <span className="hidden sm:inline">Keşfet</span>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-300 hover:text-white cursor-pointer">
                  <Bell className="w-6 h-6" />
                  <span className="hidden sm:inline">Bildirimler</span>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-300 hover:text-white cursor-pointer">
                  <Mail className="w-6 h-6" />
                  <span className="hidden sm:inline">Mesajlar</span>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-300 hover:text-white cursor-pointer">
                  <Bookmark className="w-6 h-6" />
                  <span className="hidden sm:inline">Kaydedilenler</span>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-300 hover:text-white cursor-pointer">
                  <User className="w-6 h-6" />
                  <span className="hidden sm:inline">Profil</span>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-300 hover:text-white cursor-pointer">
                  <Settings className="w-6 h-6" />
                  <span className="hidden sm:inline">Ayarlar</span>
                </div>

                {extensionEnabled && (
                  <div className="hidden sm:block p-2 text-[10px] text-orange-400/80 font-mono italic border border-dashed border-orange-500/20 rounded mt-3">
                    [Premium, İçerik Stüdyosu & Reklamlar kaldırıldı]
                  </div>
                )}
              </nav>
            </div>

            {/* Account Profile Box */}
            <div className="p-3 flex items-center justify-between hover:bg-slate-900 rounded-full cursor-pointer border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
                  BS
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-bold text-white">Brave User</div>
                  <div className="text-slate-500 text-[11px]">@brave_user</div>
                </div>
              </div>
            </div>
          </div>

          {/* Central Feed Section */}
          <div className="flex-1 min-w-0 border-r border-slate-800 flex flex-col">
            
            {/* Feed Header - NO TABBAR ROW, NO + ICON ROW */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-slate-800 z-10">
              <div className="px-4 py-3.5 font-bold text-lg flex items-center justify-between">
                <span>Anasayfa</span>
                {extensionEnabled && (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    + Satırı ve Sekme Barı Kaldırıldı
                  </span>
                )}
              </div>

              {/* UNFILTERED STATE ONLY: SHOWS THE + ICON AND TABBAR ROW */}
              {!extensionEnabled && (
                <div className="flex items-center border-t border-slate-800/80 font-medium text-sm px-2">
                  <div className="flex-1 py-3 text-center text-white font-bold border-b-2 border-sky-500">
                    Sana Özel
                  </div>
                  <div className="flex-1 py-3 text-center text-slate-500">
                    Takip Edilenler
                  </div>
                  <div className="px-3 py-2 text-slate-400 hover:text-white cursor-pointer font-bold">
                    +
                  </div>
                </div>
              )}
            </div>

            {/* Feed Content */}
            <div className="divide-y divide-slate-800">
              <div className="p-3 bg-slate-950 text-xs text-slate-400 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Sol Menü: <strong>Orijinal Menü (Premium, İçerik Stüdyosu, Reklamlar Gizli)</strong></span>
                </div>
              </div>

              {/* Tweet 1 */}
              <div className="p-4 hover:bg-slate-950/40 transition-colors flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 shrink-0 flex items-center justify-center font-bold text-xs">
                  TB
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">Tech Brave Developer</span>
                    <span className="text-slate-500">@techbrave · 10dk</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    Üst bardaki + ikonu ve sekme satırı tamamen kaldırıldı! Sol menüde orijinal görünüm korunarak Premium, İçerik Stüdyosu ve Reklamlar gizlendi. 🎯
                  </p>
                </div>
              </div>

              {/* Tweet 2 */}
              <div className="p-4 hover:bg-slate-950/40 transition-colors flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 shrink-0 flex items-center justify-center font-bold text-xs">
                  OSS
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">Open Source Community</span>
                    <span className="text-slate-500">@oss_community · 30dk</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    Brave Shields `brave://adblock` içerik filtreleme kuralları güncellendi.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-72 p-4 space-y-4 shrink-0">
            <div className="p-3 text-[11px] font-mono text-emerald-400/80 border border-dashed border-emerald-500/20 rounded-xl bg-slate-950">
              ✓ Sol menü orijinal haline getirildi
              <br />
              ✓ Premium, İçerik Stüdyosu & Reklamlar kaldırıldı
              <br />
              ✓ Üst bardaki + ikonu ve o satır kaldırıldı
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
