/*
 * QuieTools analytics helpers (image.quietools.com)
 * - qtEvent(name, params): thin gtag('event') wrapper, safe if gtag missing
 * - download: fired at each tool's actual download/save moment (see per-page scripts)
 * - tool_nav: delegated click listener on internal tool links / cards
 * Loaded via <script src="/assets/analytics.js" defer></script> after gtag.
 */
(function () {
  "use strict";

  function qtEvent(name, params) {
    if (typeof window.gtag === "function") {
      try { window.gtag("event", name, params || {}); } catch (e) { /* no-op */ }
    }
  }
  window.qtEvent = qtEvent;

  // Selectors that identify an internal tool/nav link on this site.
  // - a.card / [data-nav]: explicit opt-in (guides index uses .card)
  // - .conv-grid a: the "Popular tools" grid on the home page
  // - .related a: the related-tools chips on each tool page
  function isNavLink(a) {
    if (!a) return false;
    if (a.classList.contains("card") || a.hasAttribute("data-nav")) return true;
    return !!a.closest(".conv-grid, .related");
  }

  // tool_nav: fire when a user clicks a tool card / internal tool link.
  function onDocClick(e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    if (isNavLink(a)) {
      qtEvent("tool_nav", { to: a.getAttribute("href") || "" });
    }
  }

  function init() {
    document.addEventListener("click", onDocClick, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
