import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { declinationDeg, dateLabel, dayHours, fmtHM } from './astro.js';
import { initExtras } from './extras.js';
import { createAtlas } from './atlas3d.js';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => innerWidth < 760;
const lowPower = isMobile();
const $ = (s, r = document) => r.querySelector(s);
const D2R = Math.PI / 180;
const TILT = 23.44;

const canvas = $('#gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, lowPower ? 1.5 : 2));
renderer.localClippingEnabled = true;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#04070d');
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.3, 0.8, 0.88);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ---------- GLSL ---------- */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p,int oct){float a=.5,s=0.;for(int i=0;i<7;i++){if(i>=oct)break;s+=a*snoise(p);p*=2.03;a*=.5;}return s;}
`;
const HEIGHT = /* glsl */ `
float height(vec3 p){ float c=fbm(p*1.15+uSeed,uOct); return c*0.5+0.5; }
float moisture(vec3 p){ return snoise(p*2.4+uSeed*1.7)*.5+.5; }
`;

const uni = {
  uSun: { value: new THREE.Vector3(1, 0.2, 0.4).normalize() },
  uSea: { value: 0.5 },
  uSeed: { value: new THREE.Vector3(3.1, 7.7, 1.3) },
  uTime: { value: 0 },
  uOct: { value: lowPower ? 5 : 7 },
  uGrid: { value: 0 },
  uClimate: { value: 0 },
  uWind: { value: 0 },
  uProbe: { value: new THREE.Vector3(0, 0, 0) },
};

const planetMat = new THREE.ShaderMaterial({
  uniforms: uni,
  vertexShader: /* glsl */ `
    varying vec3 vObj; varying vec3 vN; varying vec3 vW;
    void main(){ vObj=normalize(position); vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
  fragmentShader: /* glsl */ `
    precision highp float;
    uniform vec3 uSun; uniform float uSea; uniform vec3 uSeed; uniform float uTime; uniform int uOct;
    uniform float uGrid; uniform float uClimate; uniform float uWind; uniform vec3 uProbe;
    varying vec3 vObj; varying vec3 vN; varying vec3 vW;
    ${NOISE}
    ${HEIGHT}
    float line(float v, float target, float w){ return 1.-smoothstep(0., w, abs(v-target)); }
    void main(){
      vec3 p=normalize(vObj);
      float h=height(p);
      vec3 up=abs(p.y)>.95?vec3(1,0,0):vec3(0,1,0);
      vec3 t=normalize(cross(up,p)); vec3 b=cross(p,t);
      float e=.012;
      float hx=height(normalize(p+t*e)); float hy=height(normalize(p+b*e));
      float sea=uSea;
      bool land=h>sea;
      float lh=clamp((h-sea)/(1.-sea),0.,1.);
      float lat=asin(clamp(p.y,-1.,1.));
      float alat=abs(lat);
      float m=moisture(p);
      vec3 col; float rough=0.;
      if(land){
        vec3 sand=vec3(.76,.68,.46), grass=vec3(.18,.42,.16), dry=vec3(.55,.5,.27), rock=vec3(.36,.33,.31), snow=vec3(.95,.97,1.);
        vec3 veg=mix(dry,grass,smoothstep(.25,.6,m));
        col=mix(sand,veg,smoothstep(.02,.09,lh));
        col=mix(col,rock,smoothstep(.38,.62,lh));
        float sn=smoothstep(.82-lh*.45,.9-lh*.45,abs(p.y)+(snoise(p*5.)*.03));
        col=mix(col,snow,max(sn,smoothstep(.72,.9,lh)));
        rough=1.;
      } else {
        float d=clamp((sea-h)/max(sea,.001),0.,1.);
        col=mix(vec3(.10,.42,.62),vec3(.01,.06,.2),smoothstep(0.,.55,d));
        col=mix(col,vec3(.12,.55,.6),(1.-smoothstep(0.,.05,d))*.7);
        float ice=smoothstep(.86,.95,abs(p.y)+snoise(p*6.)*.025);
        col=mix(col,vec3(.9,.95,1.),ice);
        rough=ice;
      }
      // latitudinal climate zones (overlay)
      float tr=1.-smoothstep(.40,.42,alat), st=smoothstep(.40,.42,alat)*(1.-smoothstep(.60,.62,alat)), tm=smoothstep(.60,.62,alat)*(1.-smoothstep(1.16,1.18,alat)), po=smoothstep(1.16,1.18,alat);
      vec3 zone=tr*vec3(1.,.42,.24)+st*vec3(1.,.82,.29)+tm*vec3(.36,.88,.54)+po*vec3(.56,.83,1.);
      col=mix(col,zone,.42*uClimate);

      vec3 N=normalize(vN);
      float k=land?14.:2.;
      N=normalize(N - k*((hx-h)/e*t + (hy-h)/e*b)*.012);
      vec3 L=normalize(uSun);
      float dif=max(dot(N,L),0.);
      float term=smoothstep(-.12,.18,dot(normalize(vN),L));
      vec3 V=normalize(cameraPosition-vW);
      vec3 R=reflect(-L,normalize(vN));
      float spec=land?0.:pow(max(dot(R,V),0.),70.)*(1.-rough)*1.4;
      vec3 lit=col*(dif*vec3(1.,.97,.9)*1.25+.035);
      lit+=spec*vec3(1.,.95,.85)*term;
      float tw=exp(-pow(dot(normalize(vN),L)/.14,2.));
      lit+=tw*vec3(.5,.18,.05)*.18*(land?1.:.6);
      float nightMask=smoothstep(.08,-.18,dot(normalize(vN),L));
      if(land && lh<.35){
        float c=snoise(p*34.+uSeed)*.5+.5;
        float c2=snoise(p*90.+uSeed*2.)*.5+.5;
        float pop=smoothstep(.52,.78,snoise(p*3.+uSeed*.5)*.5+.5);
        float lights=smoothstep(.62,.86,c*c2*1.6)*pop*(1.-smoothstep(.2,.35,lh));
        lit+=lights*nightMask*vec3(1.,.72,.3)*2.2;
      }
      // graticule: 15 degree grid + key parallels + prime meridian
      if(uGrid>.5){
        float lon=atan(-p.z,p.x);
        float step15=radians(15.);
        float fl=fwidth(lat), fo=fwidth(lon);
        float gl=1.-smoothstep(0.,1.6*fl,abs(fract(lat/step15+.5)-.5)*step15);
        float go=(1.-smoothstep(0.,1.6*min(fo,.05),abs(fract(lon/step15+.5)-.5)*step15))*smoothstep(1.4,1.25,alat);
        lit=mix(lit,vec3(.85,.93,1.),max(gl,go)*.30);
        float tilt=radians(${TILT.toFixed(2)});
        float eq=line(lat,0.,2.4*fl), tropics=max(line(lat,tilt,2.2*fl),line(lat,-tilt,2.2*fl));
        float polar=max(line(lat,radians(66.56),2.2*fl),line(lat,-radians(66.56),2.2*fl));
        float pm=line(lon,0.,2.2*min(fo,.05))*smoothstep(1.4,1.25,alat);
        lit=mix(lit,vec3(1.,.9,.4),eq*.85);
        lit=mix(lit,vec3(1.,.5,.25),tropics*.8);
        lit=mix(lit,vec3(.5,.85,1.),polar*.8);
        lit=mix(lit,vec3(.6,1.,.7),pm*.7);
      }
      // prevailing winds: trade winds (E->W) 0-30, westerlies (W->E) 30-60, polar easterlies 60-90
      if(uWind>.01){
        float lonw=atan(-p.z,p.x);
        float dirS=alat<.5236?-1.:alat<1.0472?1.:-1.;
        float a=sin(lonw*22.-dirS*uTime*1.5+5.*snoise(p*4.+uSeed));
        float b=sin(lat*70.+3.*snoise(p*6.));
        float st=smoothstep(.82,1.,a)*smoothstep(-.1,.6,b)*(1.-smoothstep(1.35,1.5,alat));
        float band=alat<.5236?0.:alat<1.0472?.5:1.;
        vec3 wc=mix(mix(vec3(.55,.95,1.),vec3(1.,.9,.5),step(.25,band)),vec3(.8,.85,1.),step(.75,band));
        lit=mix(lit,wc,st*.75*uWind);
        float edge=max(line(alat,.5236,.012),line(alat,1.0472,.012));
        lit=mix(lit,vec3(1.),edge*.35*uWind);
      }
      // probe marker
      if(dot(uProbe,uProbe)>.5){
        float ang=acos(clamp(dot(p,normalize(uProbe)),-1.,1.));
        float ring=smoothstep(.052,.048,ang)*smoothstep(.034,.038,ang);
        float dotm=smoothstep(.012,.009,ang);
        float pulse=.6+.4*sin(uTime*4.);
        lit=mix(lit,vec3(1.),max(ring*pulse,dotm));
      }
      gl_FragColor=vec4(lit,1.);
    }`,
});
const planet = new THREE.Mesh(new THREE.SphereGeometry(1, lowPower ? 96 : 192, lowPower ? 96 : 192), planetMat);

