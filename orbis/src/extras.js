import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { declinationDeg, dayHours, fmtHM, fmtClock, dateLabel, MONTH_STARTS } from './astro.js';
import { COUNTRIES, PLANETS, GRAVITY_BODIES, RECORDS, PLATES, BOUNDARIES, BIOMES, TIMELINE, GLOSSARY, CLOCKS, ATM_LAYERS, ATM_TABLE, ALT_LANDMARKS, QUIZ } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const n0 = n => Math.round(n).toLocaleString('en-US');
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const reveal = el => ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => el.classList.add('in') });

/* ------------------------------------------------------------ contents overlay */
function toc() {
  const secs = $$('main .sec[data-t]');
  $('#tocGrid').innerHTML = secs.map((s, i) => `<a href="#${s.id}"><small>${String(i + 1).padStart(2, '0')}</small>${esc(s.dataset.t)}</a>`).join('');
  const box = $('#toc'), open = v => { box.hidden = !v; document.body.classList.toggle('lock', v); $('#tocBtn').setAttribute('aria-expanded', v); };
  $('#tocBtn').addEventListener('click', () => open(box.hidden));
  $('#tocX').addEventListener('click', () => open(false));
  box.addEventListener('click', e => { if (e.target.closest('a')) open(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') open(false); });
}

/* ------------------------------------------------------------ day length chart */
function dayChart(sunState) {
  const cv = $('#dayc'), ctx = cv.getContext('2d'), W = cv.width, H = cv.height, padL = 34, padB = 26, padT = 10, padR = 10;
  const slider = $('#dlat'), chips = $('#dayLatChips');
  const presets = [0, 23.44, 45, 66.56];
  const X = d => padL + (d - 1) / 364 * (W - padL - padR), Y = h => padT + (1 - h / 24) * (H - padT - padB);
  chips.innerHTML = [['Equator', 0], ['Tropic', 23.44], ['45° N', 45], ['Arctic Circle', 66.56], ['45° S', -45]].map(([n, v]) => `<button class="chip" data-v="${v}">${n}</button>`).join('');
  chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { slider.value = b.dataset.v; draw(); } });
  const curve = lat => { const p = []; for (let d = 1; d <= 365; d += 3) p.push([X(d), Y(dayHours(lat, declinationDeg(d)))]); return p; };
  const stroke = (pts, col, w, dash) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]); };
  function draw() {
    const lat = +slider.value; $('#dlv').textContent = `${Math.abs(lat).toFixed(lat % 1 ? 2 : 0)}° ${lat >= 0 ? 'N' : 'S'}`;
    ctx.clearRect(0, 0, W, H);
    ctx.font = '11px "DM Mono", monospace'; ctx.fillStyle = '#8a9bb8'; ctx.strokeStyle = 'rgba(160,200,255,.14)'; ctx.lineWidth = 1;
    for (let h = 0; h <= 24; h += 6) { ctx.beginPath(); ctx.moveTo(padL, Y(h)); ctx.lineTo(W - padR, Y(h)); ctx.stroke(); ctx.fillText(h + ' h', 2, Y(h) + 4); }
    MONTH_STARTS.forEach(([m, d]) => { ctx.fillText(m, X(d) + 2, H - 8); ctx.beginPath(); ctx.moveTo(X(d), Y(24)); ctx.lineTo(X(d), Y(0)); ctx.strokeStyle = 'rgba(160,200,255,.07)'; ctx.stroke(); });
    presets.forEach(p => { stroke(curve(p), 'rgba(160,200,255,.25)', 1, [4, 4]); stroke(curve(-p), 'rgba(160,200,255,.12)', 1, [4, 4]); });
    const pts = curve(lat);
    ctx.lineTo(X(365), Y(0)); ctx.lineTo(X(1), Y(0));
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineTo(X(365), Y(0)); ctx.lineTo(X(1), Y(0)); ctx.closePath(); ctx.fillStyle = 'rgba(92,200,255,.12)'; ctx.fill();
    stroke(pts, '#5cc8ff', 2.5);
    const dec = declinationDeg(sunState.day), dh = dayHours(lat, dec);
    ctx.strokeStyle = 'rgba(255,210,74,.7)'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(sunState.day), Y(24)); ctx.lineTo(X(sunState.day), Y(0)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#ffd24a'; ctx.beginPath(); ctx.arc(X(sunState.day), Y(dh), 5, 0, 7); ctx.fill();
    let mx = 0, mn = 24; for (let d = 1; d <= 365; d++) { const v = dayHours(lat, declinationDeg(d)); mx = Math.max(mx, v); mn = Math.min(mn, v); }
    const rise = 12 - dh / 2, set = 12 + dh / 2, elev = Math.max(0, 90 - Math.abs(lat - dec));
    const polar = dh === 0 ? 'Polar night' : dh === 24 ? 'Midnight Sun' : null;
    $('#dayread').innerHTML = `<div><small>${dateLabel(sunState.day)} · day length</small><b>${polar || fmtHM(dh)}</b></div>
      <div><small>Sunrise / sunset (solar time)</small><b>${polar ? '—' : fmtClock(rise) + ' / ' + fmtClock(set)}</b></div>
      <div><small>Sun at local noon</small><b>${polar === 'Polar night' ? 'below horizon' : elev.toFixed(1) + '° high'}</b></div>
      <div><small>Longest / shortest day</small><b>${fmtHM(mx)} / ${fmtHM(mn)}</b></div>`;
  }
  slider.addEventListener('input', draw);
  draw();
  return draw;
}

