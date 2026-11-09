import { stage } from './stage.js';
import { PRODUCTS, byId, COLLECTIONS, BUNDLES, CATS, FEATURE_TAGS, ALL_FINISHES, EDITIONS } from './catalog.js';
import { ARTICLES } from './journal.js';
import { $, $$, fmt, esc, S, FINISHES, thumb, totals, inWish, STATES, eta, FREE_OVER, COUPONS } from './core.js';

const PER = 12;
const pct = p => Math.round((1 - p.price / p.was) * 100);

/* ------------------------------------------------------------ shared pieces */
export const card = p => `<article class="pcard" data-id="${p.id}">
  <a class="plink" href="#/product/${p.id}" aria-label="${esc(p.name)}">
    <div class="art"><img loading="lazy" src="${thumb(p, p.colors[0])}" alt="${esc(p.name)}">
      <span class="badges">${p.new ? '<i class="b new">New</i>' : ''}${p.edition ? `<i class="b ed">${p.edition}</i>` : ''}${p.was ? `<i class="b sale">−${pct(p)}%</i>` : ''}</span></div>
    <div class="meta"><div><b>${esc(p.name)}</b><small>${esc(p.tag)}</small></div>
      <strong>${fmt(p.price)}${p.was ? `<s>${fmt(p.was)}</s>` : ''}</strong></div>
  </a>
  <div class="dots">${p.colors.map(c => `<i style="background:${FINISHES[c]}" title="${c}"></i>`).join('')}</div>
  <button class="heart${inWish(p.id) ? ' on' : ''}" data-wish="${p.id}" aria-label="Save ${esc(p.name)} to wishlist" aria-pressed="${inWish(p.id)}"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/></svg></button>
  <label class="cmp"><input type="checkbox" data-cmp="${p.id}" ${S.compare.includes(p.id) ? 'checked' : ''}><span>Compare</span></label>
</article>`;

export function footer() {
  return `<footer class="foot"><div class="fcol"><b class="logo2">HALO</b><p>A concept audio store. Nothing here is for sale.</p>
    <form class="news" id="news" novalidate><input type="email" placeholder="Email for the demo newsletter" aria-label="Email"><button class="btn sm">Join</button></form><small class="nmsg"></small></div>
  <nav class="fcol"><h4>Shop</h4>${CATS.map(c => `<a href="#/shop?cat=${c}">${c}</a>`).join('')}<a href="#/bundles">Bundles</a></nav>
  <nav class="fcol"><h4>Collections</h4>${COLLECTIONS.slice(0, 6).map(c => `<a href="#/collection/${c.id}">${c.name}</a>`).join('')}</nav>
  <nav class="fcol"><h4>Help</h4><a href="#/support">Support</a><a href="#/track">Track a demo order</a><a href="#/finder">Find your HALO</a><a href="#/journal">Journal</a><a href="#/about">About</a><a href="#/account">Demo account</a></nav>
  <small class="legal">© 2026 HALO concept · Built with three.js · Prices in Nigerian naira, VAT included · No payment is taken and nothing ships</small></footer>`;
}

function strip(list, title, kicker) {
  if (!list.length) return '';
  return `<section class="wrap"><header class="sh"><p class="kicker">${kicker}</p><h2>${title}</h2></header><div class="grid">${list.map(card).join('')}</div></section>`;
}
const recentProducts = () => S.recent.map(byId).filter(Boolean);

