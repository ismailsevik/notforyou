// ==UserScript==
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
        forYouTab = tab;
      }

      if (index === 1 || (!isForYou && !followingTab)) {
        followingTab = tab;
      }
    });

    if (forYouTab) {
      if (forYouTab.style.display !== 'none') {
        forYouTab.style.display = 'none';
        forYouTab.setAttribute('aria-hidden', 'true');
      }

      if (followingTab) {
        const isSelected = forYouTab.getAttribute('aria-selected') === 'true' || 
                           window.location.pathname === '/home';
        
        if (isSelected && forYouTab.getAttribute('aria-selected') === 'true') {
          followingTab.click();
        }
      }
    }
  }

  function processExtraElements() {
    const grokLink = document.querySelector('a[data-testid="AppTabBar_Grok_Link"]');
    if (grokLink) grokLink.style.display = 'none';

    const premiumLink = document.querySelector('a[data-testid="AppTabBar_Premium_Link"], a[href="/i/premium_tier_upsell"]');
    if (premiumLink) premiumLink.style.display = 'none';
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
