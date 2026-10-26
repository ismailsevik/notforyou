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
      description: 'Tabbar, + ikonu ve sponsorlu tweetleri gizleyen JavaScript kodu',
      category: 'extension',
    },
    {
      name: 'Styling Rules',
      filename: 'styles.css',
      language: 'css',
      content: stylesCss,
      description: 'Sponsorlu tweetleri ve sekme barını gizleyen CSS kuralları',
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
      name: 'Twitter/X Classic Look & Hide Promoted Tweets (Brave)',
      version: '1.3.0',
      description: 'Brave Browser için Twitter/X sekme barını, + ikonunu ve sponsorlu reklam tweetlerini tamamen kaldırır.',
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
 * Twitter/X Classic Look - Hide Tabbar, Plus Icon & Promoted Tweets
 * Brave Browser Extension
 * https://github.com/
 */

(function () {
  'use strict';

  console.log('[X-Classic-Twitter] Script aktif: Tabbar, + ikonu ve sponsorlu tweetler kaldırılıyor.');

  function processTabsAndPlusIcon() {
    // 1. Tablist ve üst şeridi (+ ikonu dahil) gizle
    const tabList = document.querySelector('div[role="tablist"]');
    if (tabList) {
      const parentRow = tabList.parentElement;
      if (parentRow && parentRow.tagName !== 'BODY') {
        parentRow.style.display = 'none';
      } else {
        tabList.style.display = 'none';
      }
    }

    // 2. Yan taraftaki + ikonu / Ayarlar butonunu gizle
    const plusButtons = document.querySelectorAll(
      'a[href*="/settings/timeline"], div[aria-label*="Timeline"], div[aria-label*="Zaman akışı"], div[aria-label*="Özel akış"], div[aria-label*="Pin"]'
    );
    plusButtons.forEach(btn => {
      btn.style.display = 'none';
    });

    ${options.hidePromotedTweets ? `
    // 3. Sponsorlu / Reklam Tweetlerini Gizle (Promoted Tweets)
    const articles = document.querySelectorAll('article');
    articles.forEach(article => {
      const isPromoted = article.querySelector('a[href*="/quick_promote"]') ||
                         Array.from(article.querySelectorAll('span')).some(span => {
                           const txt = (span.textContent || '').trim().toLowerCase();
                           return txt === 'sponsorlu' || txt === 'promoted' || txt === 'ad';
                         });
      if (isPromoted) {
        article.style.display = 'none';
      }
    });

    const trackingDivs = document.querySelectorAll('div[data-testid="placementTracking"]');
    trackingDivs.forEach(div => {
      const parentArticle = div.closest('article');
      if (parentArticle) parentArticle.style.display = 'none';
      else div.style.display = 'none';
    });
    ` : ''}

    ${options.hideGrok ? `
    // Grok Sekmesini Gizle
    const grokLink = document.querySelector('a[data-testid="AppTabBar_Grok_Link"], a[href="/i/grok"]');
    if (grokLink) grokLink.style.display = 'none';
    ` : ''}

    ${options.hidePremium ? `
    // Premium Butonunu Gizle
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
  let css = `/* Twitter/X Classic Look - Remove Tabbar, Plus Icon & Promoted Tweets */\n\n`;

  css += `/* 1. Sekme barını ve yanındaki + ikonunu içeren tüm üst şeridi gizle */\n`;
  css += `div:has(> div[role="tablist"]),\n`;
  css += `div[role="tablist"],\n`;
  css += `a[href*="/settings/timeline"],\n`;
  css += `div[aria-label*="Timeline settings"],\n`;
  css += `div[aria-label*="Zaman akışı"],\n`;
  css += `div[aria-label*="Özel akış"] {\n`;
  css += `  display: none !important;\n`;
  css += `}\n\n`;

  if (options.hidePromotedTweets) {
    css += `/* 2. Sponsorlu / Reklam Tweetlerini Gizle (Promoted Tweets) */\n`;
    css += `article:has(span:has-text("Sponsorlu")),\n`;
    css += `article:has(span:has-text("Promoted")),\n`;
    css += `article:has(a[href*="/quick_promote"]),\n`;
    css += `div[data-testid="placementTracking"] {\n`;
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
// @name         Twitter/X Tabbar, + İkonu ve Sponsorlu Tweetleri Kaldır (Brave)
// @namespace    https://github.com/
// @version      1.3.0
// @description  Brave Browser için Twitter/X sekme barını, + ikonunu ve sponsorlu reklam tweetlerini tamamen kaldırır.
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
  return `! Title: Twitter/X Tabbar, + İkonu ve Sponsorlu Reklamları Kaldırma - Brave Shields Filtre Listesi
! Description: Brave Browser dahili reklam engelleyicisi (brave://adblock) için içerik filtreleme kuralları.
! Homepage: https://github.com/
! License: MIT
!

! ===================================================================
! 1. TABBAR VE YANINDAKİ + İKONU DAHİL TÜM ÜST ŞERİDİ GİZLE
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

${options.hidePromotedTweets ? `
! ===================================================================
! 2. SPONSORLU / REKLAM TWEETLERİNİ GİZLE (PROMOTED TWEETS)
! ===================================================================
x.com##article:has(span:has-text(/Sponsorlu|Promoted/))
twitter.com##article:has(span:has-text(/Sponsorlu|Promoted/))
x.com##div[data-testid="placementTracking"]
twitter.com##div[data-testid="placementTracking"]
x.com##article:has(a[href*="/quick_promote"])
twitter.com##article:has(a[href*="/quick_promote"])` : ''}

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
  return `# 🚫 Twitter/X Tabbar, + İkonu ve Sponsorlu Tweetleri Kaldırma Kodu (Brave Browser)

Brave Browser kullanıcıları için Twitter/X (\`x.com\` & \`twitter.com\`) üzerindeki **"Sana Özel" / "Takip Edilenler"** sekme barını, **+ (Artı)** ikonunu ve **Sponsorlu (Promoted)** reklam tweetlerini tamamen kaldırarak **Eski Temiz Twitter** görünümünü sağlayan eklenti ve Brave Shields kuralları.

---

## 🚀 Özellikler

- ✅ **Tabbar ve + İkonu Kaldırma:** Sekme barını ve yanındaki ayarlar / + butonunu siler.
- ✅ **Sponsorlu (Reklam) Tweet Temizliği:** Akıştaki tüm sponsorlu gönderileri gizler.
- ✅ **Brave Shields Uyumlu:** Eklentisiz \`brave://adblock\` içerik filtreleme kuralı.
- ✅ **Grok ve Premium Temizliği:** Sol menüdeki Grok ve reklam butonlarını kaldırır.

---

## 🛠️ Kurulum (Brave Browser)

1. Brave adres çubuğuna \`brave://adblock\` yazın.
2. **Özel Filtreler (Custom Filters)** kutusuna \`brave-shields-rules.txt\` içeriğini yapıştırıp kaydet'e basın.

**Lisans:** MIT
`;
}