/* ------------------------------------------------------------ home */
export function home() {
  stage.hide(false); stage.show('over-ear', FINISHES.Obsidian, '#ff5a2c', 1); stage.view('home'); stage.spin(true); stage.explode(0);
  const base = PRODUCTS.filter(p => !p.edition);
  const newest = PRODUCTS.filter(p => p.new).slice(0, 4);
  const sale = PRODUCTS.filter(p => p.was && !p.edition).slice(0, 4);
  const flag = [...new Set(CATS)].map(c => base.filter(p => p.cat === c).sort((a, b) => b.price - a.price)[0]).filter(Boolean).sort((a, b) => b.price - a.price).slice(0, 3);
  const eds = EDITIONS.map(e => ({ e, p: byId('halo-one-' + e.id) || PRODUCTS.find(x => x.edition === e.id) }));
  const mq = ['Free delivery over ' + fmt(FREE_OVER), '30-day returns (concept)', '12-month warranty (concept)', 'Bundle and save up to 10%'];
  return `<section class="hero">
    <p class="kicker">Concept store · 2026</p>
    <h1><span>HA</span><span>LO</span></h1>
    <p class="lede">Obsessive audio for <b class="swap" id="swap" data-w="headphones|earbuds|speakers|studio gear|turntables">headphones</b>. ${PRODUCTS.length} products you can spin, explode and recolour in 3D.</p>
    <div class="cta-row"><a class="btn" href="#/shop">Shop the lineup</a><a class="btn ghost" href="#/finder">Find your HALO</a></div>
    <dl class="hstats"><div><dt data-count="${PRODUCTS.length}">0</dt><dd>products</dd></div><div><dt data-count="${EDITIONS.length}">0</dt><dd>colour editions</dd></div><div><dt data-count="${BUNDLES.length}">0</dt><dd>bundles</dd></div><div><dt data-count="${COLLECTIONS.length}">0</dt><dd>collections</dd></div></dl>
    <div class="hint"><span class="dot"></span> Drag to spin · scroll to explore</div>
  </section>
  <div class="solid">
    <div class="strip">${[...mq, ...mq].map(t => `<span>${t}</span>`).join('')}</div>
    <section class="wrap rv"><header class="sh"><p class="kicker">Start in 30 seconds</p><h2>Three ways <em>in.</em></h2></header>
      <div class="quick">
        <a href="#/finder"><b>01</b><h3>Find your HALO</h3><p>Four questions about where, how and what you listen to. We match you to a product.</p><i>→</i></a>
        <a href="#/compare"><b>02</b><h3>Compare side by side</h3><p>Tick up to three products anywhere in the shop and see every spec in one table.</p><i>→</i></a>
        <a href="#/bundles"><b>03</b><h3>Build a setup</h3><p>${BUNDLES.length} ready-made bundles. Any two products save 5%, any three save 10%.</p><i>→</i></a>
      </div></section>
    <section class="wrap rv"><header class="sh"><p class="kicker">Shop by category</p><h2>Find your <em>sound.</em></h2></header>
      <div class="cats big">${CATS.map(c => { const rep = base.filter(p => p.cat === c).sort((a, b) => b.price - a.price)[0]; return `<a class="cat" href="#/shop?cat=${c}">${rep ? `<img src="${thumb(rep, rep.colors[0])}" alt="" loading="lazy">` : ''}<b>${c}</b><span>${PRODUCTS.filter(p => p.cat === c).length} products</span><i>→</i></a>`; }).join('')}</div></section>
    <section class="wrap rv"><header class="sh"><p class="kicker">Flagships</p><h2>The <em>top of each range.</em></h2></header>
      <div class="flag">${flag.map((p, i) => `<article class="fl2"><small>0${i + 1} · ${p.cat}</small><img src="${thumb(p, p.colors[0])}" alt="${esc(p.name)}" loading="lazy"><h3>${esc(p.name)}</h3><p>${esc(p.blurb)}</p><ul>${p.features.slice(0, 3).map(f => `<li>${esc(f)}</li>`).join('')}</ul><div class="row"><b>${fmt(p.price)}</b><a class="btn" href="#/product/${p.id}">View in 3D</a></div></article>`).join('')}</div></section>
    <section class="wrap rv"><header class="sh"><p class="kicker">Best of the lineup</p><h2>Start <em>here.</em></h2></header><div class="grid">${base.filter(p => p.tier === 0).slice(0, 8).map(card).join('')}</div>
      <div class="cta-row"><a class="btn ghost" href="#/shop">See all ${PRODUCTS.length} products</a></div></section>
    <section class="wrap rv"><header class="sh"><p class="kicker">Colour editions</p><h2>Every product, <em>four more ways.</em></h2></header>
      <div class="eds">${eds.map(({ e, p }) => `<a class="ed" href="#/shop?ed=${e.id}" style="--ea:${e.accent}"><img src="${thumb(p, p.colors[0])}" alt="" loading="lazy"><b>${e.name}</b><p>${e.note}</p><span class="sw">${e.colors.map(c => `<i title="${c}"></i>`).join('')}</span><small>${PRODUCTS.filter(x => x.edition === e.id).length} products →</small></a>`).join('')}</div></section>
    ${strip(newest, 'New <em>editions.</em>', 'Just arrived')}
    <section class="wrap rv"><header class="sh"><p class="kicker">Collections</p><h2>Shop by <em>moment.</em></h2></header>
      <div class="cols">${COLLECTIONS.map(c => `<a class="col" href="#/collection/${c.id}"><b>${c.name}</b><span>${PRODUCTS.filter(c.test).length} products</span><p>${c.blurb}</p></a>`).join('')}</div></section>
    ${strip(sale, 'On <em>offer.</em>', 'Concept price cuts')}
    <section class="wrap rv band"><div><p class="kicker">Build a setup</p><h2>Bundle <em>and save.</em></h2><p>Add two different products to your cart and save 5%. Add three and save 10%. Or start from one of our ${BUNDLES.length} ready-made bundles.</p></div><a class="btn" href="#/bundles">See bundles</a></section>
    <section class="wrap feat rv"><header class="sh"><p class="kicker">Why HALO</p><h2>Details you <em>hear.</em></h2></header>
      <div class="f3">
        <article><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg><h3>Real drivers, real tuning</h3><p>Every product states its driver and how it is tuned, flat first and warm second.</p></article>
        <article><svg viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg><h3>Built to be repaired</h3><p>Replaceable pads, detachable cables, standard screws. Parts are listed on every product page.</p></article>
        <article><svg viewBox="0 0 24 24"><path d="M5 12l4 4L19 6"/></svg><h3>Honest numbers</h3><p>Battery life with noise cancelling on, weight with the pads on. We state how every number is measured.</p></article>
      </div></section>
    <section class="wrap rv"><header class="sh"><p class="kicker">How this demo works</p><h2>A real shop, <em>not a real sale.</em></h2></header>
      <ol class="steps3"><li><b>1</b><h3>Browse and fill a cart</h3><p>Filters, wishlist, compare and a cart that remembers you in this browser.</p></li><li><b>2</b><h3>Check out with demo details</h3><p>Delivery by Nigerian state, coupons and VAT are all calculated. No payment is taken.</p></li><li><b>3</b><h3>Track a demo order</h3><p>Orders are saved only in your browser. Nothing ships and nobody is charged.</p></li></ol></section>
    <section class="wrap rv"><header class="sh"><p class="kicker">Journal</p><h2>Listen <em>closer.</em></h2></header>
      <div class="arts">${ARTICLES.slice(0, 3).map(a => `<a class="art2" href="#/journal/${a.id}"><small>${a.tag} · ${a.mins} min</small><b>${a.title}</b><p>${a.lede}</p></a>`).join('')}</div>
      <div class="cta-row"><a class="btn ghost" href="#/journal">All ${ARTICLES.length} articles</a></div></section>
    <section class="wrap rv"><header class="sh"><p class="kicker">Quick answers</p><h2>Before you <em>ask.</em></h2></header>
      <div class="faq3">
        <details><summary>Can I actually buy anything?</summary><p>No. HALO is a concept store: nothing is for sale, no payment is taken and nothing ships.</p></details>
        <details><summary>Where is my cart and order data stored?</summary><p>Only in this browser (local storage). There is no account, server or database behind the demo.</p></details>
        <details><summary>Are the reviews and prices real?</summary><p>There are no reviews. Prices are invented concept prices in naira with VAT included.</p></details>
        <details><summary>What are colour editions?</summary><p>The same product in a limited colourway, with its own accent colour and finishes, priced slightly higher.</p></details>
      </div></section>
    ${recentProducts().length ? strip(recentProducts().slice(0, 4), 'Recently <em>viewed.</em>', 'Pick up where you left off') : ''}
    ${footer()}
  </div>`;
}

