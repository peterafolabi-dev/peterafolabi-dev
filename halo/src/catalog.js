/* HALO concept catalog: 14 product families x 3 editions = 42 products.
   Everything here is invented for a concept store. Specs are design targets. */

const ALL = ['Obsidian', 'Ember', 'Sage', 'Bone', 'Cobalt', 'Gold', 'Sand', 'Rose', 'Slate'];
const c = (...n) => n;

const FAMILIES = [
  {
    kind: 'over-ear', cat: 'Headphones', tag: 'Wireless over-ear · ANC', tags: ['wireless', 'anc', 'over-ear'], col: ['travel'], sig: [0.7, 0.55, 0.5],
    blurb: 'Hybrid noise cancelling, spring-steel band and drivers tuned flat first, warm second.',
    addons: [{ id: 'leather', name: 'Leather cushions', price: 15000 }, { id: 'case', name: 'Travel case', price: 12000 }],
    box: ['Headphones', 'USB-C charging cable', '3.5 mm audio cable', 'Soft travel pouch', 'Quick-start guide'],
    feat: p => [`${p.anc ? 'Adaptive hybrid noise cancelling' : 'Passive isolation with ambient mode'}`, `${p.bat} hours of playback on one charge`, `Memory-foam cushions, ${p.wt} g`, `${p.mp}-device multipoint pairing`, 'USB-C fast charge: 10 min for 6 hours'],
    spec: p => [['Drivers', `${p.drv} mm beryllium-coated`], ['Battery', `${p.bat} h${p.anc ? ' (ANC on)' : ''}`], ['Weight', `${p.wt} g`], ['Connectivity', 'Bluetooth 5.4 · USB-C audio'], ['Multipoint', `${p.mp} devices`], ['Charge', 'USB-C, 10 min = 6 h']],
    variants: [
      { id: 'halo-one', name: 'HALO One', price: 185000, new: true, colors: c('Obsidian', 'Ember', 'Sage', 'Bone'), accent: '#ff5a2c', p: { anc: 1, bat: 40, wt: 280, mp: 3, drv: 40 } },
      { id: 'halo-one-lite', name: 'HALO One Lite', price: 118000, was: 139000, colors: c('Obsidian', 'Bone', 'Slate'), accent: '#ff5a2c', size: 0.96, p: { anc: 0, bat: 30, wt: 265, mp: 2, drv: 40 }, blurb: 'The One signature sound without the noise cancelling, at a friendlier price.' },
      { id: 'halo-one-max', name: 'HALO One Max', price: 259000, colors: c('Obsidian', 'Gold', 'Sand'), accent: '#d4a63c', size: 1.05, p: { anc: 1, bat: 50, wt: 295, mp: 3, drv: 45 }, addons: [{ id: 'case', name: 'Travel case', price: 12000 }], blurb: 'Larger drivers, 50 hours of battery and leather cushions as standard.' },
    ],
  },
  {
    kind: 'studio', cat: 'Headphones', tag: 'Wired · open-back reference', tags: ['wired', 'open-back', 'studio'], col: ['studio'], sig: [0.5, 0.6, 0.55],
    blurb: 'Open-back reference headphones for mixing and critical listening. Wide, airy and honest.',
    addons: [{ id: 'cable', name: 'Spare 1.2 m cable', price: 18000 }],
    box: ['Headphones', '3 m balanced cable (4.4 mm)', '1.2 m cable (3.5 mm)', '6.35 mm adapter', 'Flight case'],
    feat: p => [`Open-back, ${p.drv} mm planar-style driver`, 'Flat response tuned for mixing', 'Detachable balanced cable', 'Replaceable velour pads', 'Flight case included'],
    spec: p => [['Driver', `${p.drv} mm`], ['Impedance', `${p.imp} Ω`], ['Weight', `${p.wt} g`], ['Cable', '3 m detachable, 4.4 mm balanced'], ['Design', 'Open-back']],
    variants: [
      { id: 'halo-studio', name: 'HALO Studio', price: 240000, colors: c('Obsidian', 'Gold', 'Cobalt'), accent: '#d4a63c', p: { drv: 45, imp: 48, wt: 310 } },
      { id: 'halo-studio-mini', name: 'HALO Studio Mini', price: 165000, colors: c('Obsidian', 'Slate', 'Bone'), accent: '#d4a63c', size: 0.95, p: { drv: 40, imp: 32, wt: 270 }, blurb: 'The reference sound in a lighter, easier-to-drive pair.' },
      { id: 'halo-studio-pro', name: 'HALO Studio Pro', price: 329000, new: true, colors: c('Obsidian', 'Gold'), accent: '#e8c15a', size: 1.05, p: { drv: 50, imp: 64, wt: 345 }, blurb: 'A larger driver and a tuned-by-ear finish for the studio that wants the best.' },
    ],
  },
  {
    kind: 'rift', cat: 'Headphones', tag: 'Wireless gaming headset', tags: ['wireless', 'gaming', 'over-ear', 'mic'], col: ['gaming'], sig: [0.75, 0.5, 0.6],
    blurb: 'Low-latency wireless audio with a detachable boom mic that stays out of the way.',
    addons: [{ id: 'leather', name: 'Leather cushions', price: 15000 }, { id: 'boom', name: 'Spare boom microphone', price: 14000 }],
    box: ['Headset', 'Detachable boom mic', '2.4 GHz USB-C dongle', 'USB-C charging cable', 'Quick-start guide'],
    feat: p => ['Low-latency 2.4 GHz dongle plus Bluetooth', 'Detachable noise-rejecting boom microphone', `${p.drv} mm drivers with a wide soundstage`, `${p.bat} hours of playback`, `Breathable cushions, ${p.wt} g`],
    spec: p => [['Drivers', `${p.drv} mm`], ['Latency', `Under ${p.lat} ms (2.4 GHz mode)`], ['Battery', `${p.bat} h`], ['Weight', `${p.wt} g`], ['Microphone', 'Detachable boom, cardioid']],
    variants: [
      { id: 'halo-rift', name: 'HALO Rift', price: 155000, colors: c('Obsidian', 'Cobalt', 'Ember'), accent: '#6dff3a', p: { drv: 50, lat: 25, bat: 30, wt: 320 } },
      { id: 'halo-rift-lite', name: 'HALO Rift Lite', price: 98000, was: 115000, colors: c('Obsidian', 'Slate'), accent: '#6dff3a', size: 0.95, p: { drv: 40, lat: 35, bat: 24, wt: 290 } },
      { id: 'halo-rift-pro', name: 'HALO Rift Pro', price: 205000, new: true, colors: c('Obsidian', 'Cobalt', 'Rose'), accent: '#3ad8ff', size: 1.04, p: { drv: 50, lat: 15, bat: 36, wt: 335 }, blurb: 'Tournament-grade latency and a swappable battery.' },
    ],
  },
  {
    kind: 'buds', cat: 'Earbuds', tag: 'True wireless earbuds', tags: ['wireless', 'earbuds', 'water-resistant'], col: ['travel'], sig: [0.6, 0.55, 0.55],
    blurb: 'Small, secure and loud where it counts, with a case that charges wirelessly.',
    addons: [{ id: 'sleeve', name: 'Silicone case sleeve', price: 5000 }],
    box: ['Earbuds and case', 'Three ear-tip sizes', 'USB-C cable', 'Quick-start guide'],
    feat: p => [`${p.bat} h per charge, ${p.bat + p.cas} h with the case`, 'Three ear-tip sizes in the box', `${p.ip} sweat and rain resistant`, p.anc ? 'Active noise cancelling and transparency mode' : 'Transparency mode', 'Wireless charging case'],
    spec: p => [['Driver', `${p.drv} mm dynamic`], ['Battery', `${p.bat} h + ${p.cas} h case`], ['Water rating', p.ip], ['Weight', `${p.wt} g per bud`], ['Case charging', 'USB-C and wireless']],
    variants: [
      { id: 'halo-air', name: 'HALO Air', price: 98000, colors: c('Obsidian', 'Bone', 'Ember'), accent: '#ff5a2c', p: { bat: 6, cas: 24, ip: 'IPX5', drv: 11, wt: 5.2, anc: 0 } },
      { id: 'halo-air-lite', name: 'HALO Air Lite', price: 62000, was: 74000, colors: c('Obsidian', 'Bone', 'Sage', 'Rose'), accent: '#ff5a2c', size: 0.95, p: { bat: 5, cas: 20, ip: 'IPX4', drv: 10, wt: 4.8, anc: 0 } },
      { id: 'halo-air-pro', name: 'HALO Air Pro', price: 138000, new: true, colors: c('Obsidian', 'Bone', 'Gold'), accent: '#d4a63c', size: 1.05, p: { bat: 8, cas: 28, ip: 'IPX5', drv: 11, wt: 5.6, anc: 1 } },
    ],
  },
  {
    kind: 'sport', cat: 'Earbuds', tag: 'Neckband earbuds', tags: ['wireless', 'sport', 'earbuds', 'water-resistant'], col: ['sport', 'travel'], sig: [0.65, 0.5, 0.5],
    blurb: 'A flexible neckband that never gets lost, with magnetic buds and a battery in the band.',
    addons: [{ id: 'pouch', name: 'Hard travel pouch', price: 5500 }],
    box: ['Neckband earbuds', 'Three ear-tip sizes', 'Ear-fin set', 'USB-C cable'],
    feat: p => [`${p.bat} h playback from the neckband`, 'Magnetic buds that clip together', `${p.ip} sweat and rain proof`, 'Quick-charge: 10 min for 3 h', 'Vibration alert for calls'],
    spec: p => [['Driver', '10 mm dynamic'], ['Battery', `${p.bat} h`], ['Water rating', p.ip], ['Weight', `${p.wt} g`], ['Connectivity', 'Bluetooth 5.3']],
    variants: [
      { id: 'halo-sport', name: 'HALO Sport', price: 64000, colors: c('Obsidian', 'Ember', 'Cobalt', 'Sage'), accent: '#ff5a2c', p: { bat: 20, ip: 'IPX7', wt: 38 } },
      { id: 'halo-sport-lite', name: 'HALO Sport Lite', price: 42000, colors: c('Obsidian', 'Cobalt', 'Rose'), accent: '#ff5a2c', size: 0.95, p: { bat: 14, ip: 'IPX5', wt: 32 } },
      { id: 'halo-sport-max', name: 'HALO Sport Max', price: 79000, was: 92000, colors: c('Obsidian', 'Ember', 'Gold'), accent: '#d4a63c', size: 1.05, p: { bat: 28, ip: 'IPX7', wt: 44 } },
    ],
  },
  {
    kind: 'speaker', cat: 'Speakers', tag: 'Portable 360° speaker', tags: ['wireless', 'portable', 'water-resistant', 'speaker'], col: ['travel', 'sport'], sig: [0.8, 0.5, 0.45],
    blurb: 'A rugged 360° speaker with a woofer you can feel and a strap you can hang anywhere.',
    addons: [{ id: 'strap', name: 'Leather carry strap', price: 6000 }],
    box: ['Speaker', 'Carry strap', 'USB-C cable', 'Quick-start guide'],
    feat: p => ['360° sound from a single driver stack', `${p.bat} hours of playback`, `${p.ip} dust and water proof`, 'Pairs with a second unit for stereo', 'Carry strap built in'],
    spec: p => [['Output', `${p.w} W`], ['Battery', `${p.bat} h`], ['Water rating', p.ip], ['Weight', `${p.wt} kg`], ['Connectivity', 'Bluetooth 5.4 · AUX']],
    variants: [
      { id: 'halo-pulse', name: 'HALO Pulse', price: 135000, colors: c('Obsidian', 'Sage', 'Ember'), accent: '#ff5a2c', p: { w: 30, bat: 20, ip: 'IP67', wt: 1.1 } },
      { id: 'halo-pulse-mini', name: 'HALO Pulse Mini', price: 79000, colors: c('Obsidian', 'Sage', 'Rose', 'Sand'), accent: '#ff5a2c', size: 0.82, p: { w: 15, bat: 12, ip: 'IP67', wt: 0.6 } },
      { id: 'halo-pulse-max', name: 'HALO Pulse Max', price: 189000, was: 215000, colors: c('Obsidian', 'Cobalt'), accent: '#3ad8ff', size: 1.15, p: { w: 60, bat: 24, ip: 'IP66', wt: 2.4 } },
    ],
  },
  {
    kind: 'orb', cat: 'Speakers', tag: 'Smart speaker · 360° room fill', tags: ['wifi', 'smart', 'speaker', 'home'], col: ['home'], sig: [0.6, 0.55, 0.5],
    blurb: 'A palm-sized sphere that fills a room, with a touch top and a fabric base.',
    addons: [{ id: 'charge', name: 'Wireless charging base', price: 12000 }],
    box: ['Speaker', '2 m braided power cable', 'Quick-start guide'],
    feat: p => ['Wi-Fi and Bluetooth 5.3', '360° sound from a down-firing driver', 'Touch-top controls with LED ring', 'Group two or more across rooms', `${p.w} W output`],
    spec: p => [['Output', `${p.w} W`], ['Driver', `${p.in} in full-range + passive radiator`], ['Connectivity', 'Wi-Fi · Bluetooth 5.3'], ['Weight', `${p.wt} kg`], ['Power', 'Mains, USB-C PD']],
    variants: [
      { id: 'halo-orb', name: 'HALO Orb', price: 75000, colors: c('Bone', 'Obsidian', 'Sage', 'Ember'), accent: '#ff5a2c', p: { w: 20, in: 3, wt: 1.4 } },
      { id: 'halo-orb-mini', name: 'HALO Orb Mini', price: 48000, colors: c('Bone', 'Obsidian', 'Rose'), accent: '#ff5a2c', size: 0.8, p: { w: 10, in: 2, wt: 0.7 } },
      { id: 'halo-orb-max', name: 'HALO Orb Max', price: 118000, new: true, colors: c('Obsidian', 'Gold', 'Sand'), accent: '#d4a63c', size: 1.2, p: { w: 40, in: 4, wt: 2.6 } },
    ],
  },
  {
    kind: 'bar', cat: 'Speakers', tag: 'Soundbar', tags: ['wifi', 'home', 'tv', 'speaker'], col: ['home'], sig: [0.65, 0.6, 0.5],
    blurb: 'A slim soundbar that keeps dialogue clear and adds weight to film and music.',
    addons: [{ id: 'mount', name: 'Wall mount kit', price: 9000 }, { id: 'hdmi', name: 'Premium HDMI eARC cable', price: 7000 }],
    box: ['Soundbar', 'Remote', 'HDMI eARC cable', 'Wall-mount template'],
    feat: p => [`${p.ch} channels with dialogue boost`, 'HDMI eARC with auto power on', 'Night mode that tames loud scenes', 'Wireless sub link (sub sold separately)', 'Slim 44 mm profile fits under most TVs'],
    spec: p => [['Channels', p.ch], ['Output', `${p.w} W`], ['Inputs', 'HDMI eARC · optical · Bluetooth'], ['Dimensions', `${p.len} × 4.4 × 9 cm`], ['Weight', `${p.wt} kg`]],
    variants: [
      { id: 'halo-bar', name: 'HALO Bar', price: 210000, colors: c('Obsidian', 'Bone', 'Sage'), accent: '#ff5a2c', p: { ch: '3.1', w: 120, len: 86, wt: 3.1 } },
      { id: 'halo-bar-mini', name: 'HALO Bar Mini', price: 125000, was: 149000, colors: c('Obsidian', 'Bone'), accent: '#ff5a2c', size: 0.8, p: { ch: '2.1', w: 70, len: 60, wt: 2.0 } },
      { id: 'halo-bar-max', name: 'HALO Bar Max', price: 330000, new: true, colors: c('Obsidian', 'Slate'), accent: '#3ad8ff', size: 1.12, p: { ch: '5.1.2', w: 240, len: 110, wt: 5.2 } },
    ],
  },
  {
    kind: 'turntable', cat: 'Studio', tag: 'Belt-drive turntable', tags: ['wired', 'vinyl', 'home', 'studio'], col: ['home', 'studio'], sig: [0.55, 0.55, 0.45],
    blurb: 'A belt-drive turntable with a counterweighted aluminium tonearm and a pre-fitted cartridge.',
    addons: [{ id: 'cart', name: 'Upgrade cartridge', price: 22000 }, { id: 'cover', name: 'Spare dust cover', price: 14000 }],
    box: ['Turntable', 'Platter and felt mat', 'Belt', 'Dust cover', 'RCA cable'],
    feat: p => ['Belt drive with 33 and 45 rpm', 'Counterbalanced aluminium tonearm', `${p.cart} cartridge pre-fitted`, 'Built-in switchable phono preamp', 'Removable hinged dust cover'],
    spec: p => [['Drive', 'Belt, DC motor'], ['Speeds', '33⅓ · 45 rpm'], ['Platter', `${p.pl} mm aluminium`], ['Output', 'Phono or line level'], ['Weight', `${p.wt} kg`]],
    variants: [
      { id: 'halo-spin', name: 'HALO Spin', price: 175000, colors: c('Obsidian', 'Bone', 'Gold'), accent: '#ff5a2c', p: { cart: 'Moving-magnet', pl: 300, wt: 4.8 } },
      { id: 'halo-spin-lite', name: 'HALO Spin Lite', price: 115000, colors: c('Obsidian', 'Bone', 'Sand'), accent: '#ff5a2c', size: 0.93, p: { cart: 'Moving-magnet', pl: 270, wt: 3.6 } },
      { id: 'halo-spin-pro', name: 'HALO Spin Pro', price: 295000, new: true, colors: c('Obsidian', 'Gold'), accent: '#d4a63c', size: 1.08, p: { cart: 'Moving-coil', pl: 330, wt: 7.2 } },
    ],
  },
  {
    kind: 'mic', cat: 'Studio', tag: 'USB-C studio condenser', tags: ['wired', 'mic', 'studio', 'streaming'], col: ['studio', 'gaming'], sig: [0.5, 0.6, 0.6],
    blurb: 'A cardioid condenser for podcasts, voiceovers and streaming. Plug in over USB-C and go.',
    addons: [{ id: 'pop', name: 'Pop filter', price: 6500 }, { id: 'arm', name: 'Boom arm', price: 18000 }],
    box: ['Microphone and base', 'USB-C cable', 'Thread adapter', 'Quick-start guide'],
    feat: p => ['Cardioid condenser capsule', 'USB-C, plug and play', 'Gain knob and tap-to-mute', 'Zero-latency headphone monitoring', 'Shock-mounted yoke on a weighted base'],
    spec: p => [['Capsule', `${p.cap} mm cardioid condenser`], ['Sample rate', `Up to 24-bit / ${p.sr} kHz`], ['Frequency response', '20 Hz – 20 kHz'], ['Connection', 'USB-C'], ['Weight', `${p.wt} g`]],
    variants: [
      { id: 'halo-mic', name: 'HALO Mic', price: 120000, colors: c('Obsidian', 'Ember', 'Bone'), accent: '#ff5a2c', p: { cap: 25, sr: 96, wt: 780 } },
      { id: 'halo-mic-lite', name: 'HALO Mic Lite', price: 68000, was: 79000, colors: c('Obsidian', 'Rose', 'Slate'), accent: '#ff5a2c', size: 0.9, p: { cap: 16, sr: 48, wt: 520 } },
      { id: 'halo-mic-pro', name: 'HALO Mic Pro', price: 178000, colors: c('Obsidian', 'Gold'), accent: '#d4a63c', size: 1.06, p: { cap: 34, sr: 192, wt: 950 } },
    ],
  },
  {
    kind: 'dock', cat: 'Accessories', tag: 'Charging stand', tags: ['accessory', 'wireless-charging', 'home'], col: ['gifts'], sig: [0, 0, 0],
    blurb: 'A weighted charging stand for HALO Air cases and compatible phones.',
    addons: [{ id: 'braid', name: 'Braided USB-C cable (2 m)', price: 4500 }],
    box: ['Dock', 'USB-C cable'],
    feat: p => [`${p.w} W Qi wireless charging`, 'Weighted base, non-slip underside', 'Angled cradle for desk use', 'LED ring shows charge state', 'USB-C input, cable included'],
    spec: p => [['Charging', `${p.w} W Qi`], ['Input', 'USB-C, 20 W adapter recommended'], ['Weight', `${p.wt} g`], ['Finish', 'Matte aluminium and silicone']],
    variants: [
      { id: 'halo-dock', name: 'HALO Dock', price: 28000, colors: c('Obsidian', 'Bone', 'Sage'), accent: '#ff5a2c', p: { w: 15, wt: 420 } },
      { id: 'halo-dock-duo', name: 'HALO Dock Duo', price: 46000, colors: c('Obsidian', 'Bone'), accent: '#ff5a2c', size: 1.1, p: { w: 30, wt: 680 }, blurb: 'Two charging pads for a phone and a case at the same time.' },
      { id: 'halo-dock-travel', name: 'HALO Dock Travel', price: 19000, colors: c('Obsidian', 'Sand', 'Rose'), accent: '#ff5a2c', size: 0.82, p: { w: 10, wt: 210 }, blurb: 'A folding pocket version for trips.' },
    ],
  },
  {
    kind: 'monitor', cat: 'Studio', tag: 'Active studio monitor (each)', tags: ['wired', 'studio', 'speaker', 'monitor'], col: ['studio', 'home'], sig: [0.5, 0.6, 0.55],
    blurb: 'Active near-field monitors with a flat response and a waveguide tweeter.',
    addons: [{ id: 'pads', name: 'Isolation pads (pair)', price: 8500 }],
    box: ['Monitor', 'Power cable', 'Balanced cable', 'Foam isolation pads'],
    feat: p => [`${p.in}-inch woofer with a 1-inch dome tweeter`, `${p.w} W bi-amplified`, 'Rear-ported bass', 'Balanced XLR, TRS and RCA inputs', 'Room-tuning switches'],
    spec: p => [['Woofer', `${p.in} in`], ['Power', `${p.w} W bi-amp`], ['Response', `${p.lo} Hz – 22 kHz`], ['Inputs', 'XLR · TRS · RCA'], ['Weight', `${p.wt} kg each`]],
    variants: [
      { id: 'halo-monitor-5', name: 'HALO Monitor 5', price: 145000, colors: c('Obsidian', 'Slate'), accent: '#ff5a2c', p: { in: 5, w: 80, lo: 52, wt: 5.2 } },
      { id: 'halo-monitor-3', name: 'HALO Monitor 3', price: 89000, colors: c('Obsidian', 'Bone'), accent: '#ff5a2c', size: 0.82, p: { in: 3, w: 50, lo: 70, wt: 3.1 } },
      { id: 'halo-monitor-8', name: 'HALO Monitor 8', price: 225000, new: true, colors: c('Obsidian', 'Slate', 'Gold'), accent: '#d4a63c', size: 1.14, p: { in: 8, w: 140, lo: 38, wt: 9.8 } },
    ],
  },
  {
    kind: 'amp', cat: 'Studio', tag: 'DAC and headphone amp', tags: ['wired', 'studio', 'dac', 'amp'], col: ['studio'], sig: [0, 0, 0],
    blurb: 'A desktop DAC and headphone amplifier that powers anything from earbuds to reference cans.',
    addons: [{ id: 'psu', name: 'Linear power supply', price: 24000 }],
    box: ['DAC / amp', 'USB-C cable', 'RCA cable', '6.35 mm adapter'],
    feat: p => [`${p.bit}-bit / ${p.khz} kHz DAC`, 'Balanced 4.4 mm and single-ended outputs', 'Analog volume knob with 0.5 dB steps', 'Switchable gain for sensitive earbuds', 'Aluminium chassis'],
    spec: p => [['DAC', `${p.bit}-bit / ${p.khz} kHz`], ['Output power', `${p.mw} mW @ 32 Ω`], ['Outputs', '4.4 mm balanced · 6.35 mm'], ['Inputs', 'USB-C · optical · RCA'], ['Weight', `${p.wt} g`]],
    variants: [
      { id: 'halo-amp', name: 'HALO Amp', price: 96000, colors: c('Obsidian', 'Slate'), accent: '#ff5a2c', p: { bit: 32, khz: 384, mw: 1200, wt: 540 } },
      { id: 'halo-amp-lite', name: 'HALO Amp Lite', price: 58000, colors: c('Obsidian', 'Sand'), accent: '#ff5a2c', size: 0.85, p: { bit: 24, khz: 192, mw: 500, wt: 310 } },
      { id: 'halo-amp-pro', name: 'HALO Amp Pro', price: 175000, colors: c('Obsidian', 'Gold'), accent: '#d4a63c', size: 1.1, p: { bit: 32, khz: 768, mw: 3200, wt: 1100 } },
    ],
  },
  {
    kind: 'stand', cat: 'Accessories', tag: 'Headphone stand', tags: ['accessory', 'home', 'studio'], col: ['gifts', 'studio'], sig: [0, 0, 0],
    blurb: 'A weighted metal stand that keeps your headphones off the desk and out of harm.',
    addons: [],
    box: ['Stand', 'Rubber pad set'],
    feat: p => ['Weighted base with a non-slip pad', 'Padded rest protects the band', `${p.h} cm tall, fits any headphones`, 'Brushed aluminium finish', p.ports ? 'Built-in USB-C hub with 3 ports' : 'Cable-management groove'],
    spec: p => [['Height', `${p.h} cm`], ['Material', 'Brushed aluminium'], ['Weight', `${p.wt} g`], ['Hub', p.ports ? '3 × USB-C' : 'None']],
    variants: [
      { id: 'halo-stand', name: 'HALO Stand', price: 24000, colors: c('Obsidian', 'Bone', 'Sage'), accent: '#ff5a2c', p: { h: 23, wt: 640, ports: 0 } },
      { id: 'halo-stand-hub', name: 'HALO Stand Hub', price: 38000, colors: c('Obsidian', 'Slate'), accent: '#ff5a2c', size: 1.05, p: { h: 24, wt: 780, ports: 1 }, blurb: 'The stand with a three-port USB-C hub in the base.' },
      { id: 'halo-stand-mini', name: 'HALO Stand Mini', price: 16000, was: 19000, colors: c('Obsidian', 'Sand', 'Rose'), accent: '#ff5a2c', size: 0.8, p: { h: 17, wt: 410, ports: 0 } },
    ],
  },
];

