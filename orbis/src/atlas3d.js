import * as THREE from 'three';
import { gsap } from 'gsap';
import { D2R, TILT, dirFromLatLon, latLonFromDir, slerp, gcInfo, fmtLL } from './astro.js';
import { MEASURE_PRESETS } from './data.js';

export function createAtlas(ctx) {
  const { renderer, uni, NOISE, HEIGHT, world, user, S, clock, reduce, lowPower, onProbeDir, getProbe } = ctx;
  const $ = (s, r = document) => r.querySelector(s);
  const fullQuad = (frag, uniforms) => {
    const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: 'void main(){ gl_Position=vec4(position.xy,0.,1.); }', fragmentShader: frag, depthTest: false });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    return { scene, cam, mat };
  };
  const rtOpts = { type: THREE.UnsignedByteType, format: THREE.RGBAFormat, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: false };

  /* ============================================================ relief (equal-area sample of the whole sphere) */
  const RN = 64, N = RN * RN;
  const relRT = new THREE.WebGLRenderTarget(RN, RN, rtOpts);
  const rel = fullQuad(/* glsl */ `
    precision highp float; uniform vec3 uSeed; uniform int uOct;
    ${NOISE}
    ${HEIGHT}
    void main(){
      float i=floor(gl_FragCoord.x)+${RN}.*floor(gl_FragCoord.y);
      float y=1.-2.*(i+.5)/${N}.; float r=sqrt(max(0.,1.-y*y)); float th=i*2.39996323;
      vec3 p=vec3(cos(th)*r,y,sin(th)*r);
      float v=height(p)*255.; float hi=floor(v);
      gl_FragColor=vec4(hi/255., v-hi, 0., 1.);
    }`, { uSeed: uni.uSeed, uOct: uni.uOct });
  const relBuf = new Uint8Array(N * 4);
  let sorted = new Float32Array(N), ready = false;
  function computeRelief() {
    renderer.setRenderTarget(relRT); renderer.render(rel.scene, rel.cam);
    renderer.readRenderTargetPixels(relRT, 0, 0, RN, RN, relBuf); renderer.setRenderTarget(null);
    for (let i = 0; i < N; i++) sorted[i] = (relBuf[i * 4] + relBuf[i * 4 + 1] / 255) / 255;
    sorted.sort(); ready = true;
  }
  function landFraction(sea) {
    if (!ready) { const z = (sea - 0.5) / 0.17; return Math.max(0, Math.min(1, 1 - 0.5 * (1 + Math.tanh(0.7978845608 * (z + 0.044715 * z * z * z))))); }
    let lo = 0, hi = N; while (lo < hi) { const m = (lo + hi) >> 1; if (sorted[m] > sea) hi = m; else lo = m + 1; }
    return (N - lo) / N;
  }
  const elevOf = (h, sea) => h > sea ? (h - sea) / (1 - sea) * 8800 : -(sea - h) / Math.max(sea, 0.001) * 10900;
  function drawRelief() {
    const cv = $('#relief'); if (!cv || !ready) return;
    const g = cv.getContext('2d'), W = cv.width, H = cv.height, sea = uni.uSea.value, padL = 4, padT = 6, padB = 6;
    const Y = e => padT + (8800 - e) / 19700 * (H - padT - padB);
    g.clearRect(0, 0, W, H);
    const col = x => elevOf(sorted[N - 1 - Math.min(N - 1, Math.floor(x / W * N))], sea);
    g.beginPath(); g.moveTo(0, Y(0));
    for (let x = 0; x <= W; x += 2) g.lineTo(x, Y(Math.max(0, col(x))));
    g.lineTo(W, Y(0)); g.closePath(); g.fillStyle = 'rgba(91,224,138,.55)'; g.fill();
    g.beginPath(); g.moveTo(0, Y(0));
    for (let x = 0; x <= W; x += 2) g.lineTo(x, Y(Math.min(0, col(x))));
    g.lineTo(W, Y(0)); g.closePath(); g.fillStyle = 'rgba(40,110,200,.6)'; g.fill();
    g.beginPath(); for (let x = 0; x <= W; x += 2) { const y = Y(col(x)); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.strokeStyle = '#e8f0ff'; g.lineWidth = 1.5; g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.45)'; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(0, Y(0)); g.lineTo(W, Y(0)); g.stroke(); g.setLineDash([]);
    const fl = landFraction(sea); g.strokeStyle = 'rgba(255,210,74,.8)'; g.beginPath(); g.moveTo(fl * W, padT); g.lineTo(fl * W, H - padB); g.stroke();
    let ls = 0, lc = 0, os = 0, oc = 0;
    for (let i = 0; i < N; i++) { const e = elevOf(sorted[i], sea); if (e > 0) { ls += e; lc++; } else { os += e; oc++; } }
    $('#reltxt').innerHTML = `Measured from ${N.toLocaleString('en-US')} equal-area samples of the surface: <b>${(fl * 100).toFixed(1)}% land</b> · mean land elevation <b>${lc ? Math.round(ls / lc).toLocaleString('en-US') : 0} m</b> · mean ocean depth <b>${oc ? Math.round(-os / oc).toLocaleString('en-US') : 0} m</b> (scaled).`;
  }

  /* ============================================================ flat map (equirectangular) */
  const MW = lowPower ? 540 : 720, MH = MW / 2;
  const mapRT = new THREE.WebGLRenderTarget(MW, MH, rtOpts);
  const mapQ = fullQuad(/* glsl */ `
    precision highp float; uniform vec3 uSeed; uniform int uOct; uniform float uSea; uniform int uMode; uniform vec2 uRes;
    ${NOISE}
    ${HEIGHT}
    vec3 P(float lat,float lon){ return vec3(cos(lat)*cos(lon), sin(lat), -cos(lat)*sin(lon)); }
    vec3 hyps(float lh){
      vec3 c=mix(vec3(.16,.42,.18),vec3(.55,.62,.24),smoothstep(0.,.12,lh));
      c=mix(c,vec3(.72,.60,.32),smoothstep(.10,.30,lh));
      c=mix(c,vec3(.50,.36,.24),smoothstep(.28,.55,lh));
      return mix(c,vec3(.92,.92,.95),smoothstep(.55,.80,lh)); }
    vec3 tempCol(float t){
      float x=clamp((t+30.)/65.,0.,1.);
      vec3 a=vec3(.20,.20,.75),b=vec3(.30,.75,.95),c=vec3(.98,.95,.70),d=vec3(.98,.60,.20),e=vec3(.75,.10,.10);
      return x<.25?mix(a,b,x/.25):x<.5?mix(b,c,(x-.25)/.25):x<.75?mix(c,d,(x-.5)/.25):mix(d,e,(x-.75)/.25); }
    void main(){
      vec2 uv=gl_FragCoord.xy/uRes; float lon=(uv.x*2.-1.)*3.14159265; float lat=(uv.y*2.-1.)*1.57079633;
      vec3 p=P(lat,lon); float h=height(p); float m=moisture(p); float sea=uSea;
      float latd=degrees(abs(lat)); bool land=h>sea; float lh=clamp((h-sea)/(1.-sea),0.,1.);
      float d=clamp((sea-h)/max(sea,.001),0.,1.);
      float tC=29.-45.*pow(sin(abs(lat)),2.)-(land?lh*8.8*6.5:0.);
      vec3 col;
      if(uMode==3){
        col=land?mix(vec3(.86,.72,.42),vec3(.08,.38,.72),smoothstep(.15,.85,m)):vec3(.07,.10,.16);
      } else if(uMode==2){
        col=tempCol(tC); if(!land) col*=.82;
      } else {
        if(!land){
          col=mix(vec3(.17,.46,.70),vec3(.02,.09,.26),smoothstep(0.,.6,d));
          col=mix(col,vec3(.9,.95,1.),smoothstep(.86,.95,abs(p.y)+snoise(p*6.)*.025));
        } else if(uMode==0){
          col=hyps(lh);
          float sn=smoothstep(.82-lh*.45,.9-lh*.45,abs(p.y)+snoise(p*5.)*.03); col=mix(col,vec3(.95,.97,1.),sn);
        } else {
          if(lh>.72) col=vec3(.95,.97,1.);
          else if(latd>66.56) col=vec3(.66,.76,.72);
          else if(lh>.5) col=vec3(.55,.50,.40);
          else if(latd<${TILT.toFixed(2)}) col=m>.55?vec3(.05,.38,.14):m>.35?vec3(.64,.66,.24):vec3(.86,.72,.42);
          else if(latd<35.) col=m>.5?vec3(.22,.52,.22):vec3(.80,.68,.40);
          else if(latd<50.) col=m>.45?vec3(.14,.46,.20):vec3(.58,.68,.30);
          else col=m>.4?vec3(.10,.34,.26):vec3(.60,.62,.46);
        }
        if(land && uMode!=2){ float hE=height(P(lat,lon+.012)); col*=clamp(1.+(hE-h)*55.,.72,1.3); }
      }
      gl_FragColor=vec4(col,1.);
    }`, { uSeed: uni.uSeed, uOct: uni.uOct, uSea: uni.uSea, uMode: { value: 0 }, uRes: { value: new THREE.Vector2(MW, MH) } });
  const mapBuf = new Uint8Array(MW * MH * 4);
  const base = document.createElement('canvas'); base.width = MW; base.height = MH;
  const bctx = base.getContext('2d');
  const mapC = $('#mapc'); mapC.width = MW; mapC.height = MH;
  const mctx = mapC.getContext('2d');
  const MODES = [['Relief', 0], ['Biomes', 1], ['Temperature', 2], ['Rainfall', 3]];
  const LEGENDS = [
    [['Deep ocean', '#06173f'], ['Shallow sea', '#2b75b3'], ['Lowland', '#2a6b2e'], ['Hills', '#b89a52'], ['Mountains', '#80593d'], ['Snow / ice', '#f2f5fb']],
    [['Ocean', '#2b75b3'], ['Rainforest', '#0d6124'], ['Savanna', '#a3a83d'], ['Hot desert', '#dbb86b'], ['Temperate forest', '#247533'], ['Grassland', '#94ad4d'], ['Taiga', '#1a5742'], ['Tundra', '#a8c2b8'], ['Alpine', '#8c8066'], ['Snow', '#f2f5fb']],
    [['−30 °C', '#3333bf'], ['−15', '#4dbff2'], ['0', '#faf2b3'], ['15', '#f99a33'], ['35 °C', '#bf1a1a']],
    [['Dry', '#dbb86b'], ['Moderate', '#7f9f9a'], ['Wet', '#146bb8'], ['Ocean (not modelled)', '#121a29']],
  ];
  let mode = 0, dirty = true, visible = false, hover = null, tm = 0;
  const showGrid = () => $('#mapGrid').checked, showZones = () => $('#mapZones').checked;
  $('#mapModes').innerHTML = MODES.map(([n, v]) => `<button class="chip${v === 0 ? ' on' : ''}" data-m="${v}">${n}</button>`).join('');
  function legend() { $('#mapLegend').innerHTML = LEGENDS[mode].map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join(''); }
  legend();
  $('#mapModes').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    mode = +b.dataset.m; $$a('#mapModes .chip').forEach(c => c.classList.toggle('on', c === b)); mapQ.mat.uniforms.uMode.value = mode; legend(); dirty = true; scheduleMap(true);
  });
  function $$a(s) { return [...document.querySelectorAll(s)]; }
  const xy = (lat, lon) => [(lon + 180) / 360 * MW, (90 - lat) / 180 * MH];
  function renderMap() {
    renderer.setRenderTarget(mapRT); renderer.render(mapQ.scene, mapQ.cam);
    renderer.readRenderTargetPixels(mapRT, 0, 0, MW, MH, mapBuf); renderer.setRenderTarget(null);
    const img = bctx.createImageData(MW, MH);
    for (let y = 0; y < MH; y++) img.data.set(mapBuf.subarray((MH - 1 - y) * MW * 4, (MH - y) * MW * 4), y * MW * 4);
    bctx.putImageData(img, 0, 0); dirty = false; overlay();
  }
  function scheduleMap(now) {
    if (!visible) { dirty = true; return; }
    clearTimeout(tm); tm = setTimeout(renderMap, now ? 0 : 180);
  }
  function line(lat1, lon1, lat2, lon2) { const [x1, y1] = xy(lat1, lon1), [x2, y2] = xy(lat2, lon2); mctx.beginPath(); mctx.moveTo(x1, y1); mctx.lineTo(x2, y2); mctx.stroke(); }
  function overlay() {
    mctx.drawImage(base, 0, 0);
    mctx.font = `${Math.round(MW / 70)}px "DM Mono", monospace`;
    if (showGrid()) {
      mctx.strokeStyle = 'rgba(232,240,255,.22)'; mctx.lineWidth = 1;
      for (let lo = -150; lo <= 180; lo += 30) { line(90, lo, -90, lo); }
      for (let la = -60; la <= 60; la += 30) { line(la, -180, la, 180); }
      mctx.fillStyle = 'rgba(232,240,255,.75)';
      for (let lo = -150; lo <= 150; lo += 30) { const [x] = xy(0, lo); mctx.fillText(`${Math.abs(lo)}°${lo < 0 ? 'W' : lo > 0 ? 'E' : ''}`, x + 3, MH - 5); }
      for (let la = -60; la <= 60; la += 30) { const [, y] = xy(la, 0); mctx.fillText(`${Math.abs(la)}°${la < 0 ? 'S' : la > 0 ? 'N' : ''}`, 4, y - 3); }
    }
    if (showZones()) {
      mctx.lineWidth = 1.5;
      [[0, '#ffd24a'], [TILT, '#ff7a45'], [-TILT, '#ff7a45'], [66.56, '#8fd3ff'], [-66.56, '#8fd3ff']].forEach(([la, c]) => { mctx.strokeStyle = c; line(la, -180, la, 180); });
      mctx.strokeStyle = '#7fe08f'; line(90, 0, -90, 0);
    }
    const P = getProbe();
    if (P) { const [x, y] = xy(P.lat, P.lon); mctx.strokeStyle = '#fff'; mctx.lineWidth = 2; mctx.beginPath(); mctx.arc(x, y, 7, 0, 7); mctx.stroke(); mctx.fillStyle = '#fff'; mctx.beginPath(); mctx.arc(x, y, 2.5, 0, 7); mctx.fill(); }
    if (mA || mB) {
      mctx.strokeStyle = '#ffb347'; mctx.lineWidth = 2; mctx.setLineDash([6, 4]);
      if (mA && mB) {
        mctx.beginPath(); let prev = null;
        for (let i = 0; i <= 80; i++) { const d = slerp(mA, mB, i / 80), { lat, lon } = latLonFromDir(d), [x, y] = xy(lat, lon); if (prev && Math.abs(x - prev) > MW / 2) { mctx.moveTo(x, y); } else i ? mctx.lineTo(x, y) : mctx.moveTo(x, y); prev = x; }
        mctx.stroke();
      }
      mctx.setLineDash([]);
      [[mA, '#5cc8ff', 'A'], [mB, '#ffb347', 'B']].forEach(([d, c, l]) => { if (!d) return; const { lat, lon } = latLonFromDir(d), [x, y] = xy(lat, lon); mctx.fillStyle = c; mctx.beginPath(); mctx.arc(x, y, 5, 0, 7); mctx.fill(); mctx.fillStyle = '#fff'; mctx.fillText(l, x + 8, y - 6); });
    }
    if (hover) { const [x, y] = xy(hover.lat, hover.lon); mctx.strokeStyle = 'rgba(255,255,255,.7)'; mctx.lineWidth = 1; mctx.beginPath(); mctx.moveTo(x - 8, y); mctx.lineTo(x + 8, y); mctx.moveTo(x, y - 8); mctx.lineTo(x, y + 8); mctx.stroke(); }
  }
  const evLL = e => { const r = mapC.getBoundingClientRect(); return { lon: ((e.clientX - r.left) / r.width) * 360 - 180, lat: 90 - ((e.clientY - r.top) / r.height) * 180 }; };
  mapC.addEventListener('pointermove', e => { hover = evLL(e); $('#mapread').textContent = fmtLL(hover.lat, hover.lon) + ' · click to probe'; overlay(); });
  mapC.addEventListener('pointerleave', () => { hover = null; $('#mapread').textContent = 'Hover the map · click to probe'; overlay(); });
  mapC.addEventListener('click', e => { const { lat, lon } = evLL(e); onProbeDir(new THREE.Vector3(...dirFromLatLon(lat, lon))); faceLon(lon); overlay(); });
  $('#mapGrid').addEventListener('change', overlay); $('#mapZones').addEventListener('change', overlay);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && dirty) scheduleMap(true); }, { rootMargin: '200px' }).observe($('#map'));

  /* ============================================================ spin the globe to a longitude */
  function faceLon(lonDeg) {
    const target = -Math.PI / 2 - lonDeg * D2R, cur = S.rot * 0.35 + user.rotY + (reduce ? 0 : clock.getElapsedTime() * 0.02);
    let d = (target - cur) % (2 * Math.PI); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
    user.vel = 0; gsap.to(user, { rotY: user.rotY + d, duration: 1.2, ease: 'power2.inOut', overwrite: 'auto' });
  }

  /* ============================================================ great-circle measure */
  let mA = null, mB = null, measuring = false;
  const group = new THREE.Group(); world.add(group);
  const sph = new THREE.SphereGeometry(0.02, 16, 16);
  const mk = (d, c) => { const m = new THREE.Mesh(sph, new THREE.MeshBasicMaterial({ color: c })); m.position.set(...d).multiplyScalar(1.012); return m; };
  function clearGroup() { group.children.slice().forEach(c => { group.remove(c); c.geometry !== sph && c.geometry.dispose(); c.material.dispose(); }); }
  const COMPASS_TXT = b => `${Math.round(b)}°`;
  function rebuild() {
    clearGroup();
    if (mA) group.add(mk(mA, '#5cc8ff'));
    if (mB) group.add(mk(mB, '#ffb347'));
    const out = $('#mres');
    if (mA && mB) {
      const g = gcInfo(mA, mB), lift = 0.03 + 0.14 * (g.ang / Math.PI), pts = [];
      for (let i = 0; i <= 72; i++) { const t = i / 72, d = slerp(mA, mB, t), r = 1.012 + Math.sin(Math.PI * t) * lift; pts.push(new THREE.Vector3(d[0] * r, d[1] * r, d[2] * r)); }
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, 0.006, 6), new THREE.MeshBasicMaterial({ color: '#ffb347' }));
      group.add(tube);
      const km = g.km, mi = km * 0.621371, nm = km / 1.852;
      out.innerHTML = `<div><small>Distance</small><b>${Math.round(km).toLocaleString('en-US')} km</b></div><div><small>In miles / nautical</small><b>${Math.round(mi).toLocaleString('en-US')} mi · ${Math.round(nm).toLocaleString('en-US')} nm</b></div>
        <div><small>Initial bearing A→B</small><b>${COMPASS_TXT(g.bearing)} (${g.compass})</b></div><div><small>Share of the Equator’s length</small><b>${(km / 40075 * 100).toFixed(1)}%</b></div>
        <div><small>Airliner at 900 km/h</small><b>${(km / 900).toFixed(1)} h</b></div><div><small>Walking at 5 km/h</small><b>${Math.round(km / 5 / 24).toLocaleString('en-US')} days non-stop</b></div>
        <div><small>Light takes</small><b>${(km / 299792 * 1000).toFixed(1)} ms</b></div><div><small>Midpoint</small><b>${fmtLL(g.midLL.lat, g.midLL.lon)}</b></div>`;
      faceLon(g.midLL.lon);
    } else {
      const a = mA ? latLonFromDir(mA) : null;
      out.innerHTML = `<p>${mA ? `Point A set at ${fmtLL(a.lat, a.lon)}. Click a second point on the globe.` : 'Click the globe to place point A, then point B.'}</p>`;
    }
    overlay();
  }
  function measureAt(dirObj) {
    const d = [dirObj.x, dirObj.y, dirObj.z];
    if (mA && mB) { mA = d; mB = null; } else if (!mA) mA = d; else mB = d;
    rebuild();
  }
  function clearMeasure() { mA = mB = null; rebuild(); }
  function setMeasureMode(on) { measuring = on; document.body.classList.toggle('measuring', on); $('#mhint').textContent = on ? 'Measure mode is on: clicks on the globe place points.' : 'Scroll here to switch the globe to measure mode.'; }
  $('#mpresets').innerHTML = MEASURE_PRESETS.map(([n], i) => `<button class="chip" data-i="${i}">${n}</button>`).join('') + '<button class="chip" id="mclear">Clear</button>';
  $('#mpresets').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    if (b.id === 'mclear') { clearMeasure(); return; }
    const [, a1, o1, a2, o2] = MEASURE_PRESETS[+b.dataset.i]; mA = dirFromLatLon(a1, o1); mB = dirFromLatLon(a2, o2); rebuild();
  });
  rebuild();

  return {
    landFraction, computeRelief, drawRelief, renderMap, scheduleMap, measureAt, setMeasureMode, faceLon, overlay,
    isMeasuring: () => measuring,
    onSea() { drawRelief(); scheduleMap(false); },
    onSeed() { computeRelief(); drawRelief(); dirty = true; scheduleMap(false); },
    onProbe() { overlay(); },
  };
}
