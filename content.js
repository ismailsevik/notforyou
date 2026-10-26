/**
 * Twitter/X Minimalist Layout:
 * 1. Sol Menüde SADECE: Profil, Kaydedilenler, Ayarlar, Çıkış bırakılır.
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
