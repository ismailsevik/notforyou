/**
 * Twitter/X Hide "For You" Tab - Brave Browser Extension
 * GitHub'da barındırılmak üzere oluşturulmuştur.
 * https://github.com/
 */

(function () {
  'use strict';

  const CONFIG = {
  "hideForYou": true,
  "autoSwitchToFollowing": true,
  "hideGrok": true,
  "hidePremium": true,
  "hideSidebarTrends": false,
  "hideWhoToFollow": true,
  "hideVerifiedTab": false,
  "targetLanguages": [
    "tr",
    "en",
    "es",
    "de",
    "fr",
    "ja"
  ]
};
  const TARGET_FOR_YOU_TEXTS = ["Sana Özel","For You","Para ti","Für dich","Pour vous","おすすめ"];

  console.log('[X-ForYou-Hider] Script başlatıldı.');

  // "Sana Özel" sekmesini bul ve gizle / "Takip Edilenler" sekmesine geç
  function processTabs() {
    // Twitter/X tablist seçicisi
    const tabList = document.querySelector('div[role="tablist"]');
    if (!tabList) return;

    const tabs = tabList.querySelectorAll('a[role="tab"], div[role="tab"]');
    let forYouTab = null;
    let followingTab = null;

    tabs.forEach((tab, index) => {
      const text = (tab.textContent || '').trim();
      const isForYou = TARGET_FOR_YOU_TEXTS.some(t => text.toLowerCase().includes(t.toLowerCase())) || index === 0;
      
      if (isForYou && !forYouTab) {
        // Eğer ilk sekme ve text eşleşiyorsa veya bilinen bir text ise
        if (TARGET_FOR_YOU_TEXTS.some(t => text.toLowerCase().includes(t.toLowerCase()))) {
          forYouTab = tab;
        } else if (index === 0 && tabs.length >= 2) {
          // Fallback: Twitter'ın ilk sekmesi varsayılan olarak "For You" dur
          forYouTab = tab;
        }
      }

      if (index === 1 || (!isForYou && !followingTab)) {
        followingTab = tab;
      }
    });

    // 1. "Sana Özel" sekmesini gizle
    if (forYouTab && CONFIG.hideForYou) {
      if (forYouTab.style.display !== 'none') {
        forYouTab.style.display = 'none';
        forYouTab.setAttribute('aria-hidden', 'true');
        console.log('[X-ForYou-Hider] "Sana Özel" sekmesi gizlendi.');
      }

      // 2. Otomatik "Takip Edilenler" sekmesine yönlendir (Eğer şu an Sana Özel aktifse)
      if (CONFIG.autoSwitchToFollowing && followingTab) {
        const isSelected = forYouTab.getAttribute('aria-selected') === 'true' || 
                           window.location.pathname === '/home';
        
        // Eğer URL tam /home ve ilk sekme aktif görünüyorsa takip edilenlere tıkla
        if (isSelected && forYouTab.getAttribute('aria-selected') === 'true') {
          console.log('[X-ForYou-Hider] "Takip Edilenler" sekmesine otomatik geçiliyor...');
          followingTab.click();
        }
      }
    }
  }

  // Ekstra Temizlik Kuralları
  function processExtraElements() {
    
    // Grok Sekmesini Gizle
    const grokLink = document.querySelector('a[data-testid="AppTabBar_Grok_Link"]');
    if (grokLink) grokLink.style.display = 'none';
    

    
    // Premium / Abone Ol Butonunu Gizle
    const premiumLink = document.querySelector('a[data-testid="AppTabBar_Premium_Link"], a[href="/i/premium_tier_upsell"]');
    if (premiumLink) premiumLink.style.display = 'none';
    

    

    
    // Kimi Takip Etmeli Modülünü Gizle
    const whoToFollow = document.querySelector('aside[aria-label*="Takip"], aside[aria-label*="Who to follow"]');
    if (whoToFollow) whoToFollow.style.display = 'none';
    
  }

  // DOM değişikliklerini izlemek için MutationObserver
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

  // Sayfa yüklendiğinde ve dinamik içerik değiştikçe çalıştır
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
