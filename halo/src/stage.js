import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { gsap } from 'gsap';
import { BUILDERS, recolor } from './models.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => innerWidth < 860;

const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0a09');
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.9;
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
const key = new THREE.SpotLight(0xffd9c4, 90, 30, 0.5, 0.6);
key.position.set(4, 6, 6); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004;
scene.add(key);
const rim = new THREE.PointLight(0xff5a2c, 40, 20);
rim.position.set(-5, 1.5, -3);
scene.add(rim);
const floor = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.ShadowMaterial({ opacity: 0.35 }));
floor.rotation.x = -Math.PI / 2; floor.position.y = -1.6; floor.receiveShadow = true;
scene.add(floor);

const N = 450;
const pg = new THREE.BufferGeometry();
const pp = new Float32Array(N * 3);
for (let i = 0; i < N; i++) { pp[i * 3] = (Math.random() - .5) * 22; pp[i * 3 + 1] = (Math.random() - .5) * 12; pp[i * 3 + 2] = (Math.random() - .5) * 14 - 2; }
pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
const dust = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.025, color: 0xffb08f, transparent: true, opacity: 0.5, depthWrite: false }));
scene.add(dust);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.25, 0.6, 0.9);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const S = { x: 0, y: 0, scale: 1, rot: 0, tilt: 0.08, explode: 0, camZ: 8, camY: 0.3, sRot: 0, sY: 0, sScale: 1, spin: 1 };
const user = { rotY: 0, vel: 0, dragging: false, lastX: 0, tx: 0, ty: 0 };
const cache = {};
let current = null, kindNow = null, visible = true, sizeMul = 1;

function layout() {
  renderer.setSize(innerWidth, innerHeight, false);
  composer.setPixelRatio(Math.min(devicePixelRatio, 2));
  composer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = mobile() ? 42 : 32;
  camera.updateProjectionMatrix();
}
addEventListener('resize', () => { layout(); if (curView === 'home') view('home'); });
layout();

let curView = null;
/* half the visible world width at the model's distance, so the model can be sized to a share of the screen width */
const halfW = camZ => camZ * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
/* world-x that puts the model's centre at fraction f of the screen width, for the current camera */
const xAt = (f, camZ) => (f - 0.5) * 2 * camZ * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
function view(name) {
  curView = name;
  const m = mobile();
  const v = {
    home: { x: m ? 0 : xAt(0.8, 8.2), y: m ? 1.3 : -0.1, scale: m ? 0.78 : Math.min(0.85, 0.16 * halfW(8.2)), camZ: m ? 9.5 : 8.2, explode: 0, rot: 0.25, tilt: 0.08 },
    product: { x: m ? 0 : -1.75, y: m ? 1.25 : 0, scale: m ? 0.9 : 1.1, camZ: m ? 9.5 : 8.4, explode: 0, rot: 0.3, tilt: 0.1 },
  }[name];
  if (!v) return;
  gsap.to(S, { ...v, duration: reduce ? 0 : 1.2, ease: 'power3.inOut', overwrite: 'auto' });
}

export const stage = {
  show(kind, hex, accent, size = 1) {
    const key = kind + '|' + (accent || '');
    sizeMul = size;
    if (current && kindNow !== key) scene.remove(current.group);
    if (!kind) { current = null; kindNow = null; return; }
    if (kindNow !== key) {
      cache[key] = cache[key] || BUILDERS[kind](accent);
      current = cache[key];
      if (current.group.userData.base === undefined) current.group.userData.base = current.group.position.y;
      scene.add(current.group);
      kindNow = key;
      gsap.fromTo(S, { sScale: 0.82 }, { sScale: 1, duration: reduce ? 0 : 0.9, ease: 'elastic.out(1,.6)' });
    }
    if (hex) recolor(current, hex);
  },
  hide(v) { visible = !v; floor.visible = !v; },
  view,
  color(hex) {
    if (!current) return;
    const c = new THREE.Color(hex);
    gsap.to(current.mats.shell.color, { r: c.r, g: c.g, b: c.b, duration: 0.6, ease: 'power2.out' });
    gsap.fromTo(S, { sScale: 0.94 }, { sScale: 1, duration: 0.7, ease: 'elastic.out(1,.5)' });
  },
  cushions(leather) {
    if (!current) return;
    current.cushions.forEach(c => { c.material = leather ? current.mats.leather : current.mats.fabric; });
  },
  explode(v) { gsap.to(S, { explode: v, duration: reduce ? 0 : 1.3, ease: 'power3.inOut', overwrite: 'auto' }); },
  spin(on) { S.spin = on ? 1 : 0; },
  turn() { if (!user.turning) { user.turning = true; user.vel = 0; gsap.to(user, { rotY: user.rotY + Math.PI * 2, duration: reduce ? 0 : 1.8, ease: 'power3.inOut', onComplete: () => { user.turning = false; } }); } },
  scroll(p) { S.sRot = p * Math.PI * 1.4; S.sY = p * 2.2; },
  kick() { gsap.fromTo(bloom, { strength: 1.6 }, { strength: 0.25, duration: 1.1, ease: 'power3.out' }); },
  drag(el) {
    el.addEventListener('pointerdown', e => {
      if (e.target.closest('a,button,label,input,select,textarea,.panel,.solid')) return;
      user.dragging = true; user.lastX = e.clientX; user.vel = 0;
    });
  },
};
canvas.addEventListener('pointerdown', e => { user.dragging = true; user.lastX = e.clientX; user.vel = 0; });
addEventListener('pointerup', () => { user.dragging = false; });
addEventListener('pointercancel', () => { user.dragging = false; });
addEventListener('pointermove', e => {
  if (user.dragging) { const d = e.clientX - user.lastX; user.lastX = e.clientX; user.rotY += d * 0.011; user.vel = d * 0.011; }
  user.tx = (e.clientX / innerWidth - 0.5) * 2; user.ty = (e.clientY / innerHeight - 0.5) * 2;
});

const clock = new THREE.Clock();
let started = false;
function frame() {
  const t = clock.getElapsedTime();
  if (!user.dragging) { user.rotY += user.vel; user.vel *= 0.94; if (Math.abs(user.vel) < 0.0002) user.vel = 0; }
  if (current) {
    const g = current.group;
    g.visible = visible;
    g.position.x += (S.x - g.position.x) * 0.12;
    g.position.y += ((S.y + S.sY + (g.userData.base || 0)) + Math.sin(t * 0.9) * (reduce ? 0 : 0.05) - g.position.y) * 0.12;
    g.rotation.y = S.rot + S.sRot + user.rotY + (reduce ? 0 : t * 0.18 * S.spin * (1 - S.explode));
    g.rotation.x += ((S.tilt + user.ty * 0.05) - g.rotation.x) * 0.08;
    g.rotation.z += ((-user.tx * 0.03) - g.rotation.z) * 0.08;
    g.scale.setScalar(S.scale * S.sScale * current.scale * sizeMul);
    for (const p of current.parts) p.obj.position.copy(p.base).addScaledVector(p.dir, p.amt * S.explode * 1.1);
  }
  camera.position.set(user.tx * 0.15, S.camY - user.ty * 0.1, S.camZ + S.explode * 2.6);
  camera.lookAt(0, 0, 0);
  dust.rotation.y = t * 0.02;
  rim.intensity = 30 + Math.sin(t * 1.2) * 8;
  if (visible && current) composer.render(); else { renderer.setRenderTarget(null); renderer.clear(); }
  if (!started) { started = true; document.getElementById('loader').classList.add('done'); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
