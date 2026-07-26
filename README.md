# Ascent — Company Website

The marketing site for **Ascent**, a GTM agency for B2B companies.
Tagline: *Pipeline, authority and infrastructure for B2B.*

- **Production domain:** `getascent.co` (root)
- **Sister product:** Ascent Outbound OS, the free LinkedIn tool at `os.getascent.co` (separate repo: `zahmed-cloud/outboundos`)
- **Owner:** Jamil Ahmed, Founder & Growth Partner

---

## Tech at a glance

Plain **HTML + CSS + vanilla JavaScript**. No framework, no build step, no dependencies.
Google Fonts (Archivo + IBM Plex Mono) is the only external resource.

If you can edit an HTML file, you can maintain this site.

## Project structure

```
AscentFinalWebsite/
├── index.html            Home
├── services.html         Services (6 detailed services, anchors #s1..#s6)
├── results.html          Results (case studies + testimonials)
├── industries.html       Industries (who we work with)
├── about.html            About (story, founder, philosophy, difference)
├── how-we-work.html      How We Work (process, 3 packages, engagement note)
├── blog.html             Blog index (card grid)
├── article.html          Blog article template
├── contact.html          Contact (booking embed + form)
│
├── css/
│   └── styles.css        THE design system. Every page shares this one file.
├── js/
│   └── script.js         Scroll reveals, mobile nav, mega-menu accordion.
├── assets/
│   ├── founder.png       Founder photo (transparent cut-out)
│   └── favicon.svg       Browser-tab icon
│
├── docs/
│   ├── DESIGN-SYSTEM.md        Palette, type, components, layout rules
│   ├── CONTENT-GUIDE.md        Locked copy, writing rules, page content map
│   ├── DEPLOYMENT.md           GitHub → Vercel → domain, pre-launch checklist
│   └── partials-reference.html Canonical shared NAV / CTA band / FOOTER markup
│
└── README.md             You are here
```

## Run it locally

No build step. Either:

```bash
# quickest
open index.html

# recommended (relative links + fonts behave exactly like production)
python3 -m http.server 8080
# then open http://localhost:8080
```

VS Code users: the **Live Server** extension works great (right-click `index.html` → Open with Live Server).

## How the site is wired

- **One stylesheet.** `css/styles.css` holds the entire design system. Change a colour or component there and every page updates. Never write per-page `<style>` blocks.
- **One script.** `js/script.js` powers the scroll-reveal (`[data-r]` elements), the mobile burger menu, and the Services mega-menu accordion on mobile. Desktop mega-menu hover is pure CSS.
- **Shared chrome.** Every page carries the same NAV, CTA band, and FOOTER. There is no templating; the markup is duplicated per page. The canonical copy of those blocks lives in `docs/partials-reference.html`. **If you change the nav or footer, change it on every page** (a find-and-replace across `*.html` is the reliable way).
- **Active nav state.** Each page marks its own nav link with `class="active"` (Contact marks the "Get in touch" link).
- **Section rhythm.** Pages alternate dark (charcoal) and light (bone) sections. Light sections use `<section class="light">` and the stylesheet re-colours components automatically. See `docs/DESIGN-SYSTEM.md`.

## Editing rules (read before touching copy)

Some copy is **locked** and some is placeholder. Writing style rules (no em-dashes, no emojis, the voice) are strict. **Read `docs/CONTENT-GUIDE.md` before editing any text.**

## Before launch (open items)

Every placeholder is clearly marked in the pages; nothing is faked.

1. **Booking link** — all "Book a call" buttons point to `contact.html#book`; the Contact page has a labelled `.embed` placeholder for Calendly (or similar).
2. **Testimonials** (`results.html`, `index.html`) — real names are in place, quotes are marked "Real quote to add". Paste the actual LinkedIn recommendations.
3. **Case study outcome** (`results.html`) — 360Partners outcome is marked "Real outcome to add".
4. **Blog** — `blog.html` and `article.html` contain clearly-labelled sample posts. Replace with real articles or hide Blog from the nav until ready.
5. **Images** — `.thumb` blocks are labelled placeholders.
6. **OG/social tags + analytics** — not yet added; do this at deploy time (see `docs/DEPLOYMENT.md`).

## Deploying

See `docs/DEPLOYMENT.md` for the full GitHub → Vercel → `getascent.co` walkthrough and the pre-launch checklist.

## House rules for future changes

- Match the existing design system; don't invent new colours, fonts, or component styles ad hoc.
- No frameworks, no build tooling, no npm. The zero-dependency setup is deliberate.
- Keep pages accessible: alt text on images, labels on form fields, visible focus states (already wired).
- Test at mobile width (≤860px) after any nav or layout change.
- Commit messages: short imperative summary + a body explaining why.
