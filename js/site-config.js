/* ─────────────────────────────────────────────────────────────────────────────
   SITE CONFIG — fill these 3 values to go live. Empty = silently disabled.
   ───────────────────────────────────────────────────────────────────────────── */
window.SITE_CONFIG = {
  GA4_ID: '',               // Google Analytics 4 — e.g. 'G-XXXXXXXXXX'
  META_PIXEL_ID: '',        // Meta (Facebook) Pixel — e.g. '1234567890123456'
  NEWSLETTER_ENDPOINT: ''   // Form POST URL — e.g. Formspree 'https://formspree.io/f/abcdwxyz'
};

(function () {
  var c = window.SITE_CONFIG;

  // ── Google Analytics 4 ──────────────────────────────────────────────────────
  if (c.GA4_ID) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(c.GA4_ID);
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', c.GA4_ID);
  }

  // ── Meta Pixel ──────────────────────────────────────────────────────────────
  if (c.META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', c.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
})();

/* Unified event tracker — safe no-op when analytics is off.
   meta: optional { fb: 'StandardEventName' } to map to a Meta standard event. */
window.track = function (name, params, meta) {
  try { if (window.gtag) window.gtag('event', name, params || {}); } catch (e) {}
  try {
    if (window.fbq) {
      var fbName = (meta && meta.fb) || null;
      if (fbName) window.fbq('track', fbName, params || {});
      else window.fbq('trackCustom', name, params || {});
    }
  } catch (e) {}
};
