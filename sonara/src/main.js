import './style.css';
import { engine, DRUMS, mtof } from './audio.js';
import { RHYTHMS, toState, emptyState } from './rhythms.js';
import { SCALES, SCALE_FEEL, CHORDS, PROGRESSIONS, NOTES, noteName, diatonicChord, INTERVALS, INTERVAL_SONGS } from './theory.js';
import { initViz } from './viz.js';
import { LESSONS } from './lessons.js';

const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app'), viz = initViz($('#bg'));
const KEY = 'sonara.v1';
let S = load() || toState(RHYTHMS[0]); S.progIdx = S.progIdx ?? 0;
let fx = { cutoff: 12000, delay: 0.15, reverb: 0.2, volume: 0.8 };
function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
function cur() {
  const scale = SCALES[S.scaleName] || SCALES['Minor pentatonic'];
  const prog = PROGRESSIONS[S.progIdx] || PROGRESSIONS[0];
  const list = prog[1].map(d => diatonicChord(0, SCALES[prog[3] === 'minor' ? 'Natural minor' : 'Major'], d));
  return { ...S, scale, chords: { on: S.chords.on, list } };
}
const ctxTime = () => { engine.init(); return engine.ctx.currentTime; };
function applyFx() { engine.init(); engine.setFx(fx); }
function toggle() { if (engine.playing) engine.stop(); else { engine.start(cur); applyFx(); } }
function playRhythm(r) { S = { ...toState(r), progIdx: S.progIdx, chords: { on: false, list: [] } }; save(); engine.stop(); engine.start(cur); applyFx(); }
function note(midi, kind = 'pluck') {
  const t = ctxTime() + 0.005; applyFx();
  if (kind === 'kalimba') engine.kalimba(t, midi); else if (kind === 'bass') engine.bass(t, midi - 12, 0.6); else if (kind === 'chord') engine.chord(t, [midi, midi + 4, midi + 7], 1.2); else engine.lead(t, midi, 0.7, 1, kind);
}
engine.on(i => {
  $('#mini').textContent = engine.playing ? '■' : '▶';
  $$('.st.play').forEach(e => e.classList.remove('play'));
  if (i != null && engine.playing) $$(`.st[data-i="${i}"]`).forEach(e => e.classList.add('play'));
  const b = $('#playBtn'); if (b) { b.textContent = engine.playing ? '■ Stop' : '▶ Play'; b.classList.toggle('on', engine.playing); }
});
$('#mini').onclick = toggle;

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

