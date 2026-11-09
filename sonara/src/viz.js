import * as THREE from 'three';
import { engine } from './audio.js';
export function initViz(canvas) {
  let r; try { r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return { setHome() {} }; }
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.position.set(0, 2.2, 9);
  const N = 72, ring = new THREE.Group(), geo = new THREE.BoxGeometry(0.12, 1, 0.12), mats = [], bars = [];
  for (let i = 0; i < N; i++) {
    const a = i / N * Math.PI * 2, m = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(0.02 + i / N * 0.55, 0.9, 0.58) });
    const b = new THREE.Mesh(geo, m); b.position.set(Math.cos(a) * 3.2, 0, Math.sin(a) * 3.2); b.rotation.y = -a; ring.add(b); bars.push(b); mats.push(m);
  }
  ring.scale.setScalar(0.82); scene.add(ring);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 2), new THREE.MeshBasicMaterial({ color: 0xff6a3d, wireframe: true })); scene.add(core);
  const P = 400, pg = new THREE.BufferGeometry(), pp = new Float32Array(P * 3);
  for (let i = 0; i < P; i++) { pp[i * 3] = (Math.random() - .5) * 22; pp[i * 3 + 1] = (Math.random() - .5) * 12; pp[i * 3 + 2] = (Math.random() - .5) * 14 - 2; }
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x8a7bff, size: 0.04, transparent: true, opacity: 0.7 })); scene.add(pts);
  let home = true, t0 = performance.now(), ptr = { x: 0, y: 0 }, vis = true;
  addEventListener('pointermove', e => { ptr.x = e.clientX / innerWidth - .5; ptr.y = e.clientY / innerHeight - .5; });
  document.addEventListener('visibilitychange', () => { vis = !document.hidden; });
  const size = () => { r.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); ring.position.x = innerWidth > 860 && home ? 5.7 : 0; core.position.x = ring.position.x; };
  addEventListener('resize', size); size();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function frame() {
    requestAnimationFrame(frame); if (!vis) return;
    const t = (performance.now() - t0) / 1000, lv = engine.levels(); let bass = 0;
    for (let i = 0; i < N; i++) {
      const v = lv ? lv[Math.min(lv.length - 1, Math.floor(Math.pow(i / N, 1.6) * 90) + 1)] / 255 : 0, idle = 0.25 + 0.15 * Math.sin(t * 1.3 + i * 0.4);
      const h = 0.2 + (lv && engine.playing ? v * 3.6 : idle); bars[i].scale.y += (h - bars[i].scale.y) * 0.35; bars[i].position.y = bars[i].scale.y / 2 - 0.4; if (i < 6) bass += v / 6;
    }
    const s = 1 + bass * 0.5; core.scale.setScalar(s * 0.82); core.rotation.x = t * 0.3; core.rotation.y = t * 0.45;
    ring.rotation.y = reduce ? 0 : t * 0.12; pts.rotation.y = t * 0.02;
    ring.position.x += ((innerWidth > 860 && home ? 5.7 : 0) - ring.position.x) * 0.06; const ty = innerWidth <= 860 && home ? -5.4 : 0; ring.position.y += (ty - ring.position.y) * 0.06; core.position.x = ring.position.x; core.position.y = ring.position.y;
    cam.position.x += (ptr.x * 2 - cam.position.x) * 0.04; cam.position.y += (2.2 - ptr.y * 2 - cam.position.y) * 0.04; cam.lookAt(ring.position.x * .6, ring.position.y * .5, 0);
    r.render(scene, cam);
  }
  frame();
  return { setHome(h) { home = h; canvas.style.opacity = h ? (innerWidth > 860 ? 1 : 0.3) : 0.35; } };
}
