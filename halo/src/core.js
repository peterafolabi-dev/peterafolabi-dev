import { PRODUCTS, byId } from './catalog.js';
import { FINISHES, thumbnail } from './models.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const fmt = n => '₦' + Math.round(n).toLocaleString('en-NG');
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

export const FREE_OVER = 200000, SHIP = 4500;
export const COUPONS = {
  HALO10: { pct: 10, label: '10% off (demo code)' },
  WELCOME5: { pct: 5, label: '5% welcome offer (demo code)' },
  FREESHIP: { ship: true, label: 'Free delivery (demo code)' },
};

export const S = {
  cart: store.get('halo_v2_cart', []),
  orders: store.get('halo_v2_orders', []),
  wish: store.get('halo_v2_wish', []),
  recent: store.get('halo_v2_recent', []),
  compare: [],
  coupon: store.get('halo_v2_coupon', ''),
  address: store.get('halo_v2_address', {}),
};
export const save = {
  cart: () => store.set('halo_v2_cart', S.cart),
  orders: () => store.set('halo_v2_orders', S.orders),
  wish: () => store.set('halo_v2_wish', S.wish),
  recent: () => store.set('halo_v2_recent', S.recent),
  coupon: () => store.set('halo_v2_coupon', S.coupon),
  address: () => store.set('halo_v2_address', S.address),
};

const thumbs = {};
export function thumb(p, color) {
  const k = p.id + color;
  if (!thumbs[k]) { try { thumbs[k] = thumbnail(p.kind, FINISHES[color], p.accent, p.size); } catch { thumbs[k] = ''; } }
  return thumbs[k];
}

export const lineUnit = l => {
  const p = byId(l.id);
  return p.price + (l.addons || []).reduce((s, a) => s + (p.addons.find(x => x.id === a)?.price || 0), 0);
};
export function totals() {
  const sub = S.cart.reduce((s, l) => s + lineUnit(l) * l.qty, 0);
  const kinds = new Set(S.cart.map(l => l.id)).size;
  const bundlePct = kinds >= 3 ? 10 : kinds === 2 ? 5 : 0;
  const bundle = Math.round(sub * bundlePct / 100);
  const cp = COUPONS[S.coupon];
  const couponAmt = cp?.pct ? Math.round((sub - bundle) * cp.pct / 100) : 0;
  const after = sub - bundle - couponAmt;
  const freeShip = cp?.ship || after >= FREE_OVER;
  const ship = sub === 0 ? 0 : freeShip ? 0 : SHIP;
  const total = after + ship;
  return { sub, bundle, bundlePct, couponAmt, coupon: cp ? S.coupon : '', ship, total, vat: total * 7.5 / 107.5, after, count: S.cart.reduce((s, l) => s + l.qty, 0), kinds };
}
export function addToCart(id, color, addons, qty) {
  const key = a => [...a].sort().join(',');
  const hit = S.cart.find(l => l.id === id && l.color === color && key(l.addons || []) === key(addons));
  if (hit) hit.qty = Math.min(10, hit.qty + qty); else S.cart.push({ id, color, addons: [...addons], qty });
  save.cart();
}
export const inWish = id => S.wish.includes(id);
export function toggleWish(id) {
  S.wish = inWish(id) ? S.wish.filter(x => x !== id) : [...S.wish, id];
  save.wish();
  return inWish(id);
}
export function pushRecent(id) {
  S.recent = [id, ...S.recent.filter(x => x !== id)].slice(0, 8);
  save.recent();
}

let toastT;
export function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200);
}

export const STATES = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];
const SW = ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'];
export function eta(state) {
  if (!state) return '';
  if (state === 'Lagos') return '1–2 working days';
  if (SW.includes(state)) return '2–3 working days';
  if (state === 'FCT Abuja' || ['Edo', 'Delta', 'Kwara', 'Rivers', 'Anambra', 'Enugu'].includes(state)) return '2–4 working days';
  return '3–6 working days';
}

export const stars = null;
export { PRODUCTS, byId, FINISHES };
