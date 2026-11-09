export const D2R = Math.PI / 180;
export const TILT = 23.44;
export const R_EARTH = 6371;

export const declinationDeg = day => -TILT * Math.cos((2 * Math.PI / 365) * (day + 10));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export function dateLabel(day) { let d = Math.round(day), m = 0; while (m < 11 && d > MD[m]) { d -= MD[m]; m++; } return `${d} ${MONTHS[m]}`; }
export const MONTH_STARTS = (() => { let s = 1; return MD.map((d, i) => { const o = [MONTHS[i], s]; s += d; return o; }); })();

/** Hours of daylight at a latitude for a given solar declination (0 = polar night, 24 = midnight sun). */
export function dayHours(latDeg, decDeg) {
  const x = -Math.tan(latDeg * D2R) * Math.tan(decDeg * D2R);
  if (x >= 1) return 0;
  if (x <= -1) return 24;
  return 2 * Math.acos(x) / D2R / 15;
}
export function fmtHM(h) {
  let hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  if (mm === 60) { hh++; mm = 0; }
  return `${hh} h ${String(mm).padStart(2, '0')} min`;
}
export function fmtClock(h) {
  h = ((h % 24) + 24) % 24;
  let hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  if (mm === 60) { hh = (hh + 1) % 24; mm = 0; }
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/* direction vectors use the same convention as the shader: lon = atan2(-z, x) */
export const dirFromLatLon = (lat, lon) => [Math.cos(lat * D2R) * Math.cos(lon * D2R), Math.sin(lat * D2R), -Math.cos(lat * D2R) * Math.sin(lon * D2R)];
export const latLonFromDir = d => ({ lat: Math.asin(Math.max(-1, Math.min(1, d[1]))) / D2R, lon: Math.atan2(-d[2], d[0]) / D2R });
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export function slerp(a, b, t) {
  const w = Math.acos(Math.max(-1, Math.min(1, dot(a, b))));
  if (w < 1e-6) return a;
  const s = Math.sin(w), k1 = Math.sin((1 - t) * w) / s, k2 = Math.sin(t * w) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}
const WINDS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export function gcInfo(a, b) {
  const ang = Math.acos(Math.max(-1, Math.min(1, dot(a, b))));
  const A = latLonFromDir(a), B = latLonFromDir(b);
  const p1 = A.lat * D2R, p2 = B.lat * D2R, dl = (B.lon - A.lon) * D2R;
  const brg = (Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)) / D2R + 360) % 360;
  const sum = [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mid = Math.hypot(...sum) < 1e-6 ? a : norm(sum);
  return { ang, km: ang * R_EARTH, A, B, bearing: brg, compass: WINDS[Math.round(brg / 22.5) % 16], mid, midLL: latLonFromDir(mid) };
}
export const fmtLL = (lat, lon) => `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;
