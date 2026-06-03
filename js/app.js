/* ═════════════════════════════════════════════════════════════════════════════
   KadınımGuzelim — Demo Site v1.0
   Shared JavaScript
   ═════════════════════════════════════════════════════════════════════════════ */

// ── Mobile Navigation ───────────────────────────────────────────────────────
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  }
}

// ── Filter Drawer ───────────────────────────────────────────────────────────
function toggleFilterDrawer() {
  const drawer = document.getElementById('filterDrawer');
  const overlay = document.getElementById('filterOverlay');
  if (drawer && overlay) {
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
  }
}

// ── Product Gallery ─────────────────────────────────────────────────────────
function changeImage(thumb) {
  const main = document.getElementById('mainImage');
  if (main) {
    main.src = thumb.src;
    main.alt = thumb.alt;
  }
  // Update active state on thumbs
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

  // Close all others
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
  // Swatches
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', function() {
      this.parentElement.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Size buttons
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

  // Header hide/show on scroll
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    }, { passive: true });
    header.style.transition = 'transform 300ms ease';
  }

  // Product card hover quick-add (desktop)
  document.querySelectorAll('.category-grid .product-card').forEach(card => {
    const img = card.querySelector('.product-card__image');
    if (!img) return;

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
    img.style.position = 'relative';
    img.appendChild(overlay);

    card.addEventListener('mouseenter', () => { overlay.style.opacity = '1'; });
    card.addEventListener('mouseleave', () => { overlay.style.opacity = '0'; });
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
