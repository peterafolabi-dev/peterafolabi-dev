import './style.css';
import { engine, DRUMS, mtof } from './audio.js';
import { RHYTHMS, toState, emptyState } from './rhythms.js';
import { SCALES, SCALE_FEEL, CHORDS, PROGRESSIONS, NOTES, noteName, diatonicChord, INTERVALS, INTERVAL_SONGS } from './theory.js';
import { initViz, MODES } from './viz.js';
import { initPads } from './pads.js';
import { cover, hueOf, UNSPLASH } from './cover.js';
import gsap from 'gsap';
import { LESSONS } from './lessons.js';

const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app'), vz = initViz($('#bg')), viz = { ...vz, setHome: h => vz.setLayout(h ? 'home' : 'bg') };
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEY = 'sonara.v1';
let S = load() || toState(RHYTHMS[0]); S.progIdx = S.progIdx ?? 0;
let fx = { cutoff: 12000, delay: 0.15, reverb: 0.2, volume: 0.8 };
function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
function resolve(X) {
  const scale = SCALES[X.scaleName] || SCALES['Minor pentatonic'];
  const prog = PROGRESSIONS[X.progIdx ?? 0] || PROGRESSIONS[0];
  const list = prog[1].map(d => diatonicChord(0, SCALES[prog[3] === 'minor' ? 'Natural minor' : 'Major'], d));
  return { ...X, scale, chords: { on: X.chords.on, list } };
}
const cur = () => resolve(S);
/* song mode */
let song = (() => { try { return JSON.parse(localStorage.getItem('sonara.song')) || []; } catch { return []; } })();
let songPos = null, songLoop = true;
const saveSong = () => { try { localStorage.setItem('sonara.song', JSON.stringify(song)); } catch {} };
function songState(step) {
  if (!song.length) return cur();
  if (songPos.last === -1 || (step === 0 && songPos.last !== 0 && songPos.started)) {
    if (songPos.started) { songPos.bar++; if (songPos.bar >= song[songPos.i].bars) { songPos.bar = 0; songPos.i++; if (songPos.i >= song.length) { if (songLoop) songPos.i = 0; else { songPos.done = true; songPos.i = 0; } } } }
  }
  songPos.started = true; songPos.last = step;
  const it = song[songPos.i]; setTimeout(() => emitSong(), 0); return resolve(it.pat);
}
let emitSong = () => { $$('.sg').forEach(e => e.classList.toggle('now', songPos && +e.dataset.i === songPos.i)); if (songPos && songPos.done) { songStop(); } };
function songPlay() { if (!song.length) return; engine.stop(); songPos = { i: 0, bar: 0, last: -1, started: false, done: false }; engine.start(songState); applyFx(); }
function songStop() { engine.stop(); songPos = null; $$('.sg').forEach(e => e.classList.remove('now')); const b = $('#songBtn'); if (b) b.textContent = '▶ Play song'; }
const ctxTime = () => { engine.init(); return engine.ctx.currentTime; };
function applyFx() { engine.init(); engine.setFx(fx); }
function toggle() { songPos = null; if (engine.playing) engine.stop(); else { engine.start(cur); applyFx(); } }
function playRhythm(r) { S = { ...toState(r), progIdx: S.progIdx, chords: { on: false, list: [] } }; save(); songPos = null; engine.stop(); engine.start(cur); applyFx(); pushRecent(r.id); updatePlayer(); }
function note(midi, kind = 'pluck') {
  const t = ctxTime() + 0.005; applyFx();
  if (kind === 'kalimba') engine.kalimba(t, midi); else if (kind === 'bass') engine.bass(t, midi - 12, 0.6); else if (kind === 'chord') engine.chord(t, [midi, midi + 4, midi + 7], 1.2); else engine.lead(t, midi, 0.7, 1, kind);
}

