# PSGC Limited — WhiteShield Commercial Cleaning

Static marketing website for **WhiteShield Commercial Cleaning**, a P&S Group company. The site promotes WhiteShield's commercial, industrial and post-construction cleaning services, and showcases the **White Shield** household cleaning product range.

No build step, framework, or package manager — plain HTML, CSS and vanilla JavaScript served directly by Apache.

## Structure

```
.
├── index.html              Home — hero, services overview, product teaser, process, CTA
├── services.html           Services detail (Office, Commercial Property, Post-Construction,
│                            Industrial, Specialist), each an anchorable section (#office, etc.)
├── products.html           White Shield product catalogue with category filtering + lightbox
├── about.html              Company story, value props, sectors served
├── contact.html            Quote request form (mailto handoff) + FAQ accordion
├── .htaccess                Apache rewrite rules (clean URLs, canonical redirects)
├── assets/
│   ├── css/style.css        Single stylesheet — design tokens + all page styles
│   ├── js/main.js           Single script — all page behaviour (vanilla JS, IIFE)
│   └── img/
│       ├── brand/            PSGC/WhiteShield logo
│       ├── products/         Optimised product photos (white-shield/, irae/)
│       ├── _originals/       Un-optimised source images kept for reference
│       └── stock/             Lifestyle/stock photography used in heroes & sections
└── PSGC.zip                  Archived snapshot (not part of the served site)
```

Every page shares the same `<header>`/`<nav>`/`<footer>` markup and pulls in `assets/css/style.css` and `assets/js/main.js`.

## Routing

Apache `.htaccess` rewrites requests so pages are served without the `.html` extension (e.g. `/services` → `services.html`), and redirects `/index.html` → `/`. Internal links throughout the site use the extensionless form (`/services`, `/products#white-shield`, etc.), so this rewriting must stay in place — the raw `.html` files are not meant to be linked to directly.

## Styling (`assets/css/style.css`)

- Design tokens live in `:root` — navy/sky palette from the PSGC mark, plus teal/gold and crimson accents reserved for the two house brands (White Shield, Irae).
- Fonts: Sora (headings) and Inter (body), loaded from Google Fonts.
- Utility classes: `.container`, `.section-pad`, `.btn`/`.btn-primary`/`.btn-ghost`/`.btn-light`/`.btn-outline-light`, `.eyebrow`, `.lede`.
- Scroll-reveal animation classes (`.reveal`, `.reveal-stagger`) are toggled by JS via `IntersectionObserver`.
- Responsive breakpoints handled with plain `@media` queries; `prefers-reduced-motion` is respected.

## Behaviour (`assets/js/main.js`)

Single IIFE wiring up interactions across all pages (each block checks that its target elements exist before attaching, so one file safely serves every page):

- Header scroll state + "back to top" button visibility
- Mobile nav toggle/panel
- Scroll-reveal animations via `IntersectionObserver`
- Home page hero brand card carousel (auto-rotating + clickable dots)
- Home page focus tabs (if present)
- Products page: category filter buttons and an image lightbox with keyboard (arrow keys/Escape) and click navigation
- Contact page: form submission is intercepted and turned into a pre-filled `mailto:` link (no backend/server) — there is no real form submission endpoint
- FAQ accordion (single-open) on the contact page
- Cookie consent banner, persisted to `localStorage`

## Content notes

- Contact details (address, phone, email) are hardcoded in `contact.html` and the footer of every page — update both if they change.
- Product cards in `products.html` are hardcoded per item (image, name, category, description); there is no data file or CMS driving them.
- The `irae` product image set exists under `assets/img/` and the CSS reserves a teal/gold palette for it, but it is not yet wired into any page — likely a second product line planned for the future.

## Local development

No install step required. Serve the directory with any static file server, e.g.:

```bash
npx serve .
```

Note that without Apache's `.htaccess` rewrites active, extensionless links (`/services`, `/products`, etc.) will 404 under most static servers — append `.html` when testing locally, or use a server configured to mimic the same rewrite rules.

## Deployment

The site is deployed as-is (static files + `.htaccess`) to an Apache-based host. There is no CI/CD pipeline in this repository.
