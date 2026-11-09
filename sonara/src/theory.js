export const NOTES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
export const noteName = m => NOTES[((m % 12) + 12) % 12];
export const SCALES = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Natural minor': [0, 2, 3, 5, 7, 8, 10],
  'Harmonic minor': [0, 2, 3, 5, 7, 8, 11],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  'Lydian': [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'Locrian': [0, 1, 3, 5, 6, 8, 10],
  'Major pentatonic': [0, 2, 4, 7, 9],
  'Minor pentatonic': [0, 3, 5, 7, 10],
  'Blues': [0, 3, 5, 6, 7, 10],
  'Whole tone': [0, 2, 4, 6, 8, 10],
  'Hirajoshi': [0, 2, 3, 7, 8],
};
export const SCALE_FEEL = {
  'Major': 'Bright and settled. The default sound of most pop.', 'Natural minor': 'Dark and serious, the sound of most sad songs.',
  'Harmonic minor': 'Minor with a raised 7th that gives a tense, classical pull.', 'Dorian': 'Minor but with a lifted 6th. Warm and funky, common in Afrobeat and funk.',
  'Phrygian': 'Dark with a flat 2nd. Spanish and metal flavours.', 'Lydian': 'Major with a raised 4th. Dreamy and floating.',
  'Mixolydian': 'Major with a flat 7th. Relaxed, bluesy, common in highlife and rock.', 'Locrian': 'Unstable and rarely used as a home key.',
  'Major pentatonic': 'Five notes, no clashes. Almost impossible to play badly.', 'Minor pentatonic': 'The backbone of blues, rock and a lot of Afrobeats toplines.',
  'Blues': 'Minor pentatonic plus the "blue" note.', 'Whole tone': 'Six equal steps. Floaty and ambiguous.', 'Hirajoshi': 'A Japanese five-note scale with a sombre, open sound.',
};
export const CHORDS = {
  'Major': [0, 4, 7], 'Minor': [0, 3, 7], 'Diminished': [0, 3, 6], 'Augmented': [0, 4, 8], 'Sus2': [0, 2, 7], 'Sus4': [0, 5, 7],
  'Major 7': [0, 4, 7, 11], 'Minor 7': [0, 3, 7, 10], 'Dominant 7': [0, 4, 7, 10], 'Major 9': [0, 4, 7, 11, 14], 'Minor 9': [0, 3, 7, 10, 14], 'Add9': [0, 4, 7, 14],
};
export const PROGRESSIONS = [
  ['I – V – vi – IV', [0, 4, 5, 3], 'The most used four chords in pop.', 'major'], ['vi – IV – I – V', [5, 3, 0, 4], 'Same chords, minor feel. Emotional and anthemic.', 'major'],
  ['I – vi – IV – V', [0, 5, 3, 4], 'The 50s doo-wop progression.', 'major'], ['ii – V – I', [1, 4, 0], 'The core cadence of jazz.', 'major'],
  ['I – IV – V – I', [0, 3, 4, 0], 'Blues and rock foundation, also all over highlife.', 'major'], ['i – VII – VI – VII', [0, 6, 5, 6], 'Driving minor loop used in a lot of electronic and Afrobeats.', 'minor'],
  ['i – iv – v – i', [0, 3, 4, 0], 'Natural minor home-and-away.', 'minor'], ['i – VI – III – VII', [0, 5, 2, 6], 'Epic minor loop heard in film and pop.', 'minor'],
];
export function scaleNotes(root, name, oct = 4) { return SCALES[name].map(i => root + 12 * (oct + 1) + i); }
/* triad or seventh built on scale degree d of the scale */
export function diatonicChord(root, scale, d, sevenths = false) {
  const n = scale.length, pick = k => root + scale[(d + k) % n] + 12 * Math.floor((d + k) / n);
  const out = [pick(0), pick(2), pick(4)]; if (sevenths) out.push(pick(6)); return out.map(m => m - root);
}
export const INTERVALS = [['Minor 2nd', 1], ['Major 2nd', 2], ['Minor 3rd', 3], ['Major 3rd', 4], ['Perfect 4th', 5], ['Tritone', 6], ['Perfect 5th', 7], ['Minor 6th', 8], ['Major 6th', 9], ['Minor 7th', 10], ['Major 7th', 11], ['Octave', 12]];
export const INTERVAL_SONGS = { 'Minor 2nd': 'the "Jaws" theme', 'Major 2nd': '"Happy Birthday" (first two notes)', 'Minor 3rd': '"Greensleeves"', 'Major 3rd': '"When the Saints Go Marching In"', 'Perfect 4th': '"Here Comes the Bride"', 'Tritone': '"Maria" from West Side Story', 'Perfect 5th': '"Twinkle Twinkle" (first jump)', 'Minor 6th': 'the "Love Story" theme', 'Major 6th': '"My Bonnie Lies Over the Ocean"', 'Minor 7th': '"Somewhere" from West Side Story', 'Major 7th': '"Take On Me" chorus leap', 'Octave': '"Somewhere Over the Rainbow"' };