const cloudMat = new THREE.ShaderMaterial({
  uniforms: uni, transparent: true, depthWrite: false,
  vertexShader: `varying vec3 vObj; varying vec3 vN; void main(){ vObj=normalize(position); vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: /* glsl */ `
    precision highp float; uniform vec3 uSun; uniform float uTime; uniform vec3 uSeed;
    varying vec3 vObj; varying vec3 vN;
    ${NOISE}
    void main(){
      vec3 p=normalize(vObj);
      float n=fbm(p*2.6+vec3(uTime*.012,0.,uTime*.006)+uSeed*.3,5);
      float a=smoothstep(.04,.42,n);
      float d=max(dot(normalize(vN),normalize(uSun)),0.);
      float shade=.06+d*1.0;
      gl_FragColor=vec4(vec3(1.)*shade,a*.82*smoothstep(-.1,.2,dot(normalize(vN),normalize(uSun))+.12));
    }`,
});
const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.012, 96, 96), cloudMat);

const atmoMat = new THREE.ShaderMaterial({
  uniforms: { uSun: uni.uSun, uK: { value: 1 } },
  side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  vertexShader: `varying vec3 vNv; varying vec3 vNw; void main(){ vNv=normalize(normalMatrix*normal); vNw=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `
    uniform vec3 uSun; uniform float uK; varying vec3 vNv; varying vec3 vNw;
    void main(){
      float i=pow(max(0.72-dot(vNv,vec3(0.,0.,1.)),0.),3.5);
      float sunSide=smoothstep(-.5,.6,dot(-vNw,normalize(uSun)));
      vec3 c=mix(vec3(.15,.45,1.),vec3(.45,.8,1.),i);
      gl_FragColor=vec4(c*i*1.5*(0.12+sunSide)*uK,1.);
    }`,
});
const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.1, 96, 96), atmoMat);

