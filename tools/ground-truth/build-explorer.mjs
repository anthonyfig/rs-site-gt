#!/usr/bin/env node
// Ground Truth Explorer (v0.3) — a self-contained, zero-dependency knowledge-management workspace.
// CORE = a filterable/sortable TABLE of every artifact + a HEALTH/gaps view. The relationship map
// is its OWN section (focus + context: one item centered, only its direct links shown — never the
// old global hairball). Content is server-rendered (works without JS); internal .md cross-links are
// rewritten to in-app navigation. Usage: node tools/ground-truth/build-explorer.mjs -> ./ground-truth-explorer.html
import fs from 'node:fs';
import path from 'node:path';
import { loadArtifacts, runChecks, stats, mdToHtml, parseFrontmatter, REPO_ROOT } from './lib.mjs';

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let LOGO = ''; try { LOGO = fs.readFileSync(path.join(REPO_ROOT, 'design-system/assets/logo-rootstrap-white.svg'), 'utf8'); } catch (e) {}

const PART_ORDER = ['01-project-context','02-domain-model','03-capability-specs','04-engineering-context','05-integration-contracts','06-eval-suite','07-decision-log','_schema','reference'];
const SECTIONS = {
  '01-project-context': { label: 'Why & who', hint: 'Goals, audience, owners, success, open questions' },
  '02-domain-model': { label: 'How the business works', hint: 'Our language, the things we talk about, the method, the rules' },
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
    return m;
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
    tags: it.meta.tags || [], tier: it.meta.tier || '', capability: it.meta.capability || '', deliveryStatus: it.meta.delivery_status || '', updated: it.meta.updated || '', body: it.body, bodyHtml, searchText,
  };
});
const backlinks = {};
for (const it of items) for (const r of it.related) (backlinks[r] ||= []).push(it.id);

const checks = runChecks(raw);
const st = stats(raw);
const surfaces = [...new Set(items.flatMap(i => i.surfaces))].sort();

// ---- health / gaps (computed server-side) ----
const arts = items.filter(i => i.isArtifact);
const capIds = arts.filter(i => i.type === 'capability-spec' && i.id !== 'gt-03-index').map(i => i.id);
const capsWithStories = new Set(arts.filter(i => i.type === 'user-story' && i.capability).map(i => i.capability));
const health = {
  needsReval: arts.filter(i => i.status === 'needs-revalidation').map(i => i.id),
  inReview:   arts.filter(i => i.status === 'in-review').map(i => i.id),
  lowConf:    arts.filter(i => i.confidence === 'low').map(i => i.id),
  unowned:    arts.filter(i => /pending|suggested/i.test(i.owner || '') || !(i.owner || '').trim()).map(i => i.id),
  draftCount: arts.filter(i => i.status === 'draft').length,
  awaitingValidation: arts.filter(i => /pending/i.test(i.last_validated || '')).length,
  capsNoStories: capIds.filter(id => !capsWithStories.has(id)),
  openQuestions: 'gt-01-non-goals-and-open-questions',
};

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
  + (it.isArtifact ? '<div class="artbtns"><button class="mapbtn" data-id="' + it.id + '">⤳ Show in relationship map</button></div>' + metaHtml(it) : '')
  + '<div class="doc">' + it.bodyHtml + (it.id === 'gt-04-design-system' ? designSystemExtras() : '') + '</div></article>'
).join('\n');

const ok = checks.errors.length === 0;
const guided = [
  ['Browse everything','table','Sortable, filterable table of all artifacts'],
  ['Health & gaps','health','What needs a human'],
  ['Relationship map','map','Trace how one item connects'],
  ['Understand the strategy','gt-01-goals-and-scope','Why we’re doing this'],
  ['What we’re building','gt-03-index','The website’s capabilities'],
  ['Decisions & why','decisions','Track decisions & open questions'],
].map(([t,h,s]) => '<a class="gcard" href="#' + h + '"><div class="gt-t">' + t + '</div><div class="gt-s">' + s + '</div></a>').join('');
const legend = Object.entries(STATUS_MEAN).map(([k,v]) => '<div class="leg"><span class="dot" style="background:' + (STATUS_COLOR[k]||'#888') + '"></span><b>' + k + '</b> — ' + v + '</div>').join('');
const decisions = items.filter(i => i.type === 'decision' && i.id !== 'gt-07-index')
  .map(i => '<li>' + chip(i.id) + ' <span class="badge b-' + i.status + '">' + i.status + '</span></li>').join('');
const overview = '<section id="view-overview" class="view">'
  + '<div class="ey">Ground Truth · v0.3 · draft for validation</div>'
  + '<h1 class="t">Rootstrap, as a living model</h1>'
  + '<p class="lead">A precise, living picture of how Rootstrap works and what we’re building — written so the software can be <em>derived</em> from it. Every claim shows <b>who owns it</b>, <b>how sure we are</b>, and <b>where it came from</b>. Start with <b>Browse</b> to see everything, or <b>Health</b> to see what needs attention.</p>'
  + '<div class="gcards">' + guided + '</div>'
  + '<div class="cards">' + ('<div class="card"><div class="n">' + st.total + '</div><div class="l">things in the model</div></div>')
    + Object.entries(st.byStatus).map(([k,v]) => '<div class="card"><div class="n" style="color:' + (STATUS_COLOR[k]||'#fff') + '">' + v + '</div><div class="l">' + k + '</div></div>').join('') + '</div>'
  + '<div class="check ' + (ok ? 'ok' : 'bad') + '"><b>Health check: ' + (ok ? 'PASS ✓' : 'FAIL ✗') + '</b> — ' + checks.count + ' items checked for completeness, valid status, and working links.'
    + (ok ? '' : '<ul>' + checks.errors.map(e => '<li>' + esc(e.rel) + ' — ' + esc(e.msg) + '</li>').join('') + '</ul>') + '</div>'
  + '<h2>What the colors mean</h2><div class="legend">' + legend + '</div>'
  + '<h2>Decisions</h2><ul class="dl">' + decisions + '</ul>'
  + '</section>';

const TH = [['title','Title'],['part','Area'],['type','Type'],['status','Status'],['delivery_status','Delivery'],['confidence','Confidence'],['owner','Owner'],['last_validated','Last validated']];
const thead = '<tr>' + TH.map(([k,l]) => '<th data-key="' + k + '">' + l + ' <span class="ar" data-ar="' + k + '"></span></th>').join('') + '</tr>';
const tableView = '<section id="view-table" class="view"><div class="ey">Browse · the core</div><h1 class="t">All artifacts</h1>'
  + '<p class="lead">Every piece of the model in one place. Filter with the controls on the left, click a column to sort, click a row to open it.</p>'
  + '<div class="tbar"><span id="tableCount"></span></div>'
  + '<table class="gt-table"><thead>' + thead + '</thead><tbody id="gtTbody"></tbody></table></section>';