/* ------------------------------------------------------------ shop + collections */
function filterProducts(q, base) {
  const cat = q.get('cat') || 'All', term = (q.get('q') || '').toLowerCase().trim();
  const min = +q.get('min') || 0, max = +q.get('max') || Infinity;
  const colors = (q.get('colors') || '').split(',').filter(Boolean);
  const tags = (q.get('tags') || '').split(',').filter(Boolean);
  const sale = q.get('sale') === '1', neu = q.get('new') === '1', ed = q.get('ed') || 'all';
  let list = base.filter(p => (cat === 'All' || p.cat === cat) && (!term || (p.name + ' ' + p.tag + ' ' + p.tags.join(' ')).toLowerCase().includes(term)) &&
    p.price >= min && p.price <= max && (!colors.length || colors.some(c => p.colors.includes(c))) && tags.every(t => p.tags.includes(t)) && (!sale || p.was) && (!neu || p.new) && (ed === 'all' || (ed === 'base' ? !p.edition : p.edition === ed)));
  const sort = q.get('sort') || 'featured';
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'new') list = [...list].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
  return list;
}
function filtersUI(q) {
  const cat = q.get('cat') || 'All';
  const colors = (q.get('colors') || '').split(',').filter(Boolean), tags = (q.get('tags') || '').split(',').filter(Boolean);
  return `<details class="fdet" open><summary>Filters</summary><form id="filters" class="filters" novalidate>
    <fieldset><legend>Category</legend>${['All', ...CATS].map(c => `<label class="fl"><input type="radio" name="cat" value="${c}" ${c === cat ? 'checked' : ''}><span>${c}</span></label>`).join('')}</fieldset>
    <fieldset><legend>Price (₦)</legend><div class="two"><input name="min" type="number" min="0" step="1000" placeholder="Min" value="${q.get('min') || ''}" aria-label="Minimum price"><input name="max" type="number" min="0" step="1000" placeholder="Max" value="${q.get('max') || ''}" aria-label="Maximum price"></div></fieldset>
    <fieldset><legend>Features</legend>${FEATURE_TAGS.map(([k, n]) => `<label class="fl"><input type="checkbox" name="tags" value="${k}" ${tags.includes(k) ? 'checked' : ''}><span>${n}</span></label>`).join('')}</fieldset>
    <fieldset><legend>Finish</legend><div class="sw sm">${ALL_FINISHES.map(c => `<label title="${c}"><input type="checkbox" name="colors" value="${c}" ${colors.includes(c) ? 'checked' : ''}><i style="--c:${FINISHES[c]}"></i></label>`).join('')}</div></fieldset>
    <fieldset><legend>Edition</legend>${[['all', 'All'], ['base', 'Core range'], ...EDITIONS.map(e => [e.id, e.name])].map(([k, n]) => `<label class="fl"><input type="radio" name="ed" value="${k}" ${(q.get('ed') || 'all') === k ? 'checked' : ''}><span>${n}</span></label>`).join('')}</fieldset>
    <fieldset><legend>Show only</legend><label class="fl"><input type="checkbox" name="sale" value="1" ${q.get('sale') === '1' ? 'checked' : ''}><span>On offer</span></label><label class="fl"><input type="checkbox" name="new" value="1" ${q.get('new') === '1' ? 'checked' : ''}><span>New editions</span></label></fieldset>
    <a class="btn ghost sm" href="#/shop">Clear filters</a></form></details>`;
}
export function shop(q, base = PRODUCTS, title = 'The lineup', blurb = '', basePath = '#/shop') {
  stage.hide(true);
  const list = filterProducts(q, base), page = Math.max(1, +q.get('page') || 1), shown = list.slice(0, page * PER);
  const sort = q.get('sort') || 'featured', term = q.get('q') || '';
  const nextQ = new URLSearchParams(q); nextQ.set('page', page + 1);
  return `<div class="solid page" data-base="${basePath}"><section class="wrap">
    <header class="sh"><p class="kicker">${basePath === '#/shop' ? 'Shop' : 'Collection'}</p><h1 class="h1s">${title}</h1>${blurb ? `<p class="blurb">${blurb}</p>` : ''}</header>
    <div class="shopgrid"><aside>${filtersUI(q)}</aside><div>
      <div class="bar"><span class="count">${list.length} product${list.length === 1 ? '' : 's'}</span>
        <div class="tools"><input id="search" type="search" placeholder="Search products" value="${esc(term)}" aria-label="Search products"><select id="sort" aria-label="Sort"><option value="featured"${sort === 'featured' ? ' selected' : ''}>Featured</option><option value="new"${sort === 'new' ? ' selected' : ''}>Newest</option><option value="low"${sort === 'low' ? ' selected' : ''}>Price: low to high</option><option value="high"${sort === 'high' ? ' selected' : ''}>Price: high to low</option><option value="name"${sort === 'name' ? ' selected' : ''}>Name</option></select></div></div>
      ${shown.length ? `<div class="grid g3">${shown.map(card).join('')}</div>` : '<p class="none">No products match. Try removing a filter.</p>'}
      ${shown.length < list.length ? `<div class="more"><a class="btn ghost" href="${basePath}?${nextQ.toString()}" data-keep>Show more (${list.length - shown.length} left)</a></div>` : ''}
    </div></div></section>${footer()}</div>`;
}
export function collection(id, q) {
  const c = COLLECTIONS.find(x => x.id === id);
  if (!c) return notFound();
  return shop(q, PRODUCTS.filter(c.test), c.name, c.blurb, '#/collection/' + id);
}