const world = new THREE.Group();
world.add(planet, clouds, atmo);
scene.add(world);

/* ---------- planetary layers (cutaway) ---------- */
const LAYERS = [
  { id: 'crust', name: 'Crust', r: 1.0, color: '#7a5c3a', thick: '5 – 70 km', temp: 'up to about 400 °C at the base', state: 'Solid rock', note: 'Thin skin: oceanic crust about 5–10 km, continental crust about 30–50 km, up to 70 km under big mountain ranges. Exaggerated here.' },
  { id: 'mantle', name: 'Mantle', r: 0.93, color: '#c4452a', thick: 'about 2,900 km', temp: 'about 1,000 – 3,700 °C', state: 'Solid rock that flows very slowly', note: 'About 84% of the planet by volume. Slow convection in the mantle drives plate tectonics.' },
  { id: 'outer', name: 'Outer core', r: 0.55, color: '#f0a03a', thick: 'about 2,200 km', temp: 'about 4,000 – 5,000 °C', state: 'Liquid iron and nickel', note: 'Its motion generates the planet’s magnetic field.' },
  { id: 'inner', name: 'Inner core', r: 0.19, color: '#fff2b0', thick: 'radius about 1,220 km', temp: 'about 5,200 °C', state: 'Solid iron and nickel', note: 'Hot as the Sun’s surface but kept solid by immense pressure.' },
];
const clipPlanes = [new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)];
const layerGroup = new THREE.Group();
const layerMeshes = LAYERS.map(L => {
  const mat = new THREE.MeshStandardMaterial({ color: L.color, roughness: 0.75, metalness: 0.05, side: THREE.DoubleSide, clippingPlanes: clipPlanes, clipIntersection: true, emissive: L.color, emissiveIntensity: 0.12 });
  const m = new THREE.Mesh(new THREE.SphereGeometry(L.r, 72, 48), mat);
  layerGroup.add(m);
  return m;
});
// crust gets the planet's own surface look using a simple blue-green tone
layerMeshes[0].material.color.set('#3c6f55'); layerMeshes[0].material.emissive.set('#3c6f55');
layerGroup.visible = false;
scene.add(layerGroup);
const sunLight = new THREE.DirectionalLight(0xfff2e0, 3);
scene.add(sunLight, new THREE.AmbientLight(0x1a2438, 1.4));

/* moon + stars */
const moon = new THREE.Mesh(new THREE.SphereGeometry(0.27, 48, 48), new THREE.MeshStandardMaterial({ color: '#9a9690', roughness: 1 }));
const moonPivot = new THREE.Group();
moon.position.set(3.4, 0.3, 0);
moonPivot.add(moon);
scene.add(moonPivot);
const SN = 1800;
const sp = new Float32Array(SN * 3), sc = new Float32Array(SN * 3);
for (let i = 0; i < SN; i++) {
  const r = 60 + Math.random() * 40, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1);
  sp.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
  const w = 0.6 + Math.random() * 0.4, tint = Math.random();
  sc.set([w * (0.8 + tint * 0.2), w * 0.9, w], i * 3);
}
const sg = new THREE.BufferGeometry();
sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
sg.setAttribute('color', new THREE.BufferAttribute(sc, 3));
const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.22, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false }));
scene.add(stars);

