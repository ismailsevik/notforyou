import { ConfigOptions, GeneratedFile } from '../types';

export function generateAllFiles(options: ConfigOptions): GeneratedFile[] {
  const manifestJson = generateManifestJson(options);
  const contentJs = generateContentJs(options);
  const stylesCss = generateStylesCss(options);
  const userScriptJs = generateUserScriptJs(options);
  const braveShieldsTxt = generateBraveShieldsTxt(options);
  const readmeMd = generateReadmeMd(options);

  return [
    {
      name: 'Manifest (MV3)',
      filename: 'manifest.json',
      language: 'json',
      content: manifestJson,
      description: 'Brave / Chrome Eklentisi yapılandırma dosyası (Manifest V3)',
      category: 'extension',
    },
    {
      name: 'Content Script',
      filename: 'content.js',
      language: 'javascript',
      content: contentJs,
      description: 'Twitter/X DOM elemanlarını algılayan ve gizleyen ana JavaScript kodu',
      category: 'extension',
    },
    {
      name: 'Styling Rules',
      filename: 'styles.css',
      language: 'css',
      content: stylesCss,
      description: 'Ekran titremesini (flicker) önleyen CSS kuralları',
      category: 'extension',
    },
    {
      name: 'UserScript (Tek Parça)',
      filename: 'twitter-hide-foryou.user.js',
      language: 'javascript',
      content: userScriptJs,
      description: 'Violentmonkey / Tampermonkey eklentisi için tek tıkla kurulan UserScript',
      category: 'userscript',
    },
    {
      name: 'Brave Shields Filtresi',
      filename: 'brave-shields-rules.txt',
      language: 'text',
      content: braveShieldsTxt,
      description: 'Brave Dahili Reklam Engelleyici (brave://adblock) için CSS Filtre Kuralı',
      category: 'braveshields',
    },
    {
      name: 'GitHub README',
      filename: 'README.md',
      language: 'markdown',
      content: readmeMd,
      description: 'GitHub deponuz için hazır Türkçe dokümantasyon',
      category: 'github',
    },
  ];
}

function generateManifestJson(options: ConfigOptions): string {
  return JSON.stringify(
    {
      manifest_version: 3,
      name: 'Twitter/X Hide For You Tab (Brave)',
      version: '1.0.0',
      description: 'Brave Browser için Twitter/X "Sana Özel" (For You) sekmesini tamamen gizler ve Takip Edilenler sekmesine yönlendirir.',
      author: 'GitHub Community',
      icons: {
        "16": "icon16.png",
        "48": "icon48.png",
        "128": "icon128.png"
      },
      content_scripts: [
        {
          matches: [
            'https://twitter.com/*',
            'https://x.com/*'
          ],
          js: ['content.js'],
          css: ['styles.css'],
          run_at: 'document_start'
        }
      ],
      permissions: []
    },
    null,
    2
  );
}

