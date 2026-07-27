# Your blog CMS — setup (one time, ~10 minutes)

This gives you a private admin page where you write a post and hit **Publish**, and it goes live on getascent.co by itself. No files, no GitHub, no terminal, ever again.

## How it works (plain version)

Your site is static, so the "backend" is one small serverless function that runs on Vercel. When you click Publish, it quietly saves the new post into your repo, and Vercel puts it live in about a minute. Only you can reach the admin page, because it is password protected.

```
You at getascent.co/admin  →  write + Publish  →  serverless function commits the post
                                                    →  Vercel redeploys  →  live on your site
```

## One-time setup

### 1. Deploy the site to Vercel
Follow `DEPLOYMENT.md`: import the repo, framework "Other", deploy, connect getascent.co. The `/api/publish` function deploys automatically with the site (no extra step).

### 2. Create a GitHub token (lets the function save your posts)
- GitHub → your avatar → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
- Repository access: **Only select repositories → AscentFinalWebsite**.
- Permissions → Repository permissions → **Contents: Read and write**.
- Generate, and **copy the token** (you only see it once).
- (Classic token alternative: scope `public_repo` is enough since the repo is public.)

### 3. Add the settings in Vercel
Vercel → your project → **Settings → Environment Variables**. Add these four, then redeploy:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | a password you choose (this is your admin login) |
| `GITHUB_TOKEN` | the token from step 2 |
| `GITHUB_REPO` | `zahmed-cloud/AscentFinalWebsite` |
| `GITHUB_BRANCH` | `main` |

That is it. The token stays on the server and is never sent to your browser.

## Writing a post (every time, ~5 minutes)

1. Go to **getascent.co/admin**, enter your password.
2. Fill in Title, Category, Date, Excerpt.
3. Write the body. Four simple rules (buttons insert them):
   - blank line = new paragraph
   - `## ` = a heading
   - `> ` = a pull quote
   - `- ` = a bullet
4. Watch the live preview on the right.
5. Click **Publish to website**. Done. Live in about a minute, with an on-brand cover image generated for you and the blog index updated automatically.

Your draft auto-saves in the browser as you type, so you will not lose work.

## Notes
- The admin page and the function are hidden from search engines (noindex + robots disallow).
- The password is a simple gate, fine for a solo site. Keep it private and it is enough.
- To change the design of published posts, the article template lives inside `api/publish.js` (the `articleHTML` function). If the site nav or footer changes, update the copies in that function too.
- Prefer not to run a backend at all? You can still use `blog-studio.html` (write + export files) or just ask Claude Code to publish for you. See `BLOG-GUIDE.md`.
