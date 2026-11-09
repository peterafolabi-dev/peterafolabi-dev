import { stage } from './stage.js';
import * as P from './pages.js';
import { initFx, heroFx } from './fx.js';
import { PRODUCTS, byId, COLLECTIONS, BUNDLES } from './catalog.js';
import { ARTICLES } from './journal.js';
import { $, $$, fmt, esc, store, S, save, FINISHES, thumb, totals, lineUnit, addToCart, inWish, toggleWish, pushRecent, toast, eta, COUPONS, FREE_OVER } from './core.js';

/* ------------------------------------------------------------------ header / drawer */
function renderBadges() {
  const n = totals().count, b = $('#badge'); b.textContent = n; b.hidden = !n;
  const w = $('#wbadge'); w.textContent = S.wish.length; w.hidden = !S.wish.length;
}
function saveCart() { save.cart(); renderBadges(); renderDrawer(); if (curSeg === 'checkout') refreshCheckout(); }
function renderDrawer() {
  const t = totals(), body = $('#drawer .lines');
  if (!S.cart.length) {
    body.innerHTML = '<div class="empty"><p>Your cart is empty.</p><a class="btn" href="#/shop" data-close>Browse the lineup</a></div>';
    $('#drawer .sum').innerHTML = ''; return;
  }
  body.innerHTML = S.cart.map((l, i) => {
    const p = byId(l.id);
    const ad = (l.addons || []).map(a => p.addons.find(x => x.id === a)?.name).filter(Boolean).join(' · ');
    return `<div class="line"><img src="${thumb(p, l.color)}" alt="${esc(p.name)} in ${esc(l.color)}">
      <div><b>${esc(p.name)}</b><small>${esc(l.color)}${ad ? ' · ' + esc(ad) : ''}</small>
        <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button><button class="rm" data-rm="${i}">Remove</button></div></div>
      <strong>${fmt(lineUnit(l) * l.qty)}</strong></div>`;
  }).join('');
  const left = Math.max(0, FREE_OVER - t.after);
  $('#drawer .sum').innerHTML = `<div class="free">${t.ship === 0 ? 'You have free delivery.' : `Add ${fmt(left)} more for free delivery.`}<i style="--w:${Math.min(100, t.after / FREE_OVER * 100)}%"></i></div>
    ${P.sumRows(t)}<a class="btn full" href="#/checkout" data-close>Checkout</a>`;
}
function openDrawer(v) { $('#drawer').classList.toggle('open', v); $('#scrim').classList.toggle('on', v); document.body.classList.toggle('lock', v); if (v) renderDrawer(); }
function refreshCheckout() {
  const c = $('#cosum'); if (!c) return;
  const t = totals(); c.innerHTML = P.coSummary(t);
  const b = $('#coBtn'); if (b) b.textContent = 'Place demo order · ' + fmt(t.total);
}
function applyCoupon(btn) {
  const wrap = btn.closest('.coupon'), code = wrap.querySelector('.cpn').value.trim().toUpperCase();
  if (!code) { S.coupon = ''; save.coupon(); saveCart(); return; }
  if (!COUPONS[code]) { const m = wrap.nextElementSibling; if (m) m.textContent = 'That code is not recognised.'; return; }
  S.coupon = code; save.coupon(); saveCart(); toast('Code ' + code + ' applied');
}

/* ------------------------------------------------------------------ wishlist / compare */
function syncHearts(id) {
  $$(`[data-wish="${id}"]`).forEach(b => { b.classList.toggle('on', inWish(id)); b.setAttribute('aria-pressed', inWish(id)); });
  renderBadges();
}
function renderCmpBar() {
  const bar = $('#cmpbar');
  if (!S.compare.length) { bar.hidden = true; return; }
  bar.hidden = false;
  bar.innerHTML = `<span>${S.compare.map(id => esc(byId(id).name)).join(' · ')}</span><a class="btn sm" href="#/compare">Compare (${S.compare.length})</a><button class="rm" id="cmpClear">Clear</button>`;
}

