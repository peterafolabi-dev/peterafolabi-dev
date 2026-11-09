import * as THREE from 'three';
import { engine } from './audio.js';
export const MODES = ['Ring', 'Terrain', 'Orbs', 'Tunnel'];
export function initViz(canvas) {
  let r; try { r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return { setLayout() {}, setMode() {}, setHue() {} }; }
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.position.set(0, 2.2, 9);
  const stage = new THREE.Group(); scene.add(stage); let hue = 0.03;
  const col = (o = 0, l = 0.58) => new THREE.Color().setHSL((hue + o) % 1, 0.85, l);
  /* ring */
  const N = 72, ring = new THREE.Group(), bars = [], geo = new THREE.BoxGeometry(0.12, 1, 0.12);
  for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, b = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col(i / N * 0.5) })); b.position.set(Math.cos(a) * 3.2, 0, Math.sin(a) * 3.2); b.rotation.y = -a; ring.add(b); bars.push(b); }
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 2), new THREE.MeshBasicMaterial({ color: col(0, .6), wireframe: true })); ring.add(core);
  stage.add(ring);
  /* terrain */
  const TC = 48, TR = 30, tg = new THREE.PlaneGeometry(18, 12, TC - 1, TR - 1); tg.rotateX(-Math.PI / 2);
  const terrain = new THREE.Mesh(tg, new THREE.MeshBasicMaterial({ color: col(0.1), wireframe: true, transparent: true, opacity: 0.8 })); terrain.position.set(0, -1.5, -1); const hist = Array.from({ length: TR }, () => new Float32Array(TC)); stage.add(terrain);
  /* orbs */
  const orbs = new THREE.Group(), OG = new THREE.SphereGeometry(0.16, 12, 12), ob = [];
  for (let i = 0; i < 60; i++) { const m = new THREE.Mesh(OG, new THREE.MeshBasicMaterial({ color: col(i / 60 * 0.7) })); m.userData = { ring: i % 5, ph: i * 0.7, sp: 0.3 + (i % 5) * 0.12 }; orbs.add(m); ob.push(m); } stage.add(orbs);
  /* tunnel */
  const tun = new THREE.Group(), TG = new THREE.TorusGeometry(3, 0.03, 6, 48), tr = [];
  for (let i = 0; i < 22; i++) { const m = new THREE.Mesh(TG, new THREE.MeshBasicMaterial({ color: col(i / 22 * 0.6), transparent: true })); m.position.z = -i * 1.6; tun.add(m); tr.push(m); } stage.add(tun);
  /* particles */
  const P = 450, pg = new THREE.BufferGeometry(), pp = new Float32Array(P * 3);
  for (let i = 0; i < P; i++) { pp[i * 3] = (Math.random() - .5) * 26; pp[i * 3 + 1] = (Math.random() - .5) * 14; pp[i * 3 + 2] = (Math.random() - .5) * 16 - 2; }
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x8a7bff, size: 0.04, transparent: true, opacity: 0.7 })); scene.add(pts);

  let mode = 'Ring', layout = 'home', vis = true, ptr = { x: 0, y: 0 }; const t0 = performance.now();
  addEventListener('pointermove', e => { ptr.x = e.clientX / innerWidth - .5; ptr.y = e.clientY / innerHeight - .5; });
  document.addEventListener('visibilitychange', () => { vis = !document.hidden; });
  const size = () => { r.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); }; addEventListener('resize', size); size();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const band = (lv, i, n) => lv ? lv[Math.min(lv.length - 1, Math.floor(Math.pow(i / n, 1.6) * 90) + 1)] / 255 : 0;
  function target() {
    const wide = innerWidth > 980;
    if (layout === 'np') return { x: wide ? 3.6 : 0, y: wide ? -2.1 : -4.2, s: wide ? 0.62 : 0.5, o: wide ? 1 : 0.2 };
    if (layout === 'home') return { x: 0, y: -1, s: 1.15, o: 0.16 };
    return { x: 0, y: -1, s: 1.1, o: 0.22 };
  }
  const cur = { x: 0, y: 0, s: 1, o: 1 };
  function frame() {
    requestAnimationFrame(frame); if (!vis) return;
    const t = (performance.now() - t0) / 1000, lv = engine.levels(), play = engine.playing && lv, T = target();
    for (const k of ['x', 'y', 's', 'o']) cur[k] += (T[k] - cur[k]) * 0.07;
    stage.position.set(cur.x, cur.y, 0); stage.scale.setScalar(cur.s); canvas.style.opacity = cur.o;
    ring.visible = mode === 'Ring'; terrain.visible = mode === 'Terrain'; orbs.visible = mode === 'Orbs'; tun.visible = mode === 'Tunnel';
    let bass = 0; for (let i = 0; i < 6; i++) bass += band(lv, i, 72) / 6; if (!play) bass = 0.1 + 0.05 * Math.sin(t * 2);
    if (ring.visible) {
      for (let i = 0; i < N; i++) { const v = band(lv, i, N), idle = 0.25 + 0.15 * Math.sin(t * 1.3 + i * 0.4), h = 0.2 + (play ? v * 3.6 : idle); bars[i].scale.y += (h - bars[i].scale.y) * 0.35; bars[i].position.y = bars[i].scale.y / 2 - 0.4; }
      core.scale.setScalar(1 + bass * 0.5); core.rotation.x = t * 0.3; core.rotation.y = t * 0.45; ring.rotation.y = reduce ? 0 : t * 0.12;
    }
    if (terrain.visible) {
      const row = hist.pop(); for (let c = 0; c < TC; c++) { const v = play ? band(lv, Math.abs(c - TC / 2) * 2, TC) : 0.08 + 0.06 * Math.sin(t * 2 + c * 0.4); row[c] = v; } hist.unshift(row);
      const pos = tg.attributes.position.array; for (let rr = 0; rr < TR; rr++) for (let c = 0; c < TC; c++) pos[(rr * TC + c) * 3 + 1] = hist[TR - 1 - rr][c] * 3.2 * (1 - Math.abs(c - TC / 2) / TC * 0.8);
      tg.attributes.position.needsUpdate = true; terrain.rotation.y = Math.sin(t * 0.2) * 0.25;
    }
    if (orbs.visible) for (const m of ob) { const u = m.userData, v = play ? band(lv, u.ring * 12 + 1, 72) : 0.15, rad = 1.2 + u.ring * 0.7 + v * 1.4, a = t * u.sp + u.ph; m.position.set(Math.cos(a) * rad, Math.sin(a * 1.3) * (0.6 + v), Math.sin(a) * rad); m.scale.setScalar(1 + v * 3); }
    if (tun.visible) for (const m of tr) { m.position.z += (play ? 0.06 + bass * 0.12 : 0.025); if (m.position.z > 4) m.position.z -= 35; m.scale.setScalar(1 + bass * 0.4); m.material.opacity = Math.max(0, Math.min(1, 1 + m.position.z / 32)); m.rotation.z = t * 0.2 + m.position.z * 0.1; }
    pts.rotation.y = t * 0.02;
    cam.position.x += (ptr.x * 2 - cam.position.x) * 0.04; cam.position.y += (2.2 - ptr.y * 2 - cam.position.y) * 0.04; cam.lookAt(cur.x * .6, cur.y * .4, 0);
    r.render(scene, cam);
  }
  frame();
  return {
    setLayout(l) { layout = l; }, setMode(m) { mode = m; },
    setHue(h360) { hue = h360 / 360; bars.forEach((b, i) => b.material.color.copy(col(i / N * 0.5))); core.material.color.copy(col(0, .6)); terrain.material.color.copy(col(0.1)); ob.forEach((m, i) => m.material.color.copy(col(i / 60 * 0.7))); tr.forEach((m, i) => m.material.color.copy(col(i / 22 * 0.6))); },
  };
}