/* ------------------------------------------------------------ countries */
function countries() {
  const body = $('#ctryBody'), q = $('#ctryQ'), cont = $('#ctryC');
  const conts = ['All', ...new Set(COUNTRIES.map(c => c[1]))];
  cont.innerHTML = conts.map(c => `<option>${c}</option>`).join('');
  let key = 'pop', dir = -1;
  const val = { name: c => c[0], cont: c => c[1], cap: c => c[2], area: c => c[3], pop: c => c[4], den: c => c[4] / c[3] };
  function render() {
    const t = q.value.toLowerCase().trim();
    const rows = COUNTRIES.filter(c => (cont.value === 'All' || c[1] === cont.value) && (!t || (c[0] + ' ' + c[2]).toLowerCase().includes(t)))
      .sort((a, b) => { const x = val[key](a), y = val[key](b); return (typeof x === 'string' ? x.localeCompare(y) : x - y) * dir; });
    body.innerHTML = rows.map((c, i) => `<tr><td>${i + 1}</td><th scope="row">${esc(c[0])}</th><td>${c[1]}</td><td>${esc(c[2])}</td><td>${c[3] < 10 ? c[3] : n0(c[3])}</td><td>${c[4] >= 1e6 ? (c[4] / 1e6).toFixed(c[4] >= 1e7 ? 0 : 1) + ' M' : n0(c[4])}</td><td>${c[4] / c[3] < 10 ? (c[4] / c[3]).toFixed(1) : n0(c[4] / c[3])}</td></tr>`).join('') || '<tr><td colspan="7">No match.</td></tr>';
    $('#ctryN').textContent = `${rows.length} of ${COUNTRIES.length} countries`;
    $$('#ctryT th[data-k]').forEach(th => th.setAttribute('aria-sort', th.dataset.k === key ? (dir > 0 ? 'ascending' : 'descending') : 'none'));
  }
  $$('#ctryT th[data-k]').forEach(th => th.addEventListener('click', () => { if (key === th.dataset.k) dir *= -1; else { key = th.dataset.k; dir = key === 'name' || key === 'cont' || key === 'cap' ? 1 : -1; } render(); }));
  q.addEventListener('input', render); cont.addEventListener('change', render);
  render();
  const A = $('#cmpA'), B = $('#cmpB'), out = $('#cmpOut'), names = [...COUNTRIES].sort((a, b) => a[0].localeCompare(b[0]));
  A.innerHTML = B.innerHTML = names.map(c => `<option>${esc(c[0])}</option>`).join('');
  A.value = 'Nigeria'; B.value = 'United Kingdom';
  const ratio = (a, b) => { const r = a / b; return r >= 1 ? `${r >= 10 ? Math.round(r) : r.toFixed(1)}× larger` : `${(1 / r) >= 10 ? Math.round(1 / r) : (1 / r).toFixed(1)}× smaller`; };
  function cmp() {
    const a = COUNTRIES.find(c => c[0] === A.value), b = COUNTRIES.find(c => c[0] === B.value);
    const f = c => c[4] >= 1e6 ? (c[4] / 1e6).toFixed(1) + ' M' : n0(c[4]);
    out.innerHTML = `<div class="cmpg"><b></b><b>${esc(a[0])}</b><b>${esc(b[0])}</b><span>Capital</span><i>${esc(a[2])}</i><i>${esc(b[2])}</i><span>Area (km²)</span><i>${n0(a[3])}</i><i>${n0(b[3])}</i><span>Population</span><i>${f(a)}</i><i>${f(b)}</i><span>People per km²</span><i>${(a[4] / a[3]).toFixed(1)}</i><i>${(b[4] / b[3]).toFixed(1)}</i></div><p class="note">${esc(a[0])} is ${ratio(a[3], b[3])} than ${esc(b[0])} by area and ${ratio(a[4], b[4])} by population.</p>`;
  }
  A.addEventListener('change', cmp); B.addEventListener('change', cmp); cmp();
}

