import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const FINISHES = {
  Obsidian: '#1b1b1d', Ember: '#ff5a2c', Sage: '#6f8f72', Bone: '#e9e2d3', Cobalt: '#2d4fd8', Gold: '#b8923a', Sand: '#c9b79a', Rose: '#d99a8a', Slate: '#4b5563',
};

function makeMats(accent = '#ff5a2c') {
  return {
    shell: new THREE.MeshPhysicalMaterial({ color: '#1b1b1d', roughness: 0.28, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12 }),
    metal: new THREE.MeshStandardMaterial({ color: '#b9b4ab', roughness: 0.22, metalness: 1 }),
    dark: new THREE.MeshStandardMaterial({ color: '#0e0d0c', roughness: 0.7, metalness: 0.1 }),
    fabric: new THREE.MeshStandardMaterial({ color: '#1a1816', roughness: 0.95 }),
    leather: new THREE.MeshPhysicalMaterial({ color: '#2a1d16', roughness: 0.45, sheen: 0.6, sheenColor: new THREE.Color('#7a5a44') }),
    accent: new THREE.MeshStandardMaterial({ color: accent, roughness: 0.35, metalness: 0.4, emissive: accent, emissiveIntensity: 0.25 }),
    driver: new THREE.MeshStandardMaterial({ color: '#8c8579', roughness: 0.3, metalness: 0.9 }),
    satin: new THREE.MeshStandardMaterial({ color: '#a9a49b', roughness: 0.5, metalness: 0.9 }),
  };
}

function kit() {
  const group = new THREE.Group();
  const parts = [];
  const add = (parent, mesh, dir, amt) => {
    mesh.castShadow = true; mesh.receiveShadow = true;
    parent.add(mesh);
    parts.push({ obj: mesh, base: mesh.position.clone(), dir: new THREE.Vector3(...dir).normalize(), amt });
    return mesh;
  };
  return { group, parts, add };
}

/* ---- over-ear headphones (HALO One, HALO Studio) ---- */
function buildOverEar(accentHex) {
  const m = makeMats(accentHex || '#ff5a2c');
  const { group, parts, add } = kit();
  const band = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.055, 24, 160, Math.PI), m.metal);
  band.position.set(0, 0.35, 0);
  add(group, band, [0, 1, 0], 1.1);
  const pad = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.13, 20, 120, Math.PI * 0.62), m.leather);
  pad.rotation.z = Math.PI * 0.19; pad.scale.set(1, 1, 0.9); pad.position.set(0, 0.28, 0);
  add(group, pad, [0, 0.6, 0], 0.9);
  const cushions = [];
  for (const s of [-1, 1]) {
    const side = new THREE.Group();
    side.position.set(s * 1.32, 0.35, 0);
    group.add(side);
    const yoke = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.5, 0.2, 4, 0.05), m.satin);
    yoke.position.set(0, -0.22, 0);
    add(side, yoke, [s, 0.4, 0], 0.5);
    const yokeRing = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 12, 32), m.accent);
    yokeRing.rotation.y = Math.PI / 2; yokeRing.position.set(s * 0.02, -0.02, 0);
    add(side, yokeRing, [s, 0.9, 0], 0.7);
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.3, 64), m.shell);
    shell.rotation.z = Math.PI / 2; shell.position.set(s * 0.14, -0.72, 0);
    add(side, shell, [s, 0, 0], 1.0);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.58, 0.07, 64), m.shell);
    cap.rotation.z = Math.PI / 2; cap.position.set(s * 0.33, -0.72, 0);
    add(side, cap, [s, 0, 0], 1.7);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.016, 12, 80), m.accent);
    ring.rotation.y = Math.PI / 2; ring.position.set(s * 0.375, -0.72, 0);
    add(side, ring, [s, 0, 0], 2.2);
    const logo = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 12, 48), m.metal);
    logo.rotation.y = Math.PI / 2; logo.position.set(s * 0.38, -0.72, 0);
    add(side, logo, [s, 0, 0], 2.4);
    const driver = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 48), m.driver);
    driver.rotation.z = Math.PI / 2; driver.position.set(-s * 0.1, -0.72, 0);
    add(side, driver, [-s, 0, 0], 0.9);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.accent);
    dome.rotation.z = -s * Math.PI / 2; dome.position.set(-s * 0.13, -0.72, 0);
    add(side, dome, [-s, 0, 0], 1.2);
    const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.17, 28, 72), m.fabric);
    cushion.rotation.y = Math.PI / 2; cushion.scale.set(1, 1.12, 1); cushion.position.set(-s * 0.27, -0.72, 0);
    add(side, cushion, [-s, 0, 0], 1.9);
    cushions.push(cushion);
    const grill = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.015, 48), m.dark);
    grill.rotation.z = Math.PI / 2; grill.position.set(-s * 0.16, -0.72, 0);
    add(side, grill, [-s, 0, 0], 1.4);
  }
  group.position.y = 0.25;
  return { group, parts, mats: m, scale: 1, cushions, lift: 0 };
}