const healthView = '<section id="view-health" class="view"><div class="ey">Health &amp; gaps</div><h1 class="t">What needs attention</h1>'
  + '<p class="lead">The model is freshly authored, so most artifacts are <b>draft</b> and awaiting human validation — that’s expected. These panels surface what to act on first.</p>'
  + '<div id="healthBody"></div></section>';

const mapOptions = PART_ORDER.map(p => {
  const its = arts.filter(i => i.part === p && i.type !== 'user-story');
  if (!its.length) return '';
  return '<optgroup label="' + esc((SECTIONS[p]||{}).label || p) + '">' + its.slice().sort((a,b)=>a.title.localeCompare(b.title)).map(i => '<option value="' + i.id + '">' + esc(i.title) + '</option>').join('') + '</optgroup>';
}).join('');
const mapView = '<section id="view-map" class="view"><div class="ey">Relationship map · one section, not the home</div><h1 class="t">Trace how one item connects</h1>'
  + '<p class="lead">Centered on a single item, showing <b>only its direct connections</b> with full-size labels — click any to recenter, ← back to retrace. No global tangle.</p>'
  + '<div class="maptop"><button id="mapBack" class="btnlite">← back</button><label class="pill" for="mapPick">Focus on any item</label><select id="mapPick" class="mapsel">' + mapOptions + '</select><span id="mapMeta" class="pill"></span></div>'
  + '<div id="mapStage"><svg id="mapEdges" viewBox="0 0 860 460" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg></div>'
  + '<p class="pill" style="margin-top:8px">Tip: click the centered item to open its full page.</p></section>';

// ---- Decisions workspace + chat bubble + auth gate (markup; data rendered client-side) ----
const decisionsView = '<section id="view-decisions" class="view"><div class="ey">Decisions &amp; open questions</div><h1 class="t">Decisions &amp; open questions</h1>'
  + '<p class="lead">Every material decision in one tracked board — what we decided, who owns it, when, and what it affects. Capture a new one with <b>Propose a decision</b>; it produces a commit-ready file for the log, so Git stays the source of truth.</p>'
  + '<div class="dtoolbar"><button id="decNew" class="btnprimary">+ Propose a decision</button><span id="decCount" class="pill"></span></div>'
  + '<div id="decCompose" class="compose" hidden></div>'
  + '<div id="decBoard"></div>'
  + '<h2>Open questions &amp; human gates</h2><div id="decOpen"></div></section>';
const chatUI = '<button id="askFab" class="askfab" aria-label="Ask the Ground Truth">✦ Ask</button>'
  + '<section id="askPanel" class="askpanel" hidden aria-label="Ask the Ground Truth">'
  + '<header class="askhead"><span class="askh-t">Ask the Ground Truth</span><span id="askMode" class="askh-mode"></span><button id="askClose" class="askx" aria-label="Close">✕</button></header>'
  + '<div id="askLog" class="asklog" role="log" aria-live="polite"></div>'
  + '<form id="askForm" class="askform"><input id="askInput" class="askinput" placeholder="Ask about the model…" autocomplete="off" aria-label="Your question"><button class="asksend" type="submit">Send</button></form></section>';
const authUI = '<div id="authGate" class="authgate" hidden><div class="authcard">' + (LOGO || '')
  + '<h2 class="auth-t">Internal sign-in</h2><p class="auth-s">The Ground Truth Explorer is internal-only. Enter your Rootstrap email to get a sign-in link.</p>'
  + '<form id="authForm"><input id="authEmail" type="email" class="authinput" placeholder="you@rootstrap.com" required aria-label="Email"><button class="btnprimary" type="submit">Send sign-in link</button></form>'
  + '<div id="authMsg" class="auth-msg" aria-live="polite"></div></div></div>';

// ---- retrieval index (rebuilt from Git on every build; Decision 0010) for the /api/ask backend ----
const indexItems = items.filter(i => i.isArtifact).map(i => ({
  id: i.id, title: i.title, part: i.part, type: i.type, status: i.status,
  delivery_status: i.deliveryStatus, relPath: i.relPath, tags: i.tags, body: i.body,
}));
fs.mkdirSync(path.join(REPO_ROOT, 'api'), { recursive: true });
fs.writeFileSync(path.join(REPO_ROOT, 'api', '_gt-index.json'), JSON.stringify({ generated: new Date().toISOString(), count: indexItems.length, items: indexItems }));

// ---- explorer runtime config (PUBLIC values only — secrets stay server-side in /api) ----
const CFG = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  apiBase: process.env.EXPLORER_API_BASE || '',
  allowedDomain: (process.env.ALLOWED_EMAIL_DOMAIN || '').replace(/^@/, ''),
};

// ---- data for JS ----
const D = {
  items: items.map(i => ({ id: i.id, title: i.title, part: i.part, type: i.type, status: i.status, delivery_status: i.deliveryStatus, confidence: i.confidence, owner: i.owner, last_validated: i.last_validated, updated: i.updated, isArtifact: i.isArtifact, surfaces: i.surfaces, related: i.related, backlinks: backlinks[i.id] || [], capability: i.capability, searchText: i.searchText })),
  sections: SECTIONS, colors: COLORS, statusColor: STATUS_COLOR, surfaces, stats: st, health, cfg: CFG,
  generated: new Date().toISOString().slice(0, 16).replace('T', ' '),
};
const json = JSON.stringify(D).replace(/</g, '\\u003c');

