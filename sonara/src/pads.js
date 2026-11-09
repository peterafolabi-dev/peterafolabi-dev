import * as THREE from 'three';
/* A playable 3D drum machine. Click pads, drag to spin. Pads flash with the running sequencer. */
export function initPads(box, { onHit, labels }) {
  let r; try { r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return null; }
  r.setPixelRatio(Math.min(devicePixelRatio, 1.5)); box.appendChild(r.domElement); r.domElement.className = 'padgl';
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, 0.1, 50); cam.position.set(0, 8.6, 11.4); cam.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55)); const k = new THREE.DirectionalLight(0xffffff, 1.5); k.position.set(4, 9, 6); scene.add(k);
  const rim = new THREE.PointLight(0xff6a3d, 40, 20); rim.position.set(-5, 2, -3); scene.add(rim);
  let hue = 0.03; const col = (o = 0, l = 0.55) => new THREE.Color().setHSL((hue + o) % 1, 0.85, l);
  const g = new THREE.Group(); scene.add(g);
  const body = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.9, 5.6), new THREE.MeshStandardMaterial({ color: 0x15151d, roughness: 0.35, metalness: 0.6 })); g.add(body);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.12, 5.7), new THREE.MeshBasicMaterial({ color: col(0, .5) })); trim.position.y = -0.3; g.add(trim);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.06, 5.2), new THREE.MeshStandardMaterial({ color: 0x0b0b10, roughness: 0.5, metalness: 0.3 })); plate.position.y = 0.46; g.add(plate);
  /* screen */
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 96; const cx = cv.getContext('2d'), tex = new THREE.CanvasTexture(cv);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.6), new THREE.MeshBasicMaterial({ map: tex })); screen.rotation.x = -Math.PI / 2; screen.position.set(-0.9, 0.5, -2.05); g.add(screen);
  let title = 'SONARA', sub = 'tap the pads';
  function paint(step = -1) { cx.fillStyle = '#05060a'; cx.fillRect(0, 0, 512, 96); cx.fillStyle = `hsl(${hue * 360} 90% 62%)`; cx.font = '700 38px Space Grotesk,system-ui,sans-serif'; cx.fillText(title.slice(0, 18), 16, 44); cx.font = '500 22px system-ui,sans-serif'; cx.globalAlpha = .7; cx.fillText(sub, 16, 78); cx.globalAlpha = 1; for (let i = 0; i < 16; i++) { cx.fillStyle = i === step ? `hsl(${hue * 360} 95% 65%)` : 'rgba(255,255,255,.14)'; cx.fillRect(300 + i * 12, 60, 8, 22); } tex.needsUpdate = true; }
  paint();
  /* knobs */
  const knobs = []; for (let i = 0; i < 3; i++) { const kb = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.34, 28), new THREE.MeshStandardMaterial({ color: 0x24242e, metalness: 0.8, roughness: 0.25 })); kb.position.set(1.5 + i * 0.9, 0.62, -2.05); const mk = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.3), new THREE.MeshBasicMaterial({ color: col(0, .6) })); mk.position.set(0, 0.19, -0.14); kb.add(mk); g.add(kb); knobs.push(kb); }
  /* pads */
  const pads = [], pg = new THREE.BoxGeometry(1.1, 0.34, 1.1);
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 4), c = i % 4, m = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ color: 0x1d1d27, roughness: 0.3, metalness: 0.2, emissive: col(i / 16 * 0.5), emissiveIntensity: 0.05 }));
    m.position.set(-2.0 + c * 1.35, 0.66, -0.75 + row * 1.35 - 0.1); m.userData = { i, y: 0.66, hit: 0, base: col(i / 16 * 0.5) }; g.add(m); pads.push(m);
  }
  const ray = new THREE.Raycaster(), mp = new THREE.Vector2(); let drag = null, rotY = -0.35, rotX = 0, tY = rotY, tX = 0, hov = -1, down = null;
  const pick = e => { const b = r.domElement.getBoundingClientRect(); mp.set((e.clientX - b.left) / b.width * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); ray.setFromCamera(mp, cam); const h = ray.intersectObjects(pads, false)[0]; return h ? h.object.userData.i : -1; };
  const el = r.domElement; el.style.touchAction = 'pan-y'; el.style.cursor = 'grab';
  el.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, i: pick(e), moved: false, ry: tY, rx: tX }; el.setPointerCapture(e.pointerId); if (down.i >= 0) { hitPad(down.i); } });
  el.addEventListener('pointermove', e => {
    if (down) { const dx = e.clientX - down.x, dy = e.clientY - down.y; if (Math.abs(dx) + Math.abs(dy) > 6) down.moved = true; if (down.i < 0 || down.moved) { tY = down.ry + dx * 0.008; tX = Math.max(-0.5, Math.min(0.5, down.rx + dy * 0.004)); el.style.cursor = 'grabbing'; } }
    else { hov = pick(e); el.style.cursor = hov >= 0 ? 'pointer' : 'grab'; }
  });
  const up = () => { down = null; el.style.cursor = 'grab'; }; el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('pointerleave', () => { hov = -1; });
  function hitPad(i) { pads[i].userData.hit = 1; const l = labels(i); title = l[0]; sub = l[1]; onHit(i); }
  const size = () => { const w = box.clientWidth || 400, h = box.clientHeight || 400; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  new ResizeObserver(size).observe(box); size();
  let vis = true, alive = true, auto = 0, last = 0; const io = new IntersectionObserver(es => { vis = es[0].isIntersecting; }); io.observe(box); const t0 = performance.now();
  let flash = new Set(), chase = -1;
  (function frame() {
    if (!alive || !box.isConnected) { alive = false; r.dispose(); return; } requestAnimationFrame(frame); if (!vis || document.hidden) return;
    const now = performance.now(); if (now - last < 33) return; last = now;
    const t = (now - t0) / 1000;
    if (!down) { auto = Math.sin(t * 0.5) * 0.12; } rotY += ((tY + auto) - rotY) * 0.1; rotX += (tX - rotX) * 0.1; g.rotation.y = rotY; g.rotation.x = rotX; g.position.y = Math.sin(t * 1.2) * 0.08;
    knobs.forEach((kb, i) => { kb.rotation.y = Math.sin(t * 0.6 + i) * 1.2; });
    for (const p of pads) { const u = p.userData; u.hit *= 0.88; const f = flash.has(u.i) ? 1 : 0; const glow = Math.max(u.hit, f * 0.9, u.i === hov ? 0.25 : 0, u.i === chase ? 0.18 : 0); p.material.emissive.copy(u.base); p.material.emissiveIntensity = 0.06 + glow * 1.5; p.position.y = u.y - u.hit * 0.14 + (u.i === hov ? 0.04 : 0); }
    rim.color.copy(col(0, .55)); r.render(scene, cam);
  })();
  return {
    setHue(h) { hue = h / 360; trim.material.color.copy(col(0, .5)); pads.forEach(p => p.userData.base = col(p.userData.i / 16 * 0.5)); rim.color.copy(col(0, .55)); knobs.forEach(k => k.children[0].material.color.copy(col(0, .6))); paint(); },
    setStep(i, set, name) { chase = i % 16; flash = new Set(set); if (name) { title = name; } sub = 'step ' + (chase + 1) + ' / 16'; paint(chase); },
    idle(name, s) { chase = -1; flash = new Set(); title = name; sub = s; paint(); },
    destroy() { alive = false; r.dispose(); io.disconnect(); },
  };
}
