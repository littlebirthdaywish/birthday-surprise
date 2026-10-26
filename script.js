const surpriseBtn = document.getElementById('surpriseBtn');
const heartsBtn = document.getElementById('heartsBtn');
const letter = document.getElementById('letter');
const sparkleLayer = document.getElementById('sparkleLayer');
const toast = document.getElementById('toast');

surpriseBtn.addEventListener('click', () => {
  letter.classList.add('reveal');
  letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
  burstHearts(18);
  showToast('A little note, just for you, Riya ♡');
  surpriseBtn.innerHTML = 'Surprise opened <span aria-hidden="true">♡</span>';
});

heartsBtn.addEventListener('click', () => {
  burstHearts(32);
  showToast('Sending extra birthday wishes your way 💗');
});

function burstHearts(count) {
  const symbols = ['♡', '♥', '✦', '✧', '💕'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.setProperty('--duration', `${3 + Math.random() * 3}s`);
    heart.style.animationDelay = `${Math.random() * 0.8}s`;
    heart.style.fontSize = `${14 + Math.random() * 17}px`;
    sparkleLayer.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// A few subtle floating sparkles appear on first load.
window.addEventListener('load', () => {
  setTimeout(() => burstHearts(8), 500);
});
