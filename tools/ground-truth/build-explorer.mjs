#!/usr/bin/env node
// Ground Truth Explorer (v0.2) — a self-contained, zero-dependency navigator.
// Research-informed: plain-language IA, search + facets, breadcrumbs, relationship map,
// back-links, trace-to-source. Content is server-rendered (works even if JS fails) and
// internal .md cross-references are rewritten to in-app navigation.
// Usage: node tools/ground-truth/build-explorer.mjs  ->  ./ground-truth-explorer.html
import fs from 'node:fs';
import path from 'node:path';
import { loadArtifacts, runChecks, stats, mdToHtml, parseFrontmatter, REPO_ROOT } from './lib.mjs';

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let LOGO = ''; try { LOGO = fs.readFileSync(path.join(REPO_ROOT, 'design-system/assets/logo-rootstrap-white.svg'), 'utf8'); } catch (e) {}

const PART_ORDER = ['01-project-context','02-domain-model','03-capability-specs','04-engineering-context','05-integration-contracts','06-eval-suite','07-decision-log','_schema','reference'];
const SECTIONS = {
  '01-project-context': { label: 'Why & who', hint: 'Goals, audience, owners, success, open questions' },
  '02-domain-model': { label: 'How the business works', hint: 'Our language, the things we talk about, the rules' },
  '03-capability-specs': { label: "What we're building", hint: 'Each website capability + how we know it works' },
  '04-engineering-context': { label: "How we'll build it", hint: 'Stack, architecture, SEO & AI discovery' },
  '05-integration-contracts': { label: 'What it connects to', hint: 'HubSpot, Slack & other systems' },
  '06-eval-suite': { label: "How we know it's right", hint: 'The automated checks' },
  '07-decision-log': { label: 'Decisions & why', hint: 'What we decided and the reasoning' },
  '_schema': { label: 'Rules of the model', hint: 'How Ground Truth itself is structured' },
  'reference': { label: 'Reference', hint: 'Supporting documents' },
};
const COLORS = { '01-project-context':'#778fed','02-domain-model':'#ffc83f','03-capability-specs':'#4cc38a','04-engineering-context':'#a78bfa','05-integration-contracts':'#f06595','06-eval-suite':'#38bdf8','07-decision-log':'#fb923c','_schema':'#969699','reference':'#575759' };
const STATUS_COLOR = { approved:'#4cc38a', draft:'#969699', 'in-review':'#778fed', 'needs-revalidation':'#ff8a80', deprecated:'#575759' };
const STATUS_MEAN = { draft:'Written, not yet confirmed by a person', 'in-review':'Being checked by a stakeholder', approved:'A person has confirmed this is true', 'needs-revalidation':'Something changed — needs re-checking', deprecated:'Replaced or retired' };
const CONF_MEAN = { high:'Backed by a primary source and confirmed', medium:'One credible source, not yet confirmed', low:'Inferred, or sources disagree — needs a human' };