export const COLLECTIONS = [
  { id: 'new', name: 'New arrivals', blurb: 'The newest editions in the lineup.', test: p => p.new },
  { id: 'sale', name: 'On offer', blurb: 'Concept price cuts on selected editions.', test: p => !!p.was },
  { id: 'studio', name: 'Studio', blurb: 'Reference headphones, monitors, mics and desk gear for people who make sound.', test: p => p.col.includes('studio') },
  { id: 'home', name: 'Home listening', blurb: 'Speakers, soundbars and a turntable for the living room.', test: p => p.col.includes('home') },
  { id: 'travel', name: 'Travel', blurb: 'Light, rugged and long on battery.', test: p => p.col.includes('travel') },
  { id: 'sport', name: 'Sport', blurb: 'Sweat-proof, secure and built to move.', test: p => p.col.includes('sport') },
  { id: 'gaming', name: 'Gaming and streaming', blurb: 'Low-latency headsets and a mic that makes you sound good.', test: p => p.col.includes('gaming') },
  { id: 'aurora', name: 'Aurora editions', blurb: 'Violet-accent limited colourways of every product.', test: p => p.edition === 'aurora' },
  { id: 'carbon', name: 'Carbon editions', blurb: 'Stealth graphite finishes with silver details.', test: p => p.edition === 'carbon' },
  { id: 'dune', name: 'Dune editions', blurb: 'Warm desert tones with brass-coloured details.', test: p => p.edition === 'dune' },
  { id: 'tide', name: 'Tide editions', blurb: 'Cool teal-accent coastal colourways.', test: p => p.edition === 'tide' },
  { id: 'under100', name: 'Under ₦100,000', blurb: 'Great sound for less.', test: p => p.price <= 100000 },
  { id: 'premium', name: 'Premium', blurb: 'Our best, over ₦200,000.', test: p => p.price >= 200000 },
  { id: 'wireless', name: 'Wireless', blurb: 'No cables required.', test: p => p.tags.includes('wireless') },
  { id: 'wired', name: 'Wired and hi-fi', blurb: 'Cables, DACs, turntables and open-backs.', test: p => p.tags.includes('wired') },
  { id: 'gifts', name: 'Gifts under ₦50,000', blurb: 'Small, useful and easy to wrap.', test: p => p.price <= 50000 },
];