/* ------------------------------------------------------------ records */
function records() {
  const tabs = $('#recTabs'), box = $('#recBody'), keys = Object.keys(RECORDS);
  let cur = keys[0];
  function show(k) {
    cur = k; const R = RECORDS[k];
    tabs.innerHTML = keys.map(x => `<button class="chip${x === k ? ' on' : ''}" data-k="${x}">${x}</button>`).join('');
    if (R.list) { box.innerHTML = `<p class="note">${R.blurb}</p><div class="evs">${R.list.map(([n, y, d]) => `<div><b>${esc(n)}</b><span>${esc(y)}</span><p>${esc(d)}</p></div>`).join('')}</div>`; return; }
    const max = Math.max(...R.rows.map(r => r[1]));
    box.innerHTML = `<p class="note">${R.blurb}</p><div class="rbars">${R.rows.map(([n, v, note], i) => `<div class="rbar"><span>${i + 1}. ${esc(n)}<small>${esc(note)}</small></span><i style="--w:${(v / max * 100).toFixed(1)}%"></i><b>${v >= 1000 ? n0(v) : v} ${R.unit}</b></div>`).join('')}</div>`;
    requestAnimationFrame(() => box.querySelector('.rbars').classList.add('in'));
  }
  tabs.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) show(b.dataset.k); });
  show(cur);
}

/* ------------------------------------------------------------ plates, biomes, glossary */
function plates() {
  const max = Math.max(...PLATES.map(p => p[1]));
  $('#plateList').innerHTML = PLATES.map(([n, a, s, d]) => `<div class="pl"><b>${n}</b><i style="--w:${(a / max * 100).toFixed(0)}%"></i><span>${a} M km² · moves ${s} cm/year</span><p>${d}</p></div>`).join('');
  $('#bounds').innerHTML = BOUNDARIES.map(([n, d, e]) => `<div><b>${n}</b><p>${d}</p><small>${e}</small></div>`).join('');
}
function biomes() {
  $('#biomeList').innerHTML = BIOMES.map(([n, t, p, c, d]) => `<div style="--c:${c}"><b>${n}</b><dl><dt>Temperature</dt><dd>${t}</dd><dt>Rainfall</dt><dd>${p}</dd></dl><p>${d}</p></div>`).join('');
}
function glossary() {
  const list = $('#gloss'), q = $('#glossQ');
  function render() { const t = q.value.toLowerCase().trim(); const r = GLOSSARY.filter(([a, b]) => !t || (a + ' ' + b).toLowerCase().includes(t)); list.innerHTML = r.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('') || '<p>No match.</p>'; $('#glossN').textContent = `${r.length} terms`; }
  q.addEventListener('input', render); render();
}