// ---- load + resolve internal links ----
// Ground Truth artifacts + a few key project docs (so cross-links navigate in-app, not out to raw files).
const EXTRA_DOCS = ['CLAUDE.md','README.md','explorer/SPEC.md','docs/recommendations.md','docs/current-site-audit.md','tools/ground-truth/README.md'];
const extra = EXTRA_DOCS.filter(p => fs.existsSync(path.join(REPO_ROOT, p))).map(p => {
  const txt = fs.readFileSync(path.join(REPO_ROOT, p), 'utf8');
  const { meta, body } = parseFrontmatter(txt);
  const h = (body.match(/^#\s+(.+)$/m) || [])[1];
  return { path: path.join(REPO_ROOT, p), relPath: p, id: p, isArtifact: false, meta: { title: meta.title || h || p, part: 'reference' }, body };
});
const raw = [...loadArtifacts(), ...extra];
const pathToId = {}; for (const it of raw) pathToId[it.relPath.replace(/\\/g,'/')] = it.id;
const titleById = {}; for (const it of raw) titleById[it.id] = it.meta.title || it.id;

function resolveLinks(html, relPath) {
  const dir = path.posix.dirname(relPath.replace(/\\/g,'/'));
  return html.replace(/(href|src)="([^"]+)"/g, (m, attr, val) => {
    if (/^(https?:|mailto:|#|\/\/|data:)/.test(val)) return m;
    const filePart = val.split('#')[0];
    if (!filePart) return m;
    const target = path.posix.normalize(path.posix.join(dir, filePart));
    if (attr === 'href' && pathToId[target]) return 'href="#' + pathToId[target] + '" class="xref"';
    if (fs.existsSync(path.join(REPO_ROOT, target))) return attr + '="' + target + '"';
    return m; // leave (external or unknown)
  });
}

const items = raw.map(it => {
  const bodyHtml = resolveLinks(mdToHtml(it.body), it.relPath);
  const searchText = ((it.meta.title || '') + ' ' + it.body).toLowerCase().replace(/\s+/g, ' ');
  return {
    id: it.id, isArtifact: it.isArtifact, relPath: it.relPath,
    title: it.meta.title || it.id,
    part: it.meta.part || (it.relPath.includes('_schema') ? '_schema' : 'reference'),
    type: it.meta.type || 'doc', status: it.meta.status || '', confidence: it.meta.confidence || '',
    owner: it.meta.owner || '', last_validated: it.meta.last_validated || '', validated_by: it.meta.validated_by || '',
    surfaces: it.meta.applies_to || [], sources: it.meta.sources || [], related: (it.meta.related || []).filter(r => titleById[r]),
    tags: it.meta.tags || [], tier: it.meta.tier || '', capability: it.meta.capability || '', bodyHtml, searchText,
  };
});
const backlinks = {};
for (const it of items) for (const r of it.related) (backlinks[r] ||= []).push(it.id);

const checks = runChecks(raw);
const st = stats(raw);
const surfaces = [...new Set(items.flatMap(i => i.surfaces))].sort();

// ---- server-rendered meta + articles ----
function chip(id) { return '<a class="chip" href="#' + id + '">' + esc(titleById[id] || id) + '</a>'; }
function metaHtml(it) {
  const rel = it.related.length ? '<div class="relrow"><div class="k">Related →</div>' + it.related.map(chip).join('') + '</div>' : '';
  const bl = (backlinks[it.id] || []).length ? '<div class="relrow"><div class="k">← Referenced by</div>' + backlinks[it.id].map(chip).join('') + '</div>' : '';
  const src = it.sources.length ? it.sources.map(s => '<div class="src">↳ ' + esc(s) + '</div>').join('') : '<div class="val">—</div>';
  return '<div class="meta">'
    + '<div><div class="k">Owner</div><div class="val">' + esc(it.owner || '—') + '</div></div>'
    + '<div><div class="k">Status</div><div class="val"><span class="badge b-' + it.status + '" title="' + esc(STATUS_MEAN[it.status] || '') + '">' + (it.status || '—') + '</span></div></div>'
    + '<div><div class="k">Confidence</div><div class="val" title="' + esc(CONF_MEAN[it.confidence] || '') + '">' + (it.confidence || '—') + '</div></div>'
    + '<div><div class="k">Last validated</div><div class="val">' + esc(it.last_validated || '—') + (it.validated_by && it.validated_by !== 'pending' ? ' · ' + esc(it.validated_by) : '') + '</div></div>'
    + '<div><div class="k">Applies to</div><div class="val">' + (it.surfaces.join(', ') || '—') + '</div></div>'
    + '<div><div class="k">Type' + (it.tier ? ' · tier ' + esc(it.tier) : '') + '</div><div class="val">' + esc(it.type) + '</div></div>'
    + '<div class="full"><div class="k">Where this comes from (trace)</div>' + src + '</div>'
    + (rel ? '<div class="full">' + rel + '</div>' : '') + (bl ? '<div class="full">' + bl + '</div>' : '')
    + '</div>';
}
function designSystemExtras() {
  let assets = '';
  try {
    const dir = path.join(REPO_ROOT, 'design-system', 'assets');
    for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.svg'))) {
      assets += '<div class="assetcard">' + fs.readFileSync(path.join(dir, f), 'utf8') + '<div class="nm">' + esc(f) + '</div></div>';
    }
  } catch (e) {}
  const palette = [['Primary 500','#FFC83F'],['Primary 300','#FFDB80'],['Secondary 500','#778FED'],['Neutral 900','#191A1B'],['Neutral 600','#575759'],['Neutral 100','#F5F5F5'],['Success','#4CC38A'],['Danger','#FF8A80']]
    .map(p => '<div class="pal"><div class="c" style="background:' + p[1] + '"></div><div class="l">' + p[0] + '<br>' + p[1] + '</div></div>').join('');
  return '<h2>Palette</h2><div class="palette">' + palette + '</div><h2>Brand assets</h2><div class="assetgrid">' + (assets || '<div class="val">no assets found</div>') + '</div>';
}
const articles = items.map(it =>
  '<article id="art-' + it.id + '" class="art"><div class="pill">' + esc(it.relPath) + '</div><h1 class="t">' + esc(it.title) + '</h1>'
  + (it.isArtifact ? metaHtml(it) : '') + '<div class="doc">' + it.bodyHtml + (it.id === 'gt-04-design-system' ? designSystemExtras() : '') + '</div></article>'
).join('\n');

