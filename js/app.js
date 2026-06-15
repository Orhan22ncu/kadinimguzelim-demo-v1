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

// Demo callout points for the current product (max 4). Coords are % of the frame.
const PRODUCT_CALLOUTS = [
  { x: 50, y: 20, label: 'Fransız Dantel' },
  { x: 30, y: 52, label: 'Ayarlanabilir Askı' },
  { x: 64, y: 68, label: 'Yumuşak Saten Doku' },
  { x: 46, y: 88, label: 'Düşük Transparanlık' }
];

function getGallerySlides() {
  const thumbs = document.querySelectorAll('.product-gallery__thumbs img');
  const slides = [...thumbs].map(t => ({ src: t.src, alt: t.alt || '' }));
  if (slides.length === 0) {
    const main = document.getElementById('mainImage');
    if (main) slides.push({ src: main.src, alt: main.alt || '' });
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
    const i = slides.findIndex(s => s.src === mainImg.src);
    return i < 0 ? 0 : i;
  }
  function open() {
    idx = currentMainIndex();
    render();
    fs.classList.add('open');
    lockScroll();
    if (tip && window.matchMedia('(pointer: coarse)').matches) {
      tip.classList.add('show');
      setTimeout(() => tip.classList.remove('show'), 2800);
    }
  }
  function close() { fs.classList.remove('open'); unlockScroll(); resetZoom(false); }

  main.addEventListener('click', (e) => {
    if (e.target.closest('.callout-dot')) return; // dots handle their own taps
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
    if (mode === 'swipe' && !single) {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
    }
    if (mode === 'pinch' && scale < 1.05) resetZoom(true);
    if (e.touches.length === 0) mode = null;
  }, { passive: false });
}

// ── Detail callout layer ─────────────────────────────────────────────────────
function initCallouts() {
  const main = document.querySelector('.product-gallery__main');
  if (!main) return;

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

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.product-gallery')) return;
  initCallouts();        // before zoom so layer sits under lens interactions cleanly
  initPremiumZoom();
  initFullscreenGallery();
  initMotion();
});

/* ── Blur-up (LQIP) progressive image loading ────────────────────────────────
   Derives a tiny placeholder from the Ticimax Cloudflare image transform, shows
   it blurred, then fades in the full image. Fails gracefully (no CDN transform
   → no placeholder, image still loads normally). Runs on every page.          */
function lqipMicroUrl(src) {
  if (!/\/cdn-cgi\/image\//.test(src)) return null;
  return src.replace(/\/cdn-cgi\/image\/[^/]+\//, '/cdn-cgi/image/width=40,quality=35/');
}

function lqipBlurUp(img) {
  const wrap = img.parentElement;
  if (!wrap || img.dataset.lqip) return;
  const micro = lqipMicroUrl(img.currentSrc || img.src);
  if (!micro) return;
  img.dataset.lqip = '1';

  if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  if (getComputedStyle(wrap).overflow === 'visible') wrap.style.overflow = 'hidden';

  const ph = document.createElement('div');
  ph.className = 'lqip-ph';
  ph.style.backgroundImage = 'url("' + micro + '")';
  wrap.insertBefore(ph, img);
  img.classList.add('lqip-img');

  const done = () => {
    img.classList.add('lqip-loaded');
    wrap.classList.add('lqip-done');
    setTimeout(() => { if (ph.parentNode) ph.remove(); }, 520);
  };
  if (img.complete && img.naturalWidth > 0) {
    done();
  } else {
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', () => {
      img.classList.add('lqip-loaded');
      if (ph.parentNode) ph.remove();
    }, { once: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const targets = [];
  const main = document.getElementById('mainImage');
  if (main) targets.push(main);
  document.querySelectorAll('.product-card__image img').forEach(i => targets.push(i));
  targets.forEach(lqipBlurUp);
});