/* ---- earbuds + case (HALO Air) ---- */
function buildBuds(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.75, 1.0, 8, 0.24), m.shell);
  body.position.set(0, -0.55, 0);
  add(group, body, [0, -1, 0], 0.7);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.45, 1.0, 8, 0.2), m.shell);
  lid.position.set(0, 0.0, 0);
  add(group, lid, [0, 1, 0], 0.9);
  const seam = new THREE.Mesh(new RoundedBoxGeometry(1.72, 0.03, 1.02, 2, 0.01), m.accent);
  seam.position.set(0, -0.2, 0);
  add(group, seam, [0, 0.3, 0], 0.4);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), m.accent);
  led.position.set(0, -0.4, 0.5);
  add(group, led, [0, 0, 1], 0.5);
  for (const s of [-1, 1]) {
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 48, 32), m.shell);
    head.scale.set(1, 1.08, 0.95); head.position.set(s * 0.52, 0.92, 0); head.rotation.z = -s * 0.25;
    add(group, head, [s, 1, 0], 1.1);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.62, 24), m.metal);
    stem.position.set(s * 0.6, 0.45, 0); stem.rotation.z = s * 0.12;
    add(group, stem, [s, 0.4, 0], 1.0);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.015, 12, 48), m.accent);
    ring.position.set(s * 0.52, 0.92, 0.28); ring.rotation.set(0, 0, -s * 0.25);
    add(group, ring, [s * 0.4, 0.8, 1], 1.0);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), m.fabric);
    tip.position.set(s * 0.52 + s * 0.28, 0.98, 0); tip.scale.set(1.1, 0.8, 0.9);
    add(group, tip, [s, 0.3, 0], 1.1);
  }
  group.position.y = 0.2;
  return { group, parts, mats: m, scale: 1.45, cushions: [], lift: 0 };
}

/* ---- speaker (HALO Pulse) ---- */
function dotTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#17161a'; g.fillRect(0, 0, 128, 128);
  g.fillStyle = '#34323a';
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.beginPath(); g.arc(8 + x * 16 + (y % 2) * 8, 8 + y * 16, 3.4, 0, 6.3); g.fill(); }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 3); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
function buildSpeaker(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const top = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0, 0.9), new THREE.Vector2(0.7, 0.9), new THREE.Vector2(0.8, 0.82), new THREE.Vector2(0.82, 0.55), new THREE.Vector2(0, 0.55),
  ].map(v => v), 64), m.shell);
  top.material.side = THREE.DoubleSide;
  add(group, top, [0, 1, 0], 1.4);
  const bottom = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0, -0.9), new THREE.Vector2(0.7, -0.9), new THREE.Vector2(0.8, -0.82), new THREE.Vector2(0.82, -0.55), new THREE.Vector2(0, -0.55),
  ], 64), m.shell);
  bottom.material.side = THREE.DoubleSide;
  add(group, bottom, [0, -1, 0], 1.2);
  const grillMat = new THREE.MeshStandardMaterial({ map: dotTexture(), roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 1.1, 64, 1, true), grillMat);
  add(group, band, [0, 0, 0], 0);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.08, 48), m.dark);
  add(group, core, [0, 0, 0], 0);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.35, 48, 1, true), m.driver);
  cone.material = m.driver.clone(); cone.material.side = THREE.DoubleSide;
  cone.position.set(0, 0.2, 0);
  add(group, cone, [0, 0.3, 0], 0.6);
  const woofer = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 12, 64), m.accent);
  woofer.rotation.x = Math.PI / 2; woofer.position.set(0, 0.38, 0);
  add(group, woofer, [0, 0.6, 0], 0.9);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.025, 12, 80), m.accent);
  ring.rotation.x = Math.PI / 2; ring.position.set(0, 0.905, 0);
  add(group, ring, [0, 1, 0], 2.0);
  for (let i = -1; i <= 1; i++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 24), i === 0 ? m.accent : m.metal);
    b.position.set(i * 0.3, 0.925, 0.02);
    add(group, b, [i * 0.3, 1, 0], 2.4);
  }
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.045, 12, 40, Math.PI), m.fabric);
  strap.position.set(0, 0.92, -0.62); strap.rotation.set(0, 0, 0);
  add(group, strap, [0, 1, -1], 1.2);
  const foot = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.05, 12, 64), m.dark);
  foot.rotation.x = Math.PI / 2; foot.position.set(0, -0.9, 0);
  add(group, foot, [0, -1, 0], 1.8);
  group.position.y = 0;
  return { group, parts, mats: m, scale: 1.25, cushions: [], lift: 0 };
}