// overview (server-rendered)
const ok = checks.errors.length === 0;
const guided = [
  ['Understand the strategy','gt-01-goals-and-scope','Why we’re doing this'],
  ['Who is this for?','gt-01-audience-and-icp','Audience & buyers'],
  ['What are we building?','gt-03-index','The website’s capabilities'],
  ['What’s decided?','gt-07-index','Decisions & reasoning'],
  ['What’s still open?','gt-01-non-goals-and-open-questions','Open questions'],
  ['See the relationship map','map','How it all connects'],
].map(([t,h,s]) => '<a class="gcard" href="#' + h + '"><div class="gt-t">' + t + '</div><div class="gt-s">' + s + '</div></a>').join('');
const legend = Object.entries(STATUS_MEAN).map(([k,v]) => '<div class="leg"><span class="dot" style="background:' + (STATUS_COLOR[k]||'#888') + '"></span><b>' + k + '</b> — ' + v + '</div>').join('');
const decisions = items.filter(i => i.type === 'decision' && i.id !== 'gt-07-index')
  .map(i => '<li>' + chip(i.id) + ' <span class="badge b-' + i.status + '">' + i.status + '</span></li>').join('');
const overview = '<section id="view-overview" class="view">'
  + '<div class="ey">Ground Truth · v0.2 · draft for validation</div>'
  + '<h1 class="t">Rootstrap, as a living model</h1>'
  + '<p class="lead">This is a precise, living picture of how Rootstrap works and what we’re building — written so the software can be <em>derived</em> from it. It’s structured, owned, and validated: every claim shows <b>who owns it</b>, <b>how sure we are</b>, and <b>where it came from</b>. Start anywhere below.</p>'
  + '<div class="gcards">' + guided + '</div>'
  + '<div class="cards">' + ('<div class="card"><div class="n">' + st.total + '</div><div class="l">things in the model</div></div>')
    + Object.entries(st.byStatus).map(([k,v]) => '<div class="card"><div class="n" style="color:' + (STATUS_COLOR[k]||'#fff') + '">' + v + '</div><div class="l">' + k + '</div></div>').join('') + '</div>'
  + '<div class="check ' + (ok ? 'ok' : 'bad') + '"><b>Health check: ' + (ok ? 'PASS ✓' : 'FAIL ✗') + '</b> — ' + checks.count + ' items checked for completeness, valid status, and working links.'
    + (ok ? '' : '<ul>' + checks.errors.map(e => '<li>' + esc(e.rel) + ' — ' + esc(e.msg) + '</li>').join('') + '</ul>') + '</div>'
  + '<h2>What the colors mean</h2><div class="legend">' + legend + '</div>'
  + '<h2>Decisions</h2><ul class="dl">' + decisions + '</ul>'
  + '</section>';
