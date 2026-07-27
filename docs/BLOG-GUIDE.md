# Blog Guide — how to write and publish a post

Two ways to publish. Way 1 is the one you will actually use.

---

## Way 1 (easiest): ask Claude Code

Open the project in Claude Code and say, in your own words:

> "Write a new blog post about [topic]. Category [Outbound / Founder Brand / GTM Strategy / Paid / Ops]. Publish it."

Claude will: copy the template, write the article in the house voice (following `CONTENT-GUIDE.md`), generate a matching Swiss cover image, add the card to `blog.html`, update `sitemap.xml`, and push. You review the draft before it goes live.

You can also paste a rough draft or a LinkedIn post you wrote and say "turn this into a blog post" — that keeps it in YOUR words, which is better.

## Way 2 (manual): the 6-step checklist

Total time: ~20 minutes once you have the words.

### 1. Copy the template

Duplicate `article-template.html` in the project root and rename it:

```
article-my-post-title.html      (lowercase, hyphens, keep it short)
```

### 2. Fill in the head (top of the file)

Update these lines with your title, one-line summary, and the new filename:

- `<title>Your Title — Ascent</title>`
- `<meta name="description" content="One-line summary.">`
- `<link rel="canonical" href="https://getascent.co/article-my-post-title.html">`
- The `og:title`, `og:description`, `og:url`, `twitter:title`, `twitter:description` lines (same values)
- `og:type` stays `article`; update `article:published_time` to your publish date
- Add/adjust the JSON-LD BlogPosting block (copy one from a published article and update headline, dates, image, url)
- `og:image` + `twitter:image` → your cover image URL (step 4)

### 3. Fill in the page

- Hero eyebrow: the category (OUTBOUND, FOUNDER BRAND, GTM STRATEGY, PAID, or OPS)
- `<h1>`: your title
- Byline: `By Jamil Ahmed · Category · 12 Jun 2026`
- Body inside `<article class="prose">`: paragraphs, 3-4 `<h2>` sections, one `<blockquote>` pull quote, one `<ul>` list. 600-900 words is the sweet spot.

**Writing rules (from CONTENT-GUIDE.md): no em-dashes, no emojis, no made-up numbers or clients, plain confident operator voice.**

### 4. Cover image

Drop a 1600×1000 image into `assets/blog/my-post-title.png` and point the
`<img src="assets/blog/...">` (featured image) at it.

Easiest: ask Claude Code to "generate a Swiss cover image for this post" — it builds the geometric Mulberry/charcoal covers all the other posts use, so the blog stays consistent. Photos also work if you prefer.

### 5. Add the card to the blog index

In `blog.html`, copy the FIRST `<a class="bcard" ...>` block, paste it at the TOP of the `.bcards` grid, and update: `href`, the `<img>` src + alt, category, title, excerpt (one line), and the date. Newest post goes first.

### 6. Ship it

Add the new page to `sitemap.xml` (copy any `<url>` line, change the filename), then:

```bash
git add -A
git commit -m "Post: your title"
git push
```

Vercel deploys automatically. Done.

## House style for posts (quick reference)

- Titles are sharp and specific ("Booked calls are a number, not a strategy"), never clickbait.
- The excerpt is ONE line and states the thesis, not "in this post we will...".
- Every post should be useful to a founder who never books a call. The CTA band does the selling; the article just has to be good.
- Categories stay within: Outbound · Founder Brand · GTM Strategy · Paid · Ops.