/* ------------------------------------------------------------ product */
export const sel = { color: null, addons: new Set(), qty: 1, pid: null, exp: false };
export function product(id) {
  const p = byId(id);
  if (!p) return notFound();
  if (sel.pid !== id) { sel.pid = id; sel.color = p.colors[0]; sel.addons = new Set(); sel.qty = 1; sel.exp = false; }
  stage.hide(false); stage.show(p.kind, FINISHES[sel.color], p.accent, p.size); stage.view('product'); stage.explode(0); stage.spin(true);
  const rel = [...PRODUCTS.filter(x => x.id !== p.id)].sort((a, b) => ((b.kind === p.kind) - (a.kind === p.kind)) || ((b.cat === p.cat) - (a.cat === p.cat))).slice(0, 4);
  const rec = recentProducts().filter(x => x.id !== p.id).slice(0, 4);
  return `<div class="pdp"><div class="gap" aria-hidden="true"></div><aside class="panel" id="pdp">${pdpInner(p)}</aside></div>
  <div class="solid">${strip(rel, 'You may <em>like.</em>', 'Also in the lineup')}${strip(rec, 'Recently <em>viewed.</em>', 'Your history')}${footer()}</div>
  <div class="mbuy" id="mbuy"><div><b>${esc(p.name)}</b><small id="mprice"></small></div><button class="btn" data-addcart>Add to cart</button></div>`;
}
export function pdpInner(p) {
  const unit = p.price + [...sel.addons].reduce((s, a) => s + p.addons.find(x => x.id === a).price, 0);
  const col = COLLECTIONS.filter(c => c.test(p) && ['studio', 'home', 'travel', 'sport', 'gaming'].includes(c.id));
  return `<nav class="crumbs"><a href="#/shop">Shop</a> / <a href="#/shop?cat=${p.cat}">${p.cat}</a> / ${esc(p.name)}</nav>
    <p class="kicker">${esc(p.tag)}${p.new ? ' · <b class="new2">New</b>' : ''}</p><h1 class="h1s">${esc(p.name)}</h1>
    <p class="price">${fmt(unit)} ${p.was ? `<s>${fmt(p.was + (unit - p.price))}</s> <em class="save">Save ${pct(p)}%</em>` : ''}<small>incl. VAT</small></p>
    <p class="blurb">${esc(p.blurb)}</p>
    <div class="opt"><span>Finish · <b>${sel.color}</b></span><div class="sw">${p.colors.map(c => `<button data-c="${c}" class="${c === sel.color ? 'on' : ''}" style="--c:${FINISHES[c]}" aria-label="${c}" aria-pressed="${c === sel.color}"></button>`).join('')}</div></div>
    ${p.addons.map(a => `<label class="add"><input type="checkbox" data-a="${a.id}" ${sel.addons.has(a.id) ? 'checked' : ''}><span>${esc(a.name)}</span><b>+ ${fmt(a.price)}</b></label>`).join('')}
    <div class="buy"><div class="qty big"><button data-n="-1" aria-label="Decrease">−</button><span>${sel.qty}</span><button data-n="1" aria-label="Increase">+</button></div><button class="btn grow" id="add" data-addcart>Add to cart · ${fmt(unit * sel.qty)}</button>
      <button class="heart big${inWish(p.id) ? ' on' : ''}" data-wish="${p.id}" aria-label="Save to wishlist" aria-pressed="${inWish(p.id)}"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/></svg></button></div>
    <div class="view"><button class="btn ghost" id="exp">${sel.exp ? 'Reassemble' : 'Explode view'}</button><button class="btn ghost" id="spin">Pause spin</button><button class="btn ghost" id="share">Copy link</button></div>
    <div class="eta"><label>Delivery estimate<select id="etaState"><option value="">Choose state</option>${STATES.map(s => `<option${S.address.state === s ? ' selected' : ''}>${s}</option>`).join('')}</select></label><p id="etaTxt">${S.address.state ? 'Estimated delivery to ' + S.address.state + ': ' + eta(S.address.state) : 'Free delivery over ' + fmt(FREE_OVER) + ', otherwise ₦4,500.'}</p></div>
    <ul class="ticks">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
    ${p.sig[0] ? `<h3 class="sub">Sound signature <small>(illustrative tuning target)</small></h3><canvas id="sig" width="520" height="150" aria-label="Frequency response target curve"></canvas>` : ''}
    <h3 class="sub">Specifications <small>(concept targets)</small></h3>
    <table class="specs">${p.specs.map(([a, b]) => `<tr><th>${esc(a)}</th><td>${esc(b)}</td></tr>`).join('')}</table>
    <h3 class="sub">In the box</h3><ul class="ticks plain">${p.box.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
    ${col.length ? `<p class="fine">Part of: ${col.map(c => `<a href="#/collection/${c.id}">${c.name}</a>`).join(', ')}</p>` : ''}
    <p class="fine">HALO is a concept. Specifications are design targets, not measurements of a shipping product.</p>`;
}