function generateContentJs(options: ConfigOptions): string {
  const targetTexts = [
    'Sana Özel',
    'For You',
    'Para ti',
    'Für dich',
    'Pour vous',
    'おすすめ'
  ];

  return `/**
 * Twitter/X Hide "For You" Tab - Brave Browser Extension
 * GitHub'da barındırılmak üzere oluşturulmuştur.
 * https://github.com/
 */

(function () {
  'use strict';

  const CONFIG = ${JSON.stringify(options, null, 2)};
  const TARGET_FOR_YOU_TEXTS = ${JSON.stringify(targetTexts)};

  console.log('[X-ForYou-Hider] Script başlatıldı.');

  // "Sana Özel" sekmesini bul ve gizle / "Takip Edilenler" sekmesine geç
  function processTabs() {
    // Twitter/X tablist seçicisi
    const tabList = document.querySelector('div[role="tablist"]');
    if (!tabList) return;

    const tabs = tabList.querySelectorAll('a[role="tab"], div[role="tab"]');
    let forYouTab = null;
    let followingTab = null;

    tabs.forEach((tab, index) => {
      const text = (tab.textContent || '').trim();
      const isForYou = TARGET_FOR_YOU_TEXTS.some(t => text.toLowerCase().includes(t.toLowerCase())) || index === 0;
      
      if (isForYou && !forYouTab) {
        // Eğer ilk sekme ve text eşleşiyorsa veya bilinen bir text ise
        if (TARGET_FOR_YOU_TEXTS.some(t => text.toLowerCase().includes(t.toLowerCase()))) {
          forYouTab = tab;
        } else if (index === 0 && tabs.length >= 2) {
          // Fallback: Twitter'ın ilk sekmesi varsayılan olarak "For You" dur
          forYouTab = tab;
        }
      }

      if (index === 1 || (!isForYou && !followingTab)) {
        followingTab = tab;
      }
    });

    // 1. "Sana Özel" sekmesini gizle
    if (forYouTab && CONFIG.hideForYou) {
      if (forYouTab.style.display !== 'none') {
        forYouTab.style.display = 'none';
        forYouTab.setAttribute('aria-hidden', 'true');
        console.log('[X-ForYou-Hider] "Sana Özel" sekmesi gizlendi.');
      }

      // 2. Otomatik "Takip Edilenler" sekmesine yönlendir (Eğer şu an Sana Özel aktifse)
      if (CONFIG.autoSwitchToFollowing && followingTab) {
        const isSelected = forYouTab.getAttribute('aria-selected') === 'true' || 
                           window.location.pathname === '/home';
        
        // Eğer URL tam /home ve ilk sekme aktif görünüyorsa takip edilenlere tıkla
        if (isSelected && forYouTab.getAttribute('aria-selected') === 'true') {
          console.log('[X-ForYou-Hider] "Takip Edilenler" sekmesine otomatik geçiliyor...');
          followingTab.click();
        }
      }
    }
  }

  // Ekstra Temizlik Kuralları
  function processExtraElements() {
    ${options.hideGrok ? `
    // Grok Sekmesini Gizle
    const grokLink = document.querySelector('a[data-testid="AppTabBar_Grok_Link"]');
    if (grokLink) grokLink.style.display = 'none';
    ` : ''}

    ${options.hidePremium ? `
    // Premium / Abone Ol Butonunu Gizle
    const premiumLink = document.querySelector('a[data-testid="AppTabBar_Premium_Link"], a[href="/i/premium_tier_upsell"]');
    if (premiumLink) premiumLink.style.display = 'none';
    ` : ''}

    ${options.hideSidebarTrends ? `
    // Sağ Menü Trendler (Gündemdekiler) Gizle
    const sidebarTrends = document.querySelector('section[aria-labelledby*="accessible-list"]');
    if (sidebarTrends) {
      const parentCard = sidebarTrends.closest('div[data-testid="sidebarColumn"]');
      if (parentCard) {
        // Trendler ve Takip Edilecekler modülünü kontrol et
      }
    }
    ` : ''}

    ${options.hideWhoToFollow ? `
    // Kimi Takip Etmeli Modülünü Gizle
    const whoToFollow = document.querySelector('aside[aria-label*="Takip"], aside[aria-label*="Who to follow"]');
    if (whoToFollow) whoToFollow.style.display = 'none';
    ` : ''}
  }

  // DOM değişikliklerini izlemek için MutationObserver
  let isThrottled = false;
  const observer = new MutationObserver(() => {
    if (!isThrottled) {
      isThrottled = true;
      requestAnimationFrame(() => {
        processTabs();
        processExtraElements();
        isThrottled = false;
      });
    }
  });

  // Sayfa yüklendiğinde ve dinamik içerik değiştikçe çalıştır
  function init() {
    processTabs();
    processExtraElements();

    const targetNode = document.body || document.documentElement;
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;
}

function generateStylesCss(options: ConfigOptions): string {
  let css = `/* Twitter/X Hide For You Tab - Anti-Flicker CSS for Brave Browser */\n\n`;

  if (options.hideForYou) {
    css += `/* "Sana Özel" (For You) Sekmesini Gizle */\n`;
    css += `div[role="tablist"] > div[role="presentation"]:first-child,\n`;
    css += `div[role="tablist"] a[href="/home"][role="tab"]:first-child {\n`;
    css += `  display: none !important;\n`;
    css += `}\n\n`;
  }

  if (options.hideGrok) {
    css += `/* Grok Sekmesini Gizle */\n`;
    css += `a[data-testid="AppTabBar_Grok_Link"] {\n`;
    css += `  display: none !important;\n`;
    css += `}\n\n`;
  }

  if (options.hidePremium) {
    css += `/* Premium / Premium'a Katıl Butonunu Gizle */\n`;
    css += `a[data-testid="AppTabBar_Premium_Link"],\n`;
    css += `a[href="/i/premium_tier_upsell"] {\n`;
    css += `  display: none !important;\n`;
    css += `}\n\n`;
  }

  if (options.hideWhoToFollow) {
    css += `/* Kimi Takip Etmeli Modülünü Gizle */\n`;
    css += `aside[aria-label*="Takip"],\n`;
    css += `aside[aria-label*="Who to follow"] {\n`;
    css += `  display: none !important;\n`;
    css += `}\n\n`;
  }

  return css;
}

function generateUserScriptJs(options: ConfigOptions): string {
  const contentJs = generateContentJs(options);

  return `// ==UserScript==
// @name         Twitter/X Sana Özel Sekmesini Gizle (Brave Browser)
// @namespace    https://github.com/
// @version      1.0.0
// @description  Brave Browser için Twitter/X 'Sana Özel' (For You) sekmesini gizler, Takip Edilenler sekmesine otomatik geçer.
// @author       GitHub Developer
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @run-at       document-start
// @grant        none
// ==UserScript==

${contentJs}
`;
}

function generateBraveShieldsTxt(options: ConfigOptions): string {
  return `! Title: Twitter/X Hide For You & Extra Clean Rules for Brave Shields
! Description: Brave Browser dahili AdBlock / Brave Shields (brave://adblock) için özel CSS filtre kuralları.
! Homepage: https://github.com/
!

! --- Twitter / X "Sana Özel" (For You) Sekmesini Gizle ---
${options.hideForYou ? `x.com##div[role="tablist"] > div[role="presentation"]:first-child
twitter.com##div[role="tablist"] > div[role="presentation"]:first-child
x.com##div[role="tablist"] a[role="tab"]:first-child
twitter.com##div[role="tablist"] a[role="tab"]:first-child` : '! For You sekmesi aktif'}

${options.hideGrok ? `! --- Grok Butonunu Gizle ---
x.com##a[data-testid="AppTabBar_Grok_Link"]
twitter.com##a[data-testid="AppTabBar_Grok_Link"]` : ''}

${options.hidePremium ? `! --- Premium Butonunu Gizle ---
x.com##a[data-testid="AppTabBar_Premium_Link"]
twitter.com##a[data-testid="AppTabBar_Premium_Link"]` : ''}

${options.hideWhoToFollow ? `! --- Kimi Takip Etmeli Modülünü Gizle ---
x.com##aside[aria-label*="Takip"]
twitter.com##aside[aria-label*="Takip"]` : ''}
`;
}

function generateReadmeMd(options: ConfigOptions): string {
  return `# 🚫 Twitter/X "Sana Özel" (For You) Sekmesini Gizleme Kodu (Brave Browser)

Brave Browser kullanıcıları için Twitter/X (\`x.com\` & \`twitter.com\`) üzerindeki algoritma destekli **"Sana Özel" (For You)** sekmesini tamamen gizleyen ve doğrudan **"Takip Edilenler" (Following)** akışına yönlendiren açık kaynaklı eklenti ve UserScript.

---

## 🚀 Özellikler

- ✅ **Sana Özel Sekmesini Tamamen Gizler:** Algoritmanın dayattığı tweetler yerine temiz akış sağlar.
${options.autoSwitchToFollowing ? '- ✅ **Otomatik Yönlendirme:** Sayfa açıldığında doğrudan "Takip Edilenler" sekmesine geçer.\n' : ''}${options.hideGrok ? '- ✅ **Grok Temizliği:** Sol menüdeki Grok sekmesini gizler.\n' : ''}${options.hidePremium ? '- ✅ **Premium Temizliği:** Premium reklam butonlarını kaldırır.\n' : ''}- ✅ **Brave Browser Uyumlu:** Brave Shields, Manifest V3 Eklentisi veya Violentmonkey ile %100 uyumlu.
- ✅ **Sıfır Ekran Titremesi (Anti-Flicker):** CSS ön yükleme ile sekme yüklenirken gözüküp kaybolmaz.

---

## 🛠️ Kurulum Yöntemleri (Brave Browser)

### Yöntem 1: Brave Gelistirici Modu ile Yükleme (Önerilen)

1. Bu depoyu **ZIP** olarak indirin ve bir klasöre çıkartın.
2. Brave tarayıcınızda adres çubuğuna \`brave://extensions\` yazın ve Enter'a basın.
3. Sağ üst köşedeki **Geliştirici Modu (Developer Mode)** anahtarını açın.
4. **Paketlenmemiş öge yükle (Load Unpacked)** butonuna tıklayın.
5. İndirdiğiniz klasörü seçin. Eklenti anında aktif olacaktır!

---

### Yöntem 2: UserScript ile Yükleme (Violentmonkey / Tampermonkey)

1. Brave Tarayıcınıza **Violentmonkey** veya **Tampermonkey** eklentisini kurun.
2. Depodaki \`twitter-hide-foryou.user.js\` dosyasına tıklayın veya Raw bağlantısını kopyalayın.
3. UserScript yöneticinize ekleyin ve kaydedin.

---

### Yöntem 3: Brave Shields Özel Filtre Kuralı ile (Kodsuz / Eklentisiz)

1. Brave adres çubuğuna \`brave://adblock\` yazın.
2. En aşağıya inin ve **Özel Filtreler (Custom Filters)** kutusunu bulun.
3. \`brave-shields-rules.txt\` dosyasındaki kuralları yapıştırın ve **Kaydet** butonuna basın.

---

## 📁 Proje Yapısı

\`\`\`text
.
├── manifest.json       # Chrome/Brave Manifest V3 eklenti tanımı
├── content.js          # DOM takipçisi ve sekme değiştirici JS
├── styles.css          # Anti-flicker CSS gizleme kuralları
├── twitter-hide-foryou.user.js # Tek dosya UserScript sürümü
├── brave-shields-rules.txt     # Brave Shields reklam engelleyici kuralı
└── README.md           # Proje rehberi
\`\`\`

---

## 🤝 Katkıda Bulunma

Hata bildirimleri ve geliştirmeler için Pull Request göndermekten çekinmeyin!

**Lisans:** MIT
`;
}
