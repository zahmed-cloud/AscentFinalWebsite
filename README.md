# Ascent — website

A multi-page static site for **Ascent**, a B2B GTM & Outbound agency. Design: "Dark Swiss" (charcoal + bone + red, Archivo + IBM Plex Mono, grid-led, index numbering).

Domain: **getascent.co**

## Run it

It is plain HTML/CSS/JS. No build step.

- **Quickest:** double-click `index.html` (or open in a browser).
- **Recommended (so relative links behave):** run a local server from this folder:
  ```bash
  python3 -m http.server 8080
  # then open http://localhost:8080
  ```
- **VS Code:** open this folder, then use the "Live Server" extension, or just open `index.html`.

## Structure

```
ascent_site/
├── index.html          Home
├── services.html       Services (6 detailed services, ids #s1..#s6)
├── results.html        Results (case studies + testimonials)
├── industries.html     Industries (who we work with)
├── about.html          About (story, philosophy, difference)
├── how-we-work.html    How We Work (process, 3 packages, focus)
├── blog.html           Blog index (card grid)
├── article.html        Blog article template
├── contact.html        Contact (booking + form)
├── assets/founder.png  Founder photo (local)
├── favicon.svg         Browser-tab icon
├── styles.css          The whole design system (shared by every page)
├── script.js           Scroll reveal + mobile nav (shared)
├── _partials.html      Reference: the exact shared NAV / CTA band / FOOTER markup
└── README.md
```

Every page shares `styles.css`, `script.js`, and the same NAV / CTA band / FOOTER. To change the design once and everywhere, edit `styles.css`. To change nav or footer, update the markup in each page (see `_partials.html` for the canonical block).

## Placeholders to replace before launch

Nothing is faked. These are the clearly-marked spots to fill with real assets:

1. **Booking link** — every "Book a call" points to `contact.html#book`, and the Contact page has a `.embed` placeholder. Drop in your Calendly (or similar) embed there, and optionally point the buttons straight at the booking URL.
2. **Testimonials** — real names are in place (Abbie Bowtell / 360Partners, Adam Pounds, Feodor Kozmin, Jacob Mars, James McLoughlin, Tim Hickle) with quotes marked "Real quote to add". Paste the actual LinkedIn recommendation text.
3. **Case study outcomes** — the 360Partners case has "Real outcome to add". Add the real result.
4. **Blog** — `blog.html` + `article.html` use sample posts. Replace with real articles, or hide Blog from the nav until ready (an empty blog signals inactivity).
5. **Images** — `.thumb` blocks (blog, article featured image) are labelled placeholders. Add real images.
6. **Founder photo** — on About, served locally from `assets/founder.png`.
7. **Analytics + OG/social tags** — add before deploy (favicon is done, `favicon.svg`).

## Deploy

Static site, so any static host works: Vercel, Netlify, or Cloudflare Pages. Push the folder, connect `getascent.co`, done. (Your tool already lives at `os.getascent.co`.)

## Writing rules (keep consistent)

- No em-dashes in body copy (commas or full stops). The only dash is inside the locked `EST. 2022 — USA / UK / UAE / AU / EU` label.
- No emojis.
- Voice: plain, confident, operator-to-operator, Aussie-inflected.
