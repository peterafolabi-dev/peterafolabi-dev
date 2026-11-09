/* HALO Journal: short, original explainers. Honest, general audio knowledge. */
export const ARTICLES = [
  {
    id: 'choose-headphones', title: 'How to choose headphones without the jargon', mins: 4, tag: 'Guide',
    lede: 'Over-ear, on-ear, in-ear, open or closed. Here is how to narrow it down in five questions.',
    body: [
      'Start with where you listen. On a crowded bus or a plane, closed-back headphones with noise cancelling (ANC) make the biggest difference because they reduce the low rumble that wears you out. At a quiet desk, open-back headphones sound wider and more natural because the sound is not trapped behind the driver.',
      'Next, decide between wireless and wired. Wireless is convenient and modern wireless codecs are good enough for most people. Wired gives you zero battery worries and, on a good DAC or amp, the cleanest signal. Many people end up owning one of each.',
      'Think about comfort before specifications. Clamping force, weight and pad material decide whether you can wear them for four hours. A lighter pair with soft pads often beats a heavier pair with better numbers.',
      'Finally, look at the sound signature. “Flat” means the headphones try not to colour the music. “Warm” adds some bass and softens treble. Neither is right or wrong. If you mix music, flat helps. If you simply enjoy listening, choose the one that makes you want to keep going.',
    ],
  },
  {
    id: 'anc-explained', title: 'Noise cancelling, explained', mins: 3, tag: 'Explainer',
    lede: 'Active noise cancelling does not block sound. It adds sound that cancels it. Here is how.',
    body: [
      'Sound is a pressure wave. If you play a second wave that is the exact mirror of the first, the two cancel at your ear. ANC headphones use small microphones to listen to the outside world, then produce that mirror wave through the driver.',
      'This works best on steady, low-frequency noise: engines, air conditioning, the hum of a train. It works less well on sudden, high-pitched sounds like a voice or a door slam, which is why good headphones combine ANC with a well-sealed earcup.',
      '“Hybrid” ANC uses microphones both outside and inside the earcup. The outside microphone predicts what is coming. The inside microphone checks the result and corrects it. That feedback loop is why hybrid systems sound calmer.',
      'Transparency or ambient mode does the opposite: it passes outside sound through so you can hear announcements or talk without taking the headphones off.',
    ],
  },
  {
    id: 'driver-types', title: 'Dynamic, planar and balanced armature drivers', mins: 4, tag: 'Explainer',
    lede: 'Three ways to move air, and what each is good at.',
    body: [
      'A dynamic driver is a cone or dome moved by a coil in a magnetic field, the same idea as a loudspeaker. It is compact, efficient and covers most of the range well, which is why almost all consumer headphones use it.',
      'A planar magnetic driver uses a very thin, flat diaphragm with a conductive trace, suspended between magnets. The whole surface moves together, which can give very low distortion and a fast, even sound. Planar headphones are usually larger and heavier and often need more power.',
      'A balanced armature driver is a tiny pivoting reed inside a sealed housing. It is extremely small and precise, so it is common in in-ear monitors, often several to a side. Each covers part of the range.',
      'None of these is “best”. Good tuning and a good seal matter more than the driver type printed on the box.',
    ],
  },
  {
    id: 'earbud-care', title: 'Looking after earbuds so they last', mins: 3, tag: 'Care',
    lede: 'Small habits that add years to a pair of earbuds.',
    body: [
      'Earwax and moisture are the enemy. Wipe the ear tips with a slightly damp cloth, let them dry, and clean the mesh with a soft, dry brush. Avoid pushing anything sharp into the nozzle.',
      'Do not charge them wet. Even water-resistant earbuds should be dried before they go in the case, because trapped moisture corrodes the charging contacts.',
      'Batteries age with heat and with being kept at 0% or 100% for long periods. If you will not use them for weeks, leave them around half charged.',
      'Replace ear tips when they stretch or stop sealing. A good seal improves bass more than any equaliser setting.',
    ],
  },
  {
    id: 'vinyl-basics', title: 'Vinyl basics: your first week with a turntable', mins: 5, tag: 'Guide',
    lede: 'Set up, play and care for records without fuss.',
    body: [
      'Place the turntable on a stable, level surface away from the speakers so bass does not feed back into the needle. Fit the platter and belt, then the felt mat.',
      'Balance the tonearm so it floats level, then set the tracking force to the cartridge’s recommended weight, usually between 1.5 and 3 grams. Too light and the stylus skips. Too heavy and it wears the groove.',
      'Connect to a phono input. If your amplifier has no phono input, use a phono preamp, or a turntable with one built in. Plug into a line input only if the turntable has the preamp switched on.',
      'Handle records by the edges and label, keep them upright in their sleeves, and brush them before playing. Clean records last for decades.',
    ],
  },
  {
    id: 'home-studio', title: 'A small home studio on a small budget', mins: 5, tag: 'Guide',
    lede: 'What you actually need to record decent audio at home.',
    body: [
      'Start with the room. A bedroom with a bed, curtains and a bookshelf already absorbs plenty of echo. Record away from bare walls and windows, and put the microphone close to your mouth.',
      'A USB condenser microphone is the simplest way in. It has the converter built in, so you only need a cable. Place a pop filter a hand’s width from the capsule and speak slightly across it, not straight into it.',
      'Monitor on closed-back headphones so the sound does not bleed into the microphone, and keep the gain low enough that your loudest words stay out of the red on the meter.',
      'When you graduate to mixing, a pair of flat studio monitors and an open-back pair of headphones give you two different checks on the same mix.',
    ],
  },
  {
    id: "anc-explained", title: "How noise cancelling actually works", mins: 3, tag: "Explainer",
    lede: "Microphones, a little maths and a flipped wave.",
    body: [
      "Active noise cancelling listens to the outside world with small microphones, then plays a mirrored sound wave through the drivers. When a wave and its mirror image meet, they largely cancel.",
      "It works best on steady, low sounds such as engines, fans and air conditioning. Sudden sharp sounds like voices or clattering plates are harder to predict, so they come through more.",
      "Good fit and a proper seal still matter. ANC is helped by passive isolation from the ear cushions or tips.",
    ],
  },
  {
    id: "codecs-plain", title: "Bluetooth codecs in plain English", mins: 4, tag: "Explainer",
    lede: "What SBC, AAC and LDAC mean when you are just pressing play.",
    body: [
      "A codec is the way audio is squeezed to travel over Bluetooth. Your phone and headphones must both support the same one, otherwise they fall back to the basic SBC.",
      "Higher-bitrate codecs can carry more detail, but real-world differences are small compared to the quality of the headphones and your listening environment.",
      "If you mostly stream on a phone in noisy places, do not pay extra only for a codec name.",
    ],
  },
  {
    id: "burn-in", title: "Do headphones need burn-in?", mins: 3, tag: "Myth check",
    lede: "Short answer: your ears adapt faster than the drivers do.",
    body: [
      "Many people report that new headphones sound better after a few days. The measured change in the drivers is usually tiny.",
      "Our brains adapt to a new sound signature quickly, which feels like improvement. Give any new pair a week before judging.",
    ],
  },
  {
    id: "open-vs-closed", title: "Open-back or closed-back?", mins: 4, tag: "Guide",
    lede: "Space versus isolation, and which one you want.",
    body: [
      "Open-back headphones let air and sound pass through, which gives a wider stage and a lighter feel but leaks sound both ways.",
      "Closed-back headphones isolate you and keep your music private, with stronger bass impact. Choose open for quiet rooms, closed for travel, offices and shared spaces.",
    ],
  },
  {
    id: "dac-amp", title: "Do you need a DAC and amp?", mins: 4, tag: "Guide",
    lede: "Phones and laptops are better than you think. Sometimes.",
    body: [
      "A DAC converts digital files to analogue sound and an amp drives the headphones. Every phone and laptop has both built in.",
      "A separate unit helps when headphones are hard to drive, when your device output is noisy, or when you want physical volume control and balanced outputs. For most easy-to-drive headphones, the difference is subtle.",
    ],
  },
  {
    id: "vinyl-start", title: "Starting with vinyl", mins: 5, tag: "Guide",
    lede: "What you need, what is optional and what to avoid.",
    body: [
      "A turntable needs a cartridge and a stylus, a phono preamp (built in or separate) and powered speakers or an amp.",
      "Level the deck, set the tracking force by the cartridge guide and keep records clean and upright. Start with a few records you love instead of a big stack.",
    ],
  },
  {
    id: "hearing-health", title: "Looking after your hearing", mins: 3, tag: "Care",
    lede: "Volume and time matter more than any gadget.",
    body: [
      "A common rule of thumb is to keep headphone volume under about 60 percent of the maximum and take breaks every hour.",
      "ANC helps because you do not need to turn up the volume to beat background noise. If you notice ringing or muffled sound after listening, rest and see a professional if it continues.",
    ],
  },
  {
    id: "earbud-fit", title: "Getting the right earbud fit", mins: 3, tag: "Care",
    lede: "Tips are small, but they change bass and comfort.",
    body: [
      "Try each tip size. A good seal gives fuller bass and better ANC.",
      "Twist gently when inserting and angle the nozzle toward your ear canal. If one ear needs a different size to the other, that is normal.",
    ],
  },
  {
    id: "mic-technique", title: "Microphone technique that sounds pro", mins: 4, tag: "Guide",
    lede: "Distance, angle and room count more than price.",
    body: [
      "Speak across the capsule from about a hand width away, slightly off-axis, to tame hard consonants.",
      "Soft furniture, curtains and a rug do more for the sound than most upgrades. Record in the quietest room you have.",
    ],
  },
  {
    id: "speaker-placement", title: "Where to put a speaker", mins: 3, tag: "Guide",
    lede: "A few centimetres can change the bass completely.",
    body: [
      "Corners boost bass and walls close behind speakers do too. If sound is boomy, move away from the wall.",
      "For stereo, form a triangle with your listening spot and keep the tweeters at ear height.",
    ],
  },
  {
    id: "gaming-audio", title: "Audio for gaming: what really matters", mins: 4, tag: "Guide",
    lede: "Comfort, mic clarity and positioning.",
    body: [
      "For long sessions, weight and clamp force matter more than spec sheets. A good boom mic that mutes with a flip is a quality-of-life win.",
      "Wired connections avoid latency worries. For competitive play, use a profile that keeps footsteps clear instead of heavy bass.",
    ],
  },
  {
    id: "care-and-clean", title: "Cleaning and caring for headphones", mins: 3, tag: "Care",
    lede: "Simple habits that make them last years.",
    body: [
      "Wipe cushions with a slightly damp cloth, let them dry fully and keep headphones out of hot cars.",
      "Swap tips or pads when they harden or flatten. Store in the case and avoid wrapping cables tightly.",
    ],
  },
];
