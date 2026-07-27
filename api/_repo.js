// Shared helpers for the Ascent CMS serverless functions.
// GitHub Git Data API commits + rendering blog.html / all-posts.html / sitemap
// from posts.json (the single source of truth).

const NAV="<nav><div class=\"wrap navin\">\n  <a class=\"brand\" href=\"index.html\">Ascent<span class=\"sq\"></span></a>\n  <div class=\"nl\">\n    <div class=\"nl-item has-mega\">\n      <a href=\"services.html\" aria-haspopup=\"true\" aria-expanded=\"false\">Services <span class=\"mcaret\">&#9662;</span></a>\n      <div class=\"mega\"><div class=\"wrap mega-in\">\n        <div class=\"mega-intro\">\n          <div class=\"mega-ih\">View all services</div>\n          <p>Take one service standalone, or run the whole engine.</p>\n          <a class=\"mega-all\" href=\"services.html\">See all services <span class=\"arrow\">&#8594;</span></a>\n        </div>\n        <div class=\"mega-col\">\n          <div class=\"mega-h\">Infrastructure</div>\n          <a class=\"mega-link\" href=\"services.html#s1\"><b>GTM Strategy &amp; Foundation</b><span>ICP, positioning, and the 90-day roadmap</span></a>\n          <a class=\"mega-link\" href=\"services.html#s6\"><b>Marketing Ops &amp; Automation</b><span>CRM, workflows, and dashboards that connect it all</span></a>\n        </div>\n        <div class=\"mega-col\">\n          <div class=\"mega-h\">Pipeline</div>\n          <a class=\"mega-link\" href=\"services.html#s2\"><b>Outbound &amp; Pipeline</b><span>Multi-channel outbound that books qualified calls weekly</span></a>\n          <a class=\"mega-link\" href=\"services.html#s4\"><b>Paid Ads</b><span>LinkedIn and Google campaigns that create and capture demand</span></a>\n        </div>\n        <div class=\"mega-col\">\n          <div class=\"mega-h\">Authority</div>\n          <a class=\"mega-link\" href=\"services.html#s3\"><b>Founder LinkedIn Ghostwriting</b><span>Turn your LinkedIn into an authority asset</span></a>\n          <a class=\"mega-link\" href=\"services.html#s5\"><b>Website, Landing Pages &amp; CRO</b><span>Sites and pages built to convert visitors into leads</span></a>\n        </div>\n      </div></div>\n    </div>\n    <a href=\"industries.html\">Industries</a>\n    <a href=\"about.html\">About</a>\n    <a href=\"results.html\">Case studies</a>\n    <a href=\"blog.html\" class=\"active\">Blog</a>\n    <a class=\"nl-contact\" href=\"contact.html\">Get in touch</a>\n  </div>\n  <span class=\"navr\">\n    <a class=\"git\" href=\"contact.html\">Get in touch</a>\n    <a class=\"btn red\" href=\"https://cal.com/jamilahmed/30min\" target=\"_blank\" rel=\"noopener\">Book a call <span class=\"arrow\">&#8594;</span></a>\n    <button class=\"burger\" aria-label=\"Menu\" aria-expanded=\"false\">Menu</button>\n  </span>\n</div></nav>", CTA="<section class=\"ctaband\" id=\"book\"><div class=\"wrap\">\n  <h2 data-r>Let's get your pipeline moving.</h2>\n  <a class=\"btn bone\" href=\"https://cal.com/jamilahmed/30min\" target=\"_blank\" rel=\"noopener\" data-r>Book a call <span class=\"arrow\">&#8594;</span></a>\n</div></section>", FOOT="<footer><div class=\"wrap\">\n  <div class=\"fgrid\">\n    <div class=\"fbrand\">\n      <a class=\"brand\" href=\"index.html\">Ascent<span class=\"sq\"></span></a>\n      <p>Pipeline, authority and infrastructure for B2B. One system, one point of accountability.</p>\n    </div>\n    <div class=\"fcol\">\n      <h4>Company</h4>\n      <a href=\"services.html\">Services</a>\n      <a href=\"industries.html\">Industries</a>\n      <a href=\"about.html\">About</a>\n      <a href=\"results.html\">Case studies</a>\n      <a href=\"how-we-work.html\">How we work</a>\n      <a href=\"blog.html\">Blog</a>\n    </div>\n    <div class=\"fcol\">\n      <h4>Get in touch</h4>\n      <a href=\"contact.html\">Contact</a>\n      <a href=\"mailto:jamil@getascent.co\">jamil@getascent.co</a>\n      <a href=\"https://www.linkedin.com/in/getascent/\">LinkedIn</a>\n    </div>\n    <div class=\"fcol\">\n      <h4>Coverage</h4>\n      <p>USA &middot; UK &middot; UAE</p>\n      <p>Australia &middot; Europe</p>\n    </div>\n  </div>\n  <div class=\"fbot\"><span>&copy; 2026 Ascent&#9642; &mdash; getascent.co</span><span class=\"fbot-legal\"><a href=\"privacy.html\">Privacy</a> &middot; <a href=\"terms.html\">Terms</a></span><span>B2B GTM &amp; Outbound</span></div>\n</div></footer>";
const OWNER_REPO=()=>process.env.GITHUB_REPO;
const BRANCH=()=>process.env.GITHUB_BRANCH||"main";
const CORE=["","services.html","results.html","industries.html","about.html","how-we-work.html","blog.html","all-posts.html","contact.html","privacy.html","terms.html"];

