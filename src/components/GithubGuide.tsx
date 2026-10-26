import React from 'react';
import { Github, Shield, Terminal, Chrome, ExternalLink, CheckCircle } from 'lucide-react';

export const GithubGuide: React.FC = () => {
  return (
    <div id="guide" className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-orange-950/60 border border-orange-800/40 text-orange-400">
          <Github className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">GitHub Barındırma ve Brave Kurulum Rehberi</h2>
          <p className="text-xs text-slate-400">
            Kodlarınızı GitHub üzerinde nasıl yayınlayacağınızı ve Brave Browser'a nasıl ekleyeceğinizi adım adım öğrenin.
          </p>
        </div>
      </div>

      {/* Grid of steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 1: GitHub Repository Creation */}
        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-xs text-orange-400 font-mono">1</span>
            <h3>GitHub Deposu (Repository) Oluşturma</h3>
          </div>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li>GitHub hesabınıza giriş yapın ve <strong>New Repository</strong> butonuna tıklayın.</li>
            <li>Depo adını <code>twitter-x-hide-foryou</code> olarak girin.</li>
            <li>Depoyu <strong>Public (Açık)</strong> olarak seçin.</li>
            <li>Üstteki <strong>"GitHub Repo ZIP İndir"</strong> butonuna basıp indirdiğiniz dosyaları açarak deponuza yükleyin (upload files) veya Git ile gönderin:</li>
          </ol>
          <div className="bg-slate-900 p-3 rounded font-mono text-[11px] text-emerald-400 border border-slate-800 space-y-1 overflow-x-auto">
            <p>git init</p>
            <p>git add .</p>
            <p>git commit -m "Initial release for Brave Twitter For You Hider"</p>
            <p>git branch -M main</p>
            <p>git remote add origin https://github.com/KULLANICI_ADI/twitter-x-hide-foryou.git</p>
            <p>git push -u origin main</p>
          </div>
        </div>

        {/* Step 2: Brave Extensions Installation */}
        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-xs text-orange-400 font-mono">2</span>
            <h3>Brave Browser'a Eklenti Olarak Yükleme</h3>
          </div>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li>Brave tarayıcınızın adres çubuğuna <code className="text-orange-300 font-mono">brave://extensions</code> yazın ve Enter'a basın.</li>
            <li>Sağ üst köşedeki <strong>Geliştirici Modu (Developer Mode)</strong> anahtarını aktif edin.</li>
            <li>Sol üstte beliren <strong>Paketlenmemiş öge yükle (Load Unpacked)</strong> butonuna tıklayın.</li>
            <li>İndirdiğiniz klasörü (içinde <code>manifest.json</code> olan klasör) seçin.</li>
            <li>Twitter/X'i (<code className="text-sky-300 font-mono">x.com</code>) açın veya yenileyin. Sekme anında kaybolacaktır!</li>
          </ol>
          <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Tebrikler! Brave üzerinde eklentiniz başarıyla çalışıyor.</span>
          </div>
        </div>

        {/* Step 3: UserScript Alternative */}
        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-xs text-orange-400 font-mono">3</span>
            <h3>UserScript (Violentmonkey / Tampermonkey) Kurulumu</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Eğer eklenti klasörü yerine tek tıkla kurulan UserScript kullanmak isterseniz:
          </p>
          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
            <li>Brave Mağazasından <strong>Violentmonkey</strong> veya <strong>Tampermonkey</strong> yükleyin.</li>
            <li>GitHub deponuzdaki <code>twitter-hide-foryou.user.js</code> dosyasının <strong>Raw</strong> bağlantısını kopyalayın.</li>
            <li>UserScript yöneticinize ekleyin. Otomatik olarak güncellenecektir!</li>
          </ol>
        </div>

        {/* Step 4: Brave Shields Rules */}
        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-xs text-orange-400 font-mono">4</span>
            <h3>Brave Shields Dahili Reklam Engelleme Kuralları</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Brave Browser'ın kendi dahili reklam engelleyicisine hiç eklenti kurmadan CSS filtre kuralı ekleyebilirsiniz:
          </p>
          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
            <li>Brave'de <code className="text-orange-300 font-mono">brave://adblock</code> sayfasına gidin.</li>
            <li>En alttaki <strong>Özel Filtreler (Custom Filters)</strong> metin kutusuna gelin.</li>
            <li>Oluşturulan <code>brave-shields-rules.txt</code> içeriğini yapıştırın ve kaydet'e basın.</li>
          </ol>
        </div>

      </div>
    </div>
  );
};
