/* ═════════════════════════════════════════════════════════════════════════════
   KadınımGuzelim — Demo Site v1.1 (P0 Hotfix)
   Shared JavaScript
   ═════════════════════════════════════════════════════════════════════════════ */

let savedScrollY = 0;

function lockScroll() {
  savedScrollY = window.scrollY || window.pageYOffset;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + savedScrollY + 'px';
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

function unlockScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, savedScrollY);
}

// Light haptic feedback (Android/Chrome; no-op where unsupported, e.g. iOS Safari).
function haptic(ms) {
  if (navigator.vibrate) { try { navigator.vibrate(ms || 8); } catch (e) {} }
}

// ── Size guide bottom sheet ──────────────────────────────────────────────────
function openSizeSheet() {
  const o = document.getElementById('sizeSheetOverlay');
  const s = document.getElementById('sizeSheet');
  if (!s) return;
  s.classList.add('active');
  if (o) o.classList.add('active');
  lockScroll();
  haptic(10);
}
function closeSizeSheet() {
  const o = document.getElementById('sizeSheetOverlay');
  const s = document.getElementById('sizeSheet');
  if (!s) return;
  s.classList.remove('active');
  if (o) o.classList.remove('active');
  unlockScroll();
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const s = document.getElementById('sizeSheet');
  if (s && s.classList.contains('active')) closeSizeSheet();
});