/* ------------------------------------------------------------ wishlist, compare, bundles */
export function wishlist() {
  stage.hide(true);
  const list = S.wish.map(byId).filter(Boolean);
  return `<div class="solid page"><section class="wrap"><header class="sh"><p class="kicker">Saved</p><h1 class="h1s">Your wishlist</h1></header>
    ${list.length ? `<div class="grid">${list.map(card).join('')}</div><div class="cta-row"><button class="btn" id="wishAll">Add all to cart</button></div>` : '<p class="none">Nothing saved yet. Tap the heart on any product.</p><a class="btn" href="#/shop">Browse the lineup</a>'}
  </section>${footer()}</div>`;
}
export function compare() {
  stage.hide(true);
  const list = S.compare.map(byId).filter(Boolean);
  if (list.length < 2) return `<div class="solid page"><section class="wrap narrow"><h1 class="h1s">Compare</h1><p class="blurb">Tick “Compare” on two or three products, then open this page.</p><a class="btn" href="#/shop">Browse the lineup</a></section>${footer()}</div>`;
  const keys = [...new Set(list.flatMap(p => p.specs.map(s => s[0])))];
  return `<div class="solid page"><section class="wrap"><header class="sh"><p class="kicker">Side by side</p><h1 class="h1s">Compare</h1></header>
  <div class="cmpwrap"><table class="cmpt"><thead><tr><th></th>${list.map(p => `<th><a href="#/product/${p.id}"><img src="${thumb(p, p.colors[0])}" alt=""><b>${esc(p.name)}</b></a><strong>${fmt(p.price)}</strong><button class="btn sm" data-add1="${p.id}">Add to cart</button><button class="rm" data-cmpx="${p.id}">Remove</button></th>`).join('')}</tr></thead>
  <tbody><tr><th>Category</th>${list.map(p => `<td>${p.cat}</td>`).join('')}</tr><tr><th>Finishes</th>${list.map(p => `<td>${p.colors.join(', ')}</td>`).join('')}</tr>
  ${keys.map(k => `<tr><th>${esc(k)}</th>${list.map(p => `<td>${esc((p.specs.find(s => s[0] === k) || [])[1] || '—')}</td>`).join('')}</tr>`).join('')}
  <tr><th>Highlights</th>${list.map(p => `<td><ul>${p.features.slice(0, 3).map(f => `<li>${esc(f)}</li>`).join('')}</ul></td>`).join('')}</tr></tbody></table></div>
  </section>${footer()}</div>`;
}
export function bundles() {
  stage.hide(true);
  return `<div class="solid page"><section class="wrap"><header class="sh"><p class="kicker">Bundles</p><h1 class="h1s">Bundle <em>and save.</em></h1><p class="blurb">Any two different products save 5% in your cart, any three save 10%. These six bundles are three products each.</p></header>
  <div class="bund">${BUNDLES.map(b => { const items = b.items.map(byId); const sum = items.reduce((s, p) => s + p.price, 0); const off = Math.round(sum * 0.1);
    return `<article class="bd"><div class="bimgs">${items.map(p => `<img src="${thumb(p, p.colors[0])}" alt="${esc(p.name)}">`).join('')}</div><h3>${b.name}</h3><p>${b.blurb}</p><ul>${items.map(p => `<li><a href="#/product/${p.id}">${esc(p.name)}</a><span>${fmt(p.price)}</span></li>`).join('')}</ul>
    <div class="row"><span>Bundle price</span><b>${fmt(sum - off)} <s>${fmt(sum)}</s></b></div><button class="btn full" data-bundle="${b.id}">Add bundle · save ${fmt(off)}</button></article>`; }).join('')}</div></section>${footer()}</div>`;
}

/* ------------------------------------------------------------ finder */
const FQ = [
  ['Where will you mostly listen?', [['commute', 'On the move (commute, travel)'], ['desk', 'At a desk or studio'], ['home', 'In the living room'], ['gym', 'Gym, running, outdoors']]],
  ['What is your budget?', [['low', 'Under ₦80,000'], ['mid', '₦80,000 – ₦180,000'], ['high', 'Over ₦180,000'], ['any', 'No limit']]],
  ['What matters most?', [['quiet', 'Peace and quiet'], ['pure', 'Pure, accurate sound'], ['battery', 'Battery and portability'], ['bass', 'Punch and bass']]],
  ['What will you use them for?', [['music', 'Music'], ['games', 'Gaming and streaming'], ['calls', 'Calls and recording'], ['film', 'Film and TV']]],
];
export const FINDER = FQ;
export function finder(step, ans) {
  stage.hide(true);
  if (step >= FQ.length) {
    const score = p => {
      let s = 0; const t = p.tags;
      if (ans[0] === 'commute') s += (t.includes('wireless') ? 2 : 0) + (t.includes('anc') ? 2 : 0) + (p.cat === 'Earbuds' || p.kind === 'over-ear' ? 1 : 0) + (t.includes('portable') ? 1 : 0);
      if (ans[0] === 'desk') s += (t.includes('studio') ? 3 : 0) + (t.includes('wired') ? 1 : 0) + (p.cat === 'Headphones' || p.cat === 'Studio' ? 1 : 0);
      if (ans[0] === 'home') s += (t.includes('home') ? 3 : 0) + (p.cat === 'Speakers' ? 2 : 0);
      if (ans[0] === 'gym') s += (t.includes('sport') ? 3 : 0) + (t.includes('water-resistant') ? 2 : 0) + (t.includes('earbuds') ? 1 : 0);
      if (ans[1] === 'low') s += p.price < 80000 ? 3 : p.price < 120000 ? 0 : -4;
      if (ans[1] === 'mid') s += p.price >= 80000 && p.price <= 180000 ? 3 : -2;
      if (ans[1] === 'high') s += p.price > 180000 ? 3 : p.price > 120000 ? 1 : -3;
      if (ans[2] === 'quiet') s += (t.includes('anc') ? 3 : 0);
      if (ans[2] === 'pure') s += (t.includes('studio') ? 2 : 0) + (t.includes('wired') ? 1 : 0);
      if (ans[2] === 'battery') s += (t.includes('portable') || p.cat === 'Earbuds' ? 2 : 0) + (t.includes('wireless') ? 1 : 0);
      if (ans[2] === 'bass') s += (p.sig[0] >= 0.7 ? 3 : 0);
      if (ans[3] === 'games') s += (t.includes('gaming') ? 4 : 0) + (t.includes('mic') ? 2 : 0);
      if (ans[3] === 'calls') s += (t.includes('mic') ? 3 : 0) + (t.includes('earbuds') ? 1 : 0);
      if (ans[3] === 'film') s += (t.includes('tv') ? 4 : 0) + (p.kind === 'bar' ? 2 : 0);
      if (ans[3] === 'music') s += (p.cat === 'Headphones' || p.cat === 'Speakers' ? 1 : 0);
      return s;
    };
    const top = [...PRODUCTS].map(p => [p, score(p)]).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    return `<div class="solid page"><section class="wrap narrow"><header class="sh"><p class="kicker">Your match</p><h1 class="h1s">Meet your <em>HALO.</em></h1><p class="blurb">Based on where you listen, your budget and what you care about most:</p></header>
      <div class="grid g3">${top.map(card).join('')}</div><div class="cta-row"><a class="btn ghost" href="#/finder">Start again</a><a class="btn" href="#/shop">Browse everything</a></div></section>${footer()}</div>`;
  }
  const [q, opts] = FQ[step];
  return `<div class="solid page"><section class="wrap narrow finder"><header class="sh"><p class="kicker">Find your HALO · ${step + 1} of ${FQ.length}</p><h1 class="h1s">${q}</h1></header>
    <div class="fopts">${opts.map(([k, n]) => `<button class="fopt" data-f="${k}">${n}</button>`).join('')}</div>
    <div class="fbar"><i style="width:${(step / FQ.length) * 100}%"></i></div>${step ? '<button class="rm" id="fback">← Back</button>' : ''}</section>${footer()}</div>`;
}

