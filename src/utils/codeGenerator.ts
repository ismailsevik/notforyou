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
      description: 'Sol menüyü, üst tabbarı, + ikonunu, Abone Ol ve Konuları Özelleştir tabbarını kaldıran JS',
      category: 'extension',
    },
    {
      name: 'Styling Rules',
      filename: 'styles.css',
      language: 'css',
      content: stylesCss,
      description: 'Konuları Özelleştir tabbarını, üst tabbarı ve reklamları gizleyen CSS',
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
      name: 'Twitter/X Minimalist Layout & Hide Topics Tabbar (Brave)',
      version: '1.5.0',
      description: 'Twitter/X "Konuları Özelleştir" tabbarını, sekme barını, + ikonunu ve üst Abone Ol butonunu tamamen kaldırır.',
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
 * Twitter/X Minimalist Layout:
 * 1. Sol Menüde SADECE: Profil, Kaydedilenler, Ayarlar, Çıkış.
 * 2. Üst "Abone Ol" / "Subscribe" butonu kaldırılır.
 * 3. Üst + ikonu ve sekme barı kaldırılır.
 * 4. "Konuları Özelleştir" (Customize Topics) tabbarı ve modülleri kaldırılır.
 * https://github.com/
 */

(function () {
  'use strict';

  console.log('[X-Minimal-Brave] Betik aktif: Konuları özelleştir tabbarı temizleniyor.');

  function cleanupUI() {
    // 1. Üst Sekme Barını (Tabbar) ve Yanındaki + İkonunu Kaldır
    const tabList = document.querySelector('div[role="tablist"]');
    if (tabList) {
      const parentRow = tabList.parentElement;
      if (parentRow && parentRow.tagName !== 'BODY') {
        parentRow.style.display = 'none';
      } else {
        tabList.style.display = 'none';
      }
    }

    // 2. Üst "Abone Ol" / "Subscribe" Butonunu ve + Ayarlar İkonunu Kaldır
    const subscribeAndPlusBtns = document.querySelectorAll(
      'a[href*="premium_tier_upsell"], a[href*="subscribe"], a[href*="/settings/timeline"], div[aria-label*="Timeline"], div[aria-label*="Zaman akışı"], div[aria-label*="Özel akış"], div[aria-label*="Pin"]'
    );
    subscribeAndPlusBtns.forEach(btn => {
      btn.style.display = 'none';
    });

    // 3. "Konuları Özelleştir" (Customize Topics) Tabbarını ve Modüllerini Kaldır
    const topicElements = document.querySelectorAll(
      'div[aria-label*="Konuları özelleştir"], div[aria-label*="Customize topics"], div[data-testid="topicsModule"], div[data-testid="TopicToFollow"], a[href*="/i/topics"], a[href*="/settings/topics"]'
    );
    topicElements.forEach(el => {
      el.style.display = 'none';
    });

    // 4. Sol Menüyü Sadeleştir: SADECE Profil, Kaydedilenler, Ayarlar ve Çıkış bırak
    const navLinks = document.querySelectorAll('nav[role="navigation"] a');
    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      
      const isHome = href === '/home' || href === '/';
      const isBookmarks = href.includes('/bookmarks');
      const isSettings = href.includes('/settings');
      const isProfile = link.getAttribute('data-testid') === 'AppTabBar_Profile_Link' || 
                        (!href.includes('/i/') && !href.includes('/explore') && !href.includes('/notifications') && !href.includes('/messages') && href.length > 1);

      if (!isHome && !isBookmarks && !isSettings && !isProfile) {
        link.style.display = 'none';
      }
    });

    // 5. Sponsorlu / Reklam Tweetlerini Gizle
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
  return `/* Twitter/X Minimalist Layout - Anti-Flicker CSS for Brave Browser */

/* 1. ÜST TABBAR, + İKONU VE ABONE OL BUTONUNU KALDIR */
div:has(> div[role="tablist"]),
div[role="tablist"],
a[href*="premium_tier_upsell"],
a[href*="subscribe"],
a[href*="/settings/timeline"],
div[aria-label*="Timeline settings"],
div[aria-label*="Zaman akışı"],
div[aria-label*="Özel akış"],
div[aria-label*="Pin"] {
  display: none !important;
}

/* 2. "KONULARI ÖZELLEŞTİR" (CUSTOMIZE TOPICS) TABBAR VE MODÜLLERİNİ KALDIR */
div[aria-label*="Konuları özelleştir"],
div[aria-label*="Customize topics"],
div[aria-label*="Konular"],
div[aria-label*="Topics"],
div[data-testid="topicsModule"],
div[data-testid="TopicToFollow"],
a[href*="/i/topics"],
a[href*="/settings/topics"] {
  display: none !important;
}

/* 3. SOL MENÜDEN GEREKSİZ ELEMANLARI (Grok, Premium, Keşfet, Topluluklar vb.) KALDIR */
a[data-testid="AppTabBar_Grok_Link"],
a[href="/i/grok"],
a[data-testid="AppTabBar_Premium_Link"],
a[href*="/premium"],
a[href*="/communities"],
a[href*="/verified-orgs"],
a[href*="/i/jobs"] {
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
// @name         Twitter/X Konuları Özelleştir & Tabbar Temizleme (Brave)
// @namespace    https://github.com/
// @version      1.5.0
// @description  Twitter/X "Konuları Özelleştir" tabbarını, sekme barını, + ikonunu ve sol menüdeki gereksiz öğeleri kaldırır.
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
  return `! Title: Twitter/X Konuları Özelleştir & Sadeleştirilmiş Görünüm - Brave Shields Filtre Listesi
! Description: "Konuları Özelleştir" tabbarını, üst sekme barını, Abone Ol butonunu ve sol menüdeki fazlalıkları kaldırır.
! Homepage: https://github.com/
! License: MIT
!

! ===================================================================
! 1. ÜST ABONE OL BUTONU, TABBAR VE + İKONUNU KALDIR
! ===================================================================
x.com##div:has(> div[role="tablist"])
twitter.com##div:has(> div[role="tablist"])
x.com##div[role="tablist"]
twitter.com##div[role="tablist"]
x.com##a[href*="premium_tier_upsell"]
twitter.com##a[href*="premium_tier_upsell"]
x.com##a[href*="subscribe"]
twitter.com##a[href*="subscribe"]
x.com##a[href*="/settings/timeline"]
twitter.com##a[href*="/settings/timeline"]

! ===================================================================
! 2. "KONULARI ÖZELLEŞTİR" (CUSTOMIZE TOPICS) TABBAR VE MODÜLLERİNİ GİZLE
! ===================================================================
x.com##div[aria-label*="Konuları özelleştir"]
twitter.com##div[aria-label*="Konuları özelleştir"]
x.com##div[aria-label*="Customize topics"]
twitter.com##div[aria-label*="Customize topics"]
x.com##div[data-testid="topicsModule"]
twitter.com##div[data-testid="topicsModule"]
x.com##div[data-testid="TopicToFollow"]
twitter.com##div[data-testid="TopicToFollow"]
x.com##a[href*="/i/topics"]
twitter.com##a[href*="/i/topics"]

! ===================================================================
! 3. SOL MENÜ TEMİZLİĞİ (Sadece Profil, Kaydedilenler, Ayarlar, Çıkış)
! ===================================================================
x.com##a[data-testid="AppTabBar_Grok_Link"]
twitter.com##a[data-testid="AppTabBar_Grok_Link"]
x.com##a[href="/i/grok"]
twitter.com##a[href="/i/grok"]
x.com##a[data-testid="AppTabBar_Premium_Link"]
twitter.com##a[data-testid="AppTabBar_Premium_Link"]
x.com##a[href*="/communities"]
twitter.com##a[href*="/communities"]

! ===================================================================
! 4. SPONSORLU (REKLAM) TWEETLERİ GİZLE
! ===================================================================
x.com##article:has(span:has-text(/Sponsorlu|Promoted/))
twitter.com##article:has(span:has-text(/Sponsorlu|Promoted/))
`;
}

function generateReadmeMd(options: ConfigOptions): string {
  return `# 🚫 Twitter/X Konuları Özelleştir & Tabbar Temizleme Kodu (Brave Browser)

Brave Browser kullanıcıları için Twitter/X (\`x.com\` & \`twitter.com\`) üzerindeki **"Konuları Özelleştir"** tabbarını, **"Sana Özel"** sekme barını, **+ (Artı)** ikonunu ve sol menüdeki kalabalığı tamamen kaldıran filtre ve eklenti paketi.

---

## 🚀 Özellikler

- ✅ **Konuları Özelleştir Tabbarını Kaldırır:** Akışta beliren konu önerilerini gizler.
- ✅ **Sade Sol Menü:** Sol tarafta **SADECE** Profil, Kaydedilenler, Ayarlar ve Çıkış bırakır.
- ✅ **Üst Abone Ol Butonunu Kaldırır:** Reklam tekliflerini gizler.
- ✅ **+ İkonlu Tabbarı Kaldırır:** Sekme barını ve + ikonunu siler.
- ✅ **Sponsorlu Tweet Temizliği:** Akıştaki reklam gönderilerini kaldırır.

---

## 🛠️ Kurulum (Brave Browser)

1. Brave adres çubuğuna \`brave://adblock\` yazın.
2. **Özel Filtreler (Custom Filters)** kutusuna \`brave-shields-rules.txt\` içeriğini yapıştırıp kaydet'e basın.

**Lisans:** MIT
`;
}
