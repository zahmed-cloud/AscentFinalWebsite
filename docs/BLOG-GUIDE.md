# Blog Guide — how you write and publish posts

First, the honest truth about how this works, because it matters.

This site is **static** (plain HTML files, no database, no server-side CMS). That is deliberate: it is fast, free to host, unbreakable, and great for SEO. The trade-off is there is no "log in and hit publish" admin panel built in. A blog post is just an HTML file in the repo. When a new file lands on the `main` branch, Vercel rebuilds and it is live.

So "writing a blog" = create the post's HTML file + add one card to the blog page + push. You have **three ways** to do that, easiest first.

---

## Way 1 — Just ask Claude Code (recommended, zero friction)

Open the project in Claude Code and say, in plain words:

> "Write a new blog post about [topic]. Category [Outbound / Founder Brand / GTM Strategy / Paid / Ops]. Publish it."

Or paste your own rough draft / a LinkedIn post you wrote and say **"turn this into a blog post and publish it."** Keeping it in your own words is better.

Claude does everything: writes it in the house voice, generates the Swiss cover image, adds the card to `blog.html`, updates the sitemap, and pushes so it goes live. You just review the draft first. **This is the path to use day to day.**

---

## Way 2 — The Blog Studio (write it yourself, visually)

`blog-studio.html` in the project root is a writing tool built for exactly this. Open it in your browser (double-click it, or visit `getascent.co/blog-studio.html` once deployed).

You get an editor on the left and a **live preview of the real article page** on the right. Fill in:
- **Title**, **Category**, **Date**, **Excerpt** (one line, the thesis)
- **Body** — write plainly. Four rules: blank line = new paragraph, `## ` = a heading, `> ` = a pull quote, `- ` = a bullet. (Buttons insert these for you.)

Then the four buttons:
1. **Download article file** → saves `article-your-title.html`
2. **Download cover image** → saves `your-title.png` (an on-brand Swiss cover)
3. **Copy blog-index card** → the snippet for the blog page
4. **Copy sitemap line**

Now publish those (no terminal needed) via **GitHub in the browser**:
- Go to the repo → `assets/blog/` → **Add file → Upload files** → drop in `your-title.png` → commit.
- Repo root → **Add file → Upload files** → drop in `article-your-title.html` → commit.
- Open `blog.html` → pencil (edit) icon → paste the copied card at the top of the `<div class="bcards">` grid → commit.
- Open `sitemap.xml` → edit → paste the copied line before `</urlset>`, fix the date → commit.

Vercel redeploys automatically. Live in ~1 minute. That is the whole thing, all from the GitHub website.

---

## Way 3 — By hand in the code

For a developer: copy `article-template.html`, fill the head (title, description, canonical, og tags, `article:published_time`, JSON-LD BlogPosting, og:image), write the body inside `<article class="prose">`, drop a cover in `assets/blog/`, add the card to `blog.html`, add the line to `sitemap.xml`, commit and push.

---

## Want a true "log in and publish" CMS later?

If you ever want the full hosted-editor experience (write in a browser panel, hit Publish, no file handling at all), the clean upgrade is **Decap CMS** (free, open source) wired to this repo. It needs a small one-time build step added to the project and GitHub login set up. Say the word when you want it and it is about an hour of setup. Until then, Way 1 and Way 2 cover you completely.

---

## House style for every post

- Titles are sharp and specific, never clickbait. The excerpt is one line stating the thesis.
- 600 to 900 words, one pull quote, one list. Useful to a founder who never books a call.
- Voice: plain, confident, operator-to-operator. No em-dashes, no emojis, no made-up numbers or clients.
- Categories stay within: Outbound · Founder Brand · GTM Strategy · Paid · Ops.
- Newest post goes at the top of the blog grid.