/* ------------------------------------------------------------ solar system */
function system() {
  $('#sysBody').innerHTML = PLANETS.map(p => `<tr><th scope="row"><i style="background:${p[7]}"></i>${p[0]}</th><td>${n0(p[1])} km</td><td>${p[2]} m/s²</td><td>${p[3]}</td><td>${p[4]}</td><td>${p[5]} °C</td><td>${p[6]} AU</td></tr>`).join('');
  const cv = $('#sizes'), g = cv.getContext('2d'), W = cv.width, H = cv.height, scale = 66 / 69911;
  g.clearRect(0, 0, W, H); let x = 18; g.font = '11px "DM Mono", monospace'; g.textAlign = 'center';
  PLANETS.slice().sort((a, b) => b[1] - a[1]).forEach(p => {
    const r = Math.max(2, p[1] * scale), lw = g.measureText(p[0]).width, half = Math.max(r, lw / 2); x += half;
    g.fillStyle = p[7]; g.beginPath(); g.arc(x, H / 2 - 8, r, 0, 7); g.fill();
    if (p[0] === 'Earth') { g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.beginPath(); g.arc(x, H / 2 - 8, r + 4, 0, 7); g.stroke(); }
    g.fillStyle = '#8a9bb8'; g.fillText(p[0], x, H - 12); x += half + 14;
  });
  const out = $('#wout'), inp = $('#wkg');
  function calc() {
    const kg = Math.max(0, Math.min(500, +inp.value || 0));
    const max = Math.max(...GRAVITY_BODIES.map(b => b[1]));
    out.innerHTML = GRAVITY_BODIES.map(([n, g2]) => `<div class="rbar"><span>${n}</span><i style="--w:${(g2 / max * 100).toFixed(1)}%"></i><b>${(kg * g2 / 9.81).toFixed(1)} kg</b></div>`).join('');
    requestAnimationFrame(() => out.classList.add('in'));
  }
  inp.addEventListener('input', calc); calc();
}

/* ------------------------------------------------------------ clocks */
function clocks() {
  const box = $('#clockList');
  box.innerHTML = CLOCKS.map(([n]) => `<div class="clk"><small></small><b></b><span></span><em></em></div>`).join('');
  const cells = $$('.clk', box);
  function tick() {
    const now = new Date();
    CLOCKS.forEach(([n, tz], i) => {
      try {
        const t = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(now);
        const d = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short' }).format(now);
        let off = 'UTC';
        const part = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(now).find(p => p.type === 'timeZoneName');
        if (part) off = part.value.replace('GMT', 'UTC');
        const h = +t.slice(0, 2), day = h >= 6 && h < 18;
        const c = cells[i]; c.className = 'clk ' + (day ? 'day' : 'night');
        c.children[0].textContent = n; c.children[1].textContent = t; c.children[2].textContent = d; c.children[3].textContent = `${off} · ${day ? 'daytime' : 'night'}`;
      } catch { cells[i].children[0].textContent = n + ' (unavailable)'; }
    });
  }
  tick(); setInterval(tick, 1000);
}

