import React from 'react';
import { Github, Shield, Sliders, CheckCircle, Copy, ExternalLink, Zap } from 'lucide-react';

export const GithubGuide: React.FC = () => {
  return (
    <div id="guide" className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-orange-950/60 border border-orange-800/40 text-orange-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">İçerik Filtreleme (Content Filtering) ve GitHub Abonelik Rehberi</h2>
          <p className="text-xs text-slate-400">
            Brave Browser dahili AdBlock engelleyicisi (Brave Shields) ile eklentisiz, kodsuz içerik filtreleme yöntemi.
          </p>
        </div>
      </div>

      {/* Primary Highlight: Content Filtering Method */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-950 to-slate-950 p-6 rounded-xl border border-orange-500/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-white">Brave Shields İçerik Filtreleme Yöntemi Nedir?</h3>
          </div>
          <span className="text-[11px] font-mono bg-orange-900/40 text-orange-300 border border-orange-700/50 px-2.5 py-1 rounded-full">
            %100 Kodsuz & Eklentisiz
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Brave Browser, uBlock Origin altyapısını kullanan güçlü bir dahili **İçerik Filtreleme (Cosmetic Filtering)** sistemine sahiptir. 
          Hiçbir uzantı, JavaScript veya eklenti yüklemeden, doğrudan tarayıcının reklam engelleyicisine özel filtre kuralları vererek 
          Twitter/X "Sana Özel" sekmesini CSS bazlı olarak tamamen yok edebilirsiniz!
        </p>

        {/* Syntax highlight rule preview */}
        <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs border border-slate-800 space-y-2">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">İçerik Filtreleme (Cosmetic Filter) Kural Örneği:</div>
          <div className="text-orange-400 select-all">
            x.com##div[role="tablist"] a[role="tab"]:has-text(/Sana Özel|For You/)
          </div>
          <div className="text-orange-400 select-all">
            twitter.com##div[role="tablist"] &gt; div[role="presentation"]:first-child
          </div>
        </div>
      </div>

      {/* Grid of steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Method A: Manual Paste */}
        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-xs text-orange-400 font-mono">A</span>
            <h3>Yöntem 1: Doğrudan Brave Shields'a Yapıştırma</h3>
          </div>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li>Brave tarayıcınızda adres çubuğuna <code className="text-orange-300 font-mono">brave://adblock</code> yazıp Enter'a basın.</li>
            <li>En aşağıya inin ve <strong>Özel Filtreler (Custom Filters)</strong> metin alanını bulun.</li>
            <li>Yukarıdaki kod sekmesinde yer alan <code className="text-amber-300 font-mono">brave-shields-rules.txt</code> içeriğini kopyalayıp buraya yapıştırın.</li>
            <li><strong>Kaydet (Save)</strong> butonuna basın. Sayfayı yenilediğinizde "Sana Özel" sekmesi anında yok olacaktır.</li>
          </ol>
        </div>

        {/* Method B: GitHub Raw Subscription Link */}
        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-xs text-orange-400 font-mono">B</span>
            <h3>Yöntem 2: GitHub Otomatik Otomatik Güncellenen Filtre Listesi</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Filtre kuralınızı GitHub deponuzda barındırıp Brave'e canlı URL olarak abone edebilirsiniz:
          </p>
          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
            <li>GitHub deponuza <code>brave-shields-rules.txt</code> dosyasını yükleyin.</li>
            <li>GitHub'daki bu dosyanın <strong>Raw</strong> bağlantısını kopyalayın:
              <br />
              <span className="text-[11px] font-mono text-emerald-400 break-all bg-slate-900 px-2 py-1 rounded inline-block mt-1">
                https://raw.githubusercontent.com/KULLANICI/repo/main/brave-shields-rules.txt
              </span>
            </li>
            <li>Brave'de <code className="text-orange-300 font-mono">brave://adblock</code> sayfasına gidin ve <strong>Abonelik Ekle (Add Filter List)</strong> kutusuna bu URL'yi yapıştırın.</li>
            <li>Brave, GitHub deponuzdaki filtreyi güncelledikçe otomatik arka planda çekecektir!</li>
          </ol>
        </div>

      </div>

      {/* GitHub Repository Push Guide */}
      <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Github className="w-5 h-5 text-orange-400" />
          <h3>GitHub Deponuza Dosyaları Yükleme Adımları</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Oluşturduğunuz içerik filtreleme kurallarını ve eklenti dosyalarını GitHub'a tek komutla göndermek için:
        </p>
        <div className="bg-slate-900 p-3 rounded font-mono text-[11px] text-emerald-400 border border-slate-800 space-y-1 overflow-x-auto select-all">
          <p>git init</p>
          <p>git add .</p>
          <p>git commit -m "Add Twitter/X For You content filtering rules for Brave Shields"</p>
          <p>git branch -M main</p>
          <p>git remote add origin https://github.com/KULLANICI_ADINIZ/twitter-x-hide-foryou.git</p>
          <p>git push -u origin main</p>
        </div>
      </div>
    </div>
  );
};