/* ---- helpers for the extended lineup ---- */
function grillMat(rx, ry) {
  const t = dotTexture(); t.repeat.set(rx, ry);
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide });
}
function between(a, b, r, mat, seg = 16) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const len = A.distanceTo(B);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
  mesh.position.copy(A).add(B).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  return mesh;
}

/* ---- HALO Bar (soundbar) ---- */
function buildBar(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const body = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.44, 0.72, 6, 0.15), m.shell);
  add(group, body, [0, 0, -1], 0.5);
  const grill = new THREE.Mesh(new RoundedBoxGeometry(3.28, 0.3, 0.06, 2, 0.02), grillMat(18, 1.2));
  grill.position.set(0, 0, 0.35);
  add(group, grill, [0, 0, 1], 0.9);
  const strip = new THREE.Mesh(new RoundedBoxGeometry(2.6, 0.025, 0.34, 2, 0.01), m.accent);
  strip.position.set(0, 0.225, 0);
  add(group, strip, [0, 1, 0], 0.8);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), m.accent);
  led.position.set(1.5, 0.12, 0.37);
  add(group, led, [1, 0.4, 1], 0.7);
  for (const s of [-1, 1]) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32), m.metal);
    cap.rotation.z = Math.PI / 2; cap.position.set(s * 1.72, 0, 0);
    add(group, cap, [s, 0, 0], 0.7);
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.09, 0.44, 3, 0.03), m.dark);
    foot.position.set(s * 1.35, -0.26, 0);
    add(group, foot, [0, -1, 0], 0.6);
  }
  group.position.y = 0;
  return { group, parts, mats: m, scale: 0.82, cushions: [], lift: 0 };
}

/* ---- HALO Spin (turntable) ---- */
function buildTurntable(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(2.7, 0.32, 2.0, 6, 0.09), m.shell);
  plinth.position.set(0, -0.3, 0);
  add(group, plinth, [0, -1, 0], 0.5);
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.08, 64), m.metal);
  platter.position.set(-0.3, -0.1, 0);
  add(group, platter, [0, 1, 0], 0.5);
  const rec = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.03, 96), m.dark);
  rec.position.set(-0.3, -0.045, 0);
  add(group, rec, [0, 1, 0], 1.0);
  for (const r of [0.45, 0.6, 0.72]) {
    const groove = new THREE.Mesh(new THREE.TorusGeometry(r, 0.004, 6, 96), m.driver);
    groove.rotation.x = Math.PI / 2; groove.position.set(-0.3, -0.028, 0);
    add(group, groove, [0, 1, 0], 1.1);
  }
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.036, 48), m.accent);
  label.position.set(-0.3, -0.043, 0);
  add(group, label, [0, 1, 0], 1.3);
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 12), m.metal);
  spindle.position.set(-0.3, 0.04, 0);
  add(group, spindle, [0, 1, 0], 1.8);
  const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.16, 24), m.metal);
  pivot.position.set(0.98, -0.06, -0.6);
  add(group, pivot, [1, 1, -1], 0.7);
  const armFrom = [0.98, 0.04, -0.6], armTo = [0.12, 0.0, 0.1];
  const arm = between(armFrom, armTo, 0.02, m.metal, 12);
  add(group, arm, [0, 1, 0], 1.2);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.1), m.accent);
  head.position.set(0.1, -0.01, 0.12); head.rotation.y = -0.7;
  add(group, head, [-1, 1, 1], 1.4);
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.08, 24), m.dark);
    foot.position.set(x * 1.15, -0.5, z * 0.8);
    add(group, foot, [x, -1, z], 0.5);
  }
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 24), m.metal);
  knob.position.set(1.1, -0.13, 0.7);
  add(group, knob, [1, 1, 1], 0.7);
  group.position.y = 0.25;
  return { group, parts, mats: m, scale: 1.0, cushions: [], lift: 0 };
}

