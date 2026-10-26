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
      description: 'Tabbar ve + ikonu dahil üst şeridi gizleyen JavaScript kodu',
      category: 'extension',
    },
    {
      name: 'Styling Rules',
      filename: 'styles.css',
      language: 'css',
      content: stylesCss,
      description: 'Tabbar ve + butonunu gizleyen anti-flicker CSS kuralları',
      category: 'extension',
    },
    {
      name: 'UserScript (Tek Parça)',
      filename: 'twitter-hide-foryou.user.js',
      language: 'javascript',
      content: userScriptJs,
      description: 'Violentmonkey / Tampermonkey için tek tıkla kurulan UserScript',
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
      name: 'Twitter/X Classic Look & Remove Tabbar with Plus Icon (Brave)',
      version: '1.2.0',
      description: 'Brave Browser için Twitter/X sekme barını ve yanındaki + / ayarlar ikonunu tamamen kaldırır.',
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
  return `/**
 * Twitter/X Classic Look - Hide Tabbar & Plus Icon
 * Brave Browser Extension
 * https://github.com/
 */

(function () {
  'use strict';

  console.log('[X-Classic-Twitter] Script aktif: Tabbar ve + ikonu kaldırılıyor.');

  function processTabsAndPlusIcon() {
    // 1. Tablist ve onun kapsayıcı üst şeridini (+ ikonu dahil) gizle
    const tabList = document.querySelector('div[role="tablist"]');
    if (tabList) {
      const parentRow = tabList.parentElement;
      if (parentRow && parentRow.tagName !== 'BODY') {
        parentRow.style.display = 'none';
      } else {
        tabList.style.display = 'none';
      }
    }

    // 2. Yan taraftaki + ikonu / Ayarlar butonunu doğrudan gizle
    const plusButtons = document.querySelectorAll(
      'a[href*="/settings/timeline"], div[aria-label*="Timeline"], div[aria-label*="Zaman akışı"], div[aria-label*="Özel akış"], div[aria-label*="Pin"]'
    );
    plusButtons.forEach(btn => {
      btn.style.display = 'none';
    });

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
        processTabsAndPlusIcon();
        isThrottled = false;
      });
    }
  });

  function init() {
    processTabsAndPlusIcon();

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
  return `/* Twitter/X Classic Look - Remove Tabbar & Plus Icon */

/* 1. Sekme barını ve yanındaki + ikonunu içeren tüm üst şeridi gizle */
div:has(> div[role="tablist"]),
div[role="tablist"],
a[href*="/settings/timeline"],
div[aria-label*="Timeline settings"],
div[aria-label*="Zaman akışı"],
div[aria-label*="Özel akış"] {
  display: none !important;
}

${options.hideGrok ? `
/* Grok Sekmesini Gizle */
a[data-testid="AppTabBar_Grok_Link"], a[href="/i/grok"] {
  display: none !important;
}
` : ''}

${options.hidePremium ? `
/* Premium / Premium'a Katıl Butonunu Gizle */
a[data-testid="AppTabBar_Premium_Link"], a[href="/i/premium_tier_upsell"] {
  display: none !important;
}
` : ''}

${options.hideWhoToFollow ? `
/* Kimi Takip Etmeli Modülünü Gizle */
aside[aria-label*="Takip"], aside[aria-label*="Who to follow"] {
  display: none !important;
}
` : ''}
`;
}

function generateUserScriptJs(options: ConfigOptions): string {
  const contentJs = generateContentJs(options);

  return `// ==UserScript==
// @name         Twitter/X Tabbar ve + İkonunu Kaldır (Brave Browser)
// @namespace    https://github.com/
// @version      1.2.0
// @description  Brave Browser için Twitter/X sekme barını ("Sana Özel", "Takip Edilenler") ve yanındaki + ikonunu tamamen kaldırır.
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
  return `! Title: Twitter/X Tabbar ve + İkonunu Kaldırma - Brave Shields Filtre Listesi
! Description: Brave Browser dahili reklam engelleyicisi (brave://adblock) için içerik filtreleme kuralları.
! Homepage: https://github.com/
! License: MIT
!

! ===================================================================
! TABBAR VE YANINDAKİ + İKONUNU DAHİL TÜM ÜST ŞERİDİ GİZLE
! ===================================================================
x.com##div:has(> div[role="tablist"])
twitter.com##div:has(> div[role="tablist"])
x.com##div[role="tablist"]
twitter.com##div[role="tablist"]
x.com##a[href*="/settings/timeline"]
twitter.com##a[href*="/settings/timeline"]
x.com##div[aria-label*="Timeline"]
twitter.com##div[aria-label*="Timeline"]
x.com##div[aria-label*="Zaman akışı"]
twitter.com##div[aria-label*="Zaman akışı"]

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
  return `# 🚫 Twitter/X Tabbar ve + İkonunu Kaldırma Kodu (Brave Browser)

Brave Browser kullanıcıları için Twitter/X (\`x.com\` & \`twitter.com\`) üzerindeki **"Sana Özel"**, **"Takip Edilenler"** sekme barını ve yanındaki **+ (Artı / Ayarlar)** ikonunu tamamen kaldırarak **Eski Sade Twitter** görünümünü sağlayan eklenti ve Brave Shields kuralları.

---

## 🚀 Özellikler

- ✅ **Tabbar ve + İkonu Kaldırma:** Sekme barını ve yanındaki ayarlar / + butonunu siler.
- ✅ **Brave Shields Uyumlu:** Eklentisiz \`brave://adblock\` içerik filtreleme kuralı.
- ✅ **Grok ve Premium Temizliği:** Sol menüdeki Grok ve reklam butonlarını kaldırır.
- ✅ **Sıfır Ekran Titremesi:** Anti-flicker CSS ön yükleme.

---

## 🛠️ Kurulum (Brave Browser)

1. Brave adres çubuğuna \`brave://adblock\` yazın.
2. **Özel Filtreler (Custom Filters)** kutusuna \`brave-shields-rules.txt\` içeriğini yapıştırıp kaydet'e basın.

**Lisans:** MIT
`;
}