/* ---------- GPU probe: reads height + moisture at one direction ---------- */
const probeRT = new THREE.WebGLRenderTarget(1, 1, { type: THREE.UnsignedByteType, format: THREE.RGBAFormat });
const probeScene = new THREE.Scene();
const probeCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const probeMat = new THREE.ShaderMaterial({
  uniforms: { uDir: { value: new THREE.Vector3(1, 0, 0) }, uSeed: uni.uSeed, uOct: uni.uOct },
  vertexShader: 'void main(){ gl_Position=vec4(position.xy,0.,1.); }',
  fragmentShader: /* glsl */ `
    precision highp float; uniform vec3 uDir; uniform vec3 uSeed; uniform int uOct;
    ${NOISE}
    ${HEIGHT}
    void main(){ vec3 p=normalize(uDir); gl_FragColor=vec4(height(p), moisture(p), 0., 1.); }`,
  depthTest: false,
});
probeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), probeMat));
const pix = new Uint8Array(4);
function sample(dirObj) {
  probeMat.uniforms.uDir.value.copy(dirObj);
  renderer.setRenderTarget(probeRT);
  renderer.render(probeScene, probeCam);
  renderer.readRenderTargetPixels(probeRT, 0, 0, 1, 1, pix);
  renderer.setRenderTarget(null);
  return { h: pix[0] / 255, m: pix[1] / 255 };
}

/* ---------- state ---------- */
const S = { camZ: 7, camY: 0, x: 0, y: -1.7, scale: 1.1, rot: 0, layers: 0 };
const user = { rotY: 0, vel: 0, dragging: false, lastX: 0, tx: 0, ty: 0, downX: 0, downY: 0, moved: 0 };
const clock = new THREE.Clock();
let probeState = null;
const atlas = createAtlas({ renderer, uni, NOISE, HEIGHT, world, user, S, clock, reduce, lowPower, onProbeDir: d => probeDir(d), getProbe: () => probeState });
atlas.computeRelief(); atlas.drawRelief();
const dxs = () => (isMobile() ? 0 : 1.55);

function layout() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  composer.setPixelRatio(Math.min(devicePixelRatio, lowPower ? 1.5 : 2));
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.fov = isMobile() ? 46 : 35;
  camera.updateProjectionMatrix();
}

/* keyframes bound to each section */
let triggers = [];
function keys() {
  const m = isMobile(), d = dxs();
  const base = { layers: 0, scale: 1 };
  const doc = rot => ({ ...base, camZ: m ? 9 : 7.5, x: m ? 0 : d * 1.35, y: m ? 2.3 : 0.4, scale: m ? 0.55 : 0.7, rot });
  const K = {
    hero: { ...base, camZ: m ? 7.5 : 6.2, x: 0, y: m ? -0.9 : -1.9, scale: m ? 1.0 : 1.25, rot: 0 },
    spin: { ...base, camZ: m ? 6.8 : 5.4, x: m ? 0 : d, y: m ? 0.9 : 0, rot: 1.6 },
    time: { ...base, camZ: m ? 6.8 : 5.4, x: m ? 0 : -d, y: m ? 0.9 : 0, rot: 3.2 },
    sea: { ...base, camZ: m ? 5.8 : 4.4, x: m ? 0 : d * 0.9, y: m ? 0.8 : 0, scale: 1.08, rot: 4.6 },
    shape: { ...base, camZ: m ? 7 : 5.6, x: m ? 0 : -d, y: m ? 0.9 : 0, rot: 6.0 },
    winds: { ...base, camZ: m ? 6.4 : 5.0, x: m ? 0 : d, y: m ? 0.9 : 0, rot: 6.5 },
    measure: { ...base, camZ: m ? 6.2 : 4.8, x: m ? 0 : -d, y: m ? 0.9 : 0, rot: 7.0 },
    layers: { ...base, camZ: m ? 5.6 : 4.6, x: m ? 0 : d * 0.9, y: m ? 0.9 : 0, layers: 1, rot: 7.0 },
  };
  let r = 7.3;
  DOCS.forEach(id => { K[id] = doc(r); r += 0.35; });
  K.outro = { ...base, camZ: m ? 9 : 7.6, x: 0, y: m ? 1.5 : 1.3, scale: 0.8, rot: r + 0.3 };
  return K;
}
const DOCS = ['map', 'daylen', 'sky', 'atlas', 'records', 'countries', 'plates', 'biomes', 'system', 'clocks', 'deeptime', 'glossary', 'moon', 'quiz'];
/* the globe keeps its panel-style keyframes for the interactive sections; documents share one pose */
const ORDER = ['hero', 'spin', 'map', 'time', 'daylen', 'sea', 'shape', 'winds', 'measure', 'layers', 'sky', 'atlas', 'records', 'countries', 'plates', 'biomes', 'system', 'clocks', 'deeptime', 'glossary', 'moon', 'quiz', 'outro'];
function buildScroll() {
  triggers.forEach(t => { t.scrollTrigger?.kill(); t.kill(); });
  triggers = [];
  const K = keys();
  Object.assign(S, K.hero);
  for (let i = 1; i < ORDER.length; i++) {
    const from = K[ORDER[i - 1]], to = K[ORDER[i]];
    triggers.push(gsap.fromTo(S, { ...from }, {
      ...to, ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: '#' + ORDER[i], start: 'top bottom', end: 'top 25%', scrub: reduce ? true : 0.9 },
    }));
  }
}
layout(); buildScroll();
addEventListener('resize', () => { layout(); buildScroll(); });