/* ---- HALO Mic (USB condenser) ---- */
function buildMic(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const gm = grillMat(8, 3);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.0, 48, 1, true), gm);
  body.position.set(0, 0.75, 0);
  add(group, body, [0, 1, 0], 0.5);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.38, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), gm);
  dome.position.set(0, 1.25, 0);
  add(group, dome, [0, 1, 0], 1.0);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.96, 32), m.dark);
  core.position.set(0, 0.75, 0);
  add(group, core, [0, 1, 0], 0.2);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 48), m.metal);
  collar.position.set(0, 0.2, 0);
  add(group, collar, [0, -1, 0], 0.5);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 12, 64), m.accent);
  ring.rotation.x = Math.PI / 2; ring.position.set(0, 0.29, 0);
  add(group, ring, [0, 1, 0], 0.7);
  const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 12, 64, Math.PI), m.shell);
  yoke.rotation.z = Math.PI; yoke.position.set(0, 0.78, 0);
  add(group, yoke, [0, 0, 1], 0.9);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.95, 20), m.metal);
  stem.position.set(0, -0.28, 0);
  add(group, stem, [0, -1, 0], 0.6);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.78, 0.12, 64), m.shell);
  base.position.set(0, -0.8, 0);
  add(group, base, [0, -1, 0], 1.1);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 24), m.accent);
  knob.position.set(0, -0.72, 0.5);
  add(group, knob, [0, 1, 1], 0.9);
  group.position.y = -0.3;
  return { group, parts, mats: m, scale: 0.95, cushions: [], lift: 0 };
}

/* ---- HALO Orb (smart speaker) ---- */
function buildOrb(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const lowerMat = m.fabric.clone(); lowerMat.side = THREE.DoubleSide;
  const lower = new THREE.Mesh(new THREE.SphereGeometry(0.76, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), lowerMat);
  add(group, lower, [0, -1, 0], 0.7);
  m.shell.side = THREE.DoubleSide;
  const upper = new THREE.Mesh(new THREE.SphereGeometry(0.76, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), m.shell);
  add(group, upper, [0, 1, 0], 0.8);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.762, 0.02, 12, 96), m.accent);
  ring.rotation.x = Math.PI / 2;
  add(group, ring, [0, 0.2, 0], 0.9);
  const touch = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.02, 48), m.dark);
  touch.position.set(0, 0.745, 0);
  add(group, touch, [0, 1, 0], 1.6);
  const led = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.012, 8, 64), m.accent);
  led.rotation.x = Math.PI / 2; led.position.set(0, 0.76, 0);
  add(group, led, [0, 1, 0], 1.9);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.07, 40), m.dark);
  foot.position.set(0, -0.76, 0);
  add(group, foot, [0, -1, 0], 1.3);
  group.position.y = 0.05;
  return { group, parts, mats: m, scale: 1.5, cushions: [], lift: 0 };
}

/* ---- HALO Dock (charging stand) ---- */
function buildDock(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.02, 0.14, 64), m.shell);
  base.position.set(0, -0.62, 0);
  add(group, base, [0, -1, 0], 0.6);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.02, 12, 80), m.accent);
  ring.rotation.x = Math.PI / 2; ring.position.set(0, -0.545, 0);
  add(group, ring, [0, 1, 0], 0.6);
  const stem = new THREE.Mesh(new RoundedBoxGeometry(0.26, 1.25, 0.14, 4, 0.05), m.metal);
  stem.position.set(0, 0.0, -0.18); stem.rotation.x = -0.16;
  add(group, stem, [0, 1, -1], 0.8);
  const cradle = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.2, 0.5, 5, 0.09), m.shell);
  cradle.position.set(0, -0.35, 0.18);
  add(group, cradle, [0, 0, 1], 0.9);
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 32), m.accent);
  pad.position.set(0, -0.24, 0.18);
  add(group, pad, [0, 1, 0], 1.3);
  const cable = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 40, Math.PI * 1.2), m.fabric);
  cable.position.set(0.85, -0.55, 0.4); cable.rotation.x = Math.PI / 2;
  add(group, cable, [1, 0, 1], 0.8);
  group.position.y = 0.2;
  return { group, parts, mats: m, scale: 1.2, cushions: [], lift: 0 };
}

