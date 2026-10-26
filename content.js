/**
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