const SCRIPT = `(function(){
var D=window.__GT__, byId={}; D.items.forEach(function(i){byId[i.id]=i;});
var PARTS=${JSON.stringify(PART_ORDER)}, SECT=D.sections, NS="http://www.w3.org/2000/svg";
var facet={status:null,surface:null,q:""}, sort={key:"title",dir:1};
var defaultCenter="gt-03-index", best=-1;
D.items.forEach(function(i){if(!i.isArtifact)return;var d=(i.related||[]).length+(i.backlinks||[]).length;if(d>best){best=d;defaultCenter=i.id;}});
if(byId["gt-01-goals-and-scope"])defaultCenter="gt-01-goals-and-scope";
var mapCenter=defaultCenter, mapHist=[];
function $(s){return document.querySelector(s);}
function ce(t,c){var e=document.createElement(t);if(c)e.className=c;return e;}
function areaLabel(p){return (SECT[p]||{}).label||p;}
function match(i){
  if(facet.status&&i.status!==facet.status)return false;
  if(facet.surface&&(i.surfaces||[]).indexOf(facet.surface)<0)return false;
  if(facet.q&&(i.searchText||"").indexOf(facet.q)<0&&i.title.toLowerCase().indexOf(facet.q)<0)return false;
  return true;
}
function renderNav(){
  var nav=$("#nav");nav.innerHTML="";
  [["overview","▣ Overview"],["table","▤ Browse (table)"],["health","◍ Health & gaps"],["decisions","⚖ Decisions"],["map","✦ Relationship map"]].forEach(function(x){var a=ce("a","navtop");a.href="#"+x[0];a.textContent=x[1];nav.appendChild(a);});
  function byTitle(a,b){return a.title.localeCompare(b.title);}
  function link(i,child){
    var a=ce("a",child?"child":null);a.href="#"+encodeURIComponent(i.id);
    var d=ce("span","dot");d.style.background=i.isArtifact?(D.statusColor[i.status]||"#a6a2b0"):"transparent";if(!i.isArtifact)d.style.border="1px solid #34313f";
    a.appendChild(d);a.appendChild(document.createTextNode(i.title));nav.appendChild(a);
  }
  PARTS.forEach(function(p){
    var its=D.items.filter(function(i){return i.part===p&&match(i);});if(!its.length)return;
    var s=SECT[p]||{label:p,hint:""};
    var g=ce("div","grp");g.innerHTML='<span class="glabel"></span><span class="ghint"></span>';
    g.querySelector(".glabel").textContent=s.label;g.querySelector(".ghint").textContent=s.hint;nav.appendChild(g);
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
function buildFacets(){
  var box=$("#facets"),h='<div class="fgrp"><div class="flab">Status</div><button class="fbtn on" data-f="status" data-v="">all</button>';
  Object.keys(D.stats.byStatus).forEach(function(s){h+='<button class="fbtn" data-f="status" data-v="'+s+'">'+s+'</button>';});
  h+='</div><div class="fgrp"><div class="flab">Surface</div><button class="fbtn on" data-f="surface" data-v="">all</button>';
  D.surfaces.forEach(function(s){h+='<button class="fbtn" data-f="surface" data-v="'+s+'">'+s+'</button>';});
  box.innerHTML=h+'</div>';
  [].forEach.call(box.querySelectorAll(".fbtn"),function(b){b.onclick=function(){
    var f=b.getAttribute("data-f");facet[f]=b.getAttribute("data-v")||null;
    [].forEach.call(box.querySelectorAll('[data-f="'+f+'"]'),function(x){x.classList.toggle("on",x===b);});
    renderNav();renderTable();
  };});
}
function renderTable(){
  var tb=$("#gtTbody");if(!tb)return;tb.innerHTML="";
  var rows=D.items.filter(function(i){return i.isArtifact&&match(i);});
  rows.sort(function(a,b){var k=sort.key;var av=(a[k]||"").toString().toLowerCase(),bv=(b[k]||"").toString().toLowerCase();return av<bv?-sort.dir:av>bv?sort.dir:0;});
  var c=$("#tableCount");if(c)c.textContent=rows.length+" artifacts";
  rows.forEach(function(i){
    var tr=ce("tr","trow");tr.addEventListener("click",function(){location.hash="#"+encodeURIComponent(i.id);});
    function td(txt,cls){var e=ce("td",cls);e.textContent=txt;return e;}
    tr.appendChild(td(i.title,"c-title"));
    tr.appendChild(td(areaLabel(i.part),"c-dim"));
    tr.appendChild(td(i.type,"c-dim"));
    var ts=ce("td");var bd=ce("span","badge b-"+i.status);bd.textContent=i.status||"—";ts.appendChild(bd);tr.appendChild(ts);
    tr.appendChild(td(i.delivery_status||"—","c-dim"));
    tr.appendChild(td(i.confidence||"—","c-dim"));
    tr.appendChild(td(i.owner||"—","c-dim"));
    tr.appendChild(td(i.last_validated||"—","c-dim"));
    tb.appendChild(tr);
  });
  [].forEach.call(document.querySelectorAll("#view-table th .ar"),function(a){var k=a.getAttribute("data-ar");a.textContent=(k===sort.key)?(sort.dir>0?"▲":"▼"):"";});
}
function panel(title,ids,emptyMsg){
  var p=ce("div","hpanel"),h=ce("h3");h.innerHTML='<span></span><span class="cnt"></span>';
  h.querySelector("span").textContent=title;h.querySelector(".cnt").textContent=ids.length;p.appendChild(h);
  if(!ids.length){var ok=ce("div","ok");ok.textContent=emptyMsg||"None — all clear ✓";p.appendChild(ok);}
  else{var w=ce("div","hchips");ids.forEach(function(id){var a=ce("a","chip");a.href="#"+encodeURIComponent(id);a.textContent=(byId[id]||{}).title||id;w.appendChild(a);});p.appendChild(w);}
  return p;
}
function renderHealth(){
  var box=$("#healthBody");if(!box)return;box.innerHTML="";var H=D.health;
  var grid=ce("div","hgrid");
  function card(n,l,col){var c=ce("div","hcard");c.innerHTML='<div class="hn"></div><div class="hl"></div>';c.querySelector(".hn").textContent=n;if(col)c.querySelector(".hn").style.color=col;c.querySelector(".hl").textContent=l;return c;}
  Object.keys(D.stats.byStatus).forEach(function(s){grid.appendChild(card(D.stats.byStatus[s],s,D.statusColor[s]));});
  grid.appendChild(card(H.awaitingValidation,"awaiting validation"));
  box.appendChild(grid);
  box.appendChild(panel("Capabilities without user stories",H.capsNoStories,"Every capability has user stories ✓"));
  box.appendChild(panel("Needs revalidation",H.needsReval,"Nothing flagged for re-checking ✓"));
  box.appendChild(panel("In review",H.inReview,"Nothing currently in review"));
  box.appendChild(panel("Low confidence",H.lowConf,"No low-confidence artifacts ✓"));
  box.appendChild(panel("Owner not yet confirmed (suggested/pending)",H.unowned,"All owners confirmed"));
  var oq=ce("div","hpanel");oq.innerHTML='<h3><span>Open questions (human gates)</span></h3>';
  var a=ce("a","chip");a.href="#"+encodeURIComponent(H.openQuestions);a.textContent=(byId[H.openQuestions]||{}).title||"Open questions";oq.appendChild(a);box.appendChild(oq);
}
function mnode(id,x,y,center){
  var n=byId[id];if(!n)return;
  var d=ce("div","mnode"+(center?" center":""));d.style.left=x+"px";d.style.top=y+"px";
  var row=ce("div","mrow");var dot=ce("span","mdot");dot.style.background=D.statusColor[n.status]||"#9a9892";
  var t=ce("span","mt");t.textContent=n.title;row.appendChild(dot);row.appendChild(t);
  var ar=ce("span","ma");ar.textContent=areaLabel(n.part);
  d.appendChild(row);d.appendChild(ar);d.title=n.title+" — "+(n.status||"");
  if(center)d.addEventListener("click",function(){location.hash="#"+encodeURIComponent(id);});
  else d.addEventListener("click",function(){mapHist.push(mapCenter);buildMap(id);});
  $("#mapStage").appendChild(d);
}
function buildMap(center){
  center=center||defaultCenter;mapCenter=center;
  var stage=$("#mapStage"),edges=$("#mapEdges");if(!stage)return;
  [].slice.call(stage.querySelectorAll(".mnode")).forEach(function(e){e.remove();});
  while(edges.firstChild)edges.removeChild(edges.firstChild);
  var it=byId[center];if(!it)return;
  var psel=$("#mapPick");if(psel)psel.value=center;$("#mapMeta").textContent="· "+areaLabel(it.part);
  $("#mapBack").style.visibility=mapHist.length?"visible":"hidden";
  var nb=[];(it.related||[]).forEach(function(r){if(byId[r]&&nb.indexOf(r)<0)nb.push(r);});
  (it.backlinks||[]).forEach(function(b){if(byId[b]&&nb.indexOf(b)<0)nb.push(b);});
  nb=nb.slice(0,10);
  var W=stage.clientWidth||860,Hh=stage.clientHeight||460,cx=W/2,cy=Hh/2,rx=Math.min(W*0.36,360),ry=Hh*0.34;
  edges.setAttribute("viewBox","0 0 "+W+" "+Hh);
  if(!nb.length){var none=ce("div","pill");none.style.position="absolute";none.style.left="50%";none.style.top="62%";none.style.transform="translate(-50%,0)";none.textContent="(no direct connections)";stage.appendChild(none);}
  nb.forEach(function(nid,i){var a=-Math.PI/2+i*2*Math.PI/nb.length,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a);
    var ln=document.createElementNS(NS,"line");ln.setAttribute("x1",cx);ln.setAttribute("y1",cy);ln.setAttribute("x2",x);ln.setAttribute("y2",y);ln.setAttribute("class","medge");edges.appendChild(ln);});
  nb.forEach(function(nid,i){var a=-Math.PI/2+i*2*Math.PI/nb.length;mnode(nid,cx+rx*Math.cos(a),cy+ry*Math.sin(a),false);});
  mnode(center,cx,cy,true);
}
function openMap(id){mapCenter=id;mapHist=[];location.hash="map";}
function actExc(viewId){[].forEach.call(document.querySelectorAll(".art,.view"),function(s){s.classList.remove("active");});var t=$("#"+viewId);if(t)t.classList.add("active");}
function show(id){
  var bc=$("#crumb");
  if(!id||id==="overview"){actExc("view-overview");bc.innerHTML="Overview";}
  else if(id==="table"){actExc("view-table");bc.innerHTML='<a href="#overview">Overview</a> › Browse';renderTable();}
  else if(id==="health"){actExc("view-health");bc.innerHTML='<a href="#overview">Overview</a> › Health & gaps';renderHealth();}
  else if(id==="decisions"){actExc("view-decisions");bc.innerHTML='<a href="#overview">Overview</a> › Decisions & open questions';renderDecisions();}
  else if(id==="map"){actExc("view-map");bc.innerHTML='<a href="#overview">Overview</a> › Relationship map';buildMap(mapCenter);}
  else{var el=document.getElementById("art-"+id);if(el){[].forEach.call(document.querySelectorAll(".art,.view"),function(s){s.classList.remove("active");});el.classList.add("active");var it=byId[id];var sec=it?areaLabel(it.part):"";bc.innerHTML='<a href="#overview">Overview</a> › '+sec+' › '+(it?it.title:id);}else{actExc("view-overview");id="overview";}}
  var m=$(".main");if(m)m.scrollTop=0;hi();
}
function route(){show(decodeURIComponent((location.hash||"").slice(1)));}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".mapbtn");if(b){e.preventDefault();openMap(b.getAttribute("data-id"));}});
[].forEach.call(document.querySelectorAll("#view-table th"),function(th){th.addEventListener("click",function(){var k=th.getAttribute("data-key");if(sort.key===k)sort.dir=-sort.dir;else{sort.key=k;sort.dir=1;}renderTable();});});
$("#mapBack").addEventListener("click",function(){if(mapHist.length)buildMap(mapHist.pop());});
var mapSel=$("#mapPick");if(mapSel)mapSel.addEventListener("change",function(){if(mapSel.value!==mapCenter){mapHist.push(mapCenter);buildMap(mapSel.value);}});
var qel=$("#q");if(qel)qel.addEventListener("input",function(e){facet.q=e.target.value.toLowerCase();renderNav();renderTable();});
window.addEventListener("resize",function(){if($("#view-map").classList.contains("active"))buildMap(mapCenter);});
window.addEventListener("hashchange",route);
// ---------- Decisions workspace ----------
function decNum(id){var m=String(id||"").match(/(\\d{3,4})/);return m?m[1]:"";}
function citeLabel(id){var n=decNum(id);return n?n:String(id||"").replace(/^gt-\\d+-/,"");}
function decisionsList(){
  return D.items.filter(function(i){return i.type==="decision"&&i.id!=="gt-07-index";})
    .map(function(i){return {id:i.id,num:decNum(i.id),title:i.title,status:i.status,owner:i.owner,date:i.updated||i.last_validated||"",affects:i.surfaces||[]};})
    .sort(function(a,b){return (b.num||"").localeCompare(a.num||"");});
}
function renderDecisions(){
  var board=$("#decBoard");if(!board)return;
  var rows=decisionsList();
  var cc=$("#decCount");if(cc)cc.textContent=rows.length+" decisions";
  var h='<table class="dtable"><thead><tr><th>#</th><th>Decision</th><th>Status</th><th>Owner</th><th>Date</th><th>Affects</th></tr></thead><tbody>';
  rows.forEach(function(d){
    var aff=(d.affects||[]).map(function(s){return '<span class="chip">'+s+'</span>';}).join("");
    h+='<tr class="drow" data-id="'+d.id+'"><td class="dnum">'+(d.num||"—")+'</td><td>'+d.title+'</td><td><span class="badge b-'+d.status+'">'+(d.status||"—")+'</span></td><td class="c-dim">'+(d.owner||"—")+'</td><td class="c-dim">'+(d.date||"—")+'</td><td>'+(aff||'<span class="c-dim">—</span>')+'</td></tr>';
  });
  h+='</tbody></table>';board.innerHTML=h;
  [].forEach.call(board.querySelectorAll(".drow"),function(tr){tr.addEventListener("click",function(){location.hash="#"+encodeURIComponent(tr.getAttribute("data-id"));});});
  var open=$("#decOpen");
  if(open){
    var pend=rows.filter(function(d){return d.status==="in-review"||d.status==="draft"||d.status==="needs-revalidation";});
    var oqId=D.health&&D.health.openQuestions;
    var oh='<div class="hpanel"><h3><span>Open questions (human gate)</span></h3>';
    if(oqId&&byId[oqId])oh+='<a class="chip" href="#'+encodeURIComponent(oqId)+'">'+(byId[oqId].title||"Open questions")+'</a>';
    else oh+='<div class="ok">None recorded ✓</div>';
    oh+='</div>';
    var ph='<div class="hpanel"><h3><span>Decisions awaiting approval</span><span class="cnt">'+pend.length+'</span></h3>';
    if(!pend.length)ph+='<div class="ok">All decisions are approved ✓</div>';
    else{ph+='<div class="hchips">';pend.forEach(function(d){ph+='<a class="chip" href="#'+encodeURIComponent(d.id)+'">'+(d.num?d.num+" · ":"")+d.title+'</a>';});ph+='</div>';}
    ph+='</div>';open.innerHTML=oh+ph;
  }
}
function nextDecNum(){var mx=0;decisionsList().forEach(function(d){var n=parseInt(d.num,10);if(n>mx)mx=n;});var s=""+(mx+1);while(s.length<4)s="0"+s;return s;}
function slugify(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48);}
function todayISO(){return new Date().toISOString().slice(0,10);}
function composeOpen(){
  var box=$("#decCompose");if(!box)return;box.hidden=false;
  var surfOpts=(D.surfaces||[]).map(function(s){return '<label class="cchk"><input type="checkbox" value="'+s+'">'+s+'</label>';}).join(" ");
  box.innerHTML='<h3>Propose a decision</h3>'
    +'<div class="cfield"><label>Title</label><input id="cTitle" placeholder="Short decision title"></div>'
    +'<div class="crow"><div class="cfield"><label>Owner</label><input id="cOwner" value="Anthony (sponsor)"></div><div class="cfield"><label>Status</label><select id="cStatus"><option value="in-review">in-review</option><option value="draft">draft</option><option value="approved">approved</option></select></div></div>'
    +'<div class="cfield"><label>Affects</label><div id="cAffects" class="caffects">'+(surfOpts||'<span class="c-dim">no surfaces</span>')+'</div></div>'
    +'<div class="cfield"><label>Decision</label><textarea id="cDecision" placeholder="What we decided."></textarea></div>'
    +'<div class="cfield"><label>Why</label><textarea id="cWhy" placeholder="The rationale."></textarea></div>'
    +'<div class="cfield"><label>Consequences</label><textarea id="cCons" placeholder="What follows from this."></textarea></div>'
    +'<div class="cfield"><label>Sources</label><input id="cSrc" placeholder="e.g. User decision (Jun 2026); refines Decision 0010"></div>'
    +'<div class="cactions"><button class="btnprimary" id="cGen">Generate file</button><button class="btnlite" id="cCancel">Cancel</button></div>'
    +'<div id="cOut" class="cout"></div>';
  $("#cGen").addEventListener("click",composeGen);
  $("#cCancel").addEventListener("click",function(){box.hidden=true;box.innerHTML="";});
  var t=$("#cTitle");if(t)t.focus();
}
function composeGen(){
  var t=$("#cTitle"),title=((t&&t.value)||"").trim();if(!title){if(t)t.focus();return;}
  var num=nextDecNum(),slug=slugify(title)||"decision",owner=(($("#cOwner").value)||"Anthony (sponsor)").trim();
  var status=$("#cStatus").value,decision=(($("#cDecision").value)||"").trim(),why=(($("#cWhy").value)||"").trim(),cons=(($("#cCons").value)||"").trim();
  var today=todayISO(),src=(($("#cSrc").value)||"").trim()||("User decision ("+today+")");
  var affects=[].map.call(document.querySelectorAll("#cAffects input:checked"),function(x){return x.value;});
  var affList=affects.length?affects.map(function(a){return '"'+a+'"';}).join(", "):'"explorer"';
  var lv=status==="approved"?today:"pending",vb=status==="approved"?owner:"pending";
  var lines=[
    "---",
    "id: gt-07-"+num+"-"+slug,
    'title: "'+num+' — '+title.replace(/"/g,"'")+'"',
    'part: "07-decision-log"',
    "type: decision",
    'owner: "'+owner.replace(/"/g,"'")+'"',
    "status: "+status,
    "confidence: medium",
    "sources:",
    '  - "'+src.replace(/"/g,"'")+'"',
    "updated: "+today,
    'last_validated: "'+lv+'"',
    'validated_by: "'+vb+'"',
    "applies_to: ["+affList+"]",
    "related: []",
    'tags: ["adr", "decision"]',
    "---","",
    "# "+num+" — "+title,"",
    "**Status:** "+status+" · **Date:** "+today+" · **Owner:** "+owner,"",
    "## Decision",decision||"_TODO_","",
    "## Why",why||"_TODO_","",
    "## Consequences",cons||"_TODO_","",
    "## Open questions / human gates","- _none yet_",""
  ];
  var md=lines.join("\\n");
  var file="ground-truth/07-decision-log/"+num+"-"+slug+".md";
  var out=$("#cOut");
  out.innerHTML='<div class="cfile">'+file+'</div><pre id="cMd"></pre><div class="cactions"><button class="btnlite" id="cCopy">Copy markdown</button></div><p class="pill">Review, then commit this file to ground-truth/07-decision-log/ — the next build adds it to the model and the checker validates it.</p>';
  $("#cMd").textContent=md;
  $("#cCopy").addEventListener("click",function(){try{navigator.clipboard.writeText(md);this.textContent="Copied ✓";}catch(e){}});
}
function decInit(){var b=$("#decNew");if(b)b.addEventListener("click",function(){var box=$("#decCompose");if(box&&!box.hidden){box.hidden=true;box.innerHTML="";}else composeOpen();});}

// ---------- Ask the Ground Truth (chat) ----------
var askHistory=[],askBusy=false,askToken=null;
function apiURL(){var b=(D.cfg&&D.cfg.apiBase)||"";return (b?b.replace(/\\/$/,""):"")+"/api/ask";}
function setMode(label){var m=$("#askMode");if(m)m.textContent=label||"";}
function addUser(text){var log=$("#askLog");var d=ce("div","askmsg user");d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;}
function escHtml(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function addBot(text,sources){
  var log=$("#askLog");var d=ce("div","askmsg bot");d.innerHTML=linkifyCites(text);
  if(sources&&sources.length){var s=ce("div","asksrc");var html='<div class="k">sources</div>';
    sources.forEach(function(x){var label=(x.title||x.id);if(label.length>46)label=label.slice(0,46)+"…";html+='<a href="#'+encodeURIComponent(x.id)+'" title="'+escHtml(x.id)+'">'+escHtml(label)+'</a>';});
    s.innerHTML=html;d.appendChild(s);}
  log.appendChild(d);log.scrollTop=log.scrollHeight;return d;
}
function linkifyCites(text){
  var safe=String(text==null?"":text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  safe=safe.replace(/\\[([a-z0-9][a-z0-9\\-]+)\\]/g,function(m,id){return byId[id]?'<a class="askcite" href="#'+encodeURIComponent(id)+'">['+citeLabel(id)+']</a>':m;});
  return safe.replace(/\\n/g,"<br>");
}
function localAnswer(q){
  var qts=(q.toLowerCase().match(/[a-z0-9\\-]{3,}/g)||[]);
  var scored=D.items.filter(function(i){return i.isArtifact;}).map(function(i){
    var s=0,txt=(i.searchText||""),title=i.title.toLowerCase(),id=i.id.toLowerCase();
    qts.forEach(function(t){if(id.indexOf(t)>=0)s+=4;if(title.indexOf(t)>=0)s+=3;if(txt.indexOf(t)>=0)s+=1;});
    return {i:i,s:s};
  }).filter(function(x){return x.s>0;}).sort(function(a,b){return b.s-a.s;}).slice(0,6);
  if(!scored.length)return {answer:"I couldn't find anything about that in the Ground Truth. Try different terms.",sources:[]};
  return {answer:"Here are the artifacts in the model most relevant to your question — open any to read it and trace it to its sources:",sources:scored.map(function(x){return {id:x.i.id,title:x.i.title};})};
}
function askGreet(){addBot("Ask me anything about the Ground Truth — decisions, capabilities, the stack, the method. I answer from the model and cite the artifacts I use.",null);}
function askOpen(){var p=$("#askPanel"),f=$("#askFab");if(!p)return;p.hidden=false;if(f)f.hidden=true;if(!$("#askLog").childNodes.length)askGreet();var i=$("#askInput");if(i)i.focus();}
function askClose(){var p=$("#askPanel"),f=$("#askFab");if(p)p.hidden=true;if(f)f.hidden=false;}
function askSend(q){
  if(askBusy||!q)return;askBusy=true;addUser(q);var input=$("#askInput");if(input)input.value="";
  var typing=ce("div","asktyping");typing.textContent="…thinking";$("#askLog").appendChild(typing);$("#askLog").scrollTop=$("#askLog").scrollHeight;
  function clearTyping(){if(typing.parentNode)typing.parentNode.removeChild(typing);}
  if(location.protocol==="file:"){clearTyping();var r=localAnswer(q);setMode("retrieval mode");addBot(r.answer,r.sources);askBusy=false;return;}
  var headers={"content-type":"application/json"};if(askToken)headers["authorization"]="Bearer "+askToken;
  fetch(apiURL(),{method:"POST",headers:headers,body:JSON.stringify({question:q,history:askHistory.slice(-8)})})
    .then(function(res){return res.json().then(function(j){return {ok:res.ok,status:res.status,j:j};},function(){return {ok:res.ok,status:res.status,j:{}};});})
    .then(function(o){
      clearTyping();var j=o.j||{};
      if(!o.ok){
        if(o.status===401||o.status===403){setMode("");addBot(j.error||"Sign in to use Ask — the Explorer is internal-only.",null);askBusy=false;return;}
        var lf=localAnswer(q);setMode("retrieval mode");addBot((j.error||"The assistant is unavailable.")+" Showing the most relevant artifacts instead:",lf.sources);askBusy=false;return;
      }
      if(j.answer){setMode(j.mode==="answer"?"":"retrieval mode");addBot(j.answer,j.sources);askHistory.push({role:"user",content:q});askHistory.push({role:"assistant",content:j.answer});}
      else{setMode("retrieval mode");addBot(j.mode==="retrieval-only"?"The live assistant isn't configured yet, but here are the artifacts most relevant to your question:":"Here's what I found:",j.sources||[]);}
      askBusy=false;
    })
    .catch(function(){clearTyping();var lf=localAnswer(q);setMode("retrieval mode");addBot("I can't reach the live assistant from here, but here are the most relevant artifacts:",lf.sources);askBusy=false;});
}
function askInit(){
  var fab=$("#askFab");if(fab)fab.addEventListener("click",askOpen);
  var x=$("#askClose");if(x)x.addEventListener("click",askClose);
  var f=$("#askForm");if(f)f.addEventListener("submit",function(e){e.preventDefault();var i=$("#askInput");askSend(((i&&i.value)||"").trim());});
  if(location.protocol==="file:")setMode("retrieval mode");
}

// ---------- internal-only auth gate (Supabase, when configured) ----------
function authInit(){
  var cfg=D.cfg||{},gate=$("#authGate");
  if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||location.protocol==="file:"){if(gate)gate.hidden=true;return;}
  if(gate)gate.hidden=false;
  import("https://esm.sh/@supabase/supabase-js@2").then(function(m){
    var sb=m.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{flowType:"implicit",detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
    function apply(session){if(session&&session.access_token){askToken=session.access_token;if(gate)gate.hidden=true;}else{askToken=null;if(gate)gate.hidden=false;}}
    sb.auth.getSession().then(function(r){apply(r&&r.data&&r.data.session);});
    sb.auth.onAuthStateChange(function(_e,session){apply(session);});
    var form=$("#authForm");
    if(form)form.addEventListener("submit",function(e){e.preventDefault();
      var email=(($("#authEmail").value)||"").trim(),msg=$("#authMsg");
      if(cfg.allowedDomain&&email.toLowerCase().indexOf("@"+cfg.allowedDomain.toLowerCase())<0){if(msg)msg.textContent="Use your @"+cfg.allowedDomain+" email.";return;}
      if(msg)msg.textContent="Sending…";
      sb.auth.signInWithOtp({email:email,options:{emailRedirectTo:location.origin+location.pathname}}).then(function(res){if(msg)msg.textContent=(res&&res.error)?("Couldn't send: "+res.error.message):"Check your email for a sign-in link.";});
    });
  }).catch(function(){var msg=$("#authMsg");if(msg)msg.textContent="Couldn't load the sign-in library.";});
}

var gen=$("#gen");if(gen)gen.textContent="built "+D.generated;
buildFacets();renderNav();route();decInit();askInit();authInit();
})();`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rootstrap Ground Truth Explorer</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><style>
:root{--ink:#191a1b;--ink2:#242425;--ink3:#2c2c2e;--line:#3d3d3f;--paper:#f5f5f5;--dim:#969699;--live:#ffc83f;--live2:#778fed;--good:#4cc38a;--strike:#ff8a80}
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
.view,.art{display:none;padding:28px 40px 90px;max-width:980px}.view.active,.art.active{display:block}
@media (max-width:760px){.app{grid-template-columns:1fr}.side{display:none}}
.ey{font-family:monospace;color:var(--live);font-size:11px;letter-spacing:.14em;text-transform:uppercase}
h1.t{font-size:27px;margin:.25em 0 .35em;letter-spacing:-.01em}.lead{color:var(--dim);max-width:70ch;font-size:15.5px}
.pill{color:var(--dim);font-size:11px;font-family:monospace}
.gcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:22px 0}
.gcard{background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:16px;display:block}
.gcard:hover{border-color:var(--live);text-decoration:none}.gt-t{font-weight:600;font-size:15px}.gt-s{color:var(--dim);font-size:12.5px;margin-top:3px}
.cards,.hgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:8px 0 18px}
.card,.hcard{background:var(--ink2);border:1px solid var(--line);border-radius:10px;padding:13px}.card .n,.hcard .hn{font-size:24px;font-weight:700}.card .l,.hcard .hl{color:var(--dim);font-size:12px}
.check{border-radius:10px;padding:13px 15px;margin:12px 0;border:1px solid}.check.ok{border-color:var(--good);background:rgba(76,195,138,.08)}.check.bad{border-color:var(--strike);background:rgba(255,106,85,.08)}
.legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:6px;margin:8px 0 4px}.leg{font-size:13px;color:var(--dim);display:flex;gap:8px;align-items:center}.leg b{color:var(--paper)}
.dl{padding-left:18px}.dl li{margin:4px 0}
.badge{display:inline-block;font-size:10.5px;letter-spacing:.05em;padding:2px 8px;border-radius:4px;border:1px solid var(--line);text-transform:uppercase}
.b-approved{color:var(--good);border-color:var(--good)}.b-draft{color:var(--dim)}.b-in-review{color:var(--live2);border-color:var(--live2)}.b-needs-revalidation{color:var(--strike);border-color:var(--strike)}.b-deprecated{color:var(--dim);opacity:.6}
.artbtns{margin:10px 0 0}.mapbtn,.btnlite{background:var(--ink3);border:1px solid var(--line);color:var(--paper);font-size:12px;padding:5px 11px;border-radius:7px;cursor:pointer;font-family:inherit}.mapbtn:hover,.btnlite:hover{border-color:var(--live)}
.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:16px;margin:14px 0 22px}
.meta .full{grid-column:1/-1}.meta .k{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}.meta .val{font-size:13px;margin-top:2px}
.src{font-size:12px;color:var(--dim);font-family:monospace;margin-top:2px}.relrow{margin-top:4px}.chip{display:inline-block;background:var(--ink3);border:1px solid var(--line);color:var(--live);font-size:11.5px;padding:3px 9px;border-radius:6px;margin:3px 5px 0 0}.chip:hover{border-color:var(--live);text-decoration:none}
.tbar{display:flex;align-items:center;gap:10px;margin:6px 0 12px;color:var(--dim);font-size:12px;font-family:monospace}
.gt-table{width:100%;border-collapse:collapse;font-size:13px}
.gt-table th{position:sticky;top:0;background:var(--ink2);text-align:left;padding:8px 9px;border-bottom:1px solid var(--line);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--dim);cursor:pointer;white-space:nowrap}
.gt-table th .ar{color:var(--live)}
.gt-table td{padding:8px 9px;border-bottom:1px solid var(--line);vertical-align:top}
.gt-table td.c-title{color:var(--paper);font-weight:500;max-width:320px}.gt-table td.c-dim{color:var(--dim)}
.trow{cursor:pointer}.trow:hover td{background:var(--ink3)}
.hpanel{border:1px solid var(--line);border-radius:12px;padding:13px 15px;margin:10px 0;background:var(--ink2)}
.hpanel h3{font-size:14px;margin:0 0 8px;display:flex;justify-content:space-between;align-items:center;gap:10px}.hpanel .cnt{font-family:monospace;font-size:12px;color:var(--dim)}.hpanel .ok{color:var(--good);font-size:13px}.hchips{line-height:2}
.maptop{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}.mapsel{background:var(--ink3);border:1px solid var(--line);color:var(--paper);padding:6px 9px;border-radius:7px;font:inherit;font-size:12px;max-width:360px}
#mapStage{position:relative;width:100%;height:460px;background:var(--ink2);border:1px solid var(--line);border-radius:12px;overflow:hidden}
#mapEdges{position:absolute;inset:0;width:100%;height:100%}
.medge{stroke:#4c5573;stroke-width:1}
.mnode{position:absolute;transform:translate(-50%,-50%);width:158px;box-sizing:border-box;padding:9px 10px;border-radius:9px;background:var(--ink3);border:1px solid var(--line);text-align:center;cursor:pointer}
.mnode:hover{border-color:var(--live)}.mnode.center{background:rgba(119,143,237,.16);border:2px solid var(--live2)}
.mnode .mrow{display:flex;align-items:center;justify-content:center;gap:6px}.mnode .mt{font-size:13px;line-height:1.25;color:var(--paper)}.mnode .ma{display:block;font-size:11px;color:var(--dim);margin-top:3px}.mdot{width:8px;height:8px;border-radius:50%;flex:0 0 8px}
.doc h1,.doc h2,.doc h3,.doc h4{letter-spacing:-.01em;line-height:1.25}.doc h2{font-size:20px;margin:1.4em 0 .5em;border-top:1px solid var(--line);padding-top:.7em}.doc h3{font-size:16px;margin:1.2em 0 .4em}
.doc table{border-collapse:collapse;width:100%;margin:12px 0;font-size:13px}.doc th,.doc td{border:1px solid var(--line);padding:7px 9px;text-align:left;vertical-align:top}.doc th{background:var(--ink3);font-family:monospace;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--dim)}
.doc code{background:var(--ink3);padding:1px 5px;border-radius:4px;font-size:12.5px}.doc pre{background:var(--ink2);border:1px solid var(--line);border-radius:8px;padding:14px;overflow:auto}.doc pre code{background:none;padding:0}
.doc blockquote{border-left:3px solid var(--live);background:rgba(76,123,255,.07);margin:12px 0;padding:8px 14px}.doc ul,.doc ol{padding-left:22px}.doc li{margin:3px 0}.doc hr{border:0;border-top:1px solid var(--line);margin:20px 0}.doc a.xref{border-bottom:1px dotted var(--live)}.doc img{max-width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin:8px 0}
.sw{display:inline-block;width:12px;height:12px;border-radius:3px;border:1px solid var(--line);vertical-align:middle;margin-right:5px}
.palette{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;margin:10px 0}.pal{border:1px solid var(--line);border-radius:8px;overflow:hidden}.pal .c{height:44px}.pal .l{font-family:'JetBrains Mono',monospace;font-size:10px;padding:5px;color:var(--dim)}
.assetgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin:10px 0}.assetcard{background:#6b7280;border:1px solid var(--line);border-radius:10px;padding:16px;text-align:center}.assetcard svg{max-width:100%;height:34px;width:auto}.assetcard .nm{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--paper);margin-top:8px;word-break:break-all}
/* ---- Decisions workspace ---- */
.dtoolbar{display:flex;align-items:center;gap:12px;margin:14px 0}
.btnprimary{background:var(--live);color:var(--ink);border:none;border-radius:8px;padding:8px 13px;font-weight:600;font-size:13px;cursor:pointer;font-family:inherit}.btnprimary:hover{filter:brightness(1.06)}
.dtable{width:100%;border-collapse:collapse;font-size:13px;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.dtable th{background:var(--ink2);text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--dim)}
.dtable td{padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}.dtable tr:last-child td{border-bottom:none}
.dtable tr.drow{cursor:pointer}.dtable tr.drow:hover td{background:var(--ink3)}.dnum{font-family:'JetBrains Mono',monospace;color:var(--dim)}
.compose{background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:16px;margin:14px 0}.compose h3{margin:0 0 10px;font-size:15px;font-family:'Poppins',sans-serif}
.cfield{margin-bottom:10px}.cfield label{display:block;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim);margin-bottom:4px}
.cfield input,.cfield textarea,.cfield select{width:100%;background:var(--ink3);border:1px solid var(--line);color:var(--paper);border-radius:8px;padding:8px 10px;font-size:13px;font-family:inherit}.cfield textarea{min-height:62px;resize:vertical}
.crow{display:grid;grid-template-columns:1fr 1fr;gap:10px}.caffects{display:flex;flex-wrap:wrap;gap:6px}
.cchk{font-size:12px;color:var(--dim);background:var(--ink3);border:1px solid var(--line);border-radius:7px;padding:4px 8px;cursor:pointer}.cchk input{margin-right:5px;vertical-align:middle}
.cactions{display:flex;gap:8px;margin-top:6px}.cout{margin-top:12px}.cout pre{background:var(--ink);border:1px solid var(--line);border-radius:8px;padding:12px;overflow:auto;font-size:12px;max-height:300px;white-space:pre-wrap}.cfile{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--good);margin-bottom:6px}
/* ---- Ask chat ---- */
.askfab{position:fixed;right:22px;bottom:22px;height:50px;width:auto;border-radius:25px;background:var(--live);border:none;color:var(--ink);font-weight:600;font-size:14px;padding:0 20px;cursor:pointer;z-index:30;box-shadow:0 4px 18px rgba(0,0,0,.4);font-family:inherit}.askfab:hover{filter:brightness(1.06)}
.askpanel{position:fixed;right:22px;bottom:22px;width:382px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 84px);background:var(--ink2);border:1px solid var(--line);border-radius:14px;display:flex;flex-direction:column;overflow:hidden;z-index:31;box-shadow:0 12px 44px rgba(0,0,0,.5)}
.askhead{display:flex;align-items:center;gap:8px;padding:11px 14px;border-bottom:1px solid var(--line)}.askh-t{font-family:'Poppins',sans-serif;font-weight:600;font-size:14px}
.askh-mode{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--live);border:1px solid #5c4a16;background:#2c2614;border-radius:20px;padding:2px 8px}.askx{margin-left:auto;background:none;border:none;color:var(--dim);font-size:15px;cursor:pointer}
.asklog{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
.askmsg{font-size:13.5px;line-height:1.5;padding:8px 11px;border-radius:11px;max-width:90%;word-wrap:break-word}
.askmsg.user{align-self:flex-end;background:var(--live2);color:#0b1437;border-bottom-right-radius:3px}.askmsg.bot{align-self:flex-start;background:var(--ink3);color:var(--paper);border-bottom-left-radius:3px}
.askmsg.bot a{color:var(--live)}.askcite{color:var(--live);cursor:pointer;border-bottom:1px dotted var(--live)}
.asksrc{margin-top:7px;border-top:1px solid var(--line);padding-top:6px}.asksrc .k{font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px}
.asksrc a{display:inline-block;background:var(--ink2);border:1px solid var(--line);color:var(--live);font-size:11px;padding:2px 7px;border-radius:6px;margin:2px 5px 0 0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:bottom}
.asktyping{align-self:flex-start;color:var(--dim);font-size:12px;font-family:'JetBrains Mono',monospace}
.askform{display:flex;gap:7px;padding:10px;border-top:1px solid var(--line)}.askinput{flex:1;background:var(--ink3);border:1px solid var(--line);color:var(--paper);border-radius:9px;padding:9px 11px;font-size:13px;font-family:inherit}
.asksend{background:var(--live);color:var(--ink);border:none;border-radius:9px;padding:0 14px;font-weight:600;font-size:13px;cursor:pointer;font-family:inherit}.asksend:disabled{opacity:.5;cursor:default}
@media (max-width:520px){.askpanel{right:8px;bottom:8px;width:calc(100vw - 16px)}}
/* ---- Auth gate ---- */
.authgate{position:fixed;inset:0;background:var(--ink);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px}
.authcard{max-width:380px;width:100%;background:var(--ink2);border:1px solid var(--line);border-radius:16px;padding:28px;text-align:center}.authcard svg{height:20px;width:auto;margin-bottom:14px}.authcard svg path{fill:var(--paper)}
.auth-t{font-size:19px;margin:0 0 6px}.auth-s{color:var(--dim);font-size:13.5px;margin:0 0 16px}
.authinput{width:100%;background:var(--ink3);border:1px solid var(--line);color:var(--paper);border-radius:9px;padding:10px 12px;font-size:14px;margin-bottom:10px;font-family:inherit}.auth-msg{font-size:13px;color:var(--dim);margin-top:12px;min-height:18px}
</style></head><body>
<div class="top"><div class="b">${LOGO || 'Rootstrap'} <small>GROUND TRUTH · v0.3</small></div><input id="q" placeholder="Search the model…"><div id="gen" class="pill"></div></div>
${authUI}
<div class="app">
  <aside class="side"><div id="facets"></div><nav class="nav" id="nav"></nav></aside>
  <main class="main"><div class="crumb" id="crumb">Overview</div>
    ${overview}
    ${tableView}
    ${healthView}
    ${mapView}
    ${decisionsView}
    ${articles}
  </main>
</div>
${chatUI}
<noscript><style>.art,.view{display:block!important}.side,.crumb{display:none}</style></noscript>
<script>window.__GT__=${json};</script>
<script>${SCRIPT}</script>
</body></html>`;

const out = path.join(REPO_ROOT, 'ground-truth-explorer.html');
fs.writeFileSync(out, html);
// Vercel static output (served as the site root); keeps raw GT files out of the public dir.
const pubDir = path.join(REPO_ROOT, 'public');
fs.mkdirSync(pubDir, { recursive: true });
fs.writeFileSync(path.join(pubDir, 'index.html'), html);
console.log(`Wrote ${path.relative(REPO_ROOT, out)} + public/index.html + api/_gt-index.json (${(html.length/1024).toFixed(0)} KB, ${items.length} items)`);