/* ---- HALO Sport (neckband earbuds) ---- */
function buildSport(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const band = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.07, 24, 120, Math.PI * 1.25), m.shell);
  band.rotation.z = -Math.PI * 1.125; band.position.set(0, 0.2, 0);
  add(group, band, [0, -1, 0], 0.8);
  for (const s of [-1, 1]) {
    const pod = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.24, 0.28, 4, 0.08), m.shell);
    pod.position.set(s * 0.58, -0.76, 0); pod.rotation.z = s * 0.45;
    add(group, pod, [s, -1, 0], 1.0);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), m.accent);
    led.position.set(s * 0.58, -0.76, 0.15); 
    add(group, led, [s, -1, 1], 1.1);
    const wire = between([s * 1.016, 0.62, 0], [s * 1.04, 1.0, 0.05], 0.02, m.dark, 8);
    add(group, wire, [s, 1, 0], 0.5);
    const bud = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 24), m.shell);
    bud.scale.set(1, 1.05, 0.95); bud.position.set(s * 1.05, 1.15, 0.05);
    add(group, bud, [s, 1, 0], 1.0);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 14), m.fabric);
    tip.position.set(s * 0.86, 1.15, 0.05); tip.scale.set(1.1, 0.9, 0.9);
    add(group, tip, [-s, 0.4, 0], 0.9);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.012, 8, 32), m.accent);
    ring.position.set(s * 1.05, 1.15, 0.2);
    add(group, ring, [s * 0.3, 0.4, 1], 0.8);
  }
  group.position.y = -0.1;
  return { group, parts, mats: m, scale: 1.05, cushions: [], lift: 0 };
}

/* ---- HALO Rift (wireless gaming headset) ---- */
function buildRift(accent) {
  const base = buildOverEar(accent || '#6dff3a');
  const { group, parts, mats: m } = base;
  const push = (mesh, dir, amt) => {
    mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh);
    parts.push({ obj: mesh, base: mesh.position.clone(), dir: new THREE.Vector3(...dir).normalize(), amt });
  };
  push(between([-1.7, -0.37, 0.15], [-1.62, -0.55, 0.62], 0.028, m.metal, 12), [-1, 0, 1], 1.4);
  push(between([-1.62, -0.55, 0.62], [-1.28, -0.95, 1.05], 0.022, m.dark, 12), [-1, -0.4, 1], 1.8);
  const tip = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.12, 8, 16), m.accent);
  tip.position.set(-1.2, -1.02, 1.12); tip.rotation.set(0.9, 0.2, 0.5);
  push(tip, [-0.5, -0.5, 1], 2.1);
  const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 24), m.metal);
  pivot.rotation.z = Math.PI / 2; pivot.position.set(-1.72, -0.37, 0.1);
  push(pivot, [-1, 0, 0], 2.6);
  return { ...base, scale: 0.95 };
}

/* ---- HALO Monitor (studio monitor speaker) ---- */
function buildMonitor(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.35, 2.1, 1.15, 6, 0.1), m.shell);
  add(group, body, [0, 0, -1], 0.5);
  const baffle = new THREE.Mesh(new RoundedBoxGeometry(1.25, 2.0, 0.06, 3, 0.03), m.dark);
  baffle.position.set(0, 0, 0.58);
  add(group, baffle, [0, 0, 1], 0.5);
  const woofer = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.045, 14, 64), m.metal);
  woofer.position.set(0, -0.35, 0.62);
  add(group, woofer, [0, 0, 1], 1.0);
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.14, 0.12, 48), m.driver);
  cone.rotation.x = Math.PI / 2; cone.position.set(0, -0.35, 0.58);
  add(group, cone, [0, 0, 1], 1.4);
  const dust = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.accent);
  dust.rotation.x = Math.PI / 2; dust.position.set(0, -0.35, 0.66);
  add(group, dust, [0, 0, 1], 1.8);
  const tw = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 12, 48), m.metal);
  tw.position.set(0, 0.62, 0.62);
  add(group, tw, [0, 0, 1], 1.0);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.accent);
  dome.rotation.x = Math.PI / 2; dome.position.set(0, 0.62, 0.64);
  add(group, dome, [0, 0, 1], 1.6);
  const port = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 10, 36), m.dark);
  port.position.set(0.0, -0.88, 0.62);
  add(group, port, [0, -1, 1], 0.8);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), m.accent);
  led.position.set(0.5, -0.92, 0.62);
  add(group, led, [1, -1, 1], 0.9);
  group.position.y = 0;
  return { group, parts, mats: m, scale: 0.9, cushions: [], lift: 0 };
}

