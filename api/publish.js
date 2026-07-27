// Ascent CMS — publish a new post (or update an existing slug).
// Commits article page + cover + updated posts.json + regenerated
// blog.html, all-posts.html and sitemap.xml in one atomic commit.
import { getFile, commit, articleHTML, renderBlog, renderAllPosts, buildSitemap } from './_repo.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  const { ADMIN_PASSWORD, GITHUB_TOKEN, GITHUB_REPO } = process.env;
  if (!ADMIN_PASSWORD || !GITHUB_TOKEN || !GITHUB_REPO) { res.status(500).json({ error: 'Server not configured. Set ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO in Vercel.' }); return; }
  let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  const { password, title, category, date, iso, excerpt, slug, bodyHTML, coverBase64 } = b || {};
  if (password !== ADMIN_PASSWORD) { res.status(401).json({ error: 'Wrong password.' }); return; }
  if (!title || !slug || !bodyHTML) { res.status(400).json({ error: 'Missing title, slug or body.' }); return; }

  try {
    const manifest = JSON.parse((await getFile('posts.json')).content);
    const post = { slug, title, category: category || 'Outbound', date, iso, excerpt: excerpt || '', alt: title, cover: 'assets/blog/' + slug + '.png', pinned: true };
    manifest.posts = manifest.posts.filter(p => p.slug !== slug);
    manifest.posts.unshift(post);

    const blog = (await getFile('blog.html')).content;
    const allp = (await getFile('all-posts.html')).content;

    const files = [
      { path: 'article-' + slug + '.html', content: articleHTML(post, bodyHTML) },
      { path: 'posts.json', content: JSON.stringify(manifest, null, 2) },
      { path: 'blog.html', content: renderBlog(blog, manifest.posts) },
      { path: 'all-posts.html', content: renderAllPosts(allp, manifest.posts) },
      { path: 'sitemap.xml', content: buildSitemap(manifest.posts) },
    ];
    if (coverBase64) files.push({ path: 'assets/blog/' + slug + '.png', content: coverBase64.replace(/^data:image\/png;base64,/, ''), encoding: 'base64' });

    const sha = await commit(files, [], 'Post: ' + title);
    res.status(200).json({ ok: true, url: 'https://getascent.co/article-' + slug + '.html', commit: sha });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
}
