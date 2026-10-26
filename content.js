/**
 * Twitter/X Hide "For You" Tab - Brave Browser Extension & UserScript
 * GitHub Repository Ready
 * https://github.com/
 */

(function () {
  'use strict';

  const TARGET_FOR_YOU_TEXTS = [
    'Sana Özel',
    'For You',
    'Para ti',
    'Für dich',
    'Pour vous',
    'おすすめ'
  ];

  console.log('[X-ForYou-Hider] Script aktif.');

  // "Sana Özel" sekmesini algıla ve gizle / "Takip Edilenler" sekmesine geç
  function processTabs() {
    const tabList = document.querySelector('div[role="tablist"]');
    if (!tabList) return;

    const tabs = tabList.querySelectorAll('a[role="tab"], div[role="tab"]');
    let forYouTab = null;
    let followingTab = null;

    tabs.forEach((tab, index) => {
      const text = (tab.textContent || '').trim();
      const isForYou = TARGET_FOR_YOU_TEXTS.some(t => text.toLowerCase().includes(t.toLowerCase())) || index === 0;
      
      if (isForYou && !forYouTab) {
        if (TARGET_FOR_YOU_TEXTS.some(t => text.toLowerCase().includes(t.toLowerCase()))) {
          forYouTab = tab;
        } else if (index === 0 && tabs.length >= 2) {
          forYouTab = tab;
        }
      }

      if (index === 1 || (!isForYou && !followingTab)) {
        followingTab = tab;
      }
    });

    // 1. "Sana Özel" sekmesini gizle
    if (forYouTab) {
      if (forYouTab.style.display !== 'none') {
        forYouTab.style.display = 'none';
        forYouTab.setAttribute('aria-hidden', 'true');
      }

      // 2. Otomatik "Takip Edilenler" sekmesine geç
      if (followingTab) {
        const isSelected = forYouTab.getAttribute('aria-selected') === 'true' || 
                           window.location.pathname === '/home';
        
        if (isSelected && forYouTab.getAttribute('aria-selected') === 'true') {
          followingTab.click();
        }
      }
    }
  }

  // Ekstra Temizlik Kuralları (Grok, Premium, Kimi Takip Etmeli)
  function processExtraElements() {
    const grokLink = document.querySelector('a[data-testid="AppTabBar_Grok_Link"]');
    if (grokLink) grokLink.style.display = 'none';

    const premiumLink = document.querySelector('a[data-testid="AppTabBar_Premium_Link"], a[href="/i/premium_tier_upsell"]');
    if (premiumLink) premiumLink.style.display = 'none';

    const whoToFollow = document.querySelector('aside[aria-label*="Takip"], aside[aria-label*="Who to follow"]');
    if (whoToFollow) whoToFollow.style.display = 'none';
  }

  // DOM değişikliklerini takip etmek için MutationObserver
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