export function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

export async function gh(path,opts={}){
  const r=await fetch("https://api.github.com"+path,{...opts,headers:{Authorization:"Bearer "+process.env.GITHUB_TOKEN,Accept:"application/vnd.github+json","User-Agent":"ascent-cms","Content-Type":"application/json",...(opts.headers||{})}});
  const t=await r.text();
  if(!r.ok) throw new Error("GitHub "+r.status+" "+path+": "+t.slice(0,300));
  return t?JSON.parse(t):{};
}
export async function getFile(p){
  const R="/repos/"+OWNER_REPO();
  const j=await gh(R+"/contents/"+encodeURIComponent(p).replace(/%2F/g,"/")+"?ref="+BRANCH());
  return {content:Buffer.from(j.content,"base64").toString("utf8"),sha:j.sha};
}
// files:[{path,content,encoding}] deletions:[path]
export async function commit(files,deletions,message){
  const R="/repos/"+OWNER_REPO();
  const ref=await gh(R+"/git/ref/heads/"+BRANCH());
  const head=ref.object.sha;
  const base=(await gh(R+"/git/commits/"+head)).tree.sha;
  const tree=[];
  for(const f of files){
    const blob=await gh(R+"/git/blobs",{method:"POST",body:JSON.stringify({content:f.content,encoding:f.encoding||"utf-8"})});
    tree.push({path:f.path,mode:"100644",type:"blob",sha:blob.sha});
  }
  for(const d of (deletions||[])) tree.push({path:d,mode:"100644",type:"blob",sha:null});
  const newTree=await gh(R+"/git/trees",{method:"POST",body:JSON.stringify({base_tree:base,tree})});
  const c=await gh(R+"/git/commits",{method:"POST",body:JSON.stringify({message,tree:newTree.sha,parents:[head]})});
  await gh(R+"/git/refs/heads/"+BRANCH(),{method:"PATCH",body:JSON.stringify({sha:c.sha})});
  return c.sha;
}