const mapView = '<section id="view-map" class="view"><div class="ey">Relationship map</div><h1 class="t">How it all connects</h1>'
  + '<p class="lead">Each dot is one piece of the model, grouped into areas. Lines show what references what. Hover to focus; click to open. (Start broad, then dive in.)</p>'
  + '<div class="maplegend" id="maplegend"></div><svg id="graph" role="img" aria-label="Relationship map"></svg></section>';

// ---- data for JS ----
const D = {
  items: items.map(i => ({ id: i.id, title: i.title, part: i.part, type: i.type, status: i.status, confidence: i.confidence, isArtifact: i.isArtifact, surfaces: i.surfaces, related: i.related, backlinks: backlinks[i.id] || [], capability: i.capability, searchText: i.searchText })),
  sections: SECTIONS, colors: COLORS, statusColor: STATUS_COLOR, surfaces, stats: st,
  generated: new Date().toISOString().slice(0, 16).replace('T', ' '),
};
const json = JSON.stringify(D).replace(/</g, '\\u003c');

const SCRIPT = `(function(){
var D=window.__GT__, byId={}; D.items.forEach(function(i){byId[i.id]=i;});
var PARTS=${JSON.stringify(PART_ORDER)}, SECT=D.sections, facet={status:null,surface:null,q:""};
function $(s){return document.querySelector(s);}
function ce(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
function match(i){
  if(facet.status&&i.status!==facet.status)return false;
  if(facet.surface&&(i.surfaces||[]).indexOf(facet.surface)<0)return false;
  if(facet.q&&(i.searchText||"").indexOf(facet.q)<0&&i.title.toLowerCase().indexOf(facet.q)<0)return false;
  return true;
}
function renderNav(){
  var nav=$("#nav");nav.innerHTML="";
  [["overview","▣ Overview"],["map","✦ Relationship map"]].forEach(function(x){var a=ce("a","navtop",x[1]);a.href="#"+x[0];nav.appendChild(a);});
  function byTitle(a,b){return a.title.localeCompare(b.title);}
  function link(i,child){
    var a=ce("a",child?"child":null);a.href="#"+encodeURIComponent(i.id);
    var d=ce("span","dot");d.style.background=i.isArtifact?(D.statusColor[i.status]||"#a6a2b0"):"transparent";if(!i.isArtifact)d.style.border="1px solid #34313f";
    a.appendChild(d);a.appendChild(document.createTextNode(i.title));nav.appendChild(a);
  }
  PARTS.forEach(function(p){
    var its=D.items.filter(function(i){return i.part===p&&match(i);});if(!its.length)return;
    var s=SECT[p]||{label:p,hint:""};
    var g=ce("div","grp");g.innerHTML='<span class="glabel">'+s.label+'</span><span class="ghint">'+s.hint+'</span>';nav.appendChild(g);
    var caps=its.filter(function(i){return i.type==="capability-spec";}).sort(byTitle);
    var used={};
    caps.forEach(function(c){
      link(c,false);
      its.filter(function(i){return i.type==="user-story"&&i.capability===c.id;}).sort(byTitle).forEach(function(k){used[k.id]=1;link(k,true);});
    });
    its.filter(function(i){return i.type!=="capability-spec"&&!used[i.id];}).sort(byTitle).forEach(function(i){link(i,false);});
  });
  hi();
}
function hi(){var id=decodeURIComponent((location.hash||"").slice(1))||"overview";
  [].forEach.call(document.querySelectorAll(".nav a"),function(a){a.classList.toggle("on",decodeURIComponent(a.getAttribute("href").slice(1))===id);});}
function show(id){
  [].forEach.call(document.querySelectorAll(".art,.view"),function(s){s.classList.remove("active");});
  var t=(!id||id==="overview")?$("#view-overview"):(id==="map"?$("#view-map"):document.getElementById("art-"+id));
  if(!t){t=$("#view-overview");id="overview";}
  t.classList.add("active");
  var bc=$("#crumb");
  if(id==="overview")bc.innerHTML="Overview";
  else if(id==="map")bc.innerHTML='<a href="#overview">Overview</a> › Relationship map';
  else{var it=byId[id];var sec=it?((SECT[it.part]||{}).label||it.part):"";bc.innerHTML='<a href="#overview">Overview</a> › '+sec+' › '+(it?it.title:id);}
  if(id==="map")buildGraph();
  var m=$(".main");if(m)m.scrollTop=0;hi();
}
function route(){show(decodeURIComponent((location.hash||"").slice(1)));}
function buildFacets(){
  var box=$("#facets"),h='<div class="fgrp"><div class="flab">Status</div><button class="fbtn on" data-f="status" data-v="">all</button>';
  Object.keys(D.stats.byStatus).forEach(function(s){h+='<button class="fbtn" data-f="status" data-v="'+s+'">'+s+'</button>';});
  h+='</div><div class="fgrp"><div class="flab">Surface</div><button class="fbtn on" data-f="surface" data-v="">all</button>';
  D.surfaces.forEach(function(s){h+='<button class="fbtn" data-f="surface" data-v="'+s+'">'+s+'</button>';});
  box.innerHTML=h+'</div>';
  [].forEach.call(box.querySelectorAll(".fbtn"),function(b){b.onclick=function(){
    var f=b.getAttribute("data-f");facet[f]=b.getAttribute("data-v")||null;
    [].forEach.call(box.querySelectorAll('[data-f="'+f+'"]'),function(x){x.classList.toggle("on",x===b);});renderNav();
  };});
}
var built=false;
function buildGraph(){
  if(built)return;built=true;
  var svg=$("#graph"),W=1000,H=720,cx=W/2,cy=H/2,ns="http://www.w3.org/2000/svg";
  var arts=D.items.filter(function(i){return i.isArtifact;});
  var parts=PARTS.filter(function(p){return arts.some(function(a){return a.part===p;});});
  var pos={},RC=Math.min(W,H)*0.33;
  parts.forEach(function(p,pi){
    var ang=(pi/parts.length)*2*Math.PI-Math.PI/2,px=cx+RC*Math.cos(ang),py=cy+RC*Math.sin(ang);
    var nodes=arts.filter(function(a){return a.part===p;}),rr=22+nodes.length*6;
    nodes.forEach(function(n,ni){var a2=(ni/Math.max(1,nodes.length))*2*Math.PI;pos[n.id]={x:px+rr*Math.cos(a2),y:py+rr*Math.sin(a2),p:p};});
    pos["__c_"+p]={x:px,y:py,r:rr};
  });
  svg.setAttribute("viewBox","0 0 "+W+" "+H);while(svg.firstChild)svg.removeChild(svg.firstChild);
  arts.forEach(function(a){(a.related||[]).forEach(function(r){if(pos[r]&&pos[a.id]){
    var l=document.createElementNS(ns,"line");l.setAttribute("x1",pos[a.id].x);l.setAttribute("y1",pos[a.id].y);l.setAttribute("x2",pos[r].x);l.setAttribute("y2",pos[r].y);
    l.setAttribute("class","edge "+(pos[a.id].p===pos[r].p?"same":"cross"));l.setAttribute("data-a",a.id);l.setAttribute("data-b",r);svg.appendChild(l);
  }});});
  parts.forEach(function(p){var c=pos["__c_"+p],t=document.createElementNS(ns,"text");t.setAttribute("x",c.x);t.setAttribute("y",c.y-c.r-12);t.setAttribute("class","clabel");t.setAttribute("text-anchor","middle");t.setAttribute("fill",D.colors[p]||"#aaa");t.textContent=(SECT[p]||{}).label||p;svg.appendChild(t);});
  arts.forEach(function(a){var pp=pos[a.id],deg=(a.related||[]).length+(a.backlinks||[]).length;
    var g=document.createElementNS(ns,"g");g.setAttribute("class","node");g.setAttribute("data-id",a.id);g.setAttribute("transform","translate("+pp.x+","+pp.y+")");
    var ci=document.createElementNS(ns,"circle");ci.setAttribute("r",5+Math.min(9,deg*1.6));ci.setAttribute("fill",D.colors[a.part]||"#4c7bff");
    var tx=document.createElementNS(ns,"text");tx.setAttribute("class","nlabel");tx.setAttribute("y",-(9+Math.min(9,deg*1.6)));tx.setAttribute("text-anchor","middle");tx.textContent=a.title.length>20?a.title.slice(0,18)+"…":a.title;
    var tt=document.createElementNS(ns,"title");tt.textContent=a.title+" — "+a.status;
    g.appendChild(ci);g.appendChild(tx);g.appendChild(tt);
    g.addEventListener("mouseenter",function(){hl(a.id);});g.addEventListener("mouseleave",function(){hl(null);});
    g.addEventListener("click",function(){location.hash="#"+encodeURIComponent(a.id);});
    svg.appendChild(g);
  });
  var ml=$("#maplegend");if(ml)ml.innerHTML=parts.map(function(p){return '<span class="mli"><span class="dot" style="background:'+(D.colors[p]||"#888")+'"></span>'+((SECT[p]||{}).label||p)+'</span>';}).join("");
}
function hl(id){var svg=$("#graph");if(!svg)return;var nb={};if(id){nb[id]=1;var it=byId[id];(it.related||[]).forEach(function(r){nb[r]=1;});(it.backlinks||[]).forEach(function(b){nb[b]=1;});}
  [].forEach.call(svg.querySelectorAll(".node"),function(g){var k=g.getAttribute("data-id");g.classList.toggle("dim",id&&!nb[k]);g.classList.toggle("hot",id&&k===id);});
  [].forEach.call(svg.querySelectorAll(".edge"),function(e){var on=id&&(e.getAttribute("data-a")===id||e.getAttribute("data-b")===id);e.classList.toggle("dim",id&&!on);e.classList.toggle("hot",on);});}
var qel=$("#q");if(qel)qel.addEventListener("input",function(e){facet.q=e.target.value.toLowerCase();renderNav();});
window.addEventListener("hashchange",route);
buildFacets();renderNav();route();
})();`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rootstrap Ground Truth Explorer</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><style>
:root{--ink:#191a1b;--ink2:#242425;--ink3:#2c2c2e;--line:#3d3d3f;--paper:#f5f5f5;--dim:#969699;--live:#ffc83f;--live2:#778fed;--good:#4cc38a;--flag:#ffc83f;--strike:#ff8a80}
*{box-sizing:border-box}body{margin:0;background:var(--ink);color:var(--paper);font:15px/1.6 'Inter',system-ui,-apple-system,sans-serif}
h1,h2,h3,h4{font-family:'Poppins',system-ui,sans-serif}
code,pre,.mono,.pill,.ey,.k,.glabel,.ghint,.flab,.fbtn,.badge{font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace}
a{color:var(--live);text-decoration:none}a:hover{text-decoration:underline}
.top{display:flex;gap:16px;align-items:center;padding:12px 20px;border-bottom:1px solid var(--line);background:var(--ink2);position:sticky;top:0;z-index:5}
.top .b{font-weight:700;font-family:'Poppins',system-ui,sans-serif}.top .b small{color:var(--live);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em}.top .b svg{height:17px;width:auto;vertical-align:middle;margin-right:9px}.top .b svg path{fill:var(--paper)}
.top input{flex:1;max-width:420px;background:var(--ink3);border:1px solid var(--line);color:var(--paper);padding:8px 12px;border-radius:8px;font-size:13px}
.app{display:grid;grid-template-columns:312px 1fr;height:calc(100vh - 53px)}
.side{border-right:1px solid var(--line);overflow:auto;background:var(--ink2)}
#facets{padding:12px 16px;border-bottom:1px solid var(--line)}.fgrp{margin-bottom:8px}.flab{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:5px}
.fbtn{background:var(--ink3);border:1px solid var(--line);color:var(--dim);font-size:11px;padding:3px 9px;border-radius:20px;margin:0 4px 4px 0;cursor:pointer}
.fbtn.on{color:var(--ink);background:var(--paper);border-color:var(--paper)}
.nav{padding:8px 0 40px}.nav a{display:flex;gap:8px;align-items:center;padding:5px 16px;color:var(--paper);font-size:13px;border-left:2px solid transparent}
.nav a:hover{background:var(--ink3);text-decoration:none}.nav a.on{border-left-color:var(--live);background:var(--ink3)}
.nav a.child{padding-left:36px;font-size:12px;color:var(--dim)}.nav a.child .dot{width:6px;height:6px;flex:0 0 6px}.nav a.child.on{color:var(--paper)}
.navtop{font-weight:600}.dot{width:8px;height:8px;border-radius:50%;flex:0 0 8px}
.grp{margin:14px 0 3px;padding:0 16px}.glabel{display:block;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--paper)}.ghint{display:block;font-size:11px;color:var(--dim);font-family:inherit;margin-top:1px}
.main{overflow:auto}.crumb{padding:10px 40px;border-bottom:1px solid var(--line);color:var(--dim);font-size:12px;font-family:monospace}
.view,.art{display:none;padding:28px 40px 90px;max-width:900px}.view.active,.art.active{display:block}
@media (max-width:760px){.app{grid-template-columns:1fr}.side{display:none}}
.ey{font-family:monospace;color:var(--live);font-size:11px;letter-spacing:.14em;text-transform:uppercase}
h1.t{font-size:27px;margin:.25em 0 .35em;letter-spacing:-.01em}.lead{color:var(--dim);max-width:64ch;font-size:15.5px}
.pill{color:var(--dim);font-size:11px}
.gcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:22px 0}
.gcard{background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:16px;display:block}
.gcard:hover{border-color:var(--live);text-decoration:none}.gt-t{font-weight:600;font-size:15px}.gt-s{color:var(--dim);font-size:12.5px;margin-top:3px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:8px 0 18px}
.card{background:var(--ink2);border:1px solid var(--line);border-radius:10px;padding:13px}.card .n{font-size:24px;font-weight:700}.card .l{color:var(--dim);font-size:12px}
.check{border-radius:10px;padding:13px 15px;margin:12px 0;border:1px solid}.check.ok{border-color:var(--good);background:rgba(76,195,138,.08)}.check.bad{border-color:var(--strike);background:rgba(255,106,85,.08)}
.legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:6px;margin:8px 0 4px}.leg{font-size:13px;color:var(--dim);display:flex;gap:8px;align-items:center}.leg b{color:var(--paper)}
.dl{padding-left:18px}.dl li{margin:4px 0}
.badge{display:inline-block;font-size:10.5px;letter-spacing:.05em;padding:2px 8px;border-radius:4px;border:1px solid var(--line);text-transform:uppercase}
.b-approved{color:var(--good);border-color:var(--good)}.b-draft{color:var(--dim)}.b-in-review{color:var(--live2);border-color:var(--live2)}.b-needs-revalidation{color:var(--strike);border-color:var(--strike)}.b-deprecated{color:var(--dim);opacity:.6}
.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:16px;margin:14px 0 22px}
.meta .full{grid-column:1/-1}.meta .k{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}.meta .val{font-size:13px;margin-top:2px}
.src{font-size:12px;color:var(--dim);font-family:monospace;margin-top:2px}.relrow{margin-top:4px}.chip{display:inline-block;background:var(--ink3);border:1px solid var(--line);color:var(--live);font-size:11.5px;padding:3px 9px;border-radius:6px;margin:3px 5px 0 0}.chip:hover{border-color:var(--live);text-decoration:none}
.doc h1,.doc h2,.doc h3,.doc h4{letter-spacing:-.01em;line-height:1.25}.doc h2{font-size:20px;margin:1.4em 0 .5em;border-top:1px solid var(--line);padding-top:.7em}.doc h3{font-size:16px;margin:1.2em 0 .4em}
.doc table{border-collapse:collapse;width:100%;margin:12px 0;font-size:13px}.doc th,.doc td{border:1px solid var(--line);padding:7px 9px;text-align:left;vertical-align:top}.doc th{background:var(--ink3);font-family:monospace;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--dim)}
.doc code{background:var(--ink3);padding:1px 5px;border-radius:4px;font-size:12.5px}.doc pre{background:var(--ink2);border:1px solid var(--line);border-radius:8px;padding:14px;overflow:auto}.doc pre code{background:none;padding:0}
.doc blockquote{border-left:3px solid var(--live);background:rgba(76,123,255,.07);margin:12px 0;padding:8px 14px}.doc ul,.doc ol{padding-left:22px}.doc li{margin:3px 0}.doc hr{border:0;border-top:1px solid var(--line);margin:20px 0}.doc a.xref{border-bottom:1px dotted var(--live)}.doc img{max-width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin:8px 0}
.sw{display:inline-block;width:12px;height:12px;border-radius:3px;border:1px solid var(--line);vertical-align:middle;margin-right:5px}
.palette{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;margin:10px 0}.pal{border:1px solid var(--line);border-radius:8px;overflow:hidden}.pal .c{height:44px}.pal .l{font-family:'JetBrains Mono',monospace;font-size:10px;padding:5px;color:var(--dim)}
.assetgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin:10px 0}.assetcard{background:#6b7280;border:1px solid var(--line);border-radius:10px;padding:16px;text-align:center}.assetcard svg{max-width:100%;height:34px;width:auto}.assetcard .nm{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--paper);margin-top:8px;word-break:break-all}
.maplegend{display:flex;flex-wrap:wrap;gap:14px;margin:8px 0 12px}.mli{font-size:12px;color:var(--dim);display:flex;align-items:center;gap:6px}
#graph{width:100%;height:auto;background:var(--ink2);border:1px solid var(--line);border-radius:12px}
.edge{stroke:#3a3747;stroke-width:1}.edge.cross{stroke:#4c5573}.edge.hot{stroke:var(--live);stroke-width:2}.edge.dim{opacity:.12}
.node{cursor:pointer}.node circle{stroke:var(--ink);stroke-width:2}.node .nlabel{fill:var(--paper);font-size:10px;font-family:ui-monospace,monospace}.node.dim{opacity:.22}.node.hot circle{stroke:var(--paper)}
</style></head><body>
<div class="top"><div class="b">${LOGO || 'Rootstrap'} <small>GROUND TRUTH · v0.2</small></div><input id="q" placeholder="Search the model…"><div id="gen" class="pill"></div></div>
<div class="app">
  <aside class="side"><div id="facets"></div><nav class="nav" id="nav"></nav></aside>
  <main class="main"><div class="crumb" id="crumb">Overview</div>
    ${overview}
    ${mapView}
    ${articles}
  </main>
</div>
<noscript><style>.art,.view{display:block!important}.side,.crumb{display:none}</style></noscript>
<script>window.__GT__=${json};</script>
<script>${SCRIPT}</script>
</body></html>`;

const out = path.join(REPO_ROOT, 'ground-truth-explorer.html');
fs.writeFileSync(out, html);
console.log(`Wrote ${path.relative(REPO_ROOT, out)} (${(html.length/1024).toFixed(0)} KB, ${items.length} items)`);