/* ------------------------------------------------------------ deep time */
function timeline() {
  const DAY = 24 * 3600, fmt = s => { s = Math.min(DAY - 0.01, s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = Math.floor(s % 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}`; };
  const age = a => a >= 1000 ? (a / 1000).toFixed(2).replace(/\.?0+$/, '') + ' billion years ago' : a >= 1 ? a + ' million years ago' : Math.round(a * 1e6).toLocaleString('en-US') + ' years ago';
  $('#timeline').innerHTML = TIMELINE.map(([a, d]) => { const s = (1 - a / 4540) * DAY; return `<div class="ev" style="--p:${(s / DAY * 100).toFixed(2)}%"><b>${fmt(s)}</b><span>${age(a)}</span><p>${d}</p></div>`; }).join('');
}

/* ------------------------------------------------------------ atmosphere */
function atmosphere() {
  const slider = $('#alt'), bar = $('#atmBar'), top = Math.log10(10001), pos = a => Math.log10(a + 1) / top * 100;
  bar.innerHTML = ATM_LAYERS.map(([n, a, b, c]) => `<i style="left:${pos(a)}%;width:${pos(b) - pos(a)}%;background:${c}" title="${n}"><span>${n}</span></i>`).join('') + '<u id="altMark"></u>';
  const interp = (alt, col) => {
    for (let i = 1; i < ATM_TABLE.length; i++) {
      const A = ATM_TABLE[i - 1], B = ATM_TABLE[i];
      if (alt <= B[0]) { const f = (alt - A[0]) / (B[0] - A[0] || 1); return col === 1 ? A[1] + (B[1] - A[1]) * f : Math.exp(Math.log(A[2]) + (Math.log(B[2]) - Math.log(A[2])) * f); }
    }
    return null;
  };
  function draw() {
    const alt = Math.max(0, Math.round((Math.pow(10, +slider.value / 25) - 1) * 10) / 10);
    $('#altMark').style.left = pos(alt) + '%';
    const L = ATM_LAYERS.find(l => alt < l[2]) || ATM_LAYERS[4];
    const t = interp(alt, 1), p = interp(alt, 2);
    const below = [...ALT_LANDMARKS].reverse().find(l => l[0] <= alt), above = ALT_LANDMARKS.find(l => l[0] > alt);
    $('#altv').textContent = alt < 100 ? alt.toFixed(1) + ' km' : n0(alt) + ' km';
    $('#altInfo').innerHTML = `<b style="color:${L[3]}">${L[0]}</b><p>${L[4]}</p><dl>
      <dt>Temperature</dt><dd>${t === null ? (alt < 600 ? 'rises sharply, roughly 700–1,500 °C depending on the Sun (the air is too thin to feel hot)' : 'not meaningful in near-vacuum') : Math.round(t) + ' °C'}</dd>
      <dt>Air pressure</dt><dd>${p === null ? 'near vacuum' : (p >= 10 ? p.toFixed(0) : p >= 1 ? p.toFixed(1) : p.toPrecision(2)) + ' hPa' + (p < 1013 ? ` (${(p / 1013.25 * 100).toPrecision(2)}% of sea level)` : '')}</dd>
      <dt>Nearest below</dt><dd>${below ? below[1] + ' (' + (below[0] >= 100 ? n0(below[0]) : below[0]) + ' km)' : '—'}</dd>
      <dt>Nearest above</dt><dd>${above ? above[1] + ' (' + n0(above[0]) + ' km)' : '—'}</dd></dl>`;
  }
  slider.addEventListener('input', draw); draw();
}

/* ------------------------------------------------------------ quiz */
function quiz() {
  const box = $('#quizBox'), ROUND = 8;
  let set = [], i = 0, score = 0, streak = 0, best = 0;
  function start() { set = shuffle(QUIZ).slice(0, ROUND).map(([q, a, w, why]) => ({ q, opts: shuffle([a, ...w]), a, why })); i = 0; score = 0; streak = 0; best = 0; render(); }
  function render() {
    if (i >= set.length) {
      box.innerHTML = `<div class="final"><b>${score} / ${set.length}</b><p>${score === set.length ? 'Perfect. You could draw the atlas yourself.' : score >= 6 ? 'Strong geography.' : score >= 4 ? 'Solid. A few more probes of the globe and you will have it.' : 'Scroll up, explore the globe and the numbers, then try again.'} Best streak: ${best}.</p><button id="again">New round (${QUIZ.length} questions in the pool)</button></div>`;
      $('#again').onclick = start; return;
    }
    const Q = set[i];
    box.innerHTML = `<div class="top"><span>Question ${i + 1} of ${set.length}</span><span>Score ${score}${streak > 1 ? ' · streak ' + streak : ''}</span></div><div class="q">${esc(Q.q)}</div><div class="opts">${Q.opts.map((o, j) => `<button data-j="${j}">${esc(o)}</button>`).join('')}</div><div class="fb"></div>`;
    const btns = $$('.opts button', box);
    btns.forEach(b => b.onclick = () => {
      btns.forEach(x => { x.disabled = true; if (Q.opts[+x.dataset.j] === Q.a) x.classList.add('ok'); });
      if (Q.opts[+b.dataset.j] === Q.a) { score++; streak++; best = Math.max(best, streak); } else { b.classList.add('no'); streak = 0; }
      $('.fb', box).innerHTML = `${esc(Q.why)} <button id="next" style="margin-top:10px;width:auto">${i === set.length - 1 ? 'See score' : 'Next question'}</button>`;
      $('#next').onclick = () => { i++; render(); };
    });
  }
  start();
}

export function initExtras({ sunState }) {
  toc(); countries(); records(); plates(); biomes(); glossary(); system(); clocks(); timeline(); atmosphere(); quiz();
  $$('.rbars, .pl, .evs').forEach(reveal);
  const redraw = dayChart(sunState);
  return { onSun: redraw };
}
