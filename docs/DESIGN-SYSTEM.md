# Ascent Design System — "Dark Swiss"

Everything visual lives in `css/styles.css`. This document explains the system so you can extend it without breaking it.

The look: Swiss/International-Typographic-style grids, heavy uppercase Archivo headlines, mono micro-labels, index numbering (01, 02, 03), hairline rules, and one disciplined accent colour on charcoal and bone grounds.

---

## 1. Colour

Defined once as CSS custom properties in `:root`:

| Token | Value | Use |
|---|---|---|
| `--red` | `#8d1c3d` | **Mulberry, the brand accent.** Fills: buttons, ticker, CTA band, squares, logo dot. Also accent *text on light* sections. |
| `--redt` | `#c9536f` | Lighter Mulberry. Accent *text on dark* sections (small mono labels, index numbers) where `--red` fails contrast. |
| `--ink` | `#161619` | Charcoal. Dark section background, text on light sections. |
| `--ink2` | `#0f0f12` | Near-black. Footer background. |
| `--bone` | `#e9e6dc` | Warm off-white. Light section background, text on dark sections. |
| `--dim` / `--dim2` | bone @ 60% / 40% | Muted text on dark. |
| `--idim` / `--idim2` | `#55534a` / `#7d7a6e` | Muted text on light. |
| `--ld` / `--ll` | bone @ 14% / ink @ 13% | Hairline borders on dark / on light. |

**The one rule that keeps the site legible:** on dark grounds use `--redt` for accent *text* and `--red` for accent *fills*. On light grounds `--red` works for both. Components already follow this via `.light` overrides; keep the pattern.

The whole brand can be re-themed by editing these tokens (that is how the site was moved from red `#ff3b30` to Mulberry).

## 2. Typography

Loaded from Google Fonts in each page `<head>`:

- **Archivo** (`--a`) — everything. Headlines are `font-weight:900`, `text-transform:uppercase`, `letter-spacing:-.02em`, tight `line-height:.94`.
- **IBM Plex Mono** (`--m`) — the "chrome": eyebrows, section index labels (`01 — Why Ascent`), nav links, tags, metadata. Always small, uppercase, letter-spaced.

Scale is fluid via `clamp()`. Hero H1 goes up to 150px on Home (`.hero h1`) and 110px on inner pages (`.phero h1`).

## 3. Layout primitives

| Class | What it is |
|---|---|
| `.wrap` | Max-width 1440px container with fluid `--pad` side padding. Every section's inner wrapper. |
| `section` + `.light` | Dark by default; add `class="light"` for a bone section. **Alternate them** down the page for the Swiss rhythm. |
| `.shead` | Section header row: `h2` left, mono index label right, 2px rule underneath. |
| `.two` | Two-column intro (big heading left, paragraph right). Add `.dark` on dark sections. |
| `.cols.c3` / `.cols.c4` | Column blocks with top rules and hairline dividers (pillars, process steps). Each child is `.col` with `.n` (mono number) or `.big` (huge number). |
| `.sgrid` / `.scard` | 3-across bordered service cards (Home). |
| `.svc` | Full service block on Services: `.svc-head` (giant number + title) and `.svc-body` (what/outcome left, `.deliv` list right). |
| `.packs` / `.pack` | Package cards. All equal weight, no highlighted card (deliberate decision, keep it). |
| `.quotes` / `.q` | Testimonial cards with `.ph` placeholder chip, blockquote, `.who` footer. |
| `.case` | Case-study row: name left, `dl` grid (Needed / Ascent did / Outcome) right. |
| `.bcards` / `.bcard` | Blog index cards with `.thumb` placeholder image block. |
| `.prose` | Article body. **Centered** reading column, max-width 700px, Medium-style. |
| `.founder` | About founder block: round Mulberry-backed photo + bio. Photo uses the transparent cut-out with a tight portrait crop (`object-position:center 34%; scale(1.38)`). |
| `.ctaband` | Full-width Mulberry closing band with heading + bone button. Every page except Contact. |
| `.form` / `.field` | Contact form styles, labels bound with `for`/`id`. |

## 4. Navigation

- Sticky nav with blur. `.brand` = "Ascent" + Mulberry square.
- **Services mega-menu** (`.has-mega` inside `.nl`): full-width `.mega` panel, 3 columns ordered **Infrastructure / Pipeline / Authority**, each `.mega-link` = service title + one-liner anchored to `services.html#s1..#s6`.
  - Desktop: opens on `:hover` and `:focus-within` (keyboard accessible), closes with a 150ms delay (`transition-delay` trick).
  - Mobile (≤860px): burger opens the menu; first tap on Services expands the accordion, second tap navigates to the Services page.
- Current page's link gets `class="active"`.

## 5. Motion

- **Scroll reveal:** any element with `data-r` fades/slides in via IntersectionObserver (`js/script.js`). Hero/phero elements reveal on page load instead.
- **Ticker** (Home only): the Mulberry marquee. Content is duplicated twice and animated `translateX(-50%)`, so it loops seamlessly. If you edit the items, keep the two identical halves.
- Everything respects `prefers-reduced-motion` (reveals render final-state, ticker stops, smooth-scroll off).

## 6. Accessibility notes (already wired, keep them)

- `:focus-visible` outline on links and buttons.
- Burger has `aria-label` + `aria-expanded`; mega trigger has `aria-haspopup`.
- One `<img>` on the site (founder) has meaningful alt, width/height, `loading="lazy"`.
- Form fields: `<label for>` + `required` on name/email.
- Small accent text on dark uses `--redt` for contrast (see Colour).

## 7. Do / Don't

**Do** reuse existing components; extend with the same tokens; keep dark/light alternation; keep index numbering sequential per page.

**Don't** add new colours or fonts; don't re-highlight a package card; don't put a div inside a span (the nav is structured with divs for validity); don't add per-page styles.