export function card(p){
  return `    <a class="bcard" href="article-${p.slug}.html" data-r>
      <img width="1600" height="1000" class="thumb" src="assets/blog/${p.slug}.png" alt="${esc(p.alt||p.title)}" loading="lazy">
      <div class="bc">
        <span class="cat">${esc(p.category)}</span>
        <h2>${esc(p.title)}</h2>
        <p>${esc(p.excerpt)}</p>
        <div class="meta">${esc(p.category)} &middot; ${esc(p.date)}</div>
      </div>
    </a>`;
}
export function featured(posts,n=6){
  return posts.filter(p=>p.pinned).slice(0,n); // pinned = on the blog, newest first
}
function between(html,tag,inner){
  const re=new RegExp("<!--"+tag+"-->[\\s\\S]*?<!--\\/"+tag+"-->");
  return html.replace(re,"<!--"+tag+"-->"+inner+"<!--/"+tag+"-->");
}
export function renderBlog(html,posts){
  const cards="\n"+featured(posts).map(card).join("\n")+"\n  ";
  html=between(html,"POSTS",cards);
  const more=posts.length>6?'<div class="center mt-l" data-r><a class="btn ghostd" href="all-posts.html">Read all posts <span class="arrow">&#8594;</span></a></div>':'';
  return between(html,"MORE",more);
}
export function renderAllPosts(html,posts){
  const cards="\n"+posts.map(card).join("\n")+"\n  ";
  return between(between(html,"POSTS",cards),"MORE","");
}
export function buildSitemap(posts){
  const urls=CORE.map(p=>"https://getascent.co/"+p).concat(posts.map(p=>"https://getascent.co/article-"+p.slug+".html"));
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
    urls.map(u=>'  <url><loc>'+u+'</loc><lastmod>2026-07-28</lastmod></url>').join("\n")+"\n</urlset>\n";
}
export function articleHTML(p,bodyHTML){
  const jsonld=JSON.stringify({"@context":"https://schema.org","@type":"BlogPosting",headline:p.title,description:p.excerpt,datePublished:p.iso,dateModified:p.iso,author:{"@type":"Person",name:"Jamil Ahmed",url:"https://www.linkedin.com/in/getascent/"},publisher:{"@type":"Organization",name:"Ascent"},image:"https://getascent.co/assets/blog/"+p.slug+".png",mainEntityOfPage:"https://getascent.co/article-"+p.slug+".html",url:"https://getascent.co/article-"+p.slug+".html"});
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)} — Ascent</title>
<meta name="description" content="${esc(p.excerpt)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="canonical" href="https://getascent.co/article-${p.slug}.html">
<meta property="og:type" content="article">
<meta property="article:published_time" content="${p.iso}">
<meta property="og:site_name" content="Ascent">
<meta property="og:title" content="${esc(p.title)} — Ascent">
<meta property="og:description" content="${esc(p.excerpt)}">
<meta property="og:url" content="https://getascent.co/article-${p.slug}.html">
<meta property="og:image" content="https://getascent.co/assets/blog/${p.slug}.png">
<meta property="og:image:width" content="1600"><meta property="og:image:height" content="1000">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)} — Ascent">
<meta name="twitter:description" content="${esc(p.excerpt)}">
<meta name="twitter:image" content="https://getascent.co/assets/blog/${p.slug}.png">
<meta name="theme-color" content="#161619">
<script type="application/ld+json">${jsonld}<\/script>
</head>
<body>

${NAV}

<main>
<section class="phero"><div class="wrap">
  <div class="top" data-r><span class="ey"><span class="sq"></span>&nbsp; ${esc(p.category.toUpperCase())}</span><span class="ey">Est. 2022 — USA / UK / UAE / AU / EU</span></div>
  <h1 data-r>${esc(p.title)}</h1>
  <p class="mono" data-r style="font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--dim);margin-top:22px">By Jamil Ahmed &middot; ${esc(p.category)} &middot; ${esc(p.date)}</p>
</div></section>

<section><div class="wrap">
  <img src="assets/blog/${p.slug}.png" alt="${esc(p.title)}" width="1600" height="1000" style="width:100%;height:auto;border-radius:3px;display:block" data-r>
  <article class="prose" data-r style="margin-top:44px">
${bodyHTML}
  </article>
</div></section>
</main>

${CTA}

${FOOT}

<script src="js/script.js"><\/script>
</body></html>
`;
}
