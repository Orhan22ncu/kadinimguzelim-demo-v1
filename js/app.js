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