export const BUNDLES = [
  { id: 'desk', name: 'The Desk Setup', blurb: 'Reference headphones, a DAC/amp and a stand.', items: ['halo-studio', 'halo-amp', 'halo-stand'] },
  { id: 'podcast', name: 'Podcast Starter', blurb: 'A condenser mic, closed-back monitoring and a stand.', items: ['halo-mic', 'halo-one-lite', 'halo-stand-mini'] },
  { id: 'listening', name: 'Living-room Listening', blurb: 'Soundbar, an Orb for the kitchen and a turntable.', items: ['halo-bar', 'halo-orb', 'halo-spin'] },
  { id: 'travelkit', name: 'Carry-on Kit', blurb: 'ANC headphones, earbuds and a travel dock.', items: ['halo-one', 'halo-air-lite', 'halo-dock-travel'] },
  { id: 'runner', name: 'Run and Play', blurb: 'Sport earbuds, a Pulse Mini and a dock.', items: ['halo-sport', 'halo-pulse-mini', 'halo-dock'] },
  { id: 'streamer', name: 'Streamer Pack', blurb: 'A gaming headset, a mic and a stand.', items: ['halo-rift', 'halo-mic', 'halo-stand-hub'] },
];

const MORE = [
  ['commuter', 'Commuter Pair', 'Light ANC-free headphones, earbuds for the walk and a dock.', ['halo-one-lite', 'halo-air', 'halo-dock']],
  ['gym', 'Gym Duo', 'Sweat-proof earbuds and a pocket speaker for the changing room.', ['halo-sport-lite', 'halo-pulse-mini', 'halo-dock']],
  ['homestudio', 'Home Studio Lite', 'Entry condenser mic, reference headphones and a small stand.', ['halo-mic-lite', 'halo-studio-mini', 'halo-stand-mini']],
  ['audiophile', 'Audiophile Desk', 'Top studio headphones, a pro DAC/amp and the hub stand.', ['halo-studio-pro', 'halo-amp-pro', 'halo-stand-hub']],
  ['vinylnight', 'Vinyl Night', 'A pro turntable with a compact soundbar and an Orb.', ['halo-spin-pro', 'halo-bar-mini', 'halo-orb-mini']],
  ['gamerpack', 'Gamer Pack', 'Pro headset, pro mic and a duo dock.', ['halo-rift-pro', 'halo-mic-pro', 'halo-dock-duo']],
  ['budget', 'Budget Starter', 'Three small, useful pieces at the lowest prices.', ['halo-air-lite', 'halo-sport-lite', 'halo-stand-mini']],
  ['patio', 'Kitchen and Patio', 'A smart Orb, a rugged Pulse and a charging dock.', ['halo-orb', 'halo-pulse', 'halo-dock']],
  ['flight', 'Long-haul Pack', 'Max ANC headphones, pro earbuds and a travel dock.', ['halo-one-max', 'halo-air-pro', 'halo-dock-travel']],
  ['tvnight', 'TV Night', 'Max soundbar, a mini Orb and a headphone stand.', ['halo-bar-max', 'halo-orb-mini', 'halo-stand']],
  ['creator', 'Creator Kit', 'Pro mic, a DAC/amp and monitoring headphones.', ['halo-mic-pro', 'halo-amp-lite', 'halo-studio-mini']],
  ['student', 'Student Desk', 'Lite headphones, a tiny stand and a travel dock.', ['halo-one-lite', 'halo-stand-mini', 'halo-dock-travel']],
  ['runclub', 'Run Club', 'Max sport earbuds, lite true wireless and a mini speaker.', ['halo-sport-max', 'halo-air-lite', 'halo-pulse-mini']],
  ['listeningroom', 'Listening Room', 'Turntable, DAC/amp and open-back headphones.', ['halo-spin', 'halo-amp', 'halo-studio']],
  ['mixstation', 'Mix Station', 'Pro open-backs, a lite DAC/amp and an entry mic.', ['halo-studio-pro', 'halo-amp-lite', 'halo-mic-lite']],
  ['partyhome', 'House Party', 'Two big speakers and a dock for the phones.', ['halo-pulse-max', 'halo-orb-max', 'halo-dock-duo']],
  ['quietwork', 'Quiet Work', 'ANC headphones, earbuds for calls and a stand.', ['halo-one', 'halo-air', 'halo-stand']],
  ['streamlite', 'Stream Lite', 'Lite gaming headset, lite mic and a mini stand.', ['halo-rift-lite', 'halo-mic-lite', 'halo-stand-mini']],
  ['wireless3', 'Cut the Cables', 'ANC over-ears, earbuds and a neckband for every situation.', ['halo-one', 'halo-air-pro', 'halo-sport']],
  ['homecinema', 'Home Cinema', 'Max soundbar, a pro Orb and a turntable for music nights.', ['halo-bar-max', 'halo-orb-max', 'halo-spin-lite']],
  ['gift1', 'Gift Set: Small', 'A dock, a stand and lite earbuds, easy to wrap.', ['halo-dock', 'halo-stand-mini', 'halo-air-lite']],
  ['gift2', 'Gift Set: Big', 'Max headphones, a pro DAC/amp and the hub stand.', ['halo-one-max', 'halo-amp-pro', 'halo-stand-hub']],
  ['podcastpro', 'Podcast Pro', 'Pro mic, Studio headphones and the hub stand.', ['halo-mic-pro', 'halo-studio', 'halo-stand-hub']],
  ['roadtrip', 'Road Trip', 'A max Pulse, travel dock and neckband earbuds.', ['halo-pulse-max', 'halo-dock-travel', 'halo-sport']],
].map(([id, name, blurb, items]) => ({ id, name, blurb, items }));
BUNDLES.push(...MORE);


