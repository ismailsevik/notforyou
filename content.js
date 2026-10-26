/**
 * Twitter/X Classic Look - Hide Tabbar, Plus Icon & Promoted Tweets
 * Brave Browser Extension & UserScript
 * https://github.com/
 */

(function () {
  'use strict';

  console.log('[X-Classic-Twitter] Script aktif: Tabbar, + ikonu ve sponsorlu tweetler kaldırılıyor.');

  function processTabsAndPlusIcon() {
    // 1. Tablist ve üst şeridini (+ ikonu dahil) gizle
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

    // 4. Grok ve Premium gizle
    const grokLink = document.querySelector('a[data-testid="AppTabBar_Grok_Link"], a[href="/i/grok"]');
    if (grokLink) grokLink.style.display = 'none';

    const premiumLink = document.querySelector('a[data-testid="AppTabBar_Premium_Link"], a[href="/i/premium_tier_upsell"]');
    if (premiumLink) premiumLink.style.display = 'none';
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
