/* Procedural album art: every cover is generated from the rhythm id. No images. */
let uid = 0;
export function hash(str) { let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const hueOf = id => hash(id) % 360;
const PHOTOS = new Set(['afrohouse', 'afrobeat', 'juju', 'bembe', 'highlife', 'amapiano', 'lofi', 'afrobeats']);
/* Unsplash photos (hotlinked, per Unsplash guidelines). Credits shown on the About page. */
export const UNSPLASH = {
  disco: ['photo-1792253796807-3240774a5ab7', 'Joost Crop', 'smallcamerabigpictures', 'LOJ2F1NcDN0'],
  house: ['photo-1513563326940-e76e4641069e', 'Jehyun Sung', 'jaysung', 'Y3iX41HX6SI'],
  dnb: ['photo-1645654495749-db9ba5f1ef23', 'Call Me Fred', 'callmefred', '7oK3pbyEy1s'],
  trap: ['photo-1735617621342-d65d9c552ca1', 'Jay Dee', 'jdharris', 'FNo5zyx9HzM'],
  reggaeton: ['photo-1625642471723-12744e6e4211', 'Zetong Li', 'zetong', 'Pm8Qaht8kXU'],
  techno: ['photo-1774296785946-9d4b887b8c91', 'Kris Tian', 'kris_tian', 'FyNNbm2ExBk'],
  funk: ['photo-1583916602120-795a82087464', 'Severin Stalder', 'severinstalder', '95GsNG4YCi8'],
  rock: ['photo-1758176209301-bcb3edd1732e', 'Ruben Zea', '', 'qjX71jCYkCM'],
  pop: ['photo-1724390265362-c58d0bc7d17a', 'Aditya Sethia', '', 'T0TyVwTLlMA'],
  ambient: ['photo-1788032769279-eb26f3183e46', 'Krzysztof Kościelny', '', 'KH-sV6pl0Gg'],
  waltz: ['photo-1635476573973-fdb06ca7ad4d', 'Caleb McLean', 'calebmcleanphotography', 'qBbknsDYnLk'],
};
const img = (src, extra = '') => `<img class="cvi" src="${src}" alt="" loading="lazy" draggable="false" onerror="this.remove()"${extra}>`;
export function cover(id, name = '', opts = {}) {
  if (UNSPLASH[id] && !opts.plain) return `<span class="cvw">${cover(id, name, { ...opts, plain: true })}${img(`https://images.unsplash.com/${UNSPLASH[id][0]}?ixlib=rb-4.1.0&q=80&fm=jpg&fit=crop&crop=entropy&w=640&h=640`)}</span>`;
  if (PHOTOS.has(id)) return `<img class="cv" src="/img/${id}.jpg" alt="" loading="lazy" draggable="false" style="object-fit:cover">`;
  const s = hash(id), r = rng(s), h = s % 360, h2 = (h + 40 + (s >> 3) % 80) % 360, g = 'g' + (uid++), style = (s >> 5) % 6;
  let art = '';
  if (style === 0) for (let i = 0; i < 7; i++) art += `<circle cx="${70 + r() * 60}" cy="${60 + r() * 50}" r="${14 + i * 14}" fill="none" stroke="hsl(${h2} 90% ${60 + i * 3}% / .55)" stroke-width="${2 + r() * 5}"/>`;
  else if (style === 1) for (let i = 0; i < 14; i++) { const hh = 20 + r() * 110; art += `<rect x="${12 + i * 13}" y="${150 - hh}" width="9" height="${hh}" rx="4.5" fill="hsl(${(h2 + i * 6) % 360} 90% 62% / .8)"/>`; }
  else if (style === 2) for (let k = 0; k < 5; k++) { let d = `M0 ${70 + k * 14}`; const a = 8 + r() * 22, f = 0.02 + r() * 0.05, ph = r() * 6; for (let x = 0; x <= 200; x += 5) d += ` L${x} ${(70 + k * 14 + Math.sin(x * f * 6 + ph) * a).toFixed(1)}`; art += `<path d="${d}" fill="none" stroke="hsl(${(h2 + k * 14) % 360} 95% 66% / .75)" stroke-width="3" stroke-linecap="round"/>`; }
  else if (style === 3) { art += `<circle cx="100" cy="82" r="46" fill="hsl(${h2} 95% 62%)"/>`; for (let i = 0; i < 6; i++) art += `<rect x="0" y="${92 + i * 11}" width="200" height="${2 + i * 1.6}" fill="hsl(${h} 70% 14%)"/>`; }
  else if (style === 4) for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const on = r() > 0.35; art += `<circle cx="${20 + x * 23}" cy="${18 + y * 18}" r="${on ? 5 + r() * 5 : 2}" fill="hsl(${(h2 + x * 8) % 360} 90% 65% / ${on ? 0.85 : 0.3})"/>`; }
  else for (let i = 0; i < 6; i++) art += `<rect x="${r() * 120}" y="${r() * 100}" width="${40 + r() * 60}" height="${40 + r() * 60}" transform="rotate(${r() * 90} 100 100)" fill="hsl(${(h + i * 25) % 360} 90% 60% / .45)"/>`;
  const words = String(name).split(/\s+/).slice(0, 3), txt = opts.noText ? '' : words.map((w, i) => `<text x="12" y="${200 - 14 - (words.length - 1 - i) * 22}" font-family="Space Grotesk,system-ui,sans-serif" font-weight="800" font-size="21" fill="#fff" opacity=".95">${w.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`).join('');
  return `<svg class="cv" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h} 80% 52%)"/><stop offset="1" stop-color="hsl(${h2} 80% 22%)"/></linearGradient></defs><rect width="200" height="200" fill="url(#${g})"/>${art}<rect y="110" width="200" height="90" fill="#000" opacity=".25"/>${txt}</svg>`;
}
