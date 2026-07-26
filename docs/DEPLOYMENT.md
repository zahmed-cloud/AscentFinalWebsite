# Deployment — GitHub → Vercel → getascent.co

The site is static (no build step), so hosting is trivial. This mirrors the setup already running for the Outbound OS tool at `os.getascent.co`.

---

## 1. GitHub

Repo: `github.com/zahmed-cloud/AscentFinalWebsite` (private).

```bash
# day-to-day
git add -A
git commit -m "Short imperative summary"
git push origin main
```

`main` is the deploy branch. Anything pushed to `main` goes live once Vercel is connected.

## 2. Vercel (one-time setup)

1. vercel.com → **Add New → Project** → Import `zahmed-cloud/AscentFinalWebsite`.
2. Framework preset: **Other**. No build command, no output directory (root is the site).
3. Deploy. You get a `*.vercel.app` preview URL immediately.

Known quirk from the tool's repo: **Vercel's GitHub webhook occasionally misses a push** (commit never builds, site looks stale). Fix: push an empty commit and confirm the new deployment appears:

```bash
git commit --allow-empty -m "trigger deploy" && git push
```

Always verify a deploy landed by curling the live URL, not by assuming.

## 3. Domain (one-time)

DNS is on **Cloudflare** (nameservers already point there for getascent.co; the `os` subdomain already serves the tool).

1. Vercel project → Settings → **Domains** → add `getascent.co` and `www.getascent.co` (redirect www → apex).
2. In Cloudflare DNS, add what Vercel asks for (typically an A record for the apex to Vercel's IP, or CNAME flattening). **DNS-only (grey cloud)**, not proxied.
3. Wait for the domain to verify in Vercel. Done: `getascent.co` = this site, `os.getascent.co` = the tool.

## 4. Pre-launch checklist

Content (see `CONTENT-GUIDE.md` §5 for details):
- [x] Real booking link wired (cal.com/jamilahmed/30min, embed + buttons)
- [ ] Real testimonial quotes in place of "Real quote to add"
- [ ] 360Partners case-study outcome added
- [x] Blog: six real posts live with covers (see BLOG-GUIDE.md for publishing)
- [x] Blog cover images in place (assets/blog/)

Technical:
- [x] OG/social meta tags on every page + Mulberry OG image (`assets/og.png`)
- [x] Canonical URLs on every page
- [x] `robots.txt` + `sitemap.xml`
- [ ] Add analytics (owner's choice; keep it one lightweight script)
- [ ] Contact form backend: point the form `action` at Formspree/serverless, or remove the form and keep booking + email
- [ ] Click through every page on the live preview URL, desktop + phone
- [ ] Run the link check (below) one last time

## 5. Link check (run any time)

```bash
python3 - <<'PY'
import glob,re
pages=set(g for g in glob.glob("*.html"))
bad=0
for f in sorted(pages):
    s=open(f).read()
    for m in re.findall(r'href="([^"#:]+\.html)(#[^"]*)?"', s):
        if m[0] not in pages: print("BROKEN",f,"->",m[0]); bad+=1
    for m in re.findall(r'href="([a-z-]+\.html)#([a-zA-Z0-9-]+)"', s):
        if f'id="{m[1]}"' not in open(m[0]).read(): print("MISSING ANCHOR",f,"->",m[0]+"#"+m[1]); bad+=1
print("broken:",bad)
PY
```

## 6. After launch

- Update the Outbound OS landing's "That's Ascent" links if needed (they point to getascent.co already).
- Keep `main` deployable: preview risky changes locally before pushing.