/* ---- HALO Amp (DAC / headphone amplifier) ---- */
function buildAmp(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const body = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.6, 1.7, 6, 0.1), m.shell);
  add(group, body, [0, 0, 0], 0);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 0.04), m.satin);
  panel.position.set(0, 0, 0.86);
  add(group, panel, [0, 0, 1], 0.6);
  const disp = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.02), m.accent);
  disp.position.set(0, 0.1, 0.89);
  add(group, disp, [0, 0.4, 1], 1.0);
  for (const x of [-0.75, 0.75]) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.12, 40), m.dark);
    knob.rotation.x = Math.PI / 2; knob.position.set(x, -0.02, 0.93);
    add(group, knob, [x, 0, 1], 1.2);
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.01), m.accent);
    mark.position.set(x, 0.07, 1.0);
    add(group, mark, [x, 0.3, 1], 1.5);
  }
  for (const x of [-0.25, 0.0, 0.25]) {
    const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 20), m.dark);
    jack.rotation.x = Math.PI / 2; jack.position.set(x, -0.16, 0.9);
    add(group, jack, [0, -0.3, 1], 0.9);
  }
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.06, 20), m.dark);
    f.position.set(x * 0.95, -0.33, z * 0.65);
    add(group, f, [x, -1, z], 0.5);
  }
  group.position.y = 0.1;
  return { group, parts, mats: m, scale: 1.15, cushions: [], lift: 0 };
}

/* ---- HALO Stand (headphone stand) ---- */
function buildStand(accent) {
  const m = makeMats(accent || '#ff5a2c');
  const { group, parts, add } = kit();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.92, 0.14, 64), m.shell);
  base.position.set(0, -0.95, 0);
  add(group, base, [0, -1, 0], 0.7);
  const pad = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.018, 10, 64), m.accent);
  pad.rotation.x = Math.PI / 2; pad.position.set(0, -0.875, 0);
  add(group, pad, [0, 1, 0], 0.5);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.8, 24), m.metal);
  stem.position.set(0, 0.0, 0);
  add(group, stem, [0, 0, 0], 0);
  const neck = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.06, 16, 48, Math.PI), m.metal);
  neck.position.set(0, 0.9, 0);
  add(group, neck, [0, 1, 0], 0.9);
  const rest = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.5, 8, 20), m.fabric);
  rest.rotation.z = Math.PI / 2; rest.position.set(0, 1.26, 0);
  add(group, rest, [0, 1, 0], 1.6);
  group.position.y = 0;
  return { group, parts, mats: m, scale: 1.0, cushions: [], lift: 0 };
}

export const BUILDERS = {
  'over-ear': a => buildOverEar(a),
  studio: a => buildOverEar(a || '#d4a63c'),
  buds: buildBuds, speaker: buildSpeaker, bar: buildBar, turntable: buildTurntable, mic: buildMic, orb: buildOrb, dock: buildDock, sport: buildSport, rift: buildRift,
  monitor: buildMonitor, amp: buildAmp, stand: buildStand,
};

export function recolor(model, hex) { model.mats.shell.color.set(hex); }

/* ---- thumbnail renderer ---- */
let tr, trEnv;
export function thumbnail(kind, hex, accent, size = 1, rotY = -0.6, tilt = 0.12) {
  if (!tr) {
    const canvas = document.createElement('canvas');
    tr = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    tr.setSize(640, 640, false);
    tr.setPixelRatio(1);
    tr.toneMapping = THREE.ACESFilmicToneMapping;
    tr.toneMappingExposure = 1.1;
  }
  const scene = new THREE.Scene();
  if (!trEnv) { const pm = new THREE.PMREMGenerator(tr); trEnv = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose(); }
  scene.environment = trEnv;
  const key = new THREE.DirectionalLight(0xffe2cf, 2.6); key.position.set(3, 5, 4); scene.add(key);
  const rim = new THREE.PointLight(0xff5a2c, 25, 20); rim.position.set(-4, 1, -3); scene.add(rim);
  const model = BUILDERS[kind](accent);
  recolor(model, hex);
  model.group.scale.setScalar(model.scale * size);
  model.group.rotation.set(tilt, rotY, 0);
  scene.add(model.group);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  cam.position.set(0, 0.5, 9.2); cam.lookAt(0, 0.1, 0);
  tr.render(scene, cam);
  const url = tr.domElement.toDataURL('image/png');
  return url;
}