/* ---------- pages ---------- */
const pages = {
  home() {
    viz.setHome(true);
    app.innerHTML = `<section class="hero"><span class="tag">A music studio made of code</span><h1>Make music from <span>nothing.</span></h1>
<p class="lead">Every drum, bass note and melody here is synthesised live in your browser. No samples, no downloads. Pick a rhythm, change it, learn why it works, record it.</p>
<div class="btns"><button class="btn" id="hp">▶ Hear it</button><a class="btn ghost" href="#/studio">Open the studio</a><a class="btn ghost" href="#/rhythms">Browse rhythms</a></div>
<div class="stats"><div><b>${RHYTHMS.length}</b><span>rhythms</span></div><div><b>${DRUMS.length + 2}</b><span>instruments</span></div><div><b>${Object.keys(SCALES).length}</b><span>scales</span></div><div><b>0</b><span>audio files</span></div></div></section>
<h2>What's inside</h2><div class="grid">
${[['Studio', 'studio', 'A 10-track step sequencer with swing, key, scale, effects and recording.'], ['Rhythms', 'rhythms', '24 grooves from Afrobeat and Amapiano to techno, each with a short honest note on where it comes from.'], ['Theory', 'theory', 'Scales, chords, progressions and an ear trainer you can play along with.'], ['Sound lab', 'lab', 'A playable keyboard, drum pads and live filter, delay and reverb.']].map(c => `<a class="card" style="text-decoration:none;color:inherit" href="#/${c[1]}"><h3>${c[0]}</h3><p>${c[2]}</p><span class="tag">Open →</span></a>`).join('')}</div>`;
    $('#hp').onclick = () => { playRhythm(RHYTHMS[Math.floor(Math.random() * RHYTHMS.length)]); toast(`Playing: ${S.name}`); };
  },
  studio() {
    viz.setHome(false); const s = S;
    app.innerHTML = `<h2>Studio <span class="meta" id="sname">${s.name}</span></h2>
<div class="panel bar"><button class="btn" id="playBtn">▶ Play</button>
<label class="f">Tempo <input type="number" id="bpm" min="50" max="200" value="${s.bpm}" style="width:80px"></label>
<label class="f">Swing <input type="range" id="swing" min="0" max="0.5" step="0.01" value="${s.swing}"></label>
<label class="f">Key <select id="root">${rootOpts(s.root)}</select></label>
<label class="f">Scale <select id="scale">${opts(Object.keys(SCALES).map(k => [k, k]), s.scaleName)}</select></label>
<label class="f">Preset <select id="preset"><option value="">Choose…</option>${opts(RHYTHMS.map(r => [r.id, r.name]), '')}</select></label>
<label class="f">Lead <select id="lkind"><option value="pluck">Pluck</option><option value="soft">Soft</option></select></label>
<button class="btn ghost sm" id="clear">Clear</button><button class="btn ghost sm" id="rec">● Record</button><button class="btn ghost sm" id="share">Copy share link</button></div>
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
    let recording = false;
    $('#rec').onclick = async () => {
      if (!recording) { if (!engine.playing) toggle(); engine.record(); recording = true; $('#rec').textContent = '■ Stop & save'; $('#rec').classList.add('rec'); }
      else { const b = await engine.stopRecord(); recording = false; $('#rec').textContent = '● Record'; $('#rec').classList.remove('rec'); if (b) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `sonara-${S.id || 'loop'}.webm`; a.click(); $('#msg').textContent = 'Saved your recording as a .webm audio file.'; } }
    };
  },
  rhythms() {
    viz.setHome(false);
    const tags = ['All', ...new Set(RHYTHMS.map(r => r.tag))];
    app.innerHTML = `<h2>Rhythms</h2><p class="lead">Simplified teaching versions of each style. They show the core feel, not a note-for-note copy of any record. Press play, then open one in the studio to take it apart.</p>
<div class="chips" id="tags">${tags.map((t, i) => `<button class="chip${i ? '' : ' on'}" data-t="${t}">${t}</button>`).join('')}</div><div class="grid" id="rg" style="margin-top:14px"></div>`;
    const draw = t => { $('#rg').innerHTML = RHYTHMS.filter(r => t === 'All' || r.tag === t).map(r => { const k = r.drums.kick || '', sn = r.drums.snare || r.drums.clap || ''; return `<div class="card"><span class="tag">${r.tag}</span><h3>${r.name}</h3><div class="meta">${r.region} · ${r.bpm} BPM${r.div === 3 ? ' · 12/8' : ''}</div><p>${r.blurb}</p>
<div class="mini-steps" style="grid-template-columns:repeat(${r.len},1fr)">${[...k.padEnd(r.len, '.')].map(c => `<i class="${c !== '.' ? 'on' : ''}"></i>`).join('')}</div><div class="mini-steps" style="grid-template-columns:repeat(${r.len},1fr)">${[...sn.padEnd(r.len, '.')].map(c => `<i class="${c !== '.' ? 'on' : ''}" style="${c !== '.' ? 'background:#ffb23d' : ''}"></i>`).join('')}</div>
<div class="btns" style="margin-top:12px"><button class="btn sm" data-p="${r.id}">▶ Play</button><button class="btn ghost sm" data-o="${r.id}">Open in studio</button></div></div>`; }).join(''); 
      $$('[data-p]').forEach(b => b.onclick = () => { const r = RHYTHMS.find(x => x.id === b.dataset.p); playRhythm(r); }); $$('[data-o]').forEach(b => b.onclick = () => { const r = RHYTHMS.find(x => x.id === b.dataset.o); S = { ...toState(r), progIdx: S.progIdx, chords: { on: false, list: [] } }; save(); location.hash = '#/studio'; }); };
    draw('All'); $$('#tags .chip').forEach(c => c.onclick = () => { $$('#tags .chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); draw(c.dataset.t); });
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
<div class="panel"><div class="chips" id="kinds">${[['pluck', 'Pluck'], ['soft', 'Soft'], ['kalimba', 'Kalimba'], ['bass', 'Bass'], ['chord', 'Chord']].map(([k, l], i) => `<button class="chip${i ? '' : ' on'}" data-k="${k}">${l}</button>`).join('')}</div>${piano(0, [], 'lp', 48, 21)}<p class="meta">Computer keyboard: <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> <kbd>F</kbd> <kbd>G</kbd> <kbd>H</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> play C to D, with <kbd>W</kbd> <kbd>E</kbd> <kbd>T</kbd> <kbd>Y</kbd> <kbd>U</kbd> <kbd>O</kbd> for sharps.</p></div>
<div class="panel bar">${[['cutoff', 'Filter', 400, 12000, 50], ['delay', 'Echo', 0, 0.6, 0.01], ['reverb', 'Reverb', 0, 0.8, 0.01], ['volume', 'Volume', 0, 1, 0.01]].map(([k, l, a, b, st]) => `<label class="f">${l}<input type="range" data-fx="${k}" min="${a}" max="${b}" step="${st}" value="${fx[k]}"></label>`).join('')}</div>
<div class="panel"><h3>Drum pads</h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr));margin-top:10px">${DRUMS.map(d => `<button class="btn" data-d="${d.id}" style="background:${d.color};border-radius:var(--r);padding:22px 8px">${d.name}</button>`).join('')}</div></div>`;
    bindPiano('lp', () => kind); $$('#kinds .chip').forEach(c => c.onclick = () => { $$('#kinds .chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); kind = c.dataset.k; });
    $$('[data-fx]').forEach(e => e.oninput = () => { fx[e.dataset.fx] = +e.value; applyFx(); });
    $$('[data-d]').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); applyFx(); engine.drum(b.dataset.d, ctxTime() + .005, 1.1); }));
    labKind = () => kind;
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
<p class="meta" style="margin-top:24px">Built by Afolabi Peter. A first milestone: more instruments, a song arranger and a larger lesson library are planned.</p>`;
  },
};
let labKind = () => 'pluck';
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
  $$('#nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + page));
  if (page === 'studio') { const q = location.hash.split('?p=')[1]; if (q) { try { const o = JSON.parse(decodeURIComponent(escape(atob(q)))); if (o && o.tracks && o.length) { S = o; save(); } } catch {} history.replaceState(null, '', '#/studio'); } }
  pages[page](); scrollTo(0, 0); document.title = (page === 'home' ? 'SONARA — a music studio made of code' : `${page[0].toUpperCase() + page.slice(1)} · SONARA`);
}
addEventListener('hashchange', route); route();