$('#bar') && ScrollTrigger.create({ trigger: '#main', start: 'top top', end: 'bottom bottom', onUpdate: s => { $('#bar').style.transform = `scaleX(${s.progress})`; } });
gsap.utils.toArray('.panel, #outro > *').forEach(el => {
  gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
});
gsap.timeline({ delay: 0.5 })
  .from('h1', { opacity: 0, letterSpacing: '0.4em', duration: 1.8, ease: 'expo.out' })
  .from('.hero .mono, .hero .sub, .hint', { y: 20, opacity: 0, stagger: 0.12, duration: 0.9 }, 0.5);

/* ---------- pointer: drag to spin, click to probe ---------- */
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function down(e) { user.dragging = true; user.lastX = e.clientX; user.vel = 0; user.downX = e.clientX; user.downY = e.clientY; user.moved = 0; }
canvas.addEventListener('pointerdown', e => { down(e); canvas.setPointerCapture(e.pointerId); });
$('#main').addEventListener('pointerdown', e => { if (e.target.closest('a,button,label,input,.docw,.chip')) return; down(e); });
addEventListener('pointerup', e => {
  if (user.dragging && user.moved < 6 && !world.visible === false) probeAt(e.clientX, e.clientY);
  user.dragging = false;
});
addEventListener('pointercancel', () => { user.dragging = false; });
addEventListener('pointermove', e => {
  if (user.dragging) {
    const d = e.clientX - user.lastX; user.lastX = e.clientX;
    user.rotY += d * 0.008; user.vel = d * 0.008;
    user.moved += Math.abs(d) + Math.abs(e.movementY || 0);
  }
  user.tx = (e.clientX / innerWidth - 0.5) * 2; user.ty = (e.clientY / innerHeight - 0.5) * 2;
});

/* ---------- astronomy ---------- */
const sunState = { lon: 40 * D2R, day: 172 };
function setSun() {
  const dec = declinationDeg(sunState.day) * D2R;
  uni.uSun.value.set(Math.cos(dec) * Math.cos(sunState.lon), Math.sin(dec), Math.cos(dec) * Math.sin(sunState.lon)).normalize();
  sunLight.position.copy(uni.uSun.value).multiplyScalar(20);
  const dd = declinationDeg(sunState.day);
  $('#decl').textContent = `${Math.abs(dd).toFixed(1)}° ${dd >= 0 ? 'N' : 'S'}`;
  $('#dv').textContent = dateLabel(sunState.day);
  const deg = ((sunState.lon / D2R) % 360 + 360) % 360;
  $('#tv').textContent = deg < 60 || deg > 300 ? 'Noon side' : deg < 130 ? 'Afternoon' : deg < 230 ? 'Night side' : 'Morning';
  const d = sunState.day;
  $('#seas').textContent = d >= 80 && d < 172 ? 'Northern spring' : d >= 172 && d < 266 ? 'Northern summer' : d >= 266 && d < 355 ? 'Northern autumn' : 'Northern winter';
  if (probeState) updateHud();
  ex?.onSun();
}
$('#sun').addEventListener('input', e => gsap.to(sunState, { lon: (+e.target.value) * D2R, duration: 0.5, onUpdate: setSun, overwrite: 'auto' }));
$('#day').addEventListener('input', e => gsap.to(sunState, { day: +e.target.value, duration: 0.5, onUpdate: setSun, overwrite: 'auto' }));