/* ------------------------------------------------------------------ search overlay */
const sbox = $('#searchBox');
function openSearch(v) {
  sbox.hidden = !v;
  if (v) { $('#sq').value = ''; $('#sres').innerHTML = ''; setTimeout(() => $('#sq').focus(), 30); }
}
$('#sq').addEventListener('input', e => {
  const t = e.target.value.toLowerCase().trim();
  if (!t) { $('#sres').innerHTML = ''; return; }
  const hits = PRODUCTS.filter(p => (p.name + ' ' + p.tag + ' ' + p.tags.join(' ')).toLowerCase().includes(t));
  $('#sres').innerHTML = hits.slice(0, 6).map(p => `<a href="#/product/${p.id}" data-sx><img src="${thumb(p, p.colors[0])}" alt=""><span><b>${esc(p.name)}</b><small>${esc(p.tag)}</small></span><strong>${fmt(p.price)}</strong></a>`).join('') +
    (hits.length ? `<a class="all" href="#/shop?q=${encodeURIComponent(t)}" data-sx>See all ${hits.length} result${hits.length === 1 ? '' : 's'}</a>` : '<p class="none">No matches.</p>');
});
$('#sq').addEventListener('keydown', e => { if (e.key === 'Enter') { location.hash = '#/shop?q=' + encodeURIComponent(e.target.value.trim()); openSearch(false); } });

