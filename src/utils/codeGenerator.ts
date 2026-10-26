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
      description: 'Eski Twitter görünümü sağlayan anti-flicker CSS kuralları',
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
      name: 'Twitter/X Classic Look & Hide Tabs (Brave)',
      version: '1.1.0',
      description: 'Brave Browser için Twitter/X sekmelerini ("Sana Özel" ve "Takip Edilenler") kaldırır ve eski klasik Twitter görünümü sağlar.',
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
 * Twitter/X Classic Look & Hide Tabs - Brave Browser Extension
 * Eski Twitter görünümü (Sekmesiz temiz akış)
 * https://github.com/
 */

(function () {
  'use strict';

  const CONFIG = ${JSON.stringify(options, null, 2)};
  const TARGET_FOR_YOU_TEXTS = ${JSON.stringify(targetTexts)};

  console.log('[X-Classic-Twitter] Script aktif.');

  function processTabs() {
    const tabList = document.querySelector('div[role="tablist"]');
    if (!tabList) return;

    ${options.hideEntireTablist ? `
    // ESKİ TWITTER GÖRÜNÜMÜ: Tüm üst sekme barını gizle
    if (tabList.style.display !== 'none') {
      tabList.style.display = 'none';
      console.log('[X-Classic-Twitter] Üst sekme barı tamamen kaldırıldı (Eski Twitter Görünümü).');
    }
    ` : `
    // Yalnızca "Sana Özel" sekmesini gizle
    const tabs = tabList.querySelectorAll('a[role="tab"], div[role="tab"]');
    let forYouTab = null;
    let followingTab = null;

    tabs.forEach((tab, index) => {
      const text = (tab.textContent || '').trim();
      const isForYou = TARGET_FOR_YOU_TEXTS.some(t => text.toLowerCase().includes(t.toLowerCase())) || index === 0;
      
      if (isForYou && !forYouTab) {
        forYouTab = tab;
      }
      if (index === 1 || (!isForYou && !followingTab)) {
        followingTab = tab;
      }
    });

    if (forYouTab && CONFIG.hideForYou) {
      if (forYouTab.style.display !== 'none') {
        forYouTab.style.display = 'none';
      }
      if (CONFIG.autoSwitchToFollowing && followingTab) {
        if (forYouTab.getAttribute('aria-selected') === 'true') {
          followingTab.click();
        }
      }
    }
    `}
  }

  function processExtraElements() {
    ${options.hideGrok ? `
    // Grok Sekmesini Gizle
    const grokLink = document.querySelector('a[data-testid="AppTabBar_Grok_Link"], a[href="/i/grok"]');
    if (grokLink) grokLink.style.display = 'none';
    ` : ''}

    ${options.hidePremium ? `
    // Premium / Abone Ol Butonunu Gizle
    const premiumLink = document.querySelector('a[data-testid="AppTabBar_Premium_Link"], a[href="/i/premium_tier_upsell"]');
    if (premiumLink) premiumLink.style.display = 'none';
    ` : ''}

    ${options.hideWhoToFollow ? `
    // Kimi Takip Etmeli Modülünü Gizle
    const whoToFollow = document.querySelector('aside[aria-label*="Takip"], aside[aria-label*="Who to follow"]');
    if (whoToFollow) whoToFollow.style.display = 'none';
    ` : ''}
  }

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
  let css = `/* Twitter/X Classic Look - Anti-Flicker CSS for Brave Browser */\n\n`;

  if (options.hideEntireTablist) {
    css += `/* ESKİ TWITTER GÖRÜNÜMÜ: Üst sekme barını ("Sana Özel" ve "Takip Edilenler") tamamen kaldır */\n`;
    css += `div[role="tablist"] {\n`;
    css += `  display: none !important;\n`;
    css += `}\n\n`;
  } else if (options.hideForYou) {
    css += `/* "Sana Özel" (For You) Sekmesini Gizle */\n`;
    css += `div[role="tablist"] > div[role="presentation"]:first-child,\n`;
    css += `div[role="tablist"] a[href="/home"][role="tab"]:first-child {\n`;
    css += `  display: none !important;\n`;
    css += `}\n\n`;
  }

  if (options.hideGrok) {
    css += `/* Grok Sekmesini Gizle */\n`;
    css += `a[data-testid="AppTabBar_Grok_Link"], a[href="/i/grok"] {\n`;
    css += `  display: none !important;\n`;
    css += `}\n\n`;
  }

  if (options.hidePremium) {
    css += `/* Premium / Premium'a Katıl Butonunu Gizle */\n`;
    css += `a[data-testid="AppTabBar_Premium_Link"], a[href="/i/premium_tier_upsell"] {\n`;
    css += `  display: none !important;\n`;
    css += `}\n\n`;
  }

  if (options.hideWhoToFollow) {
    css += `/* Kimi Takip Etmeli Modülünü Gizle */\n`;
    css += `aside[aria-label*="Takip"], aside[aria-label*="Who to follow"] {\n`;
    css += `  display: none !important;\n`;
    css += `}\n\n`;
  }

  return css;
}

function generateUserScriptJs(options: ConfigOptions): string {
  const contentJs = generateContentJs(options);

  return `// ==UserScript==
// @name         Eski Twitter Görünümü - Sekme Barını Gizle (Brave Browser)
// @namespace    https://github.com/
// @version      1.1.0
// @description  Brave Browser için Twitter/X 'Sana Özel' ve 'Takip Edilenler' sekmelerini kaldırır, eski temiz Twitter görünümü sağlar.
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
  return `! Title: Eski Twitter Görünümü - Brave Shields Filtre Listesi
! Description: Brave Browser dahili reklam engelleyicisi (brave://adblock) için içerik filtreleme kuralları.
! Homepage: https://github.com/
! License: MIT
!

${options.hideEntireTablist ? `! ===================================================================
! ESKİ TWITTER GÖRÜNÜMÜ: ÜST SEKME BARINI (SANA ÖZEL & TAKİP EDİLENLER) TAMAMEN KALDIR
! ===================================================================
x.com##div[role="tablist"]
twitter.com##div[role="tablist"]` : `! --- "Sana Özel" Sekmesini Gizle ---
x.com##div[role="tablist"] a[role="tab"]:has-text(/Sana Özel|For You/)
twitter.com##div[role="tablist"] a[role="tab"]:has-text(/Sana Özel|For You/)`}

${options.hideGrok ? `
! --- Grok Sekmesini Gizle ---
x.com##a[data-testid="AppTabBar_Grok_Link"]
twitter.com##a[data-testid="AppTabBar_Grok_Link"]` : ''}

${options.hidePremium ? `
! --- Premium Butonunu Gizle ---
x.com##a[data-testid="AppTabBar_Premium_Link"]
twitter.com##a[data-testid="AppTabBar_Premium_Link"]` : ''}

${options.hideWhoToFollow ? `
! --- Kimi Takip Etmeli Modülünü Gizle ---
x.com##aside[aria-label*="Takip"]
twitter.com##aside[aria-label*="Takip"]` : ''}
`;
}

function generateReadmeMd(options: ConfigOptions): string {
  return `# 🚫 Eski Twitter Görünümü - Sekmeleri Gizleme Kodu (Brave Browser)

Brave Browser kullanıcıları için Twitter/X (\`x.com\` & \`twitter.com\`) üzerindeki **"Sana Özel" (For You)** ve **"Takip Edilenler" (Following)** sekmelerini kaldırarak **Eski Klasik Twitter** görünümünü sağlayan eklenti, UserScript ve Brave Shields kuralları.

---

## 🚀 Özellikler

- ✅ **Eski Klasik Twitter Görünümü:** Üstteki karmaşık sekme barını tamamen gizler.
- ✅ **Brave Shields Uyumlu:** Eklentisiz \`brave://adblock\` içerik filtreleme kuralı.
- ✅ **Grok ve Premium Temizliği:** Sol menüdeki Grok ve reklam butonlarını kaldırır.
- ✅ **Sıfır Ekran Titremesi:** Anti-flicker CSS ön yükleme.

---

## 🛠️ Kurulum Yöntemleri (Brave Browser)

### Yöntem 1: Brave Shields İçerik Filtreleme (Kodsuz & Eklentisiz)

1. Brave adres çubuğuna \`brave://adblock\` yazın.
2. **Özel Filtreler (Custom Filters)** kutusuna \`brave-shields-rules.txt\` içeriğini yapıştırıp kaydet'e basın.

---

### Yöntem 2: Brave Geliştirici Modu ile Yükleme

1. Bu depoyu ZIP olarak indirin veya klonlayın.
2. Brave'de \`brave://extensions\` sayfasına gidin ve **Geliştirici Modu**'nu açın.
3. **Paketlenmemiş öge yükle (Load Unpacked)** butonuna basıp bu klasörü seçin.

---

## 📁 Proje Yapısı

\`\`\`text
.
├── manifest.json       # Manifest V3 eklenti tanımı
├── content.js          # Sekme kaldırıcı JS
├── styles.css          # Eski Twitter görünümü sağlayan CSS
├── twitter-hide-foryou.user.js # UserScript
├── brave-shields-rules.txt     # Brave Shields kuralı
└── README.md           # Dokümantasyon
\`\`\`

**Lisans:** MIT
`;
}
