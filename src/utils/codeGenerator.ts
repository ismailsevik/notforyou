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
      description: 'Üst + ikonu ve satırını kaldırır, sol menüden Premium, İçerik Stüdyosu ve Reklamları gizler JS',
      category: 'extension',
    },
    {
      name: 'Styling Rules',
      filename: 'styles.css',
      language: 'css',
      content: stylesCss,
      description: 'Üst + satırını ve Premium/İçerik Stüdyosu/Reklamlar menülerini gizleyen anti-flicker CSS',
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
      name: 'Twitter/X Clean Layout & Remove Plus Row (Brave)',
      version: '1.6.0',
      description: 'Twitter/X üst bardaki + ikonunu ve satırını kaldırır; sol menüden Premium, İçerik Stüdyosu ve Reklamları gizler.',
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
 * Twitter/X Clean Layout & Remove Plus Row
 * 1. Üst bardaki sağ taraftaki + ikonu ve o sekme satırını tamamen kaldırır.
 * 2. Sol menüyü orijinal tutar; Sadece Premium, İçerik Stüdyosu ve Reklamları gizler.
 * 3. Sponsorlu reklam tweetlerini temizler.
 * https://github.com/
 */

(function () {
  'use strict';

  console.log('[X-Clean-Brave] Betik aktif: + ikonu satırı ve reklamlar temizleniyor.');

  function cleanupUI() {
    // 1. Üst Sekme Barını, Sağdaki + İkonunu ve O Satırı Tamamen Yok Et
    const tabLists = document.querySelectorAll('div[role="tablist"], div[data-testid="ScrollSnap-List"]');
    tabLists.forEach(tabList => {
      tabList.style.display = 'none';
      if (tabList.parentElement && tabList.parentElement.tagName !== 'BODY') {
        tabList.parentElement.style.display = 'none';
      }
    });

    const plusAndSettingsRow = document.querySelectorAll(
      'a[href*="/settings/timeline"], div[aria-label*="Timeline"], div[aria-label*="Zaman akışı"], div[aria-label*="Özel akış"], div[aria-label*="Pin"], a[href*="premium_tier_upsell"], a[href*="subscribe"]'
    );
    plusAndSettingsRow.forEach(el => {
      el.style.display = 'none';
      const parentContainer = el.closest('div[style*="sticky"] > div:nth-child(2)');
      if (parentContainer) parentContainer.style.display = 'none';
    });

    // 2. Sol Menü: Orijinal menüyü koru; SADECE Premium, İçerik Stüdyosu, Reklamlar ve Grok kaldır
    const itemsToHideInMenu = document.querySelectorAll(
      'a[data-testid="AppTabBar_Premium_Link"], a[href*="/premium"], a[href*="/creator-studio"], a[href*="/analytics"], a[href*="ads.twitter.com"], a[href*="/ads"], a[data-testid="AppTabBar_Grok_Link"], a[href="/i/grok"], a[href*="/verified-orgs"], a[href*="/i/jobs"]'
    );
    itemsToHideInMenu.forEach(item => {
      item.style.display = 'none';
    });

    // 3. Konuları Özelleştir Tabbarı ve Modüllerini Kaldır
    const topicElements = document.querySelectorAll(
      'div[aria-label*="Konuları özelleştir"], div[aria-label*="Customize topics"], div[data-testid="topicsModule"], div[data-testid="TopicToFollow"], a[href*="/i/topics"]'
    );
    topicElements.forEach(el => {
      el.style.display = 'none';
    });

    // 4. Sponsorlu / Reklam Tweetlerini Gizle
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
  }

  let isThrottled = false;
  const observer = new MutationObserver(() => {
    if (!isThrottled) {
      isThrottled = true;
      requestAnimationFrame(() => {
        cleanupUI();
        isThrottled = false;
      });
    }
  });

  function init() {
    cleanupUI();

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
  return `/* Twitter/X Clean Layout - Anti-Flicker CSS for Brave Browser */

/* 1. ÜST BARDAN + İKONUNU, SEKME SATIRINI VE ABONE OL BUTONUNU TAMAMEN KALDIR */
div[role="tablist"],
div:has(> div[role="tablist"]),
div[data-testid="ScrollSnap-List"],
a[href*="premium_tier_upsell"],
a[href*="subscribe"],
a[href*="/settings/timeline"],
div[aria-label*="Timeline settings"],
div[aria-label*="Zaman akışı"],
div[aria-label*="Özel akış"],
div[aria-label*="Pin"] {
  display: none !important;
}

/* 2. SOL MENÜDEN SADECE PREMIUM, İÇERİK STÜDYOSU (CREATOR STUDIO), REKLAMLAR VE GROK KALDIR */
a[data-testid="AppTabBar_Premium_Link"],
a[href*="/premium"],
a[href*="/creator-studio"],
a[href*="/analytics"],
a[href*="ads.twitter.com"],
a[href*="/ads"],
a[data-testid="AppTabBar_Grok_Link"],
a[href="/i/grok"],
a[href*="/verified-orgs"],
a[href*="/i/jobs"] {
  display: none !important;
}

/* 3. "KONULARI ÖZELLEŞTİR" TABBAR VE MODÜLLERİNİ KALDIR */
div[aria-label*="Konuları özelleştir"],
div[aria-label*="Customize topics"],
div[data-testid="topicsModule"],
div[data-testid="TopicToFollow"],
a[href*="/i/topics"] {
  display: none !important;
}

/* 4. SPONSORLU (REKLAM) TWEETLERİ GİZLE */
article:has(span:has-text("Sponsorlu")),
article:has(span:has-text("Promoted")),
article:has(a[href*="/quick_promote"]),
div[data-testid="placementTracking"] {
  display: none !important;
}
`;
}

function generateUserScriptJs(options: ConfigOptions): string {
  const contentJs = generateContentJs(options);

  return `// ==UserScript==
// @name         Twitter/X + İkonu Satırını & Premium/Reklamlar Gizleme (Brave)
// @namespace    https://github.com/
// @version      1.6.0
// @description  Twitter/X üst bardaki + ikonunu ve sekme satırını kaldırır. Sol menüden Premium, İçerik Stüdyosu ve Reklamları gizler.
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
  return `! Title: Twitter/X + İkonu Satırını & Premium/İçerik Stüdyosu/Reklamları Kaldırma - Brave Shields Filtresi
! Description: Üst bardaki + ikonunu ve satırını kaldırır. Sol menüden Premium, İçerik Stüdyosu ve Reklamları gizler.
! Homepage: https://github.com/
! License: MIT
!

! ===================================================================
! 1. ÜST BARDAN + İKONUNU, SEKME SATIRINI VE ABONE OL BUTONUNU KALDIR
! ===================================================================
x.com##div:has(> div[role="tablist"])
twitter.com##div:has(> div[role="tablist"])
x.com##div[role="tablist"]
twitter.com##div[role="tablist"]
x.com##div[data-testid="ScrollSnap-List"]
twitter.com##div[data-testid="ScrollSnap-List"]
x.com##a[href*="/settings/timeline"]
twitter.com##a[href*="/settings/timeline"]
x.com##div[aria-label*="Timeline"]
twitter.com##div[aria-label*="Timeline"]
x.com##div[aria-label*="Zaman akışı"]
twitter.com##div[aria-label*="Zaman akışı"]
x.com##a[href*="premium_tier_upsell"]
twitter.com##a[href*="premium_tier_upsell"]

! ===================================================================
! 2. SOL MENÜ TEMİZLİĞİ (Sadece Premium, İçerik Stüdyosu, Reklamlar ve Grok Gizle)
! ===================================================================
x.com##a[data-testid="AppTabBar_Premium_Link"]
twitter.com##a[data-testid="AppTabBar_Premium_Link"]
x.com##a[href*="/premium"]
twitter.com##a[href*="/premium"]
x.com##a[href*="/creator-studio"]
twitter.com##a[href*="/creator-studio"]
x.com##a[href*="/analytics"]
twitter.com##a[href*="/analytics"]
x.com##a[href*="ads.twitter.com"]
twitter.com##a[href*="ads.twitter.com"]
x.com##a[data-testid="AppTabBar_Grok_Link"]
twitter.com##a[data-testid="AppTabBar_Grok_Link"]

! ===================================================================
! 3. SPONSORLU (REKLAM) TWEETLERİ GİZLE
! ===================================================================
x.com##article:has(span:has-text(/Sponsorlu|Promoted/))
twitter.com##article:has(span:has-text(/Sponsorlu|Promoted/))
`;
}

function generateReadmeMd(options: ConfigOptions): string {
  return `# 🚫 Twitter/X + İkonu Satırını & Premium/Reklamları Kaldırma Kodu (Brave Browser)

Brave Browser kullanıcıları için Twitter/X (\`x.com\` & \`twitter.com\`) üzerindeki **+ ikonlu sekme satırını** tamamen kaldıran, sol menüdeki **Premium**, **İçerik Stüdyosu** ve **Reklamlar** butonlarını gizleyen eklenti ve Brave Shields kuralları.

---

## 🚀 Özellikler

- ✅ **Üst + İkonu ve Satırını Kaldırır:** Üst sekme barını ve sağındaki + buton satırını yok eder.
- ✅ **Sol Menü Temizliği:** Orijinal menüyü korur, sadece Premium, İçerik Stüdyosu ve Reklamlar butonlarını gizler.
- ✅ **Sponsorlu Tweet Temizliği:** Akıştaki reklam gönderilerini kaldırır.
- ✅ **Brave Shields Uyumlu:** Eklentisiz \`brave://adblock\` içerik filtreleme kuralı.

---

## 🛠️ Kurulum (Brave Browser)

1. Brave adres çubuğuna \`brave://adblock\` yazın.
2. **Özel Filtreler (Custom Filters)** kutusuna \`brave-shields-rules.txt\` içeriğini yapıştırıp kaydet'e basın.

**Lisans:** MIT
`;
}