export const PRODUCTS = [];
for (const f of FAMILIES) {
  f.variants.forEach((v, i) => {
    const p = v.p;
    PRODUCTS.push({
      id: v.id, name: v.name, tag: f.tag, cat: f.cat, kind: f.kind, price: v.price, was: v.was || 0, new: !!v.new,
      colors: v.colors, accent: v.accent, size: v.size || 1, blurb: v.blurb || f.blurb, tags: (p.anc === 0 ? f.tags.filter(t => t !== 'anc') : p.anc && !f.tags.includes('anc') ? [...f.tags, 'anc'] : f.tags), col: f.col,
      features: f.feat(p), specs: f.spec(p), addons: v.addons || f.addons, box: f.box, sig: f.sig.map((x, k) => Math.max(0, Math.min(1, x + (i === 2 ? [0.05, 0, 0.05][k] : i === 1 ? [-0.05, 0, -0.05][k] : 0)))),
      family: f.kind, tier: i,
    });
  });
}
/* Colour editions: every base product also ships in four limited colour editions (same specs, own accent and finishes) */
export const EDITIONS = [
  { id: 'aurora', name: 'Aurora', accent: '#7a5cff', colors: ['Cobalt', 'Rose', 'Obsidian'], up: 1.06, note: 'Violet-accent limited colourways.' },
  { id: 'carbon', name: 'Carbon', accent: '#aab4bf', colors: ['Slate', 'Obsidian'], up: 1.08, note: 'Stealth graphite finishes with silver details.' },
  { id: 'dune', name: 'Dune', accent: '#e0a86a', colors: ['Sand', 'Bone', 'Gold'], up: 1.05, note: 'Warm desert tones with brass-coloured details.' },
  { id: 'tide', name: 'Tide', accent: '#2cc4c9', colors: ['Sage', 'Cobalt', 'Bone'], up: 1.04, note: 'Cool teal-accent coastal colourways.' },
];
const BASE = PRODUCTS.slice();
for (const e of EDITIONS) {
  for (const b of BASE) {
    PRODUCTS.push({
      ...b, id: `${b.id}-${e.id}`, name: `${b.name} ${e.name}`, price: Math.round(b.price * e.up / 500) * 500, was: b.was ? Math.round(b.was * e.up / 500) * 500 : 0, new: false,
      colors: e.colors, accent: e.accent, edition: e.id, blurb: `${b.blurb} ${e.name} edition: ${e.note}`,
      features: [...b.features.slice(0, 4), `${e.name} edition: ${e.note}`],
    });
  }
}
export const byId = id => PRODUCTS.find(p => p.id === id);
for (let k = BUNDLES.length - 1; k >= 0; k--) if (BUNDLES[k].items.some(x => !PRODUCTS.some(p => p.id === x))) BUNDLES.splice(k, 1);
export const ALL_FINISHES = ALL;
export const CATS = ['Headphones', 'Earbuds', 'Speakers', 'Studio', 'Accessories'];
export const FEATURE_TAGS = [['wireless', 'Wireless'], ['wired', 'Wired'], ['anc', 'Noise cancelling'], ['water-resistant', 'Water resistant'], ['gaming', 'Gaming'], ['studio', 'Studio'], ['smart', 'Smart / Wi-Fi'], ['home', 'Home']];
