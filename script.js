const balloonLayer = document.getElementById('balloonLayer');
const musicToggle = document.getElementById('musicToggle');
const musicText = document.getElementById('musicText');
const toast = document.getElementById('toast');
let toastTimer;
let audioCtx = null, musicTimer = null, musicPlaying = false, noteIndex = 0;

// Balloons keep gently floating throughout the page, without blocking taps.
const balloonColors = ['#f28bb9','#d5a8ff','#ffc7dc','#a9c7ff','#ffe1a8','#b5e6d4'];
function addBalloon(initial = false) {
  const balloon = document.createElement('span');
  balloon.className = 'balloon';
  const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  balloon.style.setProperty('--balloon-color', color);
  balloon.style.background = `radial-gradient(circle at 30% 25%, #ffffffb5, ${color} 40%, ${color} 100%)`;
  balloon.style.left = `${Math.random() * 100}%`;
  balloon.style.width = `${25 + Math.random() * 20}px`;
  balloon.style.height = `${35 + Math.random() * 25}px`;
  balloon.style.setProperty('--drift', `${Math.round(Math.random() * 150 - 75)}px`);
  balloon.style.setProperty('--tilt', `${Math.round(Math.random() * 35 - 17)}deg`);
  balloon.style.animationDuration = `${11 + Math.random() * 12}s`;
  if (initial) balloon.style.animationDelay = `${-Math.random() * 16}s`;
  balloonLayer.appendChild(balloon);
  setTimeout(() => balloon.remove(), 25000);
}
for (let i = 0; i < 15; i++) addBalloon(true);
setInterval(() => addBalloon(), 900);

// Gentle synthesized piano-like notes: no extra audio download required.
// Browsers only start sound after the visitor taps the music button.
const melody = [
  [261.63, 329.63, 392.00], [293.66, 349.23, 440.00],
  [246.94, 329.63, 392.00], [220.00, 293.66, 369.99],
  [261.63, 329.63, 392.00], [196.00, 293.66, 392.00],
  [220.00, 329.63, 440.00], [246.94, 311.13, 392.00]
];
function playChord() {
  if (!audioCtx || audioCtx.state === 'closed') return;
  const chord = melody[noteIndex % melody.length];
  const now = audioCtx.currentTime;
  chord.forEach((frequency, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    filter.type = 'lowpass';
    filter.frequency.value = 1300;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(i === 0 ? 0.045 : 0.025, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.65);
    osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + 1.7);
  });
  // A quiet upper note gives the progression a delicate, music-box feel.
  const top = audioCtx.createOscillator(), topGain = audioCtx.createGain();
  top.type = 'triangle'; top.frequency.value = chord[2] * 2;
  topGain.gain.setValueAtTime(0.0001, now);
  topGain.gain.exponentialRampToValueAtTime(0.012, now + 0.025);
  topGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
  top.connect(topGain); topGain.connect(audioCtx.destination); top.start(now); top.stop(now + 1.15);
  noteIndex++;
}
async function toggleMusic() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) { showToast('This browser cannot play the piano sound.'); return; }
    audioCtx = new AudioContextClass();
  }
  if (musicPlaying) {
    clearInterval(musicTimer); musicTimer = null; musicPlaying = false;
    musicToggle.classList.remove('playing'); musicToggle.setAttribute('aria-pressed', 'false');
    musicText.textContent = 'Play piano';
    return;
  }
  await audioCtx.resume();
  musicPlaying = true; musicToggle.classList.add('playing');
  musicToggle.setAttribute('aria-pressed', 'true'); musicText.textContent = 'Pause piano';
  playChord(); musicTimer = setInterval(playChord, 1750);
}
musicToggle.addEventListener('click', toggleMusic);

function showToast(message) {
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function confettiBurst(amount = 95) {
  const colors = ['#ff9fc9','#f9d5e7','#d3b7ff','#fff0c4','#b8e8d7','#ffffff'];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${5 + Math.random() * 7}px`;
    piece.style.height = `${8 + Math.random() * 10}px`;
    piece.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    piece.style.setProperty('--drift', `${Math.round(Math.random() * 220 - 110)}px`);
    piece.style.animationDuration = `${2.5 + Math.random() * 3}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}
const cakeWrap = document.getElementById('cakeWrap');
function cakeMagic() {
  confettiBurst(65);
  document.getElementById('cake').textContent = '🧁';
  showToast('A little extra sweetness for your day, Riya! ♡');
  setTimeout(() => { document.getElementById('cake').textContent = '🎂'; }, 1500);
}
cakeWrap.addEventListener('click', cakeMagic);
cakeWrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cakeMagic(); } });
document.getElementById('celebrateBtn').addEventListener('click', () => {
  confettiBurst(110);
  document.getElementById('letter').scrollIntoView({behavior:'smooth', block:'center'});
  showToast('Birthday sparkle incoming! ✨');
});
document.getElementById('wishBtn').addEventListener('click', () => {
  confettiBurst(150);
  for (let i = 0; i < 8; i++) setTimeout(() => addBalloon(), i * 120);
  showToast('Wish sent into the universe, Riya! 💗');
});

// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  lightboxImg.src = button.dataset.photo;
  lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false');
}));
function closeLightbox() { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); lightboxImg.src = ''; }
document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