/* ---------- sea level / reshape / toggles ---------- */
const level = $('#level'), sv = $('#sv'), land = $('#land'), landtxt = $('#landtxt');
const seaState = { v: 0.5 };
function landFraction(sea) { const z = (sea - 0.5) / 0.17; const cdf = 0.5 * (1 + Math.tanh(0.7978845608 * (z + 0.044715 * z * z * z))); return Math.max(0, Math.min(1, 1 - cdf)); }
function setSea() {
  uni.uSea.value = seaState.v;
  const rel = Math.round((seaState.v - 0.5) * 2000);
  sv.textContent = (rel > 0 ? '+' : '') + rel + ' m';
  const f = atlas.landFraction(seaState.v);
  land.style.width = Math.round(f * 100) + '%';
  landtxt.textContent = `${(f * 100).toFixed(1)}% land (measured from the planet)`;
  if (probeState) refreshProbe();
  atlas.onSea();
}
level.addEventListener('input', () => gsap.to(seaState, { v: 0.5 + level.value / 100 * 0.17, duration: 0.5, onUpdate: setSea, overwrite: true }));
$('#regen').addEventListener('click', () => {
  const t = new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
  gsap.to(uni.uSeed.value, { x: t.x, y: t.y, z: t.z, duration: 2.6, ease: 'power2.inOut', onComplete: () => { probeState && refreshProbe(); atlas.onSeed(); } });
  gsap.fromTo(bloom, { strength: 1.2 }, { strength: 0.3, duration: 2.4, ease: 'power3.out' });
});
$('#clouds').addEventListener('change', e => { clouds.visible = e.target.checked; });
$('#atmo').addEventListener('change', e => { gsap.to(atmoMat.uniforms.uK, { value: e.target.checked ? 1 : 0, duration: 0.8 }); });
$('#grid').addEventListener('change', e => { uni.uGrid.value = e.target.checked ? 1 : 0; });
$('#climate').addEventListener('change', e => { gsap.to(uni.uClimate, { value: e.target.checked ? 1 : 0, duration: 0.6 }); });

/* ---------- probe HUD ---------- */
function fmtCoord(v, pos, neg) { return `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`; }
function climateZone(alat) { return alat < TILT ? 'Tropics' : alat < 35 ? 'Subtropics' : alat < 66.56 ? 'Temperate' : 'Polar'; }
function classify(lat, h, m) {
  const sea = uni.uSea.value, alat = Math.abs(lat);
  if (h <= sea) {
    const d = Math.min(1, (sea - h) / Math.max(sea, 0.001));
    const depth = Math.round(d * 10900 / 10) * 10;
    const kind = alat > 72 ? 'Polar sea (ice-covered)' : d < 0.05 ? 'Coastal shelf' : d < 0.4 ? 'Open ocean' : 'Deep ocean basin';
    return { terrain: 'Ocean', biome: kind, elev: `−${depth.toLocaleString()} m (scaled)` };
  }
  const lh = (h - sea) / (1 - sea);
  const elev = Math.round(lh * 8800 / 10) * 10;
  const terrain = lh < 0.04 ? 'Coastal plain' : lh < 0.2 ? 'Lowland' : lh < 0.4 ? 'Highland' : lh < 0.62 ? 'Mountains' : 'High peaks';
  let biome;
  if (lh > 0.72) biome = 'Snow-capped peaks';
  else if (alat > 66.56) biome = 'Tundra / ice cap';
  else if (lh > 0.5) biome = 'Alpine';
  else if (alat < TILT) biome = m > 0.55 ? 'Tropical rainforest' : m > 0.35 ? 'Savanna' : 'Hot desert';
  else if (alat < 35) biome = m > 0.5 ? 'Subtropical forest' : 'Subtropical desert / steppe';
  else if (alat < 50) biome = m > 0.45 ? 'Temperate forest' : 'Temperate grassland';
  else biome = m > 0.4 ? 'Boreal forest (taiga)' : 'Cold steppe';
  return { terrain, biome, elev: `+${elev.toLocaleString()} m (scaled)` };
}
function dayLength(latDeg, decDeg) {
  const x = -Math.tan(latDeg * D2R) * Math.tan(decDeg * D2R);
  if (x >= 1) return 'Polar night (Sun stays down)';
  if (x <= -1) return 'Midnight Sun (24 h)';
  const h = 2 * Math.acos(x) / D2R / 15;
  return `${Math.floor(h)} h ${String(Math.round((h % 1) * 60)).padStart(2, '0')} min`;
}
function updateHud() {
  if (!probeState) return;
  const { lat, lon, h, m } = probeState;
  const c = classify(lat, h, m);
  const dec = declinationDeg(sunState.day);
  // local solar time: planet-frame sun longitude
  const sunObj = uni.uSun.value.clone().applyQuaternion(world.quaternion.clone().invert());
  const sunLon = Math.atan2(-sunObj.z, sunObj.x) / D2R;
  let hrs = 12 + (lon - sunLon) / 15;
  hrs = ((hrs % 24) + 24) % 24;
  const hh = Math.floor(hrs), mm = Math.floor((hrs - hh) * 60);
  const hud = $('#hud');
  hud.hidden = false;
  hud.innerHTML = `<h4>Probe <button id="hudx" aria-label="Close probe">×</button></h4><dl>
    <dt>Latitude</dt><dd>${fmtCoord(lat, 'N', 'S')}</dd>
    <dt>Longitude</dt><dd>${fmtCoord(lon, 'E', 'W')}</dd>
    <dt>Terrain</dt><dd>${c.terrain}</dd>
    <dt>Elevation</dt><dd>${c.elev}</dd>
    <dt>Biome</dt><dd>${c.biome}</dd>
    <dt>Climate zone</dt><dd>${climateZone(Math.abs(lat))}</dd>
    <dt>Local solar time</dt><dd>${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}</dd>
    <dt>Day length (${dateLabel(sunState.day)})</dt><dd>${dayLength(lat, dec)}</dd>
    <dt>From equator</dt><dd>${Math.round(Math.abs(lat) * 111.19).toLocaleString()} km</dd></dl>`;
  $('#hudx').onclick = () => { probeState = null; uni.uProbe.value.set(0, 0, 0); hud.hidden = true; };
}
function refreshProbe() {
  if (!probeState) return;
  const r = sample(probeState.dir);
  probeState.h = r.h; probeState.m = r.m;
  updateHud();
}
function probeAt(cx, cy) {
  ndc.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  world.updateMatrixWorld(true);
  const hit = raycaster.intersectObject(planet, false)[0];
  if (!hit) return;
  const dirObj = world.worldToLocal(hit.point.clone()).normalize();
  if (atlas.isMeasuring()) { atlas.measureAt(dirObj); return; }
  probeDir(dirObj);
}
function probeDir(dirObj) {
  const lat = Math.asin(dirObj.y) / D2R, lon = Math.atan2(-dirObj.z, dirObj.x) / D2R;
  const r = sample(dirObj);
  probeState = { dir: dirObj.clone(), lat, lon, h: r.h, m: r.m };
  uni.uProbe.value.copy(dirObj);
  updateHud(); atlas.onProbe();
}