// ── Toast ───────────────────────────────────────────────────────────────────
function showToast(message) {
  let toast = document.getElementById('demoToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'demoToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── Mobile Navigation ───────────────────────────────────────────────────────
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  if (!nav) return;

  const isOpen = nav.classList.contains('active');

  if (isOpen) {
    nav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    unlockScroll();
  } else {
    nav.classList.add('active');
    if (overlay) overlay.classList.add('active');
    lockScroll();
    haptic(10);
  }
}

// ── Filter Drawer ───────────────────────────────────────────────────────────
function toggleFilterDrawer() {
  const drawer = document.getElementById('filterDrawer');
  const overlay = document.getElementById('filterOverlay');
  if (!drawer) return;

  const isOpen = drawer.classList.contains('active');

  if (isOpen) {
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    unlockScroll();
  } else {
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    lockScroll();
  }
}

// ── Product Gallery ─────────────────────────────────────────────────────────
function changeImage(thumb) {
  const main = document.getElementById('mainImage');
  if (main) {
    main.src = thumb.src;
    main.alt = thumb.alt;
  }
  document.querySelectorAll('.product-gallery__thumbs img').forEach(img => {
    img.classList.remove('active');
  });
  thumb.classList.add('active');
  if (window.__syncInlineDots) window.__syncInlineDots();
}

// ── Quantity ────────────────────────────────────────────────────────────────
function updateQty(delta) {
  const input = document.getElementById('qtyInput');
  if (input) {
    let val = parseInt(input.value, 10) || 1;
    val += delta;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    input.value = val;
  }
}

// ── Accordion ───────────────────────────────────────────────────────────────
function toggleAccordion(trigger) {
  const content = trigger.nextElementSibling;
  const icon = trigger.querySelector('.accordion-icon');
  if (!content) return;

  const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

  document.querySelectorAll('.accordion-content').forEach(c => {
    c.style.maxHeight = '0px';
  });
  document.querySelectorAll('.accordion-icon').forEach(i => {
    i.textContent = '▼';
  });

  if (!isOpen) {
    content.style.maxHeight = content.scrollHeight + 'px';
    if (icon) icon.textContent = '▲';
  }
}

// ── Swatch & Size Selection ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', function() {
      this.parentElement.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    });
  });

  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.disabled) return;
      this.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Sticky CTA visibility on desktop
  const stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    const mql = window.matchMedia('(min-width: 768px)');
    function handleMediaChange(e) {
      stickyCta.style.display = e.matches ? 'none' : 'flex';
    }
    if (mql.addEventListener) {
      mql.addEventListener('change', handleMediaChange);
    } else {
      mql.addListener(handleMediaChange);
    }
    handleMediaChange(mql);
  }

  // Product card hover quick-add (desktop)
  document.querySelectorAll('.category-grid .product-card').forEach(card => {
    const imgWrap = card.querySelector('.product-card__image');
    if (!imgWrap) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 300ms ease;
      pointer-events: none;
    `;
    const label = document.createElement('span');
    label.textContent = 'Keşfet →';
    label.style.cssText = `
      font-family: var(--font-ui);
      font-size: 13px;
      font-weight: 600;
      color: var(--color-white);
      background: var(--color-dark);
      padding: 10px 20px;
      border-radius: var(--radius-sm);
    `;
    overlay.appendChild(label);
    imgWrap.appendChild(overlay);

    card.addEventListener('mouseenter', () => { overlay.style.opacity = '1'; });
    card.addEventListener('mouseleave', () => { overlay.style.opacity = '0'; });
  });

  // ESC key closes menu/drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const nav = document.getElementById('mobileNav');
      const drawer = document.getElementById('filterDrawer');
      if (nav && nav.classList.contains('active')) {
        toggleMobileNav();
      }
      if (drawer && drawer.classList.contains('active')) {
        toggleFilterDrawer();
      }
    }
  });

  // Dead link handler — show toast for placeholder links
  document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]').forEach(link => {
    // Skip real navigation links that happen to use # for anchors
    if (link.getAttribute('onclick')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Bu özellik demo sürümünde aktif değildir');
    });
  });

  // Placeholder button handlers
  document.querySelectorAll('button').forEach(btn => {
    if (!btn.getAttribute('onclick') && btn.type !== 'submit') {
      btn.addEventListener('click', (e) => {
        // Let swatches, sizes, quantity, accordion work
        if (btn.closest('.swatches') || btn.closest('.size-options') || btn.closest('.quantity') || btn.closest('.accordion-trigger')) {
          return;
        }
        // Sticky CTA and desktop CTA show toast
        if (btn.textContent.includes('SEPETE EKLE') || btn.textContent.includes('Favorilere')) {
          e.preventDefault();
          showToast('Bu özellik demo sürümünde aktif değildir');
        }
      });
    }
  });
});

// ── Smooth scroll for anchor links ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ═════════════════════════════════════════════════════════════════════════════
   PREMIUM PDP — PRODUCT EVIDENCE MODULES (v1.2)
   Guarded by .product-gallery presence — no effect on other pages.
   ═════════════════════════════════════════════════════════════════════════════ */

// Callout points for the current product (max 4). Coords are % of the frame.
let PRODUCT_CALLOUTS = [
  { x: 50, y: 20, label: 'Fransız Dantel' },
  { x: 30, y: 52, label: 'Ayarlanabilir Askı' },
  { x: 64, y: 68, label: 'Yumuşak Saten Doku' },
  { x: 46, y: 88, label: 'Düşük Transparanlık' }
];

// Colour name → swatch hex (fallback neutral).
const KG_COLORS = {
  'Bordo': '#7A1F1F', 'Siyah': '#1A1A1A', 'Ekru': '#F5F0EB', 'Leopar': '#C8A45D',
  'Pudra': '#E8C4C0', 'Lacivert': '#1F2A44', 'Kırmızı': '#B3242B', 'Standart': '#B8A99A'
};
const CALLOUT_COORDS = [
  { x: 50, y: 20 }, { x: 30, y: 52 }, { x: 64, y: 68 }, { x: 46, y: 88 }
];

// Crisp variant for fullscreen pinch-zoom (loaded on demand, not on page load).
function galleryHiRes(src) {
  if (!/\/cdn-cgi\/image\//.test(src)) return src;
  return src.replace(/\/cdn-cgi\/image\/[^/]+\//, '/cdn-cgi/image/width=1600,quality=88/');
}
// Path without the CDN transform segment — used to match images across sizes.
function galleryBasePath(src) {
  return src.replace(/\/cdn-cgi\/image\/[^/]+\//, '/');
}

function getGallerySlides() {
  const thumbs = document.querySelectorAll('.product-gallery__thumbs img');
  const slides = [...thumbs].map(t => ({ src: galleryHiRes(t.src), alt: t.alt || '' }));
  if (slides.length === 0) {
    const main = document.getElementById('mainImage');
    if (main) slides.push({ src: galleryHiRes(main.src), alt: main.alt || '' });
  }
  return slides;
}

// ── Premium hover zoom (desktop, fine pointer) ───────────────────────────────
function initPremiumZoom() {
  const gallery = document.querySelector('.product-gallery');
  const main = document.querySelector('.product-gallery__main');
  const mainImg = document.getElementById('mainImage');
  if (!gallery || !main || !mainImg) return;

  const ZOOM = 2.4;
  const fine = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)');
  let lens = null, panel = null;

  function ensureEls() {
    if (lens) return;
    lens = document.createElement('div');
    lens.className = 'zoom-lens';
    panel = document.createElement('div');
    panel.className = 'zoom-panel';
    main.appendChild(lens);     // lens clipped to image bounds (overflow:hidden)
    gallery.appendChild(panel); // panel outside the clipped main, anchored to gallery
  }

  function onMove(e) {
    if (!fine.matches || main.classList.contains('motion')) return;
    ensureEls();
    const r = main.getBoundingClientRect();
    const src = mainImg.currentSrc || mainImg.src;
    const lensW = r.width / ZOOM;
    const lensH = r.height / ZOOM;
    lens.style.width = lensW + 'px';
    lens.style.height = lensH + 'px';

    let x = e.clientX - r.left - lensW / 2;
    let y = e.clientY - r.top - lensH / 2;
    x = Math.max(0, Math.min(x, r.width - lensW));
    y = Math.max(0, Math.min(y, r.height - lensH));
    lens.style.left = x + 'px';
    lens.style.top = y + 'px';

    panel.style.backgroundImage = 'url("' + src + '")';
    panel.style.backgroundSize = (r.width * ZOOM) + 'px ' + (r.height * ZOOM) + 'px';
    panel.style.backgroundPosition = '-' + (x * ZOOM) + 'px -' + (y * ZOOM) + 'px';
  }

  function enter() {
    if (!fine.matches || main.classList.contains('motion')) return;
    ensureEls();
    lens.classList.add('active');
    panel.classList.add('active');
    main.classList.add('zooming');
  }
  function leave() {
    if (lens) { lens.classList.remove('active'); panel.classList.remove('active'); }
    main.classList.remove('zooming');
  }

  main.addEventListener('mousemove', onMove);
  main.addEventListener('mouseenter', enter);
  main.addEventListener('mouseleave', leave);
}

// ── Fullscreen gallery modal ─────────────────────────────────────────────────
function initFullscreenGallery() {
  const main = document.querySelector('.product-gallery__main');
  const mainImg = document.getElementById('mainImage');
  if (!main || !mainImg) return;

  const slides = getGallerySlides();
  let idx = 0;

  const fs = document.createElement('div');
  fs.className = 'fs-gallery';
  fs.setAttribute('role', 'dialog');
  fs.setAttribute('aria-modal', 'true');
  fs.setAttribute('aria-label', 'Ürün görselleri');
  fs.innerHTML =
    '<div class="fs-gallery__bar">' +
      '<button class="fs-gallery__close" aria-label="Kapat" type="button">' +
        '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
      '</button>' +
    '</div>' +
    '<div class="fs-gallery__stage">' +
      '<button class="fs-gallery__nav fs-gallery__nav--prev" aria-label="Önceki" type="button">' +
        '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg></button>' +
      '<img class="fs-gallery__img" alt="">' +
      '<button class="fs-gallery__nav fs-gallery__nav--next" aria-label="Sonraki" type="button">' +
        '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></button>' +
      '<div class="fs-gallery__tip">Çift dokun veya parmaklarını aç — kumaşı yakından incele</div>' +
    '</div>' +
    '<div class="fs-gallery__dots"></div>';
  document.body.appendChild(fs);

  const img = fs.querySelector('.fs-gallery__img');
  const stage = fs.querySelector('.fs-gallery__stage');
  const tip = fs.querySelector('.fs-gallery__tip');
  const dotsWrap = fs.querySelector('.fs-gallery__dots');
  const prevBtn = fs.querySelector('.fs-gallery__nav--prev');
  const nextBtn = fs.querySelector('.fs-gallery__nav--next');
  const closeBtn = fs.querySelector('.fs-gallery__close');

  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', (i + 1) + '. görsel');
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];

  const single = slides.length <= 1;
  if (single) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    dotsWrap.style.display = 'none';
  }

  function render() {
    img.src = slides[idx].src;
    img.alt = slides[idx].alt;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    resetZoom(false);
  }
  function go(i) { idx = (i + slides.length) % slides.length; render(); }
  function currentMainIndex() {
    const cur = galleryBasePath(mainImg.src);
    const i = slides.findIndex(s => galleryBasePath(s.src) === cur);
    return i < 0 ? 0 : i;
  }
  function open() {
    idx = currentMainIndex();
    render();
    fs.classList.add('open');
    lockScroll();
    haptic(10);
    if (tip && window.matchMedia('(pointer: coarse)').matches) {
      tip.classList.add('show');
      setTimeout(() => tip.classList.remove('show'), 2800);
    }
  }
  function close() { fs.classList.remove('open'); unlockScroll(); resetZoom(false); }

  main.addEventListener('click', (e) => {
    if (e.target.closest('.callout-dot')) return; // dots handle their own taps
    if (main.dataset.noFs) { delete main.dataset.noFs; return; } // a swipe just happened
    open();
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => go(idx - 1));
  nextBtn.addEventListener('click', () => go(idx + 1));
  fs.addEventListener('click', (e) => {
    if (e.target === fs || e.target.classList.contains('fs-gallery__stage')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!fs.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && !single) go(idx - 1);
    else if (e.key === 'ArrowRight' && !single) go(idx + 1);
  });

  // ── Gesture engine: pinch-zoom · double-tap · pan · smart swipe ────────────
  let scale = 1, tx = 0, ty = 0;
  const ZOOM_MAX = 4, DBL_ZOOM = 2.6;
  let mode = null, startX = 0, startY = 0, lastX = 0, lastY = 0;
  let pinchDist0 = 0, pinchScale0 = 1, lastTap = 0, tapX = 0, tapY = 0;

  function applyTransform(animate) {
    img.style.transition = animate ? 'transform 220ms ease' : 'none';
    img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }
  function clampPan() {
    const sr = stage.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    const overX = Math.max(0, (ir.width - sr.width) / 2);
    const overY = Math.max(0, (ir.height - sr.height) / 2);
    tx = Math.max(-overX, Math.min(overX, tx));
    ty = Math.max(-overY, Math.min(overY, ty));
  }
  function resetZoom(animate) { scale = 1; tx = 0; ty = 0; applyTransform(animate); }
  function zoomToPoint(px, py, z) {
    const sr = stage.getBoundingClientRect();
    const dx = px - (sr.left + sr.width / 2);
    const dy = py - (sr.top + sr.height / 2);
    scale = z; tx = -(z - 1) * dx; ty = -(z - 1) * dy;
    clampPan(); applyTransform(true);
  }
  function touchDist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }

  img.addEventListener('touchstart', (e) => {
    if (tip) tip.classList.remove('show');
    if (e.touches.length === 2) {
      mode = 'pinch'; pinchDist0 = touchDist(e.touches); pinchScale0 = scale;
      e.preventDefault();
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      startX = lastX = t.clientX; startY = lastY = t.clientY;
      const now = Date.now();
      if (now - lastTap < 300 && Math.abs(t.clientX - tapX) < 30 && Math.abs(t.clientY - tapY) < 30) {
        if (scale > 1) resetZoom(true); else zoomToPoint(t.clientX, t.clientY, DBL_ZOOM);
        haptic(8);
        mode = 'done'; lastTap = 0; e.preventDefault(); return;
      }
      lastTap = now; tapX = t.clientX; tapY = t.clientY;
      mode = scale > 1 ? 'pan' : 'swipe';
    }
  }, { passive: false });

  img.addEventListener('touchmove', (e) => {
    if (mode === 'pinch' && e.touches.length >= 2) {
      e.preventDefault();
      scale = Math.max(1, Math.min(ZOOM_MAX, pinchScale0 * (touchDist(e.touches) / pinchDist0)));
      if (scale === 1) { tx = 0; ty = 0; }
      applyTransform(false); clampPan(); applyTransform(false);
    } else if (mode === 'pan' && e.touches.length === 1) {
      e.preventDefault();
      const t = e.touches[0];
      tx += t.clientX - lastX; ty += t.clientY - lastY;
      lastX = t.clientX; lastY = t.clientY;
      applyTransform(false); clampPan(); applyTransform(false);
    }
  }, { passive: false });

  img.addEventListener('touchend', (e) => {
    if (mode === 'swipe') {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (dy > 90 && dy > Math.abs(dx)) {
        haptic(12); close();                       // swipe down to dismiss
      } else if (!single && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        haptic(8); go(idx + (dx < 0 ? 1 : -1));
      }
    }
    if (mode === 'pinch' && scale < 1.05) resetZoom(true);
    if (e.touches.length === 0) mode = null;
  }, { passive: false });
}

// ── Detail callout layer ─────────────────────────────────────────────────────
function initCallouts() {
  const main = document.querySelector('.product-gallery__main');
  if (!main) return;
  if (main.querySelector('.callout-layer')) return; // idempotent

  const layer = document.createElement('div');
  layer.className = 'callout-layer';

  PRODUCT_CALLOUTS.slice(0, 4).forEach(c => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'callout-dot';
    dot.style.left = c.x + '%';
    dot.style.top = c.y + '%';
    dot.setAttribute('aria-label', c.label);
    const lbl = document.createElement('span');
    lbl.className = 'callout-label';
    lbl.textContent = c.label;
    dot.appendChild(lbl);
    dot.addEventListener('click', (e) => {
      e.stopPropagation(); // don't open fullscreen
      layer.querySelectorAll('.callout-dot').forEach(d => { if (d !== dot) d.classList.remove('open'); });
      dot.classList.toggle('open');
    });
    layer.appendChild(dot);
  });
  main.appendChild(layer);

  const toggle = document.getElementById('calloutToggle');
  if (toggle) {
    const labelSpan = toggle.querySelector('span');
    let on = true;
    toggle.addEventListener('click', () => {
      on = !on;
      layer.style.display = on ? '' : 'none';
      if (labelSpan) labelSpan.textContent = on ? 'Detayları Gizle' : 'Detayları Göster';
    });
  }
}

// ── Ken Burns motion preview (honest pseudo-video from the still) ─────────────
function initMotion() {
  const main = document.querySelector('.product-gallery__main');
  const btn = document.getElementById('motionToggle');
  if (!main || !btn) return;
  const label = btn.querySelector('span');

  function set(on) {
    main.classList.toggle('motion', on);
    btn.classList.toggle('is-on', on);
    if (label) label.textContent = on ? 'Durdur' : 'Hareketi Gör';
  }
  btn.addEventListener('click', () => set(!main.classList.contains('motion')));

  // Tapping the moving image stops motion (and must not open fullscreen).
  main.addEventListener('click', (e) => {
    if (main.classList.contains('motion')) { e.stopPropagation(); set(false); }
  }, true); // capture: runs before the fullscreen open handler
}

// ── Inline swipeable gallery + dots (mobile) ─────────────────────────────────
function initInlineGallery() {
  const main = document.querySelector('.product-gallery__main');
  const mainImg = document.getElementById('mainImage');
  if (!main || !mainImg) return;
  const thumbs = [...document.querySelectorAll('.product-gallery__thumbs img')];
  if (thumbs.length <= 1) return;
  if (document.querySelector('.inline-dots')) return; // idempotent

  const dots = document.createElement('div');
  dots.className = 'inline-dots';
  thumbs.forEach((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', (i + 1) + '. görsel');
    b.addEventListener('click', () => select(i));
    dots.appendChild(b);
  });
  main.insertAdjacentElement('afterend', dots); // sits above the (mobile-hidden) thumb strip
  const dotEls = [...dots.children];

  function currentIndex() {
    const i = thumbs.findIndex(t => t.classList.contains('active'));
    return i < 0 ? 0 : i;
  }
  function syncDots() {
    const ci = currentIndex();
    dotEls.forEach((d, i) => d.classList.toggle('active', i === ci));
  }
  function select(i) {
    changeImage(thumbs[(i + thumbs.length) % thumbs.length]); // reuses src/alt + active logic
    syncDots();
  }
  window.__syncInlineDots = syncDots;
  syncDots();

  // Swipe to change image; a tap (minimal movement) still opens fullscreen.
  let sx = 0, sy = 0;
  main.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  main.addEventListener('touchend', (e) => {
    if (main.classList.contains('motion') || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      select(currentIndex() + (dx < 0 ? 1 : -1));
      main.dataset.noFs = '1'; // suppress the fullscreen click that follows a swipe
      setTimeout(() => { delete main.dataset.noFs; }, 400);
    }
  }, { passive: true });
}

// ── Sticky CTA reflects the selected size/colour (+ size guard) ──────────────
function initStickyVariant() {
  const add = document.getElementById('stickyAdd');
  if (!add) return;

  function update() {
    const size = document.querySelector('.size-btn.active');
    const color = document.querySelector('.swatch.active');
    const parts = ['SEPETE EKLE'];
    if (size) parts.push(size.textContent.trim());
    if (color && color.getAttribute('title')) parts.push(color.getAttribute('title'));
    add.textContent = parts.join(' · ');
  }
  // Run after the existing handlers toggle .active (later listener = later in turn).
  document.querySelectorAll('.size-btn, .swatch').forEach(el =>
    el.addEventListener('click', update));

  update();
}

// ── Per-category feeds (shared) ──────────────────────────────────────────────
const CAT_SLUG = { 'Gecelik': 'gecelik', 'Sütyen': 'sutyen', 'Fantazi': 'fantazi', 'Pijama': 'pijama', 'Body & Korse': 'body-korse', 'Büyük Beden': 'buyuk-beden' };
const __jsonCache = {};
async function loadJSON(path) {
  if (path in __jsonCache) return __jsonCache[path];
  try { const r = await fetch(path, { cache: 'no-cache' }); __jsonCache[path] = await r.json(); }
  catch (e) { __jsonCache[path] = null; }
  return __jsonCache[path];
}
async function loadCategoryFeed(catSlug) {
  const d = await loadJSON('feeds/' + catSlug + '.json');
  return (d && d.products) || [];
}

// ── Data-driven PDP: product.html?p=<slug>[&c=<catSlug>] from per-cat feed ────
async function initProductPage() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('p');
  if (!slug) return; // no slug → keep the default hardcoded product
  let catSlug = params.get('c');
  if (!catSlug) {
    const idx = await loadJSON('feeds/index.json');   // slug → catSlug fallback
    catSlug = idx && idx[slug];
  }
  if (!catSlug) return;
  const products = await loadCategoryFeed(catSlug);
  const p = products.find(x => x.slug === slug || x.id === slug);
  if (p) populateProduct(p, products, catSlug);
}

function populateProduct(p, all, catSlug) {
  if (p.seo && p.seo.title) document.title = p.seo.title;
  const h1 = document.querySelector('.product-info h1'); if (h1) h1.textContent = p.title;
  const priceEl = document.querySelector('.product-info .text-2xl'); if (priceEl) priceEl.innerHTML = priceMarkup(p.price, p.slug);

  const bc = document.querySelector('.breadcrumb');
  if (bc) bc.innerHTML = '<a href="index.html">Ana Sayfa</a> › <a href="category.html">' +
    escapeHtml(p.category || 'Gecelik') + '</a> › ' + escapeHtml(p.title);

  const main = document.getElementById('mainImage');
  if (main && p.images && p.images.length) { main.src = p.images[0]; main.alt = p.title; }
  const thumbs = document.querySelector('.product-gallery__thumbs');
  if (thumbs && p.images && p.images.length) {
    thumbs.innerHTML = p.images.map((src, i) =>
      '<img class="' + (i === 0 ? 'active' : '') + '" src="' + src + '" onclick="changeImage(this)" alt="' +
      escapeHtml(p.title) + '" loading="lazy">').join('');
  }

  if (p.fabric) {
    const grid = document.querySelector('.fabric-card__grid');
    if (grid) {
      const rows = [['Doku', p.fabric.doku], ['Esneklik', p.fabric.esneklik], ['Transparanlık', p.fabric.transparanlik],
        ['Dantel', p.fabric.dantel], ['Kalıp', p.fabric.kalip], ['İçerik', p.fabric.icerik]].filter(r => r[1]);
      grid.innerHTML = rows.map(r => '<div class="fabric-row"><dt>' + escapeHtml(r[0]) + '</dt><dd>' + escapeHtml(r[1]) + '</dd></div>').join('');
    }
  }

  if (p.callouts && p.callouts.length) {
    PRODUCT_CALLOUTS = p.callouts.slice(0, 4).map((label, i) => ({ x: CALLOUT_COORDS[i].x, y: CALLOUT_COORDS[i].y, label }));
  }

  const sizeWrap = document.querySelector('.size-options');
  if (sizeWrap && p.sizes) {
    sizeWrap.innerHTML = p.sizes.map((s, i) => '<button class="size-btn' + (i === 0 ? ' active' : '') + '">' + escapeHtml(s) + '</button>').join('');
    sizeWrap.querySelectorAll('.size-btn').forEach(b => b.addEventListener('click', function () {
      if (this.disabled) return;
      sizeWrap.querySelectorAll('.size-btn').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
    }));
  }
  const swWrap = document.querySelector('.swatches');
  if (swWrap && p.colors) {
    swWrap.innerHTML = p.colors.map((c, i) => '<span class="swatch' + (i === 0 ? ' active' : '') +
      '" style="background:' + (KG_COLORS[c] || '#B8A99A') + ';" title="' + escapeHtml(c) + '"></span>').join('');
    swWrap.querySelectorAll('.swatch').forEach(s => s.addEventListener('click', function () {
      swWrap.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
    }));
  }

  const ld = document.querySelector('script[type="application/ld+json"]');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.title,
    image: p.images && p.images[0], description: (p.seo && p.seo.description) || p.description,
    brand: { '@type': 'Brand', name: 'KadınımGuzelim' }, category: p.category, color: p.colors,
    offers: { '@type': 'Offer', priceCurrency: 'TRY', price: String(p.price), availability: 'https://schema.org/InStock' },
    aggregateRating: p.rating ? { '@type': 'AggregateRating', ratingValue: String(p.rating.value), reviewCount: String(p.rating.count) } : undefined
  });

  const sticky = document.getElementById('stickyAdd'); if (sticky) sticky.textContent = 'SEPETE EKLE — ' + formatTRY(p.price);

  const scroll = document.querySelector('.product-scroll');
  if (scroll && all) {
    scroll.innerHTML = all.filter(x => x.slug !== p.slug).slice(0, 6).map(x =>
      '<a href="product.html?p=' + encodeURIComponent(x.slug) + '&c=' + encodeURIComponent(catSlug || '') + '" class="product-card">' +
      '<div class="product-card__image"><img src="' + x.images[0] + '" alt="' + escapeHtml(x.title) + '" loading="lazy"></div>' +
      '<p class="product-card__name">' + escapeHtml(x.title) + '</p>' +
      '<p class="product-card__price">' + formatTRY(x.price) + '</p></a>').join('');
  }
}

// ── Wire category nav links (header, mobile, footer, home tiles) to ?cat ──────
const NAV_CATS = ['Gecelik', 'Sütyen', 'Fantazi', 'Pijama', 'Body & Korse', 'Büyük Beden'];
function wireNav() {
  document.querySelectorAll('a').forEach(a => {
    const t = a.textContent.trim();
    if (NAV_CATS.includes(t) && /category\.html/.test(a.getAttribute('href') || '')) {
      a.href = 'category.html?cat=' + encodeURIComponent(t);
    }
  });
}

// ── Dynamic category grid from the feed (filtered by ?cat) ───────────────────
const CAT_PAGE = 24;
let catState = { items: [], shown: 0, slug: '', sort: 'rec' };

function catCardHTML(p, catSlug) {
  return '<div class="product-card-wrap">' +
    '<a href="product.html?p=' + encodeURIComponent(p.slug) + '&c=' + catSlug + '" class="product-card">' +
    '<div class="product-card__image" style="aspect-ratio:3/4;"><img src="' + p.images[0] + '" alt="' + escapeHtml(p.title) + '" loading="lazy"></div>' +
    '<p class="product-card__name">' + escapeHtml(p.title) + '</p>' +
    '<p class="product-card__price">' + priceMarkup(p.price, p.slug) + '</p></a>' +
    '<button class="card-add" type="button" data-slug="' + escapeHtml(p.slug) + '">Sepete Ekle</button>' +
    '</div>';
}
function sortItems(items, sort) {
  const a = items.slice();
  if (sort === 'asc') a.sort((x, y) => x.price - y.price);
  else if (sort === 'desc') a.sort((x, y) => y.price - x.price);
  return a;
}
function renderCatalogPage(reset) {
  const grid = document.getElementById('catalogGrid');
  if (reset) { grid.innerHTML = ''; catState.shown = 0; }
  const sorted = sortItems(catState.items, catState.sort);
  const next = sorted.slice(catState.shown, catState.shown + CAT_PAGE);
  grid.insertAdjacentHTML('beforeend', next.map(p => catCardHTML(p, catState.slug)).join(''));
  catState.shown += next.length;
  const more = document.getElementById('catMore');
  if (more) more.style.display = catState.shown < catState.items.length ? '' : 'none';
}
async function initCatalog() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  const catName = new URLSearchParams(location.search).get('cat') || 'Gecelik';
  const catSlug = CAT_SLUG[catName] || 'gecelik';
  const products = await loadCategoryFeed(catSlug);
  catState = { items: products, shown: 0, slug: catSlug, sort: 'rec' };

  const heading = document.querySelector('.section-title'); if (heading) heading.textContent = catName;
  document.title = catName + ' — KadınımGuzelim';
  const cnt = document.getElementById('catalogCount'); if (cnt) cnt.textContent = products.length + ' ürün';

  if (!products.length) {
    grid.innerHTML = '<p class="cart-empty" style="grid-column:1/-1;">Bu kategoride ürün bulunamadı.</p>';
    return;
  }

  let controls = document.getElementById('catControls');
  if (!controls) { controls = document.createElement('div'); controls.id = 'catControls'; controls.className = 'cat-controls'; grid.parentElement.insertBefore(controls, grid); }
  controls.innerHTML = '<label class="cat-sort">Sırala: <select id="catSort">' +
    '<option value="rec">Önerilen</option><option value="asc">Fiyat: Düşükten Yükseğe</option><option value="desc">Fiyat: Yüksekten Düşüğe</option></select></label>';
  document.getElementById('catSort').addEventListener('change', (e) => { catState.sort = e.target.value; renderCatalogPage(true); });

  let more = document.getElementById('catMore');
  if (!more) {
    more = document.createElement('button'); more.id = 'catMore'; more.type = 'button';
    more.className = 'btn btn--outline cat-more'; more.textContent = 'Daha Fazla Göster';
    grid.parentElement.appendChild(more);
    more.addEventListener('click', () => renderCatalogPage(false));
  }

  if (!grid.dataset.qa) {
    grid.dataset.qa = '1';
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.card-add');
      if (!btn) return;
      e.preventDefault(); e.stopPropagation();
      const p = catState.items.find(x => x.slug === btn.dataset.slug);
      if (p) cartAddItem({ title: p.title, price: p.price, size: (p.sizes || [])[0] || null, color: (p.colors || [])[0] || null, image: p.images[0], qty: 1 });
    });
  }

  renderCatalogPage(true);
}

// ── Search overlay (queries feeds/search.json) ───────────────────────────────
let searchUI = null;
function buildSearchUI() {
  if (searchUI) return searchUI;
  const ov = document.createElement('div'); ov.className = 'search-overlay';
  ov.innerHTML = '<div class="search-head"><input type="search" class="search-input" placeholder="Ürün ara…" autocomplete="off">' +
    '<button class="search-close" aria-label="Kapat" type="button"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div>' +
    '<div class="search-results"></div>';
  document.body.appendChild(ov);
  const input = ov.querySelector('.search-input'), results = ov.querySelector('.search-results');
  ov.querySelector('.search-close').addEventListener('click', closeSearch);
  ov.addEventListener('click', (e) => { if (e.target === ov) closeSearch(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && ov.classList.contains('active')) closeSearch(); });
  let t; input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => runSearch(input.value), 200); });
  searchUI = { ov, input, results };
  return searchUI;
}
async function runSearch(q) {
  const ui = buildSearchUI();
  q = (q || '').trim().toLocaleLowerCase('tr-TR');
  if (q.length < 2) { ui.results.innerHTML = '<p class="search-hint">En az 2 harf yazın…</p>'; return; }
  const data = await loadJSON('feeds/search.json');
  const items = (data && data.items) || [];
  const hits = items.filter(it => it.title.toLocaleLowerCase('tr-TR').includes(q)).slice(0, 40);
  ui.results.innerHTML = hits.length
    ? '<p class="search-hint">' + hits.length + ' sonuç</p><div class="category-grid">' + hits.map(it =>
        '<a href="product.html?p=' + encodeURIComponent(it.slug) + '&c=' + it.c + '" class="product-card">' +
        '<div class="product-card__image" style="aspect-ratio:3/4;"><img src="' + it.image + '" alt="' + escapeHtml(it.title) + '" loading="lazy"></div>' +
        '<p class="product-card__name">' + escapeHtml(it.title) + '</p>' +
        '<p class="product-card__price">' + priceMarkup(it.price, it.slug) + '</p></a>').join('') + '</div>'
    : '<p class="search-hint">Sonuç bulunamadı.</p>';
}
function openSearch() { const ui = buildSearchUI(); ui.ov.classList.add('active'); lockScroll(); setTimeout(() => ui.input.focus(), 60); }
function closeSearch() { if (searchUI) { searchUI.ov.classList.remove('active'); unlockScroll(); } }
function initSearch() {
  const icon = document.querySelector('.header-icons a[aria-label="Ara"]');
  if (!icon) return;
  icon.addEventListener('click', (e) => { e.preventDefault(); e.stopImmediatePropagation(); openSearch(); }, true);
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.querySelector('.product-gallery')) return;
  await initProductPage();   // populate from ?p before any gallery init reads the DOM
  initCallouts();
  initPremiumZoom();
  initFullscreenGallery();
  initMotion();
  initInlineGallery();
  initStickyVariant();
});

document.addEventListener('DOMContentLoaded', () => { wireNav(); initSearch(); initCatalog(); });

/* ═════════════════════════════════════════════════════════════════════════════
   CART — localStorage, works across all pages (demo, no backend)
   ═════════════════════════════════════════════════════════════════════════════ */
const CART_KEY = 'kg_cart_v1';

let cartMemory = null; // fallback when localStorage is unavailable (private mode, etc.)
function cartRead() {
  try { const v = localStorage.getItem(CART_KEY); return v ? JSON.parse(v) : (cartMemory || []); }
  catch (e) { return cartMemory || []; }
}
function cartWrite(items) {
  cartMemory = items;
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* private mode: keep in-memory */ }
  cartRefresh();
}
function cartCount() { return cartRead().reduce((n, i) => n + i.qty, 0); }
function cartTotal() { return cartRead().reduce((n, i) => n + i.price * i.qty, 0); }
function formatTRY(n) { return n.toLocaleString('tr-TR') + ' ₺'; }
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function slugify(s) { return String(s).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); }

let cartUI = null;
function buildCartUI() {
  if (cartUI) return cartUI;
  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  const drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-label', 'Sepetim');
  drawer.innerHTML =
    '<div class="cart-drawer__head"><h3>Sepetim</h3>' +
    '<button class="cart-close" aria-label="Kapat" type="button"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div>' +
    '<div class="cart-items"></div>' +
    '<div class="cart-drawer__foot"><div class="cart-total"><span class="label">Toplam</span><span class="value cart-total-value">0 ₺</span></div>' +
    '<button class="btn btn--primary cart-checkout" type="button" style="width:100%;">Sepeti Onayla</button></div>';
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  overlay.addEventListener('click', closeCart);
  drawer.querySelector('.cart-close').addEventListener('click', closeCart);
  drawer.querySelector('.cart-checkout').addEventListener('click', () => showToast('Demo: sipariş akışı yakında aktif olacak'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('active')) closeCart(); });

  cartUI = { overlay, drawer, items: drawer.querySelector('.cart-items'), total: drawer.querySelector('.cart-total-value') };
  return cartUI;
}

function renderCart() {
  const ui = buildCartUI();
  const items = cartRead();
  if (items.length === 0) {
    ui.items.innerHTML = '<p class="cart-empty">Sepetiniz henüz boş.</p>';
  } else {
    ui.items.innerHTML = items.map((it, i) =>
      '<div class="cart-item">' +
      (it.image ? '<img src="' + it.image + '" alt="">' : '') +
      '<div class="cart-item__body">' +
      '<p class="cart-item__title">' + escapeHtml(it.title) + '</p>' +
      '<p class="cart-item__meta">' + [it.size, it.color].filter(Boolean).map(escapeHtml).join(' · ') + '</p>' +
      '<div class="cart-item__row">' +
      '<span class="cart-qty"><button type="button" data-act="dec" data-i="' + i + '">−</button><span>' + it.qty + '</span><button type="button" data-act="inc" data-i="' + i + '">+</button></span>' +
      '<span class="cart-item__price">' + formatTRY(it.price * it.qty) + '</span>' +
      '</div>' +
      '<button class="cart-item__remove" type="button" data-act="rm" data-i="' + i + '">Kaldır</button>' +
      '</div></div>'
    ).join('');
    ui.items.querySelectorAll('button[data-act]').forEach(b => {
      b.addEventListener('click', () => {
        const i = +b.dataset.i, act = b.dataset.act, arr = cartRead();
        if (!arr[i]) return;
        if (act === 'inc') arr[i].qty++;
        else if (act === 'dec') arr[i].qty = Math.max(1, arr[i].qty - 1);
        else if (act === 'rm') arr.splice(i, 1);
        cartWrite(arr);
        renderCart();
      });
    });
  }
  ui.total.textContent = formatTRY(cartTotal());
}

function openCart() { const ui = buildCartUI(); renderCart(); ui.overlay.classList.add('active'); ui.drawer.classList.add('active'); lockScroll(); haptic(10); }
function closeCart() { if (!cartUI) return; cartUI.overlay.classList.remove('active'); cartUI.drawer.classList.remove('active'); unlockScroll(); }

function cartRefresh() {
  const badge = document.querySelector('.cart-badge');
  const c = cartCount();
  if (badge) { badge.textContent = c; badge.classList.toggle('hidden', c === 0); }
  if (cartUI && cartUI.drawer.classList.contains('active')) renderCart();
}

function addToCartFromPage() {
  const titleEl = document.querySelector('.product-info h1');
  const title = titleEl ? titleEl.textContent.trim() : 'Ürün';
  const priceEl = document.querySelector('.product-info .text-2xl') ||
    [...document.querySelectorAll('.product-info p')].find(p => /₺/.test(p.textContent));
  const price = priceEl ? (parseInt(priceEl.textContent.replace(/[^\d]/g, ''), 10) || 0) : 0;
  const sizeEl = document.querySelector('.size-btn.active');
  const colorEl = document.querySelector('.swatch.active');
  const size = sizeEl ? sizeEl.textContent.trim() : null;
  const color = colorEl ? colorEl.getAttribute('title') : null;
  const image = (document.getElementById('mainImage') || {}).src || '';
  const qtyEl = document.getElementById('qtyInput');
  const qty = qtyEl ? Math.max(1, parseInt(qtyEl.value, 10) || 1) : 1;

  if (!size) {
    const sizes = document.querySelector('.size-options');
    if (sizes) sizes.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Lütfen bir beden seçin');
    return;
  }

  cartAddItem({ title, price, size, color, image, qty });
}

// Shared add: merges same variant, persists, opens drawer.
function cartAddItem({ title, price, size, color, image, qty }) {
  const id = [slugify(title), size, color].filter(Boolean).join('|');
  const arr = cartRead();
  const existing = arr.find(i => i.id === id);
  if (existing) existing.qty += (qty || 1);
  else arr.push({ id, title, price, size, color, image, qty: qty || 1 });
  cartWrite(arr);
  haptic(12);
  showToast('Sepete eklendi');
  openCart();
}

// ── Campaign pricing (demo): show a struck list price + discount badge ───────
const KG_DISCOUNTS = [0, 0, 0, 15, 20, 20, 25, 30, 30, 40];
function discountFor(slug) {
  let h = 0; for (const c of String(slug)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return KG_DISCOUNTS[h % KG_DISCOUNTS.length];
}
function priceMarkup(price, slug) {
  const d = discountFor(slug);
  if (!d) return '<span class="price-now">' + formatTRY(price) + '</span>';
  const list = Math.round((price * 100 / (100 - d)) / 5) * 5;
  return '<span class="price-now sale">' + formatTRY(price) + '</span>' +
    '<span class="price-old">' + formatTRY(list) + '</span>' +
    '<span class="price-off">%' + d + '</span>';
}

document.addEventListener('DOMContentLoaded', () => {
  buildCartUI();

  const cartIcon = document.querySelector('.header-icons a[aria-label="Sepet"]');
  if (cartIcon) {
    const badge = document.createElement('span');
    badge.className = 'cart-badge hidden';
    badge.textContent = '0';
    cartIcon.appendChild(badge);
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation(); // suppress the placeholder dead-link toast
      openCart();
    }, true);
  }

  [...document.querySelectorAll('button')]
    .filter(b => /SEPETE EKLE/i.test(b.textContent))
    .forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); addToCartFromPage(); }));

  cartRefresh();
});
