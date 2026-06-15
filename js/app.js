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
    if (!fine.matches) return;
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
    if (!fine.matches) return;
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
    '</div>' +
    '<div class="fs-gallery__dots"></div>';
  document.body.appendChild(fs);

  const img = fs.querySelector('.fs-gallery__img');
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
  }
  function go(i) { idx = (i + slides.length) % slides.length; render(); }
  function currentMainIndex() {
    const i = slides.findIndex(s => s.src === mainImg.src);
    return i < 0 ? 0 : i;
  }
  function open() { idx = currentMainIndex(); render(); fs.classList.add('open'); lockScroll(); }
  function close() { fs.classList.remove('open'); unlockScroll(); }

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

  // Swipe (mobile)
  let sx = 0;
  fs.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  fs.addEventListener('touchend', (e) => {
    if (single) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
  });
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

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.product-gallery')) return;
  initCallouts();        // before zoom so layer sits under lens interactions cleanly
  initPremiumZoom();
  initFullscreenGallery();
});
