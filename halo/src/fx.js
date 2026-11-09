import { stage } from './stage.js';
import { PRODUCTS, EDITIONS } from './catalog.js';
import { FINISHES } from './core.js';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
/* cursor-following glow, tinted by the selected edition */
export function setGlow(hex) { root.style.setProperty('--ga', hex); }
export function initFx() {
  let gx = innerWidth * .7, gy = innerHeight * .4, tx = gx, ty = gy;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; const b = e.target.closest && e.target.closest('.btn'); if (b) { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px'); } }, { passive: true });
  (function loop() { gx += (tx - gx) * .08; gy += (ty - gy) * .08; root.style.setProperty('--gx', gx + 'px'); root.style.setProperty('--gy', gy + 'px'); requestAnimationFrame(loop); })();
  /* live ticker: concept stock levels that drift */
  const base = PRODUCTS.filter(p => !p.edition).slice(0, 9), stock = base.map((p, i) => 6 + (i * 7) % 23);
  const notes = ['CONCEPT STORE · NO PAYMENT TAKEN', 'DROP 04 · AURORA EDITION LIVE', 'FREE DELIVERY OVER THE THRESHOLD', 'CHECKOUT IS A DEMO'];
  const items = [];
  base.forEach((p, i) => items.push(`<span class="ti"><i class="md"></i>${p.name.toUpperCase()} <b data-s="${i}">${stock[i]}</b> IN STOCK</span>`));
  notes.forEach(n => items.push(`<span class="ti n"><i class="md o"></i>${n}</span>`));
  const html = items.join('');
  $('#trk').innerHTML = html + html;
  if (!reduce) setInterval(() => {
    const i = Math.floor(Math.random() * base.length); stock[i] = Math.max(2, stock[i] + (Math.random() < .6 ? -1 : 2));
    $$(`[data-s="${i}"]`).forEach(b => { b.textContent = stock[i]; b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash'); });
  }, 2600);
}
export function heroFx() {
  const rb = $('#ringbox'); if (!rb) return;
  setGlow('#ff4500'); let ex = false;
  $('#hsExp').onclick = e => { ex = !ex; stage.explode(ex ? 1 : 0); e.currentTarget.classList.toggle('on', ex); e.currentTarget.querySelector('span').innerHTML = `<small>01</small>${ex ? 'Assemble' : 'Explode view'}`; };
  $('#hsSpin').onclick = e => { stage.kick(); stage.turn(); const b = e.currentTarget; b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 1800); };
  $('#hsDrv').onclick = e => { const p = $('#hpop'); p.hidden = !p.hidden; e.currentTarget.classList.toggle('on', !p.hidden); };
  if (!window.__hpopBound) document.addEventListener('click', e => { const p = $('#hpop'); if (p && !p.hidden && !e.target.closest('#hpop,#hsDrv')) { p.hidden = true; $('#hsDrv')?.classList.remove('on'); } }); window.__hpopBound = true;
  $$('#swatches .sw').forEach(b => b.onclick = () => {
    $$('#swatches .sw').forEach(x => x.classList.remove('on')); b.classList.add('on');
    const ed = EDITIONS.find(x => x.id === b.dataset.e), accent = ed ? ed.accent : '#ff4500', fin = ed ? ed.colors[0] : 'Obsidian';
    setGlow(accent); stage.color(FINISHES[fin] || '#1b1b1d'); stage.kick();
  });
}