/* ------------------------------------------------------------ orders, tracking, account */
export function confirmation(id) {
  stage.hide(true);
  const o = S.orders.find(x => x.id === id);
  if (!o) return notFound();
  return `<div class="solid page"><section class="wrap narrow conf">
    <div class="tick"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"/></svg></div>
    <p class="kicker">Demo order placed</p><h1 class="h1s">Thank you, ${esc(o.name.split(' ')[0])}.</h1>
    <p class="blurb">Order <b>${o.id}</b> was recorded in this browser only. Because HALO is a concept store, nothing will be charged or shipped.</p>
    <div class="steps"><span class="on">Order placed</span><span>Packed</span><span>Shipped</span><span>Delivered</span></div>
    <div class="sumcard flat">${o.items.map(i => `<div class="sline"><span>${esc(i.name)}<small>${esc(i.color)} × ${i.qty}</small></span><b>${fmt(i.unit * i.qty)}</b></div>`).join('')}
    ${o.bundle ? `<div class="row"><span>Bundle saving</span><b>−${fmt(o.bundle)}</b></div>` : ''}${o.couponAmt ? `<div class="row"><span>Code ${esc(o.coupon)}</span><b>−${fmt(o.couponAmt)}</b></div>` : ''}
    <div class="row"><span>Delivery to</span><b>${esc(o.city)}, ${esc(o.state)}</b></div><div class="row"><span>Estimated</span><b>${eta(o.state)}</b></div><div class="row tot"><span>Total <small>incl. ${fmt(o.vat)} VAT</small></span><b>${fmt(o.total)}</b></div></div>
    <div class="cta-row"><a class="btn" href="#/track?id=${o.id}">Track this order</a><a class="btn ghost" href="#/shop">Keep browsing</a></div>
  </section>${footer()}</div>`;
}
export function ordersPage() {
  stage.hide(true);
  return `<div class="solid page"><section class="wrap narrow"><header class="sh"><p class="kicker">Account</p><h1 class="h1s">Demo orders</h1></header>
  ${S.orders.length ? S.orders.map(o => `<div class="ord"><div><b>${o.id}</b><small>${new Date(o.date).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</small></div><span>${o.items.reduce((s, i) => s + i.qty, 0)} items</span><b>${fmt(o.total)}</b><span class="oa"><a class="btn ghost sm" href="#/confirmation/${o.id}">View</a><a class="btn ghost sm" href="#/track?id=${o.id}">Track</a></span></div>`).join('') : '<p class="none">No demo orders yet.</p>'}
  ${S.orders.length ? '<button class="btn ghost" id="clearOrders">Clear order history</button>' : ''}</section>${footer()}</div>`;
}
const STAGES = ['Order placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
export function track(q) {
  stage.hide(true);
  const id = (q.get('id') || '').trim().toUpperCase();
  const o = id && S.orders.find(x => x.id === id);
  let body = '';
  if (id && !o) body = '<p class="demo">No demo order with that ID was found in this browser.</p>';
  if (o) {
    const mins = (Date.now() - o.date) / 60000;
    const stageIdx = mins < 1 ? 0 : mins < 2 ? 1 : mins < 4 ? 2 : mins < 6 ? 3 : 4;
    body = `<div class="trk"><h3>${o.id}</h3><p class="blurb">Demo tracking: stages advance every few minutes so you can see the flow. Nothing is really shipping.</p>
      <ol class="tl">${STAGES.map((s, i) => `<li class="${i <= stageIdx ? 'on' : ''}${i === stageIdx ? ' now' : ''}"><i></i><b>${s}</b><small>${i <= stageIdx ? (i === 0 ? new Date(o.date).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : 'Done') : 'Pending'}</small></li>`).join('')}</ol>
      <p class="fine">Destination: ${esc(o.city)}, ${esc(o.state)} · Estimated ${eta(o.state)}</p></div>`;
  }
  return `<div class="solid page"><section class="wrap narrow"><header class="sh"><p class="kicker">Track</p><h1 class="h1s">Track a <em>demo order.</em></h1></header>
  <form id="trackForm" class="inline"><input name="id" placeholder="HALO-XXXXXX" value="${esc(id)}" aria-label="Order ID"><button class="btn">Track</button></form>${body}
  ${!o && S.orders.length ? `<p class="fine">Your orders: ${S.orders.map(x => `<a href="#/track?id=${x.id}">${x.id}</a>`).join(' · ')}</p>` : ''}</section>${footer()}</div>`;
}
export function account() {
  stage.hide(true);
  const a = S.address;
  return `<div class="solid page"><section class="wrap"><header class="sh"><p class="kicker">Account</p><h1 class="h1s">Your demo account</h1><p class="blurb">There is no sign-in. Everything is stored in this browser only.</p></header>
  <div class="acct"><div class="sumcard flat"><h3>At a glance</h3><div class="row"><span>Demo orders</span><b><a href="#/orders">${S.orders.length}</a></b></div><div class="row"><span>Saved items</span><b><a href="#/wishlist">${S.wish.length}</a></b></div><div class="row"><span>Recently viewed</span><b>${S.recent.length}</b></div></div>
  <form id="addr" class="form" novalidate><h3>Saved delivery details</h3><label>Full name<input name="name" value="${esc(a.name || '')}"></label><label>Phone<input name="phone" value="${esc(a.phone || '')}"></label><label>Address<input name="address" value="${esc(a.address || '')}"></label>
  <div class="two"><label>City<input name="city" value="${esc(a.city || '')}"></label><label>State<select name="state"><option value="">Select state</option>${STATES.map(s => `<option ${a.state === s ? 'selected' : ''}>${s}</option>`).join('')}</select></label></div>
  <button class="btn">Save details</button><small class="nmsg" id="addrMsg"></small></form></div>
  <button class="btn ghost" id="wipe">Clear all data in this browser</button></section>${footer()}</div>`;
}

/* ------------------------------------------------------------ checkout */
export function checkout() {
  stage.hide(true);
  const t = totals(), a = S.address;
  if (!S.cart.length) return `<div class="solid page"><section class="wrap narrow"><h1 class="h1s">Checkout</h1><p>Your cart is empty.</p><a class="btn" href="#/shop">Browse the lineup</a></section>${footer()}</div>`;
  return `<div class="solid page"><section class="wrap co">
    <form id="co" novalidate class="form"><h1 class="h1s">Checkout</h1>
      <p class="demo">Demo checkout. No payment is taken and nothing will ship.</p>
      <fieldset><legend>Contact</legend>
        <label>Full name<input name="name" autocomplete="name" value="${esc(a.name || '')}" required><em></em></label>
        <label>Email<input name="email" type="email" autocomplete="email" required><em></em></label>
        <label>Phone<input name="phone" type="tel" autocomplete="tel" placeholder="0803 000 0000" value="${esc(a.phone || '')}" required><em></em></label></fieldset>
      <fieldset><legend>Delivery</legend>
        <label>Address<input name="address" autocomplete="street-address" value="${esc(a.address || '')}" required><em></em></label>
        <div class="two"><label>City<input name="city" autocomplete="address-level2" value="${esc(a.city || '')}" required><em></em></label>
        <label>State<select name="state" required><option value="">Select state</option>${STATES.map(s => `<option ${a.state === s ? 'selected' : ''}>${s}</option>`).join('')}</select><em></em></label></div>
        <p class="fine" id="etaCo">${a.state ? 'Estimated delivery: ' + eta(a.state) : ''}</p></fieldset>
      <fieldset><legend>Payment</legend>
        <label class="radio"><input type="radio" name="pay" value="card" checked><span><b>Card via Paystack (demo)</b><small>No card details are collected on this site.</small></span></label>
        <label class="radio"><input type="radio" name="pay" value="transfer"><span><b>Bank transfer (demo)</b><small>No account details are shown or used.</small></span></label></fieldset>
      <button class="btn full" id="coBtn" type="submit">Place demo order · ${fmt(t.total)}</button></form>
    <aside class="sumcard" id="cosum">${coSummary(t)}</aside></section>${footer()}</div>`;
}
export function coSummary(t) {
  return `<h3>Order summary</h3>${S.cart.map(l => { const p = byId(l.id); return `<div class="sline"><img src="${thumb(p, l.color)}" alt=""><span>${esc(p.name)}<small>${esc(l.color)} × ${l.qty}</small></span><b>${fmt(lineTotal(l))}</b></div>`; }).join('')}${sumRows(t)}`;
}
const lineTotal = l => { const p = byId(l.id); return (p.price + (l.addons || []).reduce((s, a) => s + (p.addons.find(x => x.id === a)?.price || 0), 0)) * l.qty; };
export function sumRows(t) {
  return `<div class="coupon"><input class="cpn" placeholder="Discount code" value="${esc(S.coupon)}" aria-label="Discount code"><button class="btn sm ghost" data-cpn type="button">Apply</button></div><small class="cmsg">${t.coupon ? esc(COUPONS[t.coupon].label) + ' applied' : 'Try HALO10, WELCOME5 or FREESHIP (demo codes)'}</small>
  <div class="row"><span>Subtotal</span><b>${fmt(t.sub)}</b></div>
  ${t.bundle ? `<div class="row"><span>Bundle saving (${t.bundlePct}%)</span><b>−${fmt(t.bundle)}</b></div>` : ''}
  ${t.couponAmt ? `<div class="row"><span>Code ${esc(t.coupon)}</span><b>−${fmt(t.couponAmt)}</b></div>` : ''}
  <div class="row"><span>Delivery</span><b>${t.ship ? fmt(t.ship) : 'Free'}</b></div>
  <div class="row tot"><span>Total <small>incl. ${fmt(t.vat)} VAT</small></span><b>${fmt(t.total)}</b></div>`;
}

/* ------------------------------------------------------------ content pages */
const FAQ = [
  ['Orders', 'Is this a real store?', 'No. HALO is a design and engineering concept. Nothing here ships, no payment is taken, and nobody is contacted. The cart, checkout, tracking and order history are a working demo of the shopping flow.'],
  ['Orders', 'Where is my cart saved?', 'In your own browser only (local storage). Clearing site data empties it. Nothing is sent to a server.'],
  ['Orders', 'How do discount codes work?', 'Three demo codes are accepted: HALO10 (10% off), WELCOME5 (5% off) and FREESHIP (free delivery). Bundle savings of 5% or 10% apply automatically for two or three different products.'],
  ['Delivery', 'How does shipping work?', `In this concept: free delivery on orders over ${fmt(FREE_OVER)}, otherwise ₦4,500 flat, to all 36 states and the FCT. Estimated times range from 1–2 working days in Lagos to 3–6 working days elsewhere.`],
  ['Delivery', 'Can I track my order?', 'Yes. Use Track a demo order with your order ID. Stages advance every few minutes so you can see the flow.'],
  ['Returns', 'What about returns and warranty?', 'The concept policy is 30 days to return unused products and a 12-month warranty. These are placeholders for a real store to fill in.'],
  ['Returns', 'How would a repair work?', 'HALO is designed to be repaired: pads, cables and batteries are replaceable and the parts are listed on each product page.'],
  ['Prices', 'Does VAT apply?', 'Prices shown include 7.5% VAT, the standard rate in Nigeria. The checkout breaks out the VAT portion.'],
  ['Products', 'Are the specifications real?', 'No. They are concept design targets chosen to be realistic, not measurements of a shipping product. The sound-signature charts are illustrative.'],
  ['Products', 'Why a concept store?', 'It exists to show how a fast, accessible, 3D-driven shop can be built with plain web technology: WebGL, no framework and no image files.'],
];
export function support(q) {
  stage.hide(true);
  const term = (q.get('q') || '').toLowerCase();
  const groups = [...new Set(FAQ.map(f => f[0]))];
  return `<div class="solid page"><section class="wrap narrow"><header class="sh"><p class="kicker">Support</p><h1 class="h1s">Questions, <em>answered.</em></h1></header>
  <form class="inline" id="faqSearch"><input name="q" placeholder="Search the help centre" value="${esc(q.get('q') || '')}" aria-label="Search help"><button class="btn">Search</button></form>
  ${groups.map(g => { const items = FAQ.filter(f => f[0] === g && (!term || (f[1] + f[2]).toLowerCase().includes(term))); return items.length ? `<h3 class="sub gh">${g}</h3>${items.map(f => `<details class="faq"><summary>${f[1]}</summary><p>${f[2]}</p></details>`).join('')}` : ''; }).join('')}
  <h3 class="sub gh">Contact (demo)</h3><form id="contact" class="form" novalidate><label>Name<input name="name"></label><label>Message<textarea name="msg" rows="4"></textarea></label><button class="btn">Send</button><small class="nmsg" id="cmsg2"></small></form>
  </section>${footer()}</div>`;
}
export function journal() {
  stage.hide(true);
  return `<div class="solid page"><section class="wrap"><header class="sh"><p class="kicker">Journal</p><h1 class="h1s">Listen <em>closer.</em></h1></header>
  <div class="arts big">${ARTICLES.map(a => `<a class="art2" href="#/journal/${a.id}"><small>${a.tag} · ${a.mins} min read</small><b>${a.title}</b><p>${a.lede}</p></a>`).join('')}</div></section>${footer()}</div>`;
}
export function article(id) {
  stage.hide(true);
  const a = ARTICLES.find(x => x.id === id);
  if (!a) return notFound();
  const more = ARTICLES.filter(x => x.id !== id).slice(0, 3);
  return `<div class="solid page"><section class="wrap narrow"><nav class="crumbs"><a href="#/journal">Journal</a> / ${esc(a.tag)}</nav><header class="sh"><p class="kicker">${a.tag} · ${a.mins} min read</p><h1 class="h1s">${a.title}</h1><p class="blurb lead">${a.lede}</p></header>
  <div class="prose">${a.body.map(p => `<p>${p}</p>`).join('')}</div>
  <h3 class="sub gh">Keep reading</h3><div class="arts">${more.map(x => `<a class="art2" href="#/journal/${x.id}"><small>${x.tag} · ${x.mins} min</small><b>${x.title}</b></a>`).join('')}</div></section>${footer()}</div>`;
}
export function about() {
  stage.hide(true);
  return `<div class="solid page"><section class="wrap narrow"><header class="sh"><p class="kicker">About</p><h1 class="h1s">A store with <em>no stock.</em></h1></header>
  <p class="blurb">HALO is an invented audio brand, built as a showcase of what a modern web store can feel like: every product is a live 3D model generated from code and the whole site ships with no image files.</p>
  <p class="blurb">The shop is a fully working demo: ${PRODUCTS.length} products, filtering and search, wishlist, side-by-side comparison, bundle and code discounts, a persistent cart, VAT maths, validated checkout, order tracking and an order history. It deliberately stops short of taking money.</p>
  <div class="f3 tight"><article><h3>3D without images</h3><p>Models are assembled from primitives in three.js and rendered live, then snapshotted for the shop grid.</p></article><article><h3>Plain web tech</h3><p>No UI framework. Hash routing, template strings, and local storage for the cart.</p></article><article><h3>Accessible by default</h3><p>Keyboard navigable, labelled controls, reduced-motion respected, readable contrast.</p></article></div></section>${footer()}</div>`;
}
export function notFound() {
  stage.hide(true);
  return `<div class="solid page"><section class="wrap narrow"><p class="kicker">404</p><h1 class="h1s">Nothing here.</h1><a class="btn" href="#/">Back to the store</a></section>${footer()}</div>`;
}
