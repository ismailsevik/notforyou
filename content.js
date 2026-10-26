/**
 * Twitter/X Classic Look & Hide Tabs - Brave Browser Extension & UserScript
 * Eski Twitter görünümü (Sekmesiz temiz akış)
 * https://github.com/
 */

(function () {
  'use strict';

  console.log('[X-Classic-Twitter] Script aktif.');

  // Üst sekme barını ("Sana Özel" ve "Takip Edilenler") tamamen kaldır
  function processTabs() {
    const tabList = document.querySelector('div[role="tablist"]');
    if (tabList) {
      if (tabList.style.display !== 'none') {
        tabList.style.display = 'none';
      }
    }
  }

  // Ekstra Temizlik Kuralları (Grok, Premium, Kimi Takip Etmeli)
  function processExtraElements() {
    const grokLink = document.querySelector('a[data-testid="AppTabBar_Grok_Link"], a[href="/i/grok"]');
    if (grokLink) grokLink.style.display = 'none';

    const premiumLink = document.querySelector('a[data-testid="AppTabBar_Premium_Link"], a[href="/i/premium_tier_upsell"]');
    if (premiumLink) premiumLink.style.display = 'none';

    const whoToFollow = document.querySelector('aside[aria-label*="Takip"], aside[aria-label*="Who to follow"]');
    if (whoToFollow) whoToFollow.style.display = 'none';
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
