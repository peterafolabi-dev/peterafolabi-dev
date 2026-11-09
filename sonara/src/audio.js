/* SONARA audio engine: every sound is synthesised with the Web Audio API. No samples, no files. */
export const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

export const DRUMS = [
  { id: 'kick', name: 'Kick', color: '#ff6a3d' },
  { id: 'snare', name: 'Snare', color: '#ffb23d' },
  { id: 'clap', name: 'Clap', color: '#ffd93d' },
  { id: 'hat', name: 'Hi-hat', color: '#9be15d' },
  { id: 'ohat', name: 'Open hat', color: '#3dd9a8' },
  { id: 'conga', name: 'Conga', color: '#3db7ff' },
  { id: 'shaker', name: 'Shaker', color: '#8a7bff' },
  { id: 'bell', name: 'Cowbell', color: '#ff7bd0' },
];

class Engine {
  constructor() { this.ctx = null; this.listeners = new Set(); this.playing = false; this.step = 0; this.timer = null; this.state = null; this.nextTime = 0; this.lastVisual = []; }

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const ctx = this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.in = ctx.createGain();
    this.filter = ctx.createBiquadFilter(); this.filter.type = 'lowpass'; this.filter.frequency.value = 18000; this.filter.Q.value = 0.7;
    this.comp = ctx.createDynamicsCompressor(); this.comp.threshold.value = -14; this.comp.ratio.value = 4; this.comp.attack.value = 0.005; this.comp.release.value = 0.2;
    this.master = ctx.createGain(); this.master.gain.value = 0.8;
    this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 512; this.analyser.smoothingTimeConstant = 0.78;
    this.dest = ctx.createMediaStreamDestination();
    this.in.connect(this.filter); this.filter.connect(this.comp); this.comp.connect(this.master);
    this.master.connect(ctx.destination); this.master.connect(this.analyser); this.master.connect(this.dest);
    // delay send
    this.delay = ctx.createDelay(1.5); this.delay.delayTime.value = 0.375;
    this.fb = ctx.createGain(); this.fb.gain.value = 0.35; this.dsend = ctx.createGain(); this.dsend.gain.value = 0;
    const dlp = ctx.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 3500;
    this.dsend.connect(this.delay); this.delay.connect(dlp); dlp.connect(this.fb); this.fb.connect(this.delay); dlp.connect(this.in);
    // reverb send (generated impulse response)
    this.verb = ctx.createConvolver(); this.verb.buffer = this.impulse(2.4, 2.6); this.rsend = ctx.createGain(); this.rsend.gain.value = 0;
    this.rsend.connect(this.verb); this.verb.connect(this.in);
    // shared noise
    const n = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate), d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noise = n;
    this.freq = new Uint8Array(this.analyser.frequencyBinCount);
  }

  impulse(sec, decay) {
    const ctx = this.ctx, len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }

  out(node, send = 1) { node.connect(this.in); if (this.dsend) { const d = this.ctx.createGain(); d.gain.value = send; node.connect(d); d.connect(this.dsend); const r = this.ctx.createGain(); r.gain.value = send; node.connect(r); r.connect(this.rsend); } }
  setFx({ cutoff, delay, reverb, volume }) {
    if (!this.ctx) return; const t = this.ctx.currentTime;
    if (cutoff != null) this.filter.frequency.setTargetAtTime(cutoff, t, 0.03);
    if (delay != null) this.dsend.gain.setTargetAtTime(delay, t, 0.03);
    if (reverb != null) this.rsend.gain.setTargetAtTime(reverb, t, 0.03);
    if (volume != null) this.master.gain.setTargetAtTime(volume, t, 0.03);
  }
  setTempoSync(bpm) { if (this.delay) this.delay.delayTime.value = Math.min(1.4, 60 / bpm * 0.75); }

  env(g, t, a, peak, d, end = 0.0001) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(end, t + a + d); }
  burst(t, dur, type, freq, q, peak, send = 0.15) {
    const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; const g = c.createGain();
    this.env(g, t, 0.001, peak, dur); s.connect(f); f.connect(g); this.out(g, send); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }
  tone(t, type, f0, f1, dur, peak, send = 0.1) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.8);
    this.env(g, t, 0.002, peak, dur); o.connect(g); this.out(g, send); o.start(t); o.stop(t + dur + 0.05);
  }

  /* drum voices */
  drum(id, t, v = 1) {
    switch (id) {
      case 'kick': this.tone(t, 'sine', 160, 42, 0.42, 1.0 * v, 0); this.burst(t, 0.02, 'lowpass', 900, 0.5, 0.35 * v, 0); break;
      case 'snare': this.tone(t, 'triangle', 190, 140, 0.14, 0.45 * v, 0.1); this.burst(t, 0.2, 'bandpass', 2200, 0.7, 0.7 * v, 0.2); break;
      case 'clap': for (let i = 0; i < 3; i++) this.burst(t + i * 0.011, 0.07, 'bandpass', 1500, 1.1, 0.55 * v, 0.3); this.burst(t + 0.034, 0.18, 'bandpass', 1500, 1.1, 0.5 * v, 0.35); break;
      case 'hat': this.burst(t, 0.05, 'highpass', 8000, 0.8, 0.32 * v, 0.05); break;
      case 'ohat': this.burst(t, 0.32, 'highpass', 7000, 0.8, 0.3 * v, 0.1); break;
      case 'conga': this.tone(t, 'sine', 330, 230, 0.2, 0.6 * v, 0.2); this.burst(t, 0.03, 'bandpass', 1800, 1, 0.2 * v, 0.1); break;
      case 'shaker': { const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6500; const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.22 * v, t + 0.025); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09); s.connect(f); f.connect(g); this.out(g, 0.1); s.start(t, 0.1); s.stop(t + 0.12); break; }
      case 'bell': { const c = this.ctx, g = c.createGain(), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 1.5;
        for (const f of [562, 845]) { const o = c.createOscillator(); o.type = 'square'; o.frequency.value = f; o.connect(bp); o.start(t); o.stop(t + 0.3); }
        this.env(g, t, 0.002, 0.28 * v, 0.22); bp.connect(g); this.out(g, 0.15); break; }
    }
  }

  /* melodic voices */
  bass(t, midi, dur, v = 1) {
    const c = this.ctx, f = mtof(midi), g = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 5;
    lp.frequency.setValueAtTime(f * 7, t); lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + dur * 0.9);
    const o1 = c.createOscillator(), o2 = c.createOscillator(); o1.type = 'sawtooth'; o2.type = 'sine'; o1.frequency.value = f; o2.frequency.value = f / 2;
    const m = c.createGain(); m.gain.value = 0.5; o1.connect(lp); o2.connect(m); m.connect(lp); lp.connect(g);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.5 * v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    this.out(g, 0.03); o1.start(t); o2.start(t); o1.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  lead(t, midi, dur, v = 1, kind = 'pluck') {
    if (kind === 'organ' || kind === 'square' || kind === 'bell' || kind === 'pad') return this.voice(t, midi, dur, v, kind);
    const c = this.ctx, f = mtof(midi), g = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2;
    lp.frequency.setValueAtTime(Math.min(12000, f * 9), t); lp.frequency.exponentialRampToValueAtTime(Math.max(300, f * 2), t + dur);
    for (const det of [-6, 6]) { const o = c.createOscillator(); o.type = kind === 'pluck' ? 'sawtooth' : 'triangle'; o.frequency.value = f; o.detune.value = det; o.connect(lp); o.start(t); o.stop(t + dur + 0.1); }
    lp.connect(g); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.2 * v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    this.out(g, 0.4);
  }
  voice(t, midi, dur, v, kind) {
    const c = this.ctx, f = mtof(midi), g = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass';
    let parts, a = 0.01, rel = 0.1, peak = 0.16 * v;
    if (kind === 'organ') { parts = [['sine', 1, 1], ['sine', 2, 0.6], ['sine', 3, 0.35], ['sine', 4, 0.2]]; lp.frequency.value = 5000; peak = 0.12 * v; }
    else if (kind === 'square') { parts = [['square', 1, 1], ['square', 2.003, 0.3]]; lp.frequency.value = 2600; peak = 0.1 * v; }
    else if (kind === 'bell') { parts = [['sine', 1, 1], ['sine', 2.76, 0.5], ['sine', 5.4, 0.25], ['sine', 8.93, 0.12]]; lp.frequency.value = 9000; dur = Math.max(dur, 1.2); rel = dur; peak = 0.14 * v; }
    else { parts = [['sawtooth', 1, 1], ['sawtooth', 1.004, 1], ['triangle', 0.5, 0.8]]; lp.frequency.value = 1400; a = 0.25; rel = 0.5; dur = Math.max(dur, 0.9); peak = 0.09 * v; }
    for (const [type, mul, amp] of parts) { const o = c.createOscillator(), og = c.createGain(); o.type = type; o.frequency.value = f * mul; og.gain.value = amp / parts.length * 2; o.connect(og); og.connect(lp); o.start(t); o.stop(t + dur + rel + 0.05); }
    lp.connect(g); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a);
    if (kind === 'bell') g.gain.exponentialRampToValueAtTime(0.0001, t + dur); else { g.gain.setValueAtTime(peak, t + Math.max(a, dur * 0.7)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel); }
    this.out(g, 0.45);
  }
  kalimba(t, midi, v = 1) { const f = mtof(midi); this.tone(t, 'sine', f, f, 0.9, 0.35 * v, 0.5); this.tone(t, 'sine', f * 4.1, f * 4.1, 0.15, 0.1 * v, 0.5); }
  chord(t, midis, dur, v = 1) {
    const c = this.ctx, g = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    for (const m of midis) for (const det of [-5, 5]) { const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = mtof(m); o.detune.value = det; o.connect(lp); o.start(t); o.stop(t + dur + 0.4); }
    lp.connect(g); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.11 * v, t + 0.06); g.gain.setValueAtTime(0.11 * v, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.3);
    this.out(g, 0.5);
  }

  /* sequencer */
  start(getState) {
    this.init(); if (this.playing) return; this.getState = getState; this.playing = true; this.step = 0; this.nextTime = this.ctx.currentTime + 0.06;
    this.timer = setInterval(() => this.tick(), 25); this.emit();
  }
  stop() { clearInterval(this.timer); this.playing = false; this.step = 0; this.emit(); }
  tick() {
    const ahead = this.ctx.currentTime + 0.14;
    while (this.nextTime < ahead) {
      const s = this.getState(this.step), div = s.div || 4, stepDur = 60 / s.bpm / div;
      this.setTempoSync(s.bpm);
      const i = this.step % s.length, swing = (i % 2 === 1 && div === 4) ? s.swing * stepDur * 0.5 : 0, t = this.nextTime + swing;
      this.playStep(s, i, t, stepDur);
      const delay = Math.max(0, (t - this.ctx.currentTime) * 1000);
      setTimeout(() => this.emit(i), delay);
      this.nextTime += stepDur; this.step = (this.step + 1) % s.length;
    }
  }
  playStep(s, i, t, stepDur) {
    for (const tr of s.tracks) { const val = tr.steps[i]; if (val && !tr.mute) this.drum(tr.id, t, (val === 2 ? 1.25 : 0.85) * tr.vol); }
    const root = s.root, sc = s.scale;
    const deg = (d, oct) => root + 12 * oct + sc[((d % sc.length) + sc.length) % sc.length] + 12 * Math.floor(d / sc.length);
    const b = s.bass.steps[i]; if (b != null && !s.bass.mute) this.bass(t, deg(b, 2), stepDur * 1.8, s.bass.vol);
    const l = s.lead.steps[i]; if (l != null && !s.lead.mute) this.lead(t, deg(l, 4), stepDur * 2.2, s.lead.vol, s.lead.kind);
    if (s.chords && s.chords.on && i % s.length === 0) { const ch = s.chords.list[(this.bar = ((this.bar || 0) + 1)) % s.chords.list.length]; this.chord(t, ch.map(n => root + 48 + n), stepDur * s.length, 0.9); }
  }
  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit(i) { for (const fn of this.listeners) fn(i); }
  levels() { if (!this.analyser) return null; this.analyser.getByteFrequencyData(this.freq); return this.freq; }

  /* recording */
  record() {
    this.init(); if (this.rec) return; this.chunks = [];
    const type = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
    this.rec = new MediaRecorder(this.dest.stream, type ? { mimeType: type } : undefined);
    this.rec.ondataavailable = e => e.data.size && this.chunks.push(e.data);
    this.rec.start();
  }
  stopRecord() {
    return new Promise(res => { if (!this.rec) return res(null); this.rec.onstop = () => { const b = new Blob(this.chunks, { type: this.rec.mimeType || 'audio/webm' }); this.rec = null; res(b); }; this.rec.stop(); });
  }
}
export const engine = new Engine();