/* ---------- chrome: nav, player, now-playing ---------- */
const ICON = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>', studio: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 9v6M12 7v10M16 11v2"/>', rhythms: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
  arranger: '<path d="M4 6h10M4 12h16M4 18h12"/><circle cx="18" cy="6" r="2"/><circle cx="20" cy="18" r="2"/>', learn: '<path d="M3 8l9-4 9 4-9 4zM7 10v5c3 2 7 2 10 0v-5"/>', theory: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>', lab: '<path d="M10 3h4M11 3v6l-6 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-6-10V3"/>', about: '<circle cx="12" cy="12" r="9"/><path d="M12 8v.5M12 11v5"/>',
};
const NAV = [['', 'Home', 'home'], ['studio', 'Studio', 'studio'], ['rhythms', 'Rhythms', 'rhythms'], ['arranger', 'Arranger', 'arranger'], ['learn', 'Learn', 'learn'], ['theory', 'Theory', 'theory'], ['lab', 'Sound lab', 'lab'], ['about', 'About', 'about']];
$('#nav').innerHTML = NAV.map(([h, l, i]) => `<a href="#/${h}"><svg viewBox="0 0 24 24">${ICON[i]}</svg><span>${l}</span></a>`).join('');
$('#tabs').innerHTML = NAV.filter(n => n[0] !== 'about').map(([h, l, i]) => `<a href="#/${h}"><svg viewBox="0 0 24 24">${ICON[i]}</svg><span>${l}</span></a>`).join('');
const PLAY_SVG = '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>', PAUSE_SVG = '<svg viewBox="0 0 24 24"><path d="M8 4v16M16 4v16" stroke-width="5"/></svg>';
const recents = () => { try { return JSON.parse(localStorage.getItem('sonara.recent')) || []; } catch { return []; } };
function pushRecent(id) { try { const r = [id, ...recents().filter(x => x !== id)].slice(0, 6); localStorage.setItem('sonara.recent', JSON.stringify(r)); } catch {} drawLib(); }
const curMeta = () => RHYTHMS.find(r => r.id === S.id);
function applyTheme() { const h = hueOf(S.id || 'new'); document.documentElement.style.setProperty('--h', h); vz.setHue(h); }
function drawLib() {
  const items = recents().map(id => RHYTHMS.find(r => r.id === id)).filter(Boolean);
  $('#lib').innerHTML = (song.length ? `<button data-go="arranger"><span class="t" style="display:grid;place-items:center;background:var(--card2)">♫</span><span><b>Your song</b><small>${song.length} section${song.length > 1 ? 's' : ''}</small></span></button>` : '') + items.map(r => `<button data-play="${r.id}"><span class="t">${cover(r.id, '', { noText: true })}</span><span><b>${r.name}</b><small>${r.region}</small></span></button>`).join('') || '<div class="meta" style="padding:6px 12px">Play a rhythm and it shows up here.</div>';
  $$('#lib [data-play]').forEach(b => b.onclick = () => playRhythm(RHYTHMS.find(r => r.id === b.dataset.play)));
  $$('#lib [data-go]').forEach(b => b.onclick = () => { location.hash = '#/' + b.dataset.go; });
}
function updatePlayer() {
  const m = curMeta(), name = songPos && song[songPos.i] ? song[songPos.i].name : S.name;
  $('#pTitle').textContent = name || 'Pick a groove'; $('#pSub').textContent = m ? `${m.region} · ${S.bpm} BPM` : `Custom pattern · ${S.bpm} BPM`;
  $('#pCov').innerHTML = cover(S.id || 'new', S.name, { noText: true });
  $('#pDots').innerHTML = Array.from({ length: S.length }, (_, i) => `<i class="${i % 4 === 0 ? 'q' : ''}"></i>`).join('');
  $('#npCov').innerHTML = cover(S.id || 'new', S.name); $('#npT').textContent = S.name; $('#npS').textContent = m ? `${m.region} · ${m.tag}` : 'Your own pattern';
  $('#npD').textContent = m ? m.blurb : 'Built in the studio. Open it there to keep editing.'; $('#npBpm').value = S.bpm; $('#npBpmV').textContent = S.bpm + ' BPM';
  $('#lanes').innerHTML = [...S.tracks.map(t => ({ n: DRUMS.find(d => d.id === t.id).name, c: DRUMS.find(d => d.id === t.id).color, s: t.steps.map(v => v ? 1 : 0) })), { n: 'Bass', c: '#ff6a3d', s: S.bass.steps.map(v => v != null ? 1 : 0) }, { n: 'Lead', c: '#8a7bff', s: S.lead.steps.map(v => v != null ? 1 : 0) }].filter(l => l.s.some(Boolean)).map(l => `<div class="ln"><span>${l.n}</span><div class="lc" style="grid-template-columns:repeat(${S.length},1fr);--c:${l.c}">${l.s.map(v => `<i class="${v ? 'on' : ''}"></i>`).join('')}</div></div>`).join('');
  applyTheme(); updatePlayState();
}
function updatePlayState() {
  const on = engine.playing;
  for (const b of [$('#mini'), $('#npPlay')]) { b.innerHTML = on ? PAUSE_SVG : PLAY_SVG; b.classList.toggle('on', on); b.setAttribute('aria-label', on ? 'Stop' : 'Play'); }
  $('#np').classList.toggle('play', on); const pb = $('#playBtn'); if (pb) { pb.textContent = on ? '■ Stop' : '▶ Play'; pb.classList.toggle('on', on); }
  $$('.alb').forEach(a => a.classList.toggle('playing', on && a.dataset.id === S.id));
  if (!on) { $$('.st.play,.pdots i.now,.lc i.now').forEach(e => e.classList.remove('now', 'play')); $('#pProg i').style.width = '0'; }
}
engine.on(i => {
  updatePlayState();
  if (i != null && engine.playing) {
    $$('.st.play,.pdots i.now,.lc i.now').forEach(e => e.classList.remove('now', 'play'));
    $$(`.st[data-i="${i}"]`).forEach(e => e.classList.add('play'));
    const d = $$('#pDots i')[i]; if (d) d.classList.add('now'); $$('.lc').forEach(l => { const c = l.children[i]; if (c) c.classList.add('now'); });
    $('#pProg i').style.width = ((i + 1) / S.length * 100) + '%';
  }
});
$('#mini').onclick = () => { if (songPos) songStop(); else toggle(); updatePlayState(); }; $('#npPlay').onclick = $('#mini').onclick;
const stepRhythm = d => { const i = RHYTHMS.findIndex(r => r.id === S.id), n = RHYTHMS.length; playRhythm(RHYTHMS[((i < 0 ? 0 : i + d) + n) % n]); };
$('#pNext').onclick = () => stepRhythm(1); $('#pPrev').onclick = () => stepRhythm(-1);
$('#pVol').oninput = e => { fx.volume = +e.target.value; applyFx(); };
const openNP = o => { $('#np').classList.toggle('open', o); document.body.classList.toggle('npopen', o); $('#np').setAttribute('aria-hidden', !o); vz.setLayout(o ? 'np' : (/^#\/?$/.test(location.hash) || !location.hash ? 'home' : 'bg')); document.body.style.overflow = o ? 'hidden' : ''; };
$('#pOpen').onclick = () => openNP(true); $('#pExp').onclick = () => openNP(true); $('#npX').onclick = () => openNP(false);
addEventListener('keydown', e => { if (e.key === 'Escape') openNP(false); });
$('#npBpm').oninput = e => { S.bpm = +e.target.value; $('#npBpmV').textContent = S.bpm + ' BPM'; save(); const b = $('#bpm'); if (b) b.value = S.bpm; $('#pSub').textContent = $('#pSub').textContent.replace(/\d+ BPM/, S.bpm + ' BPM'); };
$('#npModes').innerHTML = MODES.map((m, i) => `<button class="chip${i ? '' : ' on'}" data-vm="${m}">${m}</button>`).join('');
$$('#npModes .chip').forEach(c => c.onclick = () => { $$('#npModes .chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); vz.setMode(c.dataset.vm); });
/* equaliser bars driven by the analyser */
const eqs = [...$$('#sideeq i'), ...$$('#peq i')];
(function eqLoop() { requestAnimationFrame(eqLoop); const lv = engine.levels(); const play = engine.playing && lv; eqs.forEach((el, k) => { const n = el.parentElement.children.length, idx = k % n; const v = play ? lv[2 + idx * 5] / 255 : 0.05 + 0.04 * Math.sin(performance.now() / 600 + idx); el.style.height = Math.max(6, v * 100) + '%'; }); })();
/* delegated: ripple on buttons, 3D tilt on cards */
document.addEventListener('pointerdown', e => { const b = e.target.closest('.btn'); if (!b) return; const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement('span'); s.className = 'rip'; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`; b.appendChild(s); setTimeout(() => s.remove(), 650); });
document.addEventListener('pointermove', e => { if (REDUCE || e.pointerType === 'touch') return; const c = e.target.closest('.alb,.tile,.npcov'); $$('.tilt').forEach(x => { if (x !== c) { x.style.transform = ''; x.classList.remove('tilt'); } }); if (!c) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.classList.add('tilt'); c.style.transform = `perspective(700px) rotateX(${-y * 9}deg) rotateY(${x * 11}deg) translateZ(6px)`; });
document.addEventListener('pointerleave', () => $$('.tilt').forEach(x => { x.style.transform = ''; }), true);
function albums(list) { return list.map(r => `<button class="alb" data-id="${r.id}" aria-label="Play ${r.name}"><div class="art">${cover(r.id, r.name)}<span class="pl">${PLAY_SVG}</span></div><b>${r.name}</b><small>${r.region} · ${r.bpm} BPM</small></button>`).join(''); }
function bindAlbums(root = app) { $$('.alb[data-id],.qk[data-id]', root).forEach(a => a.onclick = () => { const r = RHYTHMS.find(x => x.id === a.dataset.id); if (S.id === r.id && engine.playing && !songPos) { engine.stop(); updatePlayState(); } else playRhythm(r); }); }


/* ---------- piano helper ---------- */
function piano(root, notes, id, startMidi = 60, keys = 14) {
  const set = new Set(notes.map(n => ((n % 12) + 12) % 12)), W = [0, 2, 4, 5, 7, 9, 11]; let html = '', blk = '';
  for (let k = 0; k < keys; k++) {
    const m = startMidi + 12 * Math.floor(k / 7) + W[k % 7], inn = set.has(m % 12);
    html += `<div class="wk${inn ? ' in' : ''}" data-m="${m}">${inn ? noteName(m) : ''}</div>`;
    if ([0, 1, 3, 4, 5].includes(k % 7) && k < keys - 1) { const bm = m + 1; blk += `<div class="bk${set.has(bm % 12) ? ' in' : ''}" data-m="${bm}" style="left:calc(${(k + 1) / keys * 100}% - 2.6%)"></div>`; }
  }
  return `<div class="piano" id="${id}">${html}${blk}</div>`;
}
function bindPiano(id, kind) { $$(`#${id} [data-m]`).forEach(e => e.addEventListener('pointerdown', ev => { ev.preventDefault(); note(+e.dataset.m, typeof kind === 'function' ? kind() : kind); e.classList.add('act'); setTimeout(() => e.classList.remove('act'), 160); })); }
const opts = (arr, sel) => arr.map(([v, l]) => `<option value="${v}"${v == sel ? ' selected' : ''}>${l}</option>`).join('');
const rootOpts = sel => opts(NOTES.map((n, i) => [i, n]), sel);

const STORY_ROWS = { kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', shaker: 'xxxxxxxxxxxxxxxx', conga: '..x..x..x..x..x.', bell: 'x..x..x.x..x..x.' };
const STORY = [['The pulse', 'A kick on every beat tells your body where "one" is.', 0, ['kick']], ['The backbeat', 'A snare on two and four gives the groove its lean.', 1, ['kick', 'snare']], ['The shimmer', 'Hats and shakers fill the gaps and make it feel alive.', 2, ['kick', 'snare', 'hat', 'shaker']], ['The colour', 'Congas, a bell and a bass line turn a pattern into a style.', 3, ['kick', 'snare', 'hat', 'shaker', 'conga', 'bell']]];
const FAQ = [['Is any of this recorded audio?', 'No. Every sound is built live from oscillators, filtered noise and effects using the Web Audio API. The site ships zero audio files.'], ['Can I save or share what I make?', 'Yes. Share links carry the whole pattern in the URL, and you can record a WebM take from the studio.'], ['Does it work on my phone?', 'Yes. The layout switches to a bottom tab bar and the pads and piano respond to touch.'], ['Where do the rhythms come from?', 'They are hand-written patterns inspired by real traditions, from Afrobeat and Juju to Samba and Techno.']];
/* ---------- pages ---------- */
let padsOff = null;
const pages = {
  home() {
    viz.setHome(true);
    const africa = /Nigeria|Ghana|South Africa|Congo|Cameroon|Angola|Ivoire|Pan-African|West Africa/, pick = RHYTHMS.find(r => r.id === (curMeta() ? S.id : 'afrobeat')) || RHYTHMS[0];
    const by = f => RHYTHMS.filter(f);
    const shelf = (t, sub, list) => `<section class="shelf rv"><div class="shh"><h2>${t}</h2><span class="meta">${sub}</span></div><div class="row2">${albums(list)}</div></section>`;
    const hr = new Date().getHours(), greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    app.innerHTML = `<section class="hero2"><div class="txt"><span class="tag">${greet}, a music studio made of code</span><h1>Make music from <span>nothing.</span></h1>
<p class="lead">Every drum, bass note and melody is synthesised live in your browser. No samples, no downloads. Play ${RHYTHMS.length} rhythms, rebuild them, record them.</p>
<div class="btns"><button class="btn" id="hp">${PLAY_SVG.replace('<svg', '<svg width="18" height="18" fill="#111" stroke="#111"')} Play something</button><a class="btn ghost" href="#/studio">Open the studio</a><a class="btn ghost" href="#/arranger">Build a song</a></div>
<div class="hstats"><div><b data-count="${RHYTHMS.length}">0</b><span>rhythms</span></div><div><b data-count="${DRUMS.length + 7}">0</b><span>instruments</span></div><div><b data-count="${Object.keys(SCALES).length}">0</b><span>scales</span></div><div><b data-count="0">0</b><span>audio files</span></div></div></div>
<div class="machine"><div id="padbox"></div><div class="mhint"><i></i>Drag to spin · tap the pads to play</div></div></section>
<h2 style="margin-top:10px">Quick picks</h2><div class="quick rv">${RHYTHMS.slice(0, 8).map(r => `<button class="qk" data-id="${r.id}"><span class="t">${cover(r.id, '', { noText: true })}</span>${r.name}<span class="pl">${PLAY_SVG}</span></button>`).join('')}</div>
${shelf('Made in Africa', 'West, Central and Southern Africa', by(r => africa.test(r.region)))}
${shelf('Dance floor', 'House, techno and club', by(r => /Dance|House/.test(r.tag)))}
${shelf('Hip-hop and chill', 'Slow, swung and dusty', by(r => /Hip-hop|Chill/.test(r.tag)))}
${shelf('Latin and Caribbean', 'Clave, dembow, one drop', by(r => /Latin|Jamaica|Puerto|Brazil|Colombia|Dominican|Cuba/.test(r.region + r.tag)))}
${shelf('Rolling 12/8', 'Every beat splits into three', by(r => r.div === 3))}
<section class="shelf rv"><div class="shh"><h2>Jump in</h2></div><div class="tiles">${[['studio', 'Studio', 'Edit every step, shape the sound and record.', 14], ['arranger', 'Arranger', 'Chain patterns into a full song.', 170], ['learn', 'Learn', 'Ten short lessons with live examples.', 260], ['theory', 'Theory', 'Scales, chords and an ear trainer.', 320], ['lab', 'Sound lab', 'Play nine voices and drum pads.', 60]].map(([h, t, d, x]) => `<a class="tile" href="#/${h}" style="--x:${x}"><h3>${t}</h3><p>${d}</p><svg viewBox="0 0 24 24">${ICON[h]}</svg></a>`).join('')}</div></section>
<section class="story rv"><div class="shh"><h2>How a beat is built</h2><span class="meta">Hear each layer arrive</span></div>
<div class="steps4">${STORY.map((t, i) => `<div class="sc" data-s="${i}"><span class="n">0${i + 1}</span><h3>${t[0]}</h3><p>${t[1]}</p><div class="mini">${t[3].map(k => `<div class="mr">${STORY_ROWS[k].split('').map(c => `<i class="${c === 'x' ? 'on' : ''}"></i>`).join('')}</div>`).join('')}</div><button class="btn ghost sp" data-s="${i}">Hear it</button></div>`).join('')}</div></section>
<div class="marq rv" aria-hidden="true"><div class="mt">${[...RHYTHMS, ...RHYTHMS].map(r => `<span>${r.name}</span>`).join('')}</div></div>
<section class="shelf rv faq"><div class="shh"><h2>Questions</h2></div>${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>
<section class="cta rv"><h2>Your turn.</h2><p>Pick a rhythm, break it apart, make it yours.</p><div class="btns"><a class="btn" href="#/studio">Open the studio</a><a class="btn ghost" href="#/rhythms">Browse ${RHYTHMS.length} rhythms</a></div></section>`;

    const pbox = $('#padbox'), PD = ['kick', 'snare', 'clap', 'hat', 'ohat', 'conga', 'shaker', 'bell'];
    if (padsOff) { padsOff(); padsOff = null; }
    const pads = pbox && initPads(pbox, { onHit: i => { if (i < 8) { applyFx(); engine.drum(PD[i], ctxTime() + .005, 1.15); } else { const sc = SCALES[S.scaleName] || SCALES['Natural minor'] || [0, 2, 3, 5, 7, 8, 10]; note(S.root + 60 + sc[(i - 8) % sc.length] + 12 * Math.floor((i - 8) / sc.length), 'kalimba'); } }, labels: i => i < 8 ? [DRUMS[i].name, 'drum pad'] : [noteName((S.root + 60 + (SCALES[S.scaleName] || [0, 2, 3, 5, 7, 8, 10])[(i - 8) % 7]) % 12), 'kalimba note'] });
    if (pads) {
      pads.setHue(hueOf(pick.id)); pads.idle(S.name || 'SONARA', 'tap the pads');
      const off = engine.on(i => { if (!pbox.isConnected) { off(); return; } if (i == null || !engine.playing) { pads.idle(S.name || 'SONARA', 'tap the pads'); return; } const L = S.length, set = []; S.tracks.forEach(t => { const k = PD.indexOf(t.id); if (k >= 0 && t.steps[i % L] && !t.mute) set.push(k); }); pads.setStep(i, set, S.name); });
      padsOff = () => { off(); pads.destroy(); };
    }
    $$('.sp').forEach(b => b.onclick = () => { const k = STORY[+b.dataset.s][3], dr = {}; DRUMS.forEach(d => dr[d.id] = k.includes(d.id) ? STORY_ROWS[d.id] : ''); const st = toState({ id: 'story', name: 'Build: ' + STORY[+b.dataset.s][0], bpm: 112, len: 16, div: 4, swing: 0, drums: dr, bass: +b.dataset.s === 3 ? '0 . . . . . 0 . 3 . . . 2 . . .' : '', lead: '', root: 0, scale: 'Natural minor' }); S = { ...st, progIdx: S.progIdx, chords: { on: false, list: [] } }; songPos = null; engine.stop(); engine.start(cur); applyFx(); updatePlayer(); updatePlayState(); });
    bindAlbums(); $('#hp').onclick = () => { if (engine.playing) { engine.stop(); updatePlayState(); } else playRhythm(RHYTHMS[Math.floor(Math.random() * RHYTHMS.length)]); };
    $$('[data-count]').forEach(el => { const to = +el.dataset.count; if (REDUCE || !to) { el.textContent = to; return; } const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.4, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); } }); });
    updatePlayState();
  },
  studio() {
    viz.setHome(false); updatePlayer(); const s = S;
    app.innerHTML = `<h2>Studio <span class="meta" id="sname">${s.name}</span></h2>
<div class="panel bar"><button class="btn" id="playBtn">▶ Play</button>
<label class="f">Tempo <input type="number" id="bpm" min="50" max="200" value="${s.bpm}" style="width:80px"></label>
<label class="f">Swing <input type="range" id="swing" min="0" max="0.5" step="0.01" value="${s.swing}"></label>
<label class="f">Key <select id="root">${rootOpts(s.root)}</select></label>
<label class="f">Scale <select id="scale">${opts(Object.keys(SCALES).map(k => [k, k]), s.scaleName)}</select></label>
<label class="f">Preset <select id="preset"><option value="">Choose…</option>${opts(RHYTHMS.map(r => [r.id, r.name]), '')}</select></label>
<label class="f">Lead <select id="lkind"><option value="pluck">Pluck</option><option value="soft">Soft</option><option value="organ">Organ</option><option value="square">Chip square</option><option value="bell">Bell</option><option value="pad">Pad</option></select></label>
<button class="btn ghost sm" id="clear">Clear</button><button class="btn ghost sm" id="rec">● Record</button><button class="btn ghost sm" id="share">Copy share link</button><button class="btn ghost sm" id="tap">Tap tempo</button><button class="btn ghost sm" id="addsong">+ Add to song</button></div>
<div class="panel"><div class="seq" id="seq"></div></div>
<div class="panel bar"><label class="f"><span><input type="checkbox" id="chon"> Chord pad</span><select id="prog">${opts(PROGRESSIONS.map((p, i) => [i, p[0]]), s.progIdx)}</select></label>
${[['cutoff', 'Filter', 400, 12000, 50], ['delay', 'Echo', 0, 0.6, 0.01], ['reverb', 'Reverb', 0, 0.8, 0.01], ['volume', 'Volume', 0, 1, 0.01]].map(([k, l, a, b, st]) => `<label class="f">${l}<input type="range" data-fx="${k}" min="${a}" max="${b}" step="${st}" value="${fx[k]}"></label>`).join('')}</div>
<p class="meta">Tip: click a drum step to cycle off → hit → accent. On bass and lead rows it cycles scale degrees. Keys <kbd>A</kbd>–<kbd>K</kbd> play the lead live.</p><div class="msg" id="msg"></div>`;
    renderSeq(); $('#chon').checked = s.chords.on; $('#lkind').value = s.lead.kind;
    $('#playBtn').onclick = toggle; $('#playBtn').textContent = engine.playing ? '■ Stop' : '▶ Play';
    $('#bpm').onchange = e => { S.bpm = Math.max(50, Math.min(200, +e.target.value || 100)); save(); };
    $('#swing').oninput = e => { S.swing = +e.target.value; save(); };
    $('#root').onchange = e => { S.root = +e.target.value; save(); };
    $('#scale').onchange = e => { S.scaleName = e.target.value; save(); };
    $('#lkind').onchange = e => { S.lead.kind = e.target.value; save(); };
    $('#chon').onchange = e => { S.chords.on = e.target.checked; save(); }; $('#prog').onchange = e => { S.progIdx = +e.target.value; save(); };
    $('#preset').onchange = e => { const r = RHYTHMS.find(x => x.id === e.target.value); if (r) { S = { ...toState(r), progIdx: S.progIdx, chords: { on: S.chords.on, list: [] } }; save(); pages.studio(); } };
    $('#clear').onclick = () => { const n = emptyState(); S = { ...n, bpm: S.bpm, root: S.root, scaleName: S.scaleName, progIdx: S.progIdx }; save(); pages.studio(); };
    $$('[data-fx]').forEach(e => e.oninput = () => { fx[e.dataset.fx] = +e.value; applyFx(); });
    $('#share').onclick = async () => { const u = location.origin + location.pathname + '#/studio?p=' + btoa(unescape(encodeURIComponent(JSON.stringify(S)))); try { await navigator.clipboard.writeText(u); $('#msg').textContent = 'Link copied. Anyone who opens it gets your pattern.'; } catch { prompt('Copy this link', u); } };
    let taps = []; $('#tap').onclick = () => { const n = performance.now(); taps = taps.filter(x => n - x < 2500); taps.push(n); if (taps.length > 1) { const iv = (taps[taps.length - 1] - taps[0]) / (taps.length - 1); S.bpm = Math.max(50, Math.min(200, Math.round(60000 / iv))); $('#bpm').value = S.bpm; save(); } };
    $('#addsong').onclick = () => { song.push({ name: S.name, bars: 2, pat: JSON.parse(JSON.stringify(S)) }); saveSong(); $('#msg').textContent = `Added "${S.name}" to your song (${song.length} section${song.length > 1 ? 's' : ''}). Open Arranger to edit.`; };
    let recording = false;
    $('#rec').onclick = async () => {
      if (!recording) { if (!engine.playing) toggle(); engine.record(); recording = true; $('#rec').textContent = '■ Stop & save'; $('#rec').classList.add('rec'); }
      else { const b = await engine.stopRecord(); recording = false; $('#rec').textContent = '● Record'; $('#rec').classList.remove('rec'); if (b) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `sonara-${S.id || 'loop'}.webm`; a.click(); $('#msg').textContent = 'Saved your recording as a .webm audio file.'; } }
    };
  },
  rhythms() {
    viz.setHome(false); let tag = 'All', q = qstr.toLowerCase();
    const tags = ['All', ...new Set(RHYTHMS.map(r => r.tag))];
    app.innerHTML = `<h2>Rhythms</h2><p class="lead">Simplified teaching versions of each style. They show the core feel, not a note-for-note copy of any record. Click a cover to play, then open it in the studio to take it apart.</p>
<div class="chips" id="tags">${tags.map(t => `<button class="chip${t === 'All' ? ' on' : ''}" data-t="${t}">${t}</button>`).join('')}</div><div class="grid4" id="rg" style="margin-top:16px"></div><p class="meta" id="rn" style="margin-top:12px"></p>`;
    const draw = () => { const list = RHYTHMS.filter(r => (tag === 'All' || r.tag === tag) && (!q || (r.name + r.region + r.tag + r.blurb).toLowerCase().includes(q))); $('#rg').innerHTML = list.map(r => `<div style="position:relative">${albums([r])}<button class="btn ghost sm" data-o="${r.id}" style="margin-top:6px;width:100%;justify-content:center">Open in studio</button></div>`).join('') || '<div class="card"><p>No rhythms match that search.</p></div>'; $('#rn').textContent = `${list.length} rhythm${list.length === 1 ? '' : 's'}`; bindAlbums(); updatePlayState();
      $$('[data-o]').forEach(b => b.onclick = () => { const r = RHYTHMS.find(x => x.id === b.dataset.o); S = { ...toState(r), progIdx: S.progIdx, chords: { on: false, list: [] } }; save(); pushRecent(r.id); location.hash = '#/studio'; }); };
    draw(); $$('#tags .chip').forEach(c => c.onclick = () => { $$('#tags .chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); tag = c.dataset.t; draw(); });
    window.__rq = v => { q = v.toLowerCase(); draw(); };
  },
  theory() {
    viz.setHome(false); let root = 0, sc = 'Major', ch = 'Major', cr = 0, pr = 0, pk = 0;
    app.innerHTML = `<h2>Theory</h2><p class="lead">Press the notes. Learn by hearing.</p>
<div class="panel"><h3>Scale explorer</h3><div class="bar" style="margin:10px 0"><label class="f">Root <select id="sr">${rootOpts(0)}</select></label><label class="f">Scale <select id="ss">${opts(Object.keys(SCALES).map(k => [k, k]), sc)}</select></label><button class="btn sm" id="sp">▶ Play scale</button></div><div id="sx"></div></div>
<div class="panel"><h3>Chord builder</h3><div class="bar" style="margin:10px 0"><label class="f">Root <select id="cr">${rootOpts(0)}</select></label><label class="f">Type <select id="ct">${opts(Object.keys(CHORDS).map(k => [k, k]), ch)}</select></label><button class="btn sm" id="cp">▶ Play chord</button><button class="btn ghost sm" id="ca">Arpeggio</button></div><div id="cx"></div></div>
<div class="panel"><h3>Progressions</h3><p class="meta">Played with the Studio's root key, as diatonic chords.</p><div class="grid" id="pg" style="margin-top:10px"></div></div>
<div class="panel"><h3>Ear trainer: name the interval</h3><div class="quiz-q" id="eq">Press Start.</div><div class="chips" id="eo"></div><div class="msg" id="em"></div><div class="btns"><button class="btn sm" id="es">Start / next</button><button class="btn ghost sm" id="er">Hear again</button><span class="meta" id="esc" style="align-self:center">Score 0 / 0</span></div></div>`;
    const drawScale = () => { const iv = SCALES[sc], notes = iv.map(i => root + i); $('#sx').innerHTML = piano(root, notes, 'sp1', 60, 14) + `<div class="chips">${iv.map(i => `<span class="chip on">${noteName(root + i)}</span>`).join('')}</div><p class="meta" style="margin-top:8px">${SCALE_FEEL[sc]} Steps from the root: ${iv.join(' · ')} semitones.</p>`; bindPiano('sp1', 'pluck'); };
    const drawChord = () => { const iv = CHORDS[ch], notes = iv.map(i => cr + i); $('#cx').innerHTML = piano(cr, notes, 'cp1', 60, 14) + `<p class="meta">${noteName(cr)} ${ch}: ${iv.map(i => noteName(cr + i)).join(' – ')}</p>`; bindPiano('cp1', 'pluck'); };
    $('#sr').onchange = e => { root = +e.target.value; drawScale(); }; $('#ss').onchange = e => { sc = e.target.value; drawScale(); };
    $('#sp').onclick = () => { const t = ctxTime() + .05; applyFx(); [...SCALES[sc], 12].forEach((i, k) => engine.lead(t + k * 0.28, 60 + root + i, 0.4)); };
    $('#cr').onchange = e => { cr = +e.target.value; drawChord(); }; $('#ct').onchange = e => { ch = e.target.value; drawChord(); };
    $('#cp').onclick = () => { applyFx(); engine.chord(ctxTime() + .03, CHORDS[ch].map(i => 60 + cr + i), 1.4); };
    $('#ca').onclick = () => { const t = ctxTime() + .05; applyFx(); CHORDS[ch].forEach((i, k) => engine.lead(t + k * .22, 60 + cr + i, .5)); };
    $('#pg').innerHTML = PROGRESSIONS.map((p, i) => `<div class="card"><h3>${p[0]}</h3><p>${p[2]}</p><button class="btn sm" data-pp="${i}">▶ Play</button></div>`).join('');
    $$('[data-pp]').forEach(b => b.onclick = () => { const p = PROGRESSIONS[+b.dataset.pp], sca = SCALES[p[3] === 'minor' ? 'Natural minor' : 'Major'], t = ctxTime() + .05; applyFx(); p[1].forEach((d, k) => engine.chord(t + k * 1.1, diatonicChord(0, sca, d).map(n => S.root + 55 + n), 1.0)); });
    drawScale(); drawChord();
    let score = 0, tot = 0, ans = null, a = 0, b2 = 0, done = true;
    const play = () => { const t = ctxTime() + .03; applyFx(); engine.lead(t, a, .6); engine.lead(t + .7, b2, .6); };
    $('#es').onclick = () => { const pick = INTERVALS[Math.floor(Math.random() * INTERVALS.length)]; ans = pick[0]; a = 55 + Math.floor(Math.random() * 12); b2 = a + pick[1]; done = false; $('#eq').textContent = 'Which interval is this?'; $('#em').textContent = ''; $('#eo').innerHTML = INTERVALS.map(i => `<button class="chip" data-a="${i[0]}">${i[0]}</button>`).join(''); play();
      $$('#eo .chip').forEach(c => c.onclick = () => { if (done) return; done = true; tot++; const ok = c.dataset.a === ans; if (ok) score++; $('#em').style.color = ok ? 'var(--ok)' : '#ff7b8a'; $('#em').textContent = ok ? `Correct: ${ans}. Think of ${INTERVAL_SONGS[ans]}.` : `It was ${ans}. Think of ${INTERVAL_SONGS[ans]}.`; $('#esc').textContent = `Score ${score} / ${tot}`; }); };
    $('#er').onclick = () => { if (ans) play(); };
  },
  lab() {
    viz.setHome(false); let kind = 'pluck';
    app.innerHTML = `<h2>Sound lab</h2><p class="lead">Play it yourself. Pick a voice, shape it with the filter, echo and reverb.</p>
<div class="panel"><div class="chips" id="kinds">${[['pluck', 'Pluck'], ['soft', 'Soft'], ['organ', 'Organ'], ['square', 'Chip square'], ['bell', 'Bell'], ['pad', 'Pad'], ['kalimba', 'Kalimba'], ['bass', 'Bass'], ['chord', 'Chord']].map(([k, l], i) => `<button class="chip${i ? '' : ' on'}" data-k="${k}">${l}</button>`).join('')}</div>${piano(0, [], 'lp', 48, 21)}<p class="meta">Computer keyboard: <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> <kbd>F</kbd> <kbd>G</kbd> <kbd>H</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> play C to D, with <kbd>W</kbd> <kbd>E</kbd> <kbd>T</kbd> <kbd>Y</kbd> <kbd>U</kbd> <kbd>O</kbd> for sharps.</p></div>
<div class="panel bar">${[['cutoff', 'Filter', 400, 12000, 50], ['delay', 'Echo', 0, 0.6, 0.01], ['reverb', 'Reverb', 0, 0.8, 0.01], ['volume', 'Volume', 0, 1, 0.01]].map(([k, l, a, b, st]) => `<label class="f">${l}<input type="range" data-fx="${k}" min="${a}" max="${b}" step="${st}" value="${fx[k]}"></label>`).join('')}</div>
<div class="panel"><h3>Drum pads</h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr));margin-top:10px">${DRUMS.map(d => `<button class="btn" data-d="${d.id}" style="background:${d.color};border-radius:var(--r);padding:22px 8px">${d.name}</button>`).join('')}</div></div>`;
    bindPiano('lp', () => kind); $$('#kinds .chip').forEach(c => c.onclick = () => { $$('#kinds .chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); kind = c.dataset.k; });
    $$('[data-fx]').forEach(e => e.oninput = () => { fx[e.dataset.fx] = +e.value; applyFx(); });
    $$('[data-d]').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); applyFx(); engine.drum(b.dataset.d, ctxTime() + .005, 1.1); }));
    labKind = () => kind;
  },
  arranger() {
    viz.setHome(false);
    const draw = () => {
      app.innerHTML = `<h2>Arranger</h2><p class="lead">Chain patterns into a full song. Add sections from the Studio ("+ Add to song") or from any rhythm below, set how many bars each plays, and press play.</p>
<div class="panel bar"><button class="btn" id="songBtn">${songPos ? '■ Stop' : '▶ Play song'}</button><label class="f"><span><input type="checkbox" id="loop"${songLoop ? ' checked' : ''}> Loop</span></label><label class="f">Add preset <select id="addp"><option value="">Choose…</option>${opts(RHYTHMS.map(r => [r.id, r.name]), '')}</select></label><button class="btn ghost sm" id="rec2">● Record song</button><button class="btn ghost sm" id="clrs">Clear song</button><span class="meta" id="tot"></span></div>
<div id="sl">${song.length ? '' : '<div class="card"><p>Your song is empty. Pick a preset above to start.</p></div>'}${song.map((it, i) => `<div class="panel sg" data-i="${i}"><div class="bar"><b>${i + 1}. ${it.name}</b><span class="meta">${it.pat.bpm} BPM</span><label class="f">Bars <input type="number" min="1" max="16" value="${it.bars}" data-b="${i}" style="width:64px"></label><button class="btn ghost sm" data-u="${i}">↑</button><button class="btn ghost sm" data-d="${i}">↓</button><button class="btn ghost sm" data-e="${i}">Edit in studio</button><button class="btn ghost sm" data-x="${i}">Remove</button></div></div>`).join('')}</div><div class="msg" id="msg"></div>`;
      const tot = () => { const secs = song.reduce((a, it) => a + it.bars * it.pat.length / (it.pat.div || 4) * 60 / it.pat.bpm * (it.pat.div === 3 ? 1 : 1), 0); $('#tot').textContent = song.length ? `Length about ${Math.floor(secs / 60)}:${String(Math.round(secs % 60)).padStart(2, '0')}` : ''; }; tot();
      $('#songBtn').onclick = () => { if (songPos) songStop(); else { songPlay(); $('#songBtn').textContent = '■ Stop'; } };
      $('#loop').onchange = e => { songLoop = e.target.checked; };
      $('#addp').onchange = e => { const r = RHYTHMS.find(x => x.id === e.target.value); if (r) { song.push({ name: r.name, bars: 4, pat: toState(r) }); saveSong(); draw(); } };
      $('#clrs').onclick = () => { songStop(); song = []; saveSong(); draw(); };
      $$('[data-b]').forEach(e => e.onchange = () => { song[+e.dataset.b].bars = Math.max(1, Math.min(16, +e.value || 1)); saveSong(); tot(); });
      $$('[data-x]').forEach(b => b.onclick = () => { song.splice(+b.dataset.x, 1); saveSong(); songStop(); draw(); });
      $$('[data-u]').forEach(b => b.onclick = () => { const i = +b.dataset.u; if (i > 0) { [song[i - 1], song[i]] = [song[i], song[i - 1]]; saveSong(); draw(); } });
      $$('[data-d]').forEach(b => b.onclick = () => { const i = +b.dataset.d; if (i < song.length - 1) { [song[i + 1], song[i]] = [song[i], song[i + 1]]; saveSong(); draw(); } });
      $$('[data-e]').forEach(b => b.onclick = () => { S = JSON.parse(JSON.stringify(song[+b.dataset.e].pat)); S.progIdx = S.progIdx ?? 0; save(); location.hash = '#/studio'; });
      let rec = false; $('#rec2').onclick = async () => { if (!rec) { if (!song.length) return; songLoop = false; $('#loop').checked = false; songPlay(); $('#songBtn').textContent = '■ Stop'; engine.record(); rec = true; $('#rec2').textContent = '■ Stop & save'; $('#rec2').classList.add('rec'); } else { const b = await engine.stopRecord(); rec = false; songStop(); $('#rec2').textContent = '● Record song'; $('#rec2').classList.remove('rec'); if (b) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'sonara-song.webm'; a.click(); $('#msg').textContent = 'Saved your song as a .webm audio file.'; } } };
      emitSong();
    };
    draw();
  },
  learn() {
    viz.setHome(false);
    app.innerHTML = `<h2>Learn</h2><p class="lead">Ten short lessons. Each one plays a real example you can then open and edit.</p><div class="grid">${LESSONS.map((l, i) => `<div class="card"><span class="tag">Lesson ${i + 1}</span><h3>${l.t}</h3><p>${l.body}</p><div class="btns"><button class="btn sm" data-l="${i}">▶ Hear it</button>${l.demo.rhythm ? `<button class="btn ghost sm" data-lo="${i}">Open in studio</button>` : `<a class="btn ghost sm" href="#/theory">Open in theory</a>`}</div></div>`).join('')}</div>`;
    $$('[data-l]').forEach(b => b.onclick = () => { const d = LESSONS[+b.dataset.l].demo; if (d.rhythm) playRhythm(RHYTHMS.find(r => r.id === d.rhythm)); else { const t = ctxTime() + .05; applyFx(); if (d.scale) [...SCALES[d.scale], 12].forEach((i, k) => engine.lead(t + k * .28, 62 + i, .4)); else engine.chord(t, CHORDS[d.chord].map(i => 60 + i), 1.4); } });
    $$('[data-lo]').forEach(b => b.onclick = () => { const r = RHYTHMS.find(x => x.id === LESSONS[+b.dataset.lo].demo.rhythm); S = { ...toState(r), progIdx: S.progIdx, chords: { on: false, list: [] } }; save(); location.hash = '#/studio'; });
  },
  about() {
    viz.setHome(false);
    app.innerHTML = `<h2>About SONARA</h2><p class="lead">A showpiece built to prove that a browser alone is enough to make music.</p>
<div class="grid"><div class="card"><h3>No audio files</h3><p>Kicks are sine sweeps, snares and hats are filtered noise, bass and leads are oscillators, reverb is generated noise. All of it runs through the Web Audio API.</p></div>
<div class="card"><h3>Honest rhythms</h3><p>The patterns are simplified teaching versions that show each style's character. They are not transcriptions of specific songs.</p></div>
<div class="card"><h3>Stack</h3><p>Vanilla JavaScript, Web Audio, three.js for the visualiser, Vite. Your work is saved in your own browser.</p></div></div>
<h2>Photo credits</h2><p class="meta">Some covers use photos from <a href="https://unsplash.com/?utm_source=sonara&utm_medium=referral" style="color:var(--tx)">Unsplash</a>, used under the Unsplash licence. Others were supplied by the site's author.</p><div class="credits">${Object.entries(UNSPLASH).map(([k, [, by, u, pid]]) => `<span>${RHYTHMS.find(r => r.id === k)?.name || k}: <a href="https://unsplash.com/photos/${pid}?utm_source=sonara&utm_medium=referral">photo</a> by <a href="https://unsplash.com/${u ? "@" + u : "photos/" + pid}?utm_source=sonara&utm_medium=referral">${by}</a></span>`).join('')}</div>
<p class="meta" style="margin-top:24px">Built by Afolabi Peter. Includes a step sequencer, song arranger, 10 lessons, theory tools and a sound lab.</p>`;
  },
};
let labKind = () => 'pluck'; let qstr = '';
function renderSeq() {
  const s = S, drumById = Object.fromEntries(DRUMS.map(d => [d.id, d]));
  const rows = [...s.tracks.map(t => ({ k: 'd', t, name: drumById[t.id].name, color: drumById[t.id].color })), { k: 'm', t: s.bass, name: 'Bass', color: '#ff6a3d', which: 'bass' }, { k: 'm', t: s.lead, name: 'Lead', color: '#8a7bff', which: 'lead' }];
  $('#seq').innerHTML = rows.map((r, ri) => `<div class="row"><div class="rl"><button data-m="${ri}" class="${r.t.mute ? 'm' : ''}">M</button>${r.name}<input type="range" class="vol" data-v="${ri}" min="0" max="1.5" step="0.05" value="${r.t.vol}" aria-label="${r.name} volume"></div><div class="steps" style="grid-template-columns:repeat(${s.length},1fr);grid-auto-flow:row">${r.t.steps.map((v, i) => `<button class="st ${v != null && (r.k === 'm' || v !== 0) ? 'on' : ''} ${v === 2 ? 'acc' : ''}" data-r="${ri}" data-i="${i}" style="--c:${r.color}" aria-label="${r.name} step ${i + 1}">${r.k === 'm' && v != null ? v + 1 : ''}</button>`).join('')}</div></div>`).join('');
  $$('.st').forEach(b => b.onclick = () => {
    const r = rows[+b.dataset.r], i = +b.dataset.i;
    if (r.k === 'd') { r.t.steps[i] = (r.t.steps[i] + 1) % 3; if (r.t.steps[i]) { applyFx(); engine.drum(r.t.id, ctxTime() + .005, r.t.steps[i] === 2 ? 1.2 : .8); } }
    else { const v = r.t.steps[i]; r.t.steps[i] = v == null ? 0 : v >= 6 ? null : v + 1; if (r.t.steps[i] != null) { const sc = SCALES[S.scaleName], d = r.t.steps[i], oct = r.which === 'bass' ? 2 : 4; const m = S.root + 12 * (oct + 1) + sc[d % sc.length] + 12 * Math.floor(d / sc.length); applyFx(); r.which === 'bass' ? engine.bass(ctxTime() + .005, m, .4) : engine.lead(ctxTime() + .005, m, .5, 1, S.lead.kind); } }
    const v = r.t.steps[i]; b.className = 'st' + (v != null && (r.k === 'm' || v !== 0) ? ' on' : '') + (v === 2 ? ' acc' : ''); if (r.k === 'm') b.textContent = v != null ? v + 1 : ''; save();
  });
  $$('.vol').forEach(e => e.oninput = () => { rows[+e.dataset.v].t.vol = +e.value; save(); });
  $$('[data-m]').forEach(b => b.onclick = () => { const r = rows[+b.dataset.m]; r.t.mute = !r.t.mute; b.classList.toggle('m', r.t.mute); save(); });
}
function toast(t) { const m = $('#msg'); if (m) m.textContent = t; }
const KEYMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14 };
addEventListener('keydown', e => {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const h = location.hash; if (!/studio|lab/.test(h)) { if (e.code === 'Space' && !/button|a/i.test(e.target.tagName)) { e.preventDefault(); toggle(); } return; }
  if (e.code === 'Space') { e.preventDefault(); toggle(); return; }
  const k = KEYMAP[e.key.toLowerCase()]; if (k != null) note(60 + k, /lab/.test(h) ? labKind() : 'pluck');
});
function route() {
  const p = (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0].split('/')[0], page = pages[p] ? p : 'home';
  $$('#nav a,#tabs a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + (page === 'home' ? '' : page)));
  if (page === 'studio') { const q = location.hash.split('?p=')[1]; if (q) { try { const o = JSON.parse(decodeURIComponent(escape(atob(q)))); if (o && o.tracks && o.length) { S = o; save(); } } catch {} history.replaceState(null, '', '#/studio'); } }
  window.__rq = null; if (padsOff && page !== 'home') { padsOff(); padsOff = null; } pages[page](); scrollTo(0, 0); updatePlayer(); drawLib(); enter(); document.title = (page === 'home' ? 'SONARA — a music studio made of code' : `${page[0].toUpperCase() + page.slice(1)} · SONARA`);
}
function enter() { if (REDUCE) return; const els = $$('.alb,.card,.panel,.tile,.qk,.shh,.hero2 .txt > *,.chips', app).slice(0, 60); gsap.fromTo(els, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.025, ease: 'power2.out', clearProps: 'transform,opacity' }); }
$('#q').addEventListener('input', e => { qstr = e.target.value; if (!/rhythms/.test(location.hash)) location.hash = '#/rhythms'; else if (window.__rq) window.__rq(qstr); });
addEventListener('hashchange', route); route();
