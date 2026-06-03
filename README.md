# KadınımGuzelim — Client Approval Demo v1.0

> **Status:** Client presentation demo  
> **Purpose:** Allow Bürol Bey to experience the premium storefront vision before production commitment  
> **Scope:** Visual demonstration only — no backend, no payment, no production data

---

## What This Is

This is a **static HTML/CSS/JS demo storefront** built to present the visual direction for KadınımGuzelim's new e-commerce experience.

It is **NOT**:
- A production website
- A Ticimax replacement
- A functional store with checkout
- Connected to real inventory or payment systems

It **IS**:
- A navigable, responsive demo with real product images
- A proof-of-concept for layout, typography, color palette, and mobile UX
- A tool for client approval before investment in full implementation

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Homepage | `index.html` | Hero, categories, new arrivals, featured products, trust layer, brand story, Instagram grid |
| Category | `category.html` | Saten Gecelik category with product grid, filters, pagination |
| Product | `product.html` | Bordo Saten Gecelik detail page with gallery, variants, accordion, sticky CTA |

---

## Tech Stack

- **HTML5** semantic markup
- **CSS3** custom properties, flexbox, grid, mobile-first responsive
- **Vanilla JS** (no frameworks)
- **Google Fonts** (Playfair Display, Inter, Montserrat)
- **Product images** from KadınımGuzelim's live Ticimax CDN

---

## Design System

| Token | Value |
|-------|-------|
| Primary Dark | `#2D2D2D` |
| Cream | `#F5F0EB` |
| Gold Accent | `#C4A77D` |
| Rose Accent | `#B85C5C` |
| Display Font | Playfair Display |
| Body Font | Inter |
| UI Font | Montserrat |

---

## Local Development

```bash
# Serve locally
python3 -m http.server 8766

# Open
open http://localhost:8766
```

---

## Deployment

This demo is deployed as a static site. No build step required.

---

## License

© 2024 KadınımGuzelim. All rights reserved.  
This demo is proprietary and confidential. Not for public distribution without written permission.