/* ---------- layers UI ---------- */
const chips = $('#layerChips'), info = $('#layerInfo');
let activeLayer = 1;
function showLayer(i) {
  activeLayer = i;
  const L = LAYERS[i];
  chips.innerHTML = LAYERS.map((l, j) => `<button class="chip${j === i ? ' on' : ''}" data-i="${j}">${l.name}</button>`).join('');
  info.innerHTML = `<b>${L.name}</b>${L.note}<dl><dt>Thickness</dt><dd>${L.thick}</dd><dt>Temperature</dt><dd>${L.temp}</dd><dt>State</dt><dd>${L.state}</dd></dl>`;
  layerMeshes.forEach((m, j) => { gsap.to(m.material, { emissiveIntensity: j === i ? 0.7 : 0.1, duration: 0.4 }); });
}
chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) showLayer(+b.dataset.i); });
showLayer(1);

/* ---------- atlas data ---------- */
const CONT = [['Asia', 44.6], ['Africa', 30.4], ['North America', 24.7], ['South America', 17.8], ['Antarctica', 14.2], ['Europe', 10.2], ['Oceania', 8.5]];
const OCEANS = [['Pacific', 165.2], ['Atlantic', 106.5], ['Indian', 70.6], ['Southern', 20.3], ['Arctic', 14.1]];
function bars(id, data) {
  const max = Math.max(...data.map(d => d[1]));
  const el = $(id);
  el.innerHTML = data.map(([n, v]) => `<div class="bar"><span>${n}</span><i style="--w:${(v / max * 100).toFixed(1)}%"></i><b>${v}</b></div>`).join('');
  ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => el.classList.add('in') });
}
bars('#continents', CONT); bars('#oceans', OCEANS);
document.querySelectorAll('.kpis b[data-n]').forEach(el => {
  const n = +el.dataset.n, dec = +(el.dataset.d || 0), suf = el.dataset.s || '';
  const o = { v: 0 };
  ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: n, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = o.v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; } }) });
});
setInterval(() => { const d = new Date(); $('#utc').textContent = d.toISOString().slice(11, 16); }, 1000);
$('#utc').textContent = new Date().toISOString().slice(11, 16);

