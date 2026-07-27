// Ascent CMS — serverless publish endpoint (Vercel Node function).
// Commits a new blog post to the GitHub repo in one atomic commit, which
// triggers a Vercel redeploy. Auth via ADMIN_PASSWORD. Never exposes the token.
//
// Required Vercel env vars:
//   ADMIN_PASSWORD   a password you choose (the /admin login)
//   GITHUB_TOKEN     a GitHub token with repo/public_repo scope
//   GITHUB_REPO      "zahmed-cloud/AscentFinalWebsite"
//   GITHUB_BRANCH    "main" (optional, defaults to main)

const NAV = "<nav><div class=\"wrap navin\">\n  <a class=\"brand\" href=\"index.html\">Ascent<span class=\"sq\"></span></a>\n  <div class=\"nl\">\n    <div class=\"nl-item has-mega\">\n      <a href=\"services.html\" aria-haspopup=\"true\" aria-expanded=\"false\">Services <span class=\"mcaret\">&#9662;</span></a>\n      <div class=\"mega\"><div class=\"wrap mega-in\">\n        <div class=\"mega-intro\">\n          <div class=\"mega-ih\">View all services</div>\n          <p>Take one service standalone, or run the whole engine.</p>\n          <a class=\"mega-all\" href=\"services.html\">See all services <span class=\"arrow\">&#8594;</span></a>\n        </div>\n        <div class=\"mega-col\">\n          <div class=\"mega-h\">Infrastructure</div>\n          <a class=\"mega-link\" href=\"services.html#s1\"><b>GTM Strategy &amp; Foundation</b><span>ICP, positioning, and the 90-day roadmap</span></a>\n          <a class=\"mega-link\" href=\"services.html#s6\"><b>Marketing Ops &amp; Automation</b><span>CRM, workflows, and dashboards that connect it all</span></a>\n        </div>\n        <div class=\"mega-col\">\n          <div class=\"mega-h\">Pipeline</div>\n          <a class=\"mega-link\" href=\"services.html#s2\"><b>Outbound &amp; Pipeline</b><span>Multi-channel outbound that books qualified calls weekly</span></a>\n          <a class=\"mega-link\" href=\"services.html#s4\"><b>Paid Ads</b><span>LinkedIn and Google campaigns that create and capture demand</span></a>\n        </div>\n        <div class=\"mega-col\">\n          <div class=\"mega-h\">Authority</div>\n          <a class=\"mega-link\" href=\"services.html#s3\"><b>Founder LinkedIn Ghostwriting</b><span>Turn your LinkedIn into an authority asset</span></a>\n          <a class=\"mega-link\" href=\"services.html#s5\"><b>Website, Landing Pages &amp; CRO</b><span>Sites and pages built to convert visitors into leads</span></a>\n        </div>\n      </div></div>\n    </div>\n    <a href=\"industries.html\">Industries</a>\n    <a href=\"about.html\">About</a>\n    <a href=\"results.html\">Case studies</a>\n    <a href=\"blog.html\" class=\"active\">Blog</a>\n    <a class=\"nl-contact\" href=\"contact.html\">Get in touch</a>\n  </div>\n  <span class=\"navr\">\n    <a class=\"git\" href=\"contact.html\">Get in touch</a>\n    <a class=\"btn red\" href=\"https://cal.com/jamilahmed/30min\" target=\"_blank\" rel=\"noopener\">Book a call <span class=\"arrow\">&#8594;</span></a>\n    <button class=\"burger\" aria-label=\"Menu\" aria-expanded=\"false\">Menu</button>\n  </span>\n</div></nav>";
const CTA = "<section class=\"ctaband\" id=\"book\"><div class=\"wrap\">\n  <h2 data-r>Let's get your pipeline moving.</h2>\n  <a class=\"btn bone\" href=\"https://cal.com/jamilahmed/30min\" target=\"_blank\" rel=\"noopener\" data-r>Book a call <span class=\"arrow\">&#8594;</span></a>\n</div></section>";
const FOOT = "<footer><div class=\"wrap\">\n  <div class=\"fgrid\">\n    <div class=\"fbrand\">\n      <a class=\"brand\" href=\"index.html\">Ascent<span class=\"sq\"></span></a>\n      <p>Pipeline, authority and infrastructure for B2B. One system, one point of accountability.</p>\n    </div>\n    <div class=\"fcol\">\n      <h4>Company</h4>\n      <a href=\"services.html\">Services</a>\n      <a href=\"industries.html\">Industries</a>\n      <a href=\"about.html\">About</a>\n      <a href=\"results.html\">Case studies</a>\n      <a href=\"how-we-work.html\">How we work</a>\n      <a href=\"blog.html\">Blog</a>\n    </div>\n    <div class=\"fcol\">\n      <h4>Get in touch</h4>\n      <a href=\"contact.html\">Contact</a>\n      <a href=\"mailto:jamil@getascent.co\">jamil@getascent.co</a>\n      <a href=\"https://www.linkedin.com/in/getascent/\">LinkedIn</a>\n    </div>\n    <div class=\"fcol\">\n      <h4>Coverage</h4>\n      <p>USA &middot; UK &middot; UAE</p>\n      <p>Australia &middot; Europe</p>\n    </div>\n  </div>\n  <div class=\"fbot\"><span>&copy; 2026 Ascent&#9642; &mdash; getascent.co</span><span class=\"fbot-legal\"><a href=\"privacy.html\">Privacy</a> &middot; <a href=\"terms.html\">Terms</a></span><span>B2B GTM &amp; Outbound</span></div>\n</div></footer>";

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function articleHTML(p){
  const jsonld = JSON.stringify({"@context":"https://schema.org","@type":"BlogPosting",
    headline:p.title, description:p.excerpt, datePublished:p.iso, dateModified:p.iso,
    author:{"@type":"Person",name:"Jamil Ahmed",url:"https://www.linkedin.com/in/getascent/"},
    publisher:{"@type":"Organization",name:"Ascent"},
    image:"https://getascent.co/assets/blog/"+p.slug+".png",
    mainEntityOfPage:"https://getascent.co/article-"+p.slug+".html",
    url:"https://getascent.co/article-"+p.slug+".html"});
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
${p.bodyHTML}
  </article>
</div></section>
</main>

${CTA}

${FOOT}

<script src="js/script.js"><\/script>
</body></html>
`;
}

const API="https://api.github.com";
async function gh(path, token, opts={}){
  const r=await fetch(API+path,{...opts,headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json","User-Agent":"ascent-cms","Content-Type":"application/json",...(opts.headers||{})}});
  const t=await r.text();
  if(!r.ok) throw new Error("GitHub "+r.status+" "+path+": "+t.slice(0,300));
  return t?JSON.parse(t):{};
}

export default async function handler(req,res){
  if(req.method!=="POST"){res.status(405).json({error:"POST only"});return;}
  const {ADMIN_PASSWORD,GITHUB_TOKEN,GITHUB_REPO,GITHUB_BRANCH}=process.env;
  const branch=GITHUB_BRANCH||"main";
  if(!ADMIN_PASSWORD||!GITHUB_TOKEN||!GITHUB_REPO){res.status(500).json({error:"Server not configured. Set ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO in Vercel."});return;}
  let b=req.body; if(typeof b==="string"){try{b=JSON.parse(b);}catch{b={};}}
  const {password,title,category,date,iso,excerpt,slug,bodyHTML,coverBase64}=b||{};
  if(password!==ADMIN_PASSWORD){res.status(401).json({error:"Wrong password."});return;}
  if(!title||!slug||!bodyHTML){res.status(400).json({error:"Missing title, slug or body."});return;}
  const cat=category||"Outbound";
  try{
    const R="/repos/"+GITHUB_REPO;
    // current head + base tree
    const ref=await gh(R+"/git/ref/heads/"+branch,GITHUB_TOKEN);
    const headSha=ref.object.sha;
    const baseCommit=await gh(R+"/git/commits/"+headSha,GITHUB_TOKEN);
    const baseTree=baseCommit.tree.sha;
    // current blog.html + sitemap.xml
    const blogF=await gh(R+"/contents/blog.html?ref="+branch,GITHUB_TOKEN);
    const siteF=await gh(R+"/contents/sitemap.xml?ref="+branch,GITHUB_TOKEN);
    let blog=Buffer.from(blogF.content,"base64").toString("utf8");
    let sitemap=Buffer.from(siteF.content,"base64").toString("utf8");
    // insert card (newest first)
    const card='    <a class="bcard" href="article-'+slug+'.html" data-r>\n'+
      '      <img class="thumb" src="assets/blog/'+slug+'.png" alt="'+esc(title)+'" loading="lazy" width="1600" height="1000">\n'+
      '      <div class="bc"><span class="cat">'+esc(cat)+'</span><h2>'+esc(title)+'</h2><p>'+esc(excerpt)+'</p><div class="meta">'+esc(cat)+' &middot; '+esc(date)+'</div></div>\n'+
      '    </a>\n';
    blog=blog.replace(/(<div class="bcards">\s*\n)/,'$1'+card);
    sitemap=sitemap.replace("</urlset>",'  <url><loc>https://getascent.co/article-'+slug+'.html</loc><lastmod>'+iso+'</lastmod></url>\n</urlset>');
    // blobs
    async function blob(content,encoding){const j=await gh(R+"/git/blobs",GITHUB_TOKEN,{method:"POST",body:JSON.stringify({content,encoding})});return j.sha;}
    const tree=[
      {path:"article-"+slug+".html",mode:"100644",type:"blob",sha:await blob(articleHTML({title,category:cat,date,iso,excerpt,slug,bodyHTML}),"utf-8")},
      {path:"blog.html",mode:"100644",type:"blob",sha:await blob(blog,"utf-8")},
      {path:"sitemap.xml",mode:"100644",type:"blob",sha:await blob(sitemap,"utf-8")},
    ];
    if(coverBase64){tree.push({path:"assets/blog/"+slug+".png",mode:"100644",type:"blob",sha:await blob(coverBase64.replace(/^data:image\/png;base64,/,""),"base64")});}
    const newTree=await gh(R+"/git/trees",GITHUB_TOKEN,{method:"POST",body:JSON.stringify({base_tree:baseTree,tree})});
    const commit=await gh(R+"/git/commits",GITHUB_TOKEN,{method:"POST",body:JSON.stringify({message:"Post: "+title,tree:newTree.sha,parents:[headSha]})});
    await gh(R+"/git/refs/heads/"+branch,GITHUB_TOKEN,{method:"PATCH",body:JSON.stringify({sha:commit.sha})});
    res.status(200).json({ok:true,url:"https://getascent.co/article-"+slug+".html",commit:commit.sha});
  }catch(e){res.status(500).json({error:String(e.message||e)});}
}
