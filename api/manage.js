// Ascent CMS — manage posts: delete, or set pinned state.
// Regenerates blog.html, all-posts.html and sitemap.xml from posts.json.
import { getFile, commit, renderBlog, renderAllPosts, buildSitemap } from './_repo.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  const { ADMIN_PASSWORD, GITHUB_TOKEN, GITHUB_REPO } = process.env;
  if (!ADMIN_PASSWORD || !GITHUB_TOKEN || !GITHUB_REPO) { res.status(500).json({ error: 'Server not configured. Set ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO in Vercel.' }); return; }
  let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  const { password, action, slug, pinned } = b || {};
  if (password !== ADMIN_PASSWORD) { res.status(401).json({ error: 'Wrong password.' }); return; }
  if (!action || !slug) { res.status(400).json({ error: 'Missing action or slug.' }); return; }

  try {
    const manifest = JSON.parse((await getFile('posts.json')).content);
    const exists = manifest.posts.some(p => p.slug === slug);
    if (!exists) { res.status(404).json({ error: 'Post not found: ' + slug }); return; }
    const deletions = [];
    let message = '';

    if (action === 'delete') {
      manifest.posts = manifest.posts.filter(p => p.slug !== slug);
      deletions.push('article-' + slug + '.html', 'assets/blog/' + slug + '.png');
      message = 'Delete post: ' + slug;
    } else if (action === 'pin' || action === 'unpin') {
      const want = action === 'pin';
      manifest.posts = manifest.posts.map(p => p.slug === slug ? { ...p, pinned: want } : p);
      message = (want ? 'Pin' : 'Unpin') + ' post: ' + slug;
    } else if (action === 'setpinned') {
      manifest.posts = manifest.posts.map(p => p.slug === slug ? { ...p, pinned: !!pinned } : p);
      message = 'Update pin: ' + slug;
    } else { res.status(400).json({ error: 'Unknown action.' }); return; }

    const blog = (await getFile('blog.html')).content;
    const allp = (await getFile('all-posts.html')).content;
    const files = [
      { path: 'posts.json', content: JSON.stringify(manifest, null, 2) },
      { path: 'blog.html', content: renderBlog(blog, manifest.posts) },
      { path: 'all-posts.html', content: renderAllPosts(allp, manifest.posts) },
      { path: 'sitemap.xml', content: buildSitemap(manifest.posts) },
    ];
    const sha = await commit(files, deletions, message);
    res.status(200).json({ ok: true, commit: sha, posts: manifest.posts });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
}