/* moon phase */
(function moonPhase() {
  const SYN = 29.530588853, EPOCH = Date.UTC(2000, 0, 6, 18, 14);
  const age = (((Date.now() - EPOCH) / 86400000) % SYN + SYN) % SYN;
  const frac = (1 - Math.cos(2 * Math.PI * age / SYN)) / 2;
  const names = [[1.85, 'New Moon'], [5.54, 'Waxing Crescent'], [9.23, 'First Quarter'], [12.92, 'Waxing Gibbous'], [16.61, 'Full Moon'], [20.3, 'Waning Gibbous'], [23.99, 'Last Quarter'], [27.68, 'Waning Crescent'], [30, 'New Moon']];
  const name = names.find(n => age < n[0])[1];
  $('#mname').textContent = name;
  $('#mtxt').textContent = `${Math.round(frac * 100)}% illuminated · ${age.toFixed(1)} days into the lunar month`;
  const c = $('#phase'), g = c.getContext('2d'), R = 74, cx = 80, cy = 80;
  g.fillStyle = '#1b2230'; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
  const waxing = age < SYN / 2, k = Math.cos(2 * Math.PI * age / SYN), sg2 = waxing ? 1 : -1;
  g.fillStyle = '#e8ecf5';
  g.beginPath();
  for (let a = -90; a <= 90; a += 3) { const th = a * D2R; const x = cx + sg2 * R * Math.cos(th), y = cy + R * Math.sin(th); a === -90 ? g.moveTo(x, y) : g.lineTo(x, y); }
  for (let a = 90; a >= -90; a -= 3) { const th = a * D2R; g.lineTo(cx + sg2 * k * R * Math.cos(th), cy + R * Math.sin(th)); }
  g.closePath(); g.fill();
})();

/* winds overlay + measure mode */
let windPref = true, windOn = false;
const setWind = () => gsap.to(uni.uWind, { value: windPref && windOn ? 1 : 0, duration: 0.8, overwrite: true });
$('#winds-tog').addEventListener('change', e => { windPref = e.target.checked; setWind(); });
ScrollTrigger.create({ trigger: '#winds', start: 'top 70%', end: 'bottom 30%', onToggle: st => { windOn = st.isActive; setWind(); } });
ScrollTrigger.create({ trigger: '#measure', start: 'top 70%', end: 'bottom 30%', onToggle: st => atlas.setMeasureMode(st.isActive) });
atlas.setMeasureMode(false);
$('#mapGotoProbe')?.addEventListener('click', () => { if (probeState) atlas.faceLon(probeState.lon); });

/* cursor, anchors */
const cur = $('#cur');
addEventListener('pointermove', e => { cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; });
document.addEventListener('pointerover', e => { cur.classList.toggle('big', !!e.target.closest('a,button,label,input')); });
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const el = document.querySelector(a.getAttribute('href'));
  if (!el) return; e.preventDefault();
  scrollTo({ top: el.offsetTop, behavior: reduce ? 'auto' : 'smooth' });
}));

const ex = initExtras({ sunState });
setSun(); setSea();
ScrollTrigger.create({ trigger: '#spin', start: 'top 80%', endTrigger: '#sea', end: 'top 30%', onToggle: s => $('#hud').classList.toggle('away', !s.isActive) });

/* ---------- loop ---------- */
let first = true;
let hudTick = 0;
function frame() {
  const t = clock.getElapsedTime();
  uni.uTime.value = t;
  if (!user.dragging) { user.rotY += user.vel; user.vel *= 0.94; if (Math.abs(user.vel) < 0.0002) user.vel = 0; }
  world.position.x += (S.x - world.position.x) * 0.1;
  world.position.y += (S.y - world.position.y) * 0.1;
  world.scale.setScalar(S.scale);
  world.rotation.y = S.rot * 0.35 + user.rotY + (reduce ? 0 : t * 0.02);
  clouds.rotation.y = t * 0.004;
  const inside = S.layers > 0.5;
  world.visible = !inside;
  layerGroup.visible = inside;
  layerGroup.position.copy(world.position);
  layerGroup.scale.setScalar(S.scale * 1.0);
  layerGroup.rotation.set(0.45, -0.75 + t * 0.05, 0);
  moonPivot.position.copy(world.position);
  moonPivot.rotation.y = t * 0.12;
  moonPivot.rotation.z = 0.18;
  moon.rotation.y = t * 0.05;
  moonPivot.visible = !inside;
  camera.position.set(user.tx * 0.12, S.camY - user.ty * 0.08, S.camZ);
  camera.lookAt(0, 0, 0);
  stars.rotation.y = t * 0.002;
  if (probeState && ++hudTick % 30 === 0) updateHud();
  composer.render();
  if (first) { first = false; $('#loader').classList.add('done'); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