/* ------------------------------------------------------------------ global clicks */
document.addEventListener('click', e => {
  const t = e.target;
  const d = t.closest('[data-q]');
  if (d) { const l = S.cart[+d.dataset.q]; l.qty = Math.max(1, Math.min(10, l.qty + +d.dataset.d)); saveCart(); return; }
  const r = t.closest('[data-rm]');
  if (r) { S.cart.splice(+r.dataset.rm, 1); saveCart(); return; }
  if (t.closest('#cartBtn')) { openDrawer(true); return; }
  if (t.closest('#scrim,#closeDrawer,[data-close]')) openDrawer(false);
  if (t.closest('#searchBtn')) { openSearch(sbox.hidden); return; }
  if (t.closest('#sx,[data-sx]')) openSearch(false);
  if (t.closest('#menuBtn')) { const n = $('#nav'); const o = n.classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', o); return; }
  if (t.closest('#nav a')) { $('#nav').classList.remove('open'); }
  const cp = t.closest('[data-cpn]'); if (cp) { applyCoupon(cp); return; }
  const w = t.closest('[data-wish]');
  if (w) { e.preventDefault(); const id = w.dataset.wish; const on = toggleWish(id); syncHearts(id); toast(on ? 'Saved to wishlist' : 'Removed from wishlist'); if (curSeg === 'wishlist') route(true); return; }
  const a1 = t.closest('[data-add1]');
  if (a1) { const p = byId(a1.dataset.add1); addToCart(p.id, p.colors[0], [], 1); saveCart(); toast(p.name + ' added'); openDrawer(true); return; }
  const bd = t.closest('[data-bundle]');
  if (bd) { const b = BUNDLES.find(x => x.id === bd.dataset.bundle); b.items.forEach(id => addToCart(id, byId(id).colors[0], [], 1)); saveCart(); toast(b.name + ' added'); openDrawer(true); return; }
  if (t.closest('#wishAll')) { S.wish.forEach(id => addToCart(id, byId(id).colors[0], [], 1)); saveCart(); toast('Wishlist added to cart'); openDrawer(true); return; }
  const cx = t.closest('[data-cmpx]');
  if (cx) { S.compare = S.compare.filter(x => x !== cx.dataset.cmpx); renderCmpBar(); route(true); return; }
  if (t.closest('#cmpClear')) { S.compare = []; renderCmpBar(); $$('[data-cmp]').forEach(c => { c.checked = false; }); return; }
  const f = t.closest('[data-f]');
  if (f) { fAns.push(f.dataset.f); route(true); return; }
  if (t.closest('#fback')) { fAns.pop(); route(true); return; }
  if (t.closest('#clearOrders')) { S.orders = []; save.orders(); route(true); return; }
  if (t.closest('#wipe')) {
    ['cart', 'orders', 'wish', 'recent', 'coupon', 'address'].forEach(k => { try { localStorage.removeItem('halo_v2_' + k); } catch { /* ignore */ } });
    S.cart = []; S.orders = []; S.wish = []; S.recent = []; S.compare = []; S.coupon = ''; S.address = {};
    renderBadges(); renderCmpBar(); renderDrawer(); toast('Browser data cleared'); route(true); return;
  }
});
document.addEventListener('change', e => {
  const c = e.target.closest('[data-cmp]');
  if (c) {
    const id = c.dataset.cmp;
    if (c.checked) { if (S.compare.length >= 3) { c.checked = false; toast('Compare up to 3 products'); return; } S.compare.push(id); }
    else S.compare = S.compare.filter(x => x !== id);
    renderCmpBar();
  }
});
addEventListener('keydown', e => { if (e.key === 'Escape') { openDrawer(false); openSearch(false); } });

/* ------------------------------------------------------------------ router */
const app = $('#app');
stage.drag(app);
let fAns = [], curSeg = '', lastBase = '';
function route(internal) {
  const [path, qs] = (location.hash.slice(1) || '/').split('?');
  const q = new URLSearchParams(qs || '');
  const seg = path.split('/').filter(Boolean);
  curSeg = seg[0] || '';
  let html, title = 'HALO — concept audio store';
  const keepScroll = !internal && curSeg && (curSeg === 'shop' || curSeg === 'collection') && lastBase === path;
  const y = scrollY;
  if (curSeg !== 'finder' && !internal) fAns = [];
  if (curSeg === 'finder' && !internal && fAns.length && !location.hash.includes('?')) fAns = [];
  switch (curSeg) {
    case '': html = P.home(); break;
    case 'shop': html = P.shop(q); title = 'Shop · HALO'; break;
    case 'collection': html = P.collection(seg[1], q); title = (COLLECTIONS.find(c => c.id === seg[1])?.name || 'Collection') + ' · HALO'; break;
    case 'product': html = P.product(seg[1]); title = (byId(seg[1])?.name || 'Product') + ' · HALO'; if (byId(seg[1])) pushRecent(seg[1]); break;
    case 'wishlist': html = P.wishlist(); title = 'Wishlist · HALO'; break;
    case 'compare': html = P.compare(); title = 'Compare · HALO'; break;
    case 'bundles': html = P.bundles(); title = 'Bundles · HALO'; break;
    case 'finder': html = P.finder(fAns.length, fAns); title = 'Find your HALO'; break;
    case 'checkout': html = P.checkout(); title = 'Checkout · HALO'; break;
    case 'confirmation': html = P.confirmation(seg[1]); title = 'Order placed · HALO'; break;
    case 'orders': html = P.ordersPage(); title = 'Demo orders · HALO'; break;
    case 'track': html = P.track(q); title = 'Track an order · HALO'; break;
    case 'account': html = P.account(); title = 'Your demo account · HALO'; break;
    case 'support': html = P.support(q); title = 'Support · HALO'; break;
    case 'journal': html = seg[1] ? P.article(seg[1]) : P.journal(); title = (seg[1] ? ARTICLES.find(a => a.id === seg[1])?.title : 'Journal') + ' · HALO'; break;
    case 'about': html = P.about(); title = 'About · HALO'; break;
    default: html = P.notFound();
  }
  app.innerHTML = html;
  document.title = title;
  if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
  lastBase = path;
  stage.scroll(0);
  $$('.nav a[data-r]').forEach(a => { const h = a.getAttribute('href'); a.classList.toggle('on', h === '#/' + curSeg || (['product', 'collection'].includes(curSeg) && h === '#/shop')); });
  bind(seg, q);
  openDrawer(false); openSearch(false);
}

function homeFx() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; heroFx();
  const sw = $('#swap');
  if (sw && !reduce) { const w = sw.dataset.w.split('|'); let i = 0; clearInterval(window.__swap); window.__swap = setInterval(() => { if (!document.body.contains(sw)) return clearInterval(window.__swap); sw.classList.add('out'); setTimeout(() => { i = (i + 1) % w.length; sw.textContent = w[i]; sw.classList.remove('out'); }, 350); }, 2200); }
  $$('[data-count]').forEach(el => { const to = +el.dataset.count; if (reduce) { el.textContent = to; return; } const t0 = performance.now(); const tick = t => { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  const rv = $$('.rv'); if (reduce || !('IntersectionObserver' in window)) { rv.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  rv.forEach(e => io.observe(e));
}

function bind(seg, q) {
  const s = seg[0];
  if (!s) homeFx();
  if (s === 'checkout') bindCheckout();
  if (s === 'shop' || s === 'collection') bindShop(q, '#/' + seg.join('/'));
  if (s === 'product') bindPdp(byId(seg[1]));
  if (s === 'track') $('#trackForm')?.addEventListener('submit', e => { e.preventDefault(); location.hash = '#/track?id=' + encodeURIComponent(e.target.elements.id.value.trim()); });
  if (s === 'support') {
    $('#faqSearch')?.addEventListener('submit', e => { e.preventDefault(); location.hash = '#/support?q=' + encodeURIComponent(e.target.elements.q.value.trim()); });
    $('#contact')?.addEventListener('submit', e => { e.preventDefault(); $('#cmsg2').textContent = 'Demo only: nothing was sent.'; e.target.reset(); });
  }
  if (s === 'account') $('#addr')?.addEventListener('submit', e => {
    e.preventDefault(); const el = e.target.elements;
    S.address = { name: el.name.value.trim(), phone: el.phone.value.trim(), address: el.address.value.trim(), city: el.city.value.trim(), state: el.state.value };
    save.address(); $('#addrMsg').textContent = 'Saved in this browser.';
  });
  $('#news')?.addEventListener('submit', e => {
    e.preventDefault(); const v = e.target.elements[0].value.trim(), m = $('.nmsg');
    m.textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Demo only: nothing was stored or sent.' : 'Enter a valid email address.';
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) e.target.reset();
  });
}

function bindShop(q, base) {
  const nav = nq => { const s = nq.toString(); location.hash = base + (s ? '?' + s : ''); };
  $('#sort')?.addEventListener('change', e => { q.set('sort', e.target.value); q.delete('page'); nav(q); });
  let tm; $('#search')?.addEventListener('input', e => {
    clearTimeout(tm);
    tm = setTimeout(() => {
      q.set('q', e.target.value); q.delete('page');
      history.replaceState(null, '', base + '?' + q.toString());
      const pos = e.target.selectionStart; route(true);
      const n = $('#search'); n.focus(); n.setSelectionRange(pos, pos);
    }, 250);
  });
  const fd0 = $('.fdet'); if (fd0) fd0.open = innerWidth > 860;
  const form = $('#filters'); if (!form) return;
  const apply = () => {
    const fd = new FormData(form), nq = new URLSearchParams();
    const cat = fd.get('cat'); if (cat && cat !== 'All') nq.set('cat', cat);
    if (fd.get('min')) nq.set('min', fd.get('min')); if (fd.get('max')) nq.set('max', fd.get('max'));
    const tg = fd.getAll('tags'); if (tg.length) nq.set('tags', tg.join(','));
    const cl = fd.getAll('colors'); if (cl.length) nq.set('colors', cl.join(','));
    if (fd.get('ed') && fd.get('ed') !== 'all') nq.set('ed', fd.get('ed')); if (fd.get('sale')) nq.set('sale', '1'); if (fd.get('new')) nq.set('new', '1');
    ['q', 'sort'].forEach(k => { if (q.get(k)) nq.set(k, q.get(k)); });
    nav(nq);
  };
  form.addEventListener('change', apply);
  form.addEventListener('submit', e => { e.preventDefault(); apply(); });
}

function bindPdp(p) {
  if (!p) return;
  const panel = $('#pdp'), sel = P.sel;
  const drawSig = () => {
    const cv = $('#sig'); if (!cv) return; const c = cv.getContext('2d'), W = cv.width, H = cv.height, [b, m, t] = p.sig;
    const css = getComputedStyle(document.documentElement);
    c.clearRect(0, 0, W, H);
    c.strokeStyle = 'rgba(243,237,228,.12)'; c.lineWidth = 1;
    for (let i = 0; i < 5; i++) { const y = 20 + i * (H - 40) / 4; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    const fx = f => 12 + (Math.log10(f) - Math.log10(20)) / 3 * (W - 24);
    const pts = [[20, b * 0.55], [80, b], [300, (b + m) / 2], [1000, m], [3000, m + 0.06], [8000, t], [20000, t * 0.5]].map(([f, v]) => [fx(f), H - 20 - v * (H - 40)]);
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2; c.bezierCurveTo(mx, y0, mx, y1, x1, y1); }
    c.strokeStyle = css.getPropertyValue('--acc').trim() || '#ff5a2c'; c.lineWidth = 3; c.stroke();
    c.lineTo(W - 12, H - 6); c.lineTo(12, H - 6); c.closePath(); c.fillStyle = 'rgba(255,90,44,.12)'; c.fill();
    c.fillStyle = '#9a9288'; c.font = '11px Inter, sans-serif';
    [[20, '20 Hz'], [100, '100'], [1000, '1k'], [10000, '10k']].forEach(([f, l]) => c.fillText(l, fx(f) - 8, H - 4));
  };
  const price = () => { const u = p.price + [...sel.addons].reduce((s, a) => s + p.addons.find(x => x.id === a).price, 0); const m = $('#mprice'); if (m) m.textContent = fmt(u * sel.qty); };
  const redraw = () => { panel.innerHTML = P.pdpInner(p); drawSig(); price(); };
  drawSig(); price();
  const addNow = () => { addToCart(p.id, sel.color, [...sel.addons], sel.qty); saveCart(); toast(`${p.name} added to cart`); openDrawer(true); };
  $('#mbuy [data-addcart]')?.addEventListener('click', addNow);
  panel.addEventListener('click', e => {
    const c = e.target.closest('[data-c]');
    if (c) { sel.color = c.dataset.c; stage.color(FINISHES[sel.color]); stage.kick(); redraw(); return; }
    const n = e.target.closest('[data-n]');
    if (n) { sel.qty = Math.max(1, Math.min(10, sel.qty + +n.dataset.n)); redraw(); return; }
    if (e.target.closest('#add')) { addNow(); return; }
    if (e.target.closest('#exp')) { sel.exp = !sel.exp; stage.explode(sel.exp ? 1 : 0); redraw(); return; }
    if (e.target.closest('#spin')) { const b = $('#spin'); const paused = b.textContent === 'Resume spin'; stage.spin(paused); b.textContent = paused ? 'Pause spin' : 'Resume spin'; return; }
    if (e.target.closest('#share')) { navigator.clipboard?.writeText(location.href).then(() => toast('Link copied'), () => toast('Copy the address bar to share')); }
  });
  panel.addEventListener('change', e => {
    const a = e.target.closest('[data-a]');
    if (a) { a.checked ? sel.addons.add(a.dataset.a) : sel.addons.delete(a.dataset.a); if (a.dataset.a === 'leather') stage.cushions(a.checked); redraw(); return; }
    if (e.target.id === 'etaState') {
      S.address = { ...S.address, state: e.target.value }; save.address();
      $('#etaTxt').textContent = e.target.value ? `Estimated delivery to ${e.target.value}: ${eta(e.target.value)}` : '';
    }
  });
}

function bindCheckout() {
  const f = $('#co'); if (!f) return;
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your full name',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email',
    phone: v => /^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/\s|-/g, '')) || 'Enter a Nigerian mobile number',
    address: v => v.trim().length >= 6 || 'Enter a delivery address',
    city: v => v.trim().length >= 2 || 'Enter your city',
    state: v => !!v || 'Choose a state',
  };
  f.elements.state.addEventListener('change', e => { $('#etaCo').textContent = e.target.value ? 'Estimated delivery: ' + eta(e.target.value) : ''; });
  f.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    for (const k in rules) {
      const el = f.elements[k], r = rules[k](el.value);
      el.closest('label').classList.toggle('bad', r !== true);
      el.closest('label').querySelector('em').textContent = r === true ? '' : r;
      if (r !== true) { if (ok) el.focus(); ok = false; }
    }
    if (!ok) return;
    const t = totals();
    const id = 'HALO-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const order = { id, date: Date.now(), items: S.cart.map(l => ({ ...l, name: byId(l.id).name, unit: lineUnit(l) })), total: t.total, sub: t.sub, ship: t.ship, vat: t.vat, bundle: t.bundle, coupon: t.coupon, couponAmt: t.couponAmt, name: f.elements.name.value.trim(), state: f.elements.state.value, city: f.elements.city.value.trim() };
    S.orders.unshift(order); save.orders();
    S.address = { name: order.name, phone: f.elements.phone.value.trim(), address: f.elements.address.value.trim(), city: order.city, state: order.state }; save.address();
    S.cart = []; S.coupon = ''; save.coupon(); saveCart();
    location.hash = '#/confirmation/' + id;
  });
  $$('input,select', f).forEach(el => el.addEventListener('input', () => { el.closest('label')?.classList.remove('bad'); }));
}

addEventListener('hashchange', () => route(false));
addEventListener('scroll', () => { if (!location.hash || location.hash === '#/') stage.scroll(Math.min(1, scrollY / (innerHeight * 0.9))); }, { passive: true });

renderBadges(); renderDrawer(); renderCmpBar();
route(false);

initFx();
