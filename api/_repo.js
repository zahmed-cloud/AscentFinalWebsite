// Shared helpers for the Ascent CMS serverless functions.
// GitHub Git Data API commits + rendering blog.html / all-posts.html / sitemap
// from posts.json (the single source of truth). Luminous Light design.

const BOOK="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2jekQFQ5Ny4aO7LEXS1zeKG5qta-lnk4YEx9eosryEtErrGx9ACSKav5i37M6Fj5ukKz2nLF9o?gv=true";
const NAV='<nav><div class="wrap navin"><a class="brand" href="/">Ascent<i></i></a><span class="nl"><a href="services">Services</a><a href="industries">Industries</a><a href="about">About</a><a href="results">Case studies</a><a href="blog" class="on">Blog</a></span><a class="btn g" href="'+BOOK+'" target="_blank" rel="noopener">Book a call <span class="arw">&#8594;</span></a></div></nav>';
const CTA='<div class="ctaband"><div class="wrap"><div class="ctapanel"><span class="cg"></span><h2>Let&#39;s get your pipeline moving.</h2><a class="btn" href="'+BOOK+'" target="_blank" rel="noopener">Book a call &#8594;</a></div></div></div>';
const FOOT='<footer class="ft"><div class="wrap"><div class="fgrid"><div class="fb"><a class="brand" href="/">Ascent<i></i></a><p>Pipeline, authority and infrastructure for B2B. One system, one point of accountability.</p></div><div class="fc"><h4>Company</h4><a href="services">Services</a><a href="industries">Industries</a><a href="about">About</a><a href="results">Case studies</a><a href="how-we-work">How we work</a><a href="blog">Blog</a></div><div class="fc"><h4>Get in touch</h4><a href="mailto:jamil@getascent.co">jamil@getascent.co</a><a href="tel:+447445551437">+44 7445 551437</a><a href="https://www.linkedin.com/in/getascent/" target="_blank" rel="noopener">LinkedIn</a><a href="contact">Contact</a></div><div class="fc"><h4>Coverage</h4><p>USA &middot; UK &middot; UAE</p><p>Australia &middot; Europe</p></div></div><div class="fbot"><span>&copy; 2026 Ascent&#9642; &mdash; getascent.co</span><span><a href="privacy">Privacy</a> &middot; <a href="terms">Terms</a></span><span>B2B GTM &amp; Outbound</span></div></div></footer>';
const OWNER_REPO=()=>process.env.GITHUB_REPO;
const BRANCH=()=>process.env.GITHUB_BRANCH||"main";
const CORE=["","services","results","industries","about","how-we-work","blog","all-posts","contact","privacy","terms"];

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
  return `    <a class="card post" href="article-${p.slug}"><img class="cov" src="assets/blog/${p.slug}.png" alt="${esc(p.alt||p.title)}" loading="lazy"><div class="pb"><span class="cat">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><div class="meta">${esc(p.category)} &middot; ${esc(p.date)}</div></div></a>`;
}
export function featured(posts,n=6){ return posts.filter(p=>p.pinned).slice(0,n); }
function between(html,tag,inner){
  const re=new RegExp("<!--"+tag+"-->[\\s\\S]*?<!--\\/"+tag+"-->");
  return html.replace(re,"<!--"+tag+"-->"+inner+"<!--/"+tag+"-->");
}
export function renderBlog(html,posts){
  const cards="\n"+featured(posts).map(card).join("\n")+"\n  ";
  html=between(html,"POSTS",cards);
  const more=posts.length>6?'<div class="allc"><a href="all-posts">Read all posts &#8594;</a></div>':'';
  return between(html,"MORE",more);
}
export function renderAllPosts(html,posts){
  const cards="\n"+posts.map(card).join("\n")+"\n  ";
  return between(between(html,"POSTS",cards),"MORE","");
}
export function buildSitemap(posts){
  const urls=CORE.map(p=>"https://getascent.co/"+p).concat(posts.map(p=>"https://getascent.co/article-"+p.slug));
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
    urls.map(u=>'  <url><loc>'+u+'</loc><lastmod>2026-07-29</lastmod></url>').join("\n")+"\n</urlset>\n";
}
export function articleHTML(p,bodyHTML){
  const jsonld=JSON.stringify({"@context":"https://schema.org","@type":"BlogPosting",headline:p.title,description:p.excerpt,datePublished:p.iso,dateModified:p.updated||p.iso,author:{"@type":"Person",name:"Jamil Ahmed",url:"https://www.linkedin.com/in/getascent/"},publisher:{"@type":"Organization",name:"Ascent"},image:"https://getascent.co/assets/blog/"+p.slug+".png",mainEntityOfPage:"https://getascent.co/article-"+p.slug,url:"https://getascent.co/article-"+p.slug});
  const faqld=(p.faq&&p.faq.length)?'\n<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:p.faq.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))})+'<\/script>':'';
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)} — Ascent</title>
<meta name="description" content="${esc(p.excerpt)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/lux.css">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="canonical" href="https://getascent.co/article-${p.slug}">
<meta property="og:type" content="article">
<meta property="article:published_time" content="${p.iso}">
<meta property="og:site_name" content="Ascent">
<meta property="og:title" content="${esc(p.title)} — Ascent">
<meta property="og:description" content="${esc(p.excerpt)}">
<meta property="og:url" content="https://getascent.co/article-${p.slug}">
<meta property="og:image" content="https://getascent.co/assets/blog/${p.slug}.png">
<meta property="og:image:width" content="1600"><meta property="og:image:height" content="1000">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)} — Ascent">
<meta name="twitter:description" content="${esc(p.excerpt)}">
<meta name="twitter:image" content="https://getascent.co/assets/blog/${p.slug}.png">
<meta name="theme-color" content="#ffffff">
<script type="application/ld+json">${jsonld}<\/script>${faqld}
</head>
<body>
${NAV}
<header class="phero"><span class="glow a"></span><span class="glow c"></span><div class="wrap in"><span class="badge"><b></b> ${esc(p.category)}</span><h1>${esc(p.title)}</h1><p class="artmeta">By Jamil Ahmed &middot; ${esc(p.category)} &middot; ${esc(p.date)}</p></div></header>
<section class="sec-pad" style="padding-top:0"><div class="wrap"><div class="article-wrap"><img class="acover" src="assets/blog/${p.slug}.png" alt="${esc(p.title)}" width="1600" height="1000"><article class="prose">
${bodyHTML}
</article></div></div></section>
${CTA}
${FOOT}
<script src="js/nav.js" defer></script>
</body></html>
`;
}
