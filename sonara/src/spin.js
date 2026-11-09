import * as THREE from 'three';
import { engine } from './audio.js';
/* 360 degree viewer: a turntable and speaker pair you can spin all the way round. Reacts to the running audio. */
export function initSpin(box, onAngle) {
  let r; try { r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return null; }
  r.setPixelRatio(Math.min(devicePixelRatio, 1.5)); box.appendChild(r.domElement); r.domElement.className = 'padgl';
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(34, 1, 0.1, 60); cam.position.set(0, 7.5, 18);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5)); const k = new THREE.DirectionalLight(0xffffff, 1.6); k.position.set(5, 9, 6); scene.add(k);
  const rim = new THREE.PointLight(0xff6a3d, 50, 24); rim.position.set(-6, 3, -4); scene.add(rim);
  let hue = 0.03; const col = (o = 0, l = 0.55) => new THREE.Color().setHSL((hue + o) % 1, 0.85, l);
  const g = new THREE.Group(); scene.add(g);
  const M = (c, rough = .35, met = .5) => new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: met });
  /* turntable */
  const deck = new THREE.Group(); deck.position.x = -0.6; g.add(deck);
  deck.add(new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.6, 4.2), M(0x16161d)));
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.12, 64), M(0x2b2b35, .3, .8)); plat.position.set(-0.3, 0.36, 0); deck.add(plat);
  const vinyl = new THREE.Group(); vinyl.position.set(-0.3, 0.46, 0); deck.add(vinyl);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.05, 64), M(0x050507, .25, .3)); vinyl.add(disc);
  for (let i = 1; i < 6; i++) { const gr = new THREE.Mesh(new THREE.RingGeometry(0.55 + i * 0.17, 0.57 + i * 0.17, 64), new THREE.MeshBasicMaterial({ color: 0x1b1b22, side: THREE.DoubleSide })); gr.rotation.x = -Math.PI / 2; gr.position.y = 0.03; vinyl.add(gr); }
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 40), new THREE.MeshBasicMaterial({ color: col(0, .5) })); label.position.y = 0.01; vinyl.add(label);
  const dot = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.07, 0.06), new THREE.MeshBasicMaterial({ color: 0xffffff })); dot.position.set(0.9, 0.04, 0); vinyl.add(dot);
  const arm = new THREE.Group(); arm.position.set(1.85, 0.5, -1.4); deck.add(arm);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 12), M(0xcfcfd8, .2, .9)); bar.rotation.z = Math.PI / 2; bar.position.x = -1.3; arm.add(bar);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.22), M(0x222)); head.position.x = -2.6; arm.add(head);
  const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.3, 24), M(0x2b2b35, .3, .8)); arm.add(pivot);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: col(0, .6) })); led.position.set(2.1, 0.36, 1.6); deck.add(led);
  /* speakers */
  const cones = [], spk = [];
  for (const sx of [-1, 1]) {
    const s = new THREE.Group(); s.position.set(sx * 4.4 + 0.2, 1.3, -0.2); s.rotation.y = -sx * 0.35; g.add(s);
    s.add(new THREE.Mesh(new THREE.BoxGeometry(1.9, 3.4, 1.7), M(0x14141b, .6, .2)));
    for (const [y, rad] of [[0.55, .62], [-0.85, .45]]) { const rg = new THREE.Mesh(new THREE.TorusGeometry(rad + .08, .06, 12, 40), new THREE.MeshBasicMaterial({ color: col(0, .5) })); rg.position.set(0, y + 0.0, 0.86); s.add(rg); const cone = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad * .55, 0.22, 36), M(0x0a0a0d, .5, .3)); cone.rotation.x = Math.PI / 2; cone.position.set(0, y, 0.82); s.add(cone); cones.push(cone); spk.push(rg); }
  }
  const floor = new THREE.Mesh(new THREE.CircleGeometry(9, 64), new THREE.MeshBasicMaterial({ color: col(0, .2), transparent: true, opacity: 0.12 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.4; g.add(floor);
  /* interaction */
  let rotY = 0.6, vel = 0, drag = null, tilt = 0.12, tTilt = .12; const el = r.domElement; el.style.cursor = 'grab';
  el.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, ry: rotY, t: tTilt }; vel = 0; el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; });
  el.addEventListener('pointermove', e => { if (!drag) return; const nr = drag.ry + (e.clientX - drag.x) * 0.012; vel = nr - rotY; rotY = nr; tTilt = Math.max(-0.2, Math.min(0.65, drag.t + (e.clientY - drag.y) * 0.004)); });
  const end = () => { drag = null; el.style.cursor = 'grab'; }; el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  let goal = null; const size = () => { const w = box.clientWidth || 400, h = box.clientHeight || 400; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; new ResizeObserver(size).observe(box); size();
  let vis = true, alive = true, last = 0, spin = 0, armA = 0.0, bass = 0; const io = new IntersectionObserver(es => { vis = es[0].isIntersecting; }); io.observe(box); const t0 = performance.now(); let reported = -1;
  (function frame() {
    if (!alive || !box.isConnected) { alive = false; r.dispose(); return; } requestAnimationFrame(frame); if (!vis || document.hidden) return;
    const now = performance.now(); if (now - last < 33) return; last = now; const t = (now - t0) / 1000;
    if (goal != null) { rotY += (goal - rotY) * 0.12; if (Math.abs(goal - rotY) < 0.003) goal = null; } else if (drag) { } else { rotY += vel; vel *= 0.94; if (Math.abs(vel) < 0.0006) rotY += 0.004; }
    tilt += (tTilt - tilt) * 0.1; g.rotation.y = rotY; g.rotation.x = tilt; cam.lookAt(0, 0.4, 0);
    const lv = engine.levels(), play = engine.playing && lv; let b = 0; if (play) { for (let i = 0; i < 6; i++) b += lv[i] / 255 / 6; } bass += (b - bass) * 0.5;
    spin += play ? 0.075 + bass * 0.05 : 0; vinyl.rotation.y = spin; armA += ((play ? 0.34 : 0) - armA) * 0.06; arm.rotation.y = armA;
    cones.forEach((c, i) => { const s = 1 + bass * (i % 2 ? .25 : .45); c.scale.set(s, 1, s); c.position.z = (i % 2 ? .82 : .82) + bass * 0.12; });
    spk.forEach(s => s.material.color.copy(col(0, .35 + bass * .5))); label.material.color.copy(col(0, .5)); led.material.color.copy(col(0, play ? .7 : .25));
    const deg = Math.round(((rotY * 180 / Math.PI) % 360 + 360) % 360); if (deg !== reported) { reported = deg; onAngle && onAngle(deg); }
    r.render(scene, cam);
  })();
  return {
    setHue(h) { hue = h / 360; rim.color.copy(col(0, .55)); },
    view(name) { goal = { front: 0, side: Math.PI / 2, back: Math.PI, top: 0 }[name] + Math.round(rotY / (Math.PI * 2)) * Math.PI * 2; tTilt = name === 'top' ? 0.65 : 0.12; },
    destroy() { alive = false; r.dispose(); io.disconnect(); },
  };
}
