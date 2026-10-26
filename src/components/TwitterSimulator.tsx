import React, { useState } from 'react';
import { ConfigOptions } from '../types';
import { Eye, EyeOff, Sparkles, Home, Search, Bell, Mail, Bookmark, User, Bot, Award, TrendingUp, RefreshCw, CheckCircle } from 'lucide-react';

interface TwitterSimulatorProps {
  options: ConfigOptions;
}

export const TwitterSimulator: React.FC<TwitterSimulatorProps> = ({ options }) => {
  const [extensionEnabled, setExtensionEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('following');

  // Handle active tab behavior when script is enabled
  const currentActiveTab = extensionEnabled && options.hideForYou && options.autoSwitchToFollowing ? 'following' : activeTab;

  return (
    <div id="simulator" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Simulator Top Controls Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-2 text-xs font-mono text-slate-400">Canlı Önizleme: Twitter / X (x.com/home)</span>
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
                <span>Eklenti AKTİF (Sekme Gizlendi)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Varsayılan Twitter (Orijinal Görünüm)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Twitter App View Mockup */}
      <div className="bg-black text-slate-100 min-h-[500px] flex justify-center text-sm font-sans">
        {/* Twitter Main Container */}
        <div className="w-full max-w-5xl flex border-x border-slate-800 min-h-[500px]">
          
          {/* Left Navigation Bar */}
          <div className="w-16 sm:w-60 border-r border-slate-800 p-3 flex flex-col justify-between shrink-0">
            <div className="space-y-2">
              {/* Logo */}
              <div className="p-2 text-white font-bold text-xl hover:bg-slate-900 rounded-full w-fit">
                𝕏
              </div>

              {/* Nav Items */}
              <nav className="space-y-1">
                <div className="flex items-center gap-4 p-3 font-bold hover:bg-slate-900 rounded-full text-white cursor-pointer">
                  <Home className="w-6 h-6" />
                  <span className="hidden sm:inline">Anasayfa</span>
                </div>
                <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-400 hover:text-white cursor-pointer">
                  <Search className="w-6 h-6" />
                  <span className="hidden sm:inline">Keşfet</span>
                </div>
                <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-400 hover:text-white cursor-pointer">
                  <Bell className="w-6 h-6" />
                  <span className="hidden sm:inline">Bildirimler</span>
                </div>

                {/* Grok Item */}
                {(!extensionEnabled || !options.hideGrok) ? (
                  <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-400 hover:text-white cursor-pointer transition-all">
                    <Bot className="w-6 h-6 text-sky-400" />
                    <span className="hidden sm:inline">Grok</span>
                  </div>
                ) : (
                  <div className="hidden sm:block p-2 text-[10px] text-orange-400/60 font-mono italic border border-dashed border-orange-500/20 rounded">
                    [Grok gizlendi]
                  </div>
                )}

                {/* Premium Item */}
                {(!extensionEnabled || !options.hidePremium) ? (
                  <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-400 hover:text-white cursor-pointer transition-all">
                    <Award className="w-6 h-6 text-amber-400" />
                    <span className="hidden sm:inline">Premium</span>
                  </div>
                ) : (
                  <div className="hidden sm:block p-2 text-[10px] text-orange-400/60 font-mono italic border border-dashed border-orange-500/20 rounded">
                    [Premium gizlendi]
                  </div>
                )}

                <div className="flex items-center gap-4 p-3 hover:bg-slate-900 rounded-full text-slate-400 hover:text-white cursor-pointer">
                  <User className="w-6 h-6" />
                  <span className="hidden sm:inline">Profil</span>
                </div>
              </nav>
            </div>

            <div className="p-3 flex items-center gap-3 hover:bg-slate-900 rounded-full cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
                BS
              </div>
              <div className="hidden sm:block text-xs">
                <div className="font-bold">Brave User</div>
                <div className="text-slate-500">@brave_user</div>
              </div>
            </div>
          </div>

          {/* Central Feed Section */}
          <div className="flex-1 min-w-0 border-r border-slate-800 flex flex-col">
            
            {/* Feed Header Tabs */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-slate-800 z-10">
              <div className="px-4 py-3 font-bold text-lg">Anasayfa</div>

              {/* Tabs list */}
              <div className="flex border-t border-slate-800/80 font-medium text-sm">
                
                {/* FOR YOU TAB */}
                {(!extensionEnabled || !options.hideForYou) ? (
                  <button
                    onClick={() => setActiveTab('foryou')}
                    className={`flex-1 py-3.5 text-center relative hover:bg-slate-900/50 transition-colors ${
                      currentActiveTab === 'foryou' ? 'text-white font-bold' : 'text-slate-500'
                    }`}
                  >
                    <span>Sana Özel</span>
                    {currentActiveTab === 'foryou' && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-sky-500 rounded-full" />
                    )}
                  </button>
                ) : (
                  <div className="px-4 py-2 my-1 text-center font-mono text-xs text-orange-400 bg-orange-950/30 border border-orange-500/30 rounded flex items-center justify-center gap-2">
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>"Sana Özel" (For You) Sekmesi Gizlendi</span>
                  </div>
                )}

                {/* FOLLOWING TAB */}
                <button
                  onClick={() => setActiveTab('following')}
                  className={`flex-1 py-3.5 text-center relative hover:bg-slate-900/50 transition-colors ${
                    currentActiveTab === 'following' ? 'text-white font-bold' : 'text-slate-500'
                  }`}
                >
                  <span>Takip Edilenler</span>
                  {currentActiveTab === 'following' && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-sky-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Feed Content */}
            <div className="divide-y divide-slate-800">
              
              {/* Active Tab Notice */}
              <div className="p-3 bg-slate-950 text-xs text-slate-400 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Şu Anki Akış: <strong>{currentActiveTab === 'following' ? 'Takip Edilenler (Kronolojik)' : 'Sana Özel (Algoritma Önerileri)'}</strong></span>
                </div>
                {extensionEnabled && options.hideForYou && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                    Algoritma Engellendi
                  </span>
                )}
              </div>

              {/* Tweet 1 */}
              <div className="p-4 hover:bg-slate-950/40 transition-colors flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 shrink-0 flex items-center justify-center font-bold text-xs">
                  TB
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">Tech Brave Developer</span>
                    <span className="text-slate-500">@techbrave · 12dk</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    Brave Browser eklentimiz sayesinde Twitter/X 'Sana Özel' sekmesi olmadan %100 kronolojik ve temiz bir akış elde ediyoruz! 🚀
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
                    <span className="font-bold text-white">Open Source Software</span>
                    <span className="text-slate-500">@oss_community · 45dk</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    GitHub üzerinde barındırabileceğiniz bu Manifest V3 eklentisi ve UserScript tüm dillerdeki "For You" başlıklarını algılıyor.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Sidebar Section */}
          <div className="hidden lg:block w-72 p-4 space-y-4 shrink-0">
            
            {/* Search */}
            <div className="bg-slate-900 rounded-full px-4 py-2.5 text-slate-400 text-xs flex items-center gap-3 border border-slate-800">
              <Search className="w-4 h-4 text-slate-500" />
              <span>Ara</span>
            </div>

            {/* Who To Follow Sidebar */}
            {(!extensionEnabled || !options.hideWhoToFollow) ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-white text-sm">Kimi Takip Etmeli</h3>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold">GH</div>
                    <div>
                      <div className="font-bold text-white">GitHub</div>
                      <div className="text-slate-500">@github</div>
                    </div>
                  </div>
                  <button className="bg-white text-black font-bold px-3 py-1 rounded-full text-xs">Takip Et</button>
                </div>
              </div>
            ) : (
              <div className="p-3 text-[11px] font-mono text-orange-400/60 border border-dashed border-orange-500/20 rounded-xl">
                [Kimi Takip Etmeli Modülü Eklenti Tarafından Gizlendi]
              </div>
            )}

            {/* Trends Sidebar */}
            {(!extensionEnabled || !options.hideSidebarTrends) ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-white text-sm">Gündemdekiler</h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-slate-500 text-[10px]">Türkiye konumunda gündemde</div>
                    <div className="font-bold text-white">#BraveBrowser</div>
                    <div className="text-slate-500 text-[10px]">14,2 B gönderi</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 text-[11px] font-mono text-orange-400/60 border border-dashed border-orange-500/20 rounded-xl">
                [Gündemdekiler Modülü Gizlendi]
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
