
/* ==========================================
   RIYA'S BIRTHDAY WEBSITE — COMPLETE JS
   Music • Cake • Gallery • Confetti • Hearts
   No timer
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const music = $("#birthdayMusic");
  const musicToggle = $("#musicToggle");
  const musicText = $("#musicText");
  const musicHint = $("#musicHint");
  const startMusic = $("#startMusic");

  const cake = $("#cake");
  const celebrateBtn = $("#celebrateBtn");
  const wishBtn = $("#wishBtn");

  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const closeLightbox = $("#closeLightbox");

  const toast = $("#toast");
  const balloonLayer = $("#balloonLayer");

  let toastTimeout;
  let musicPlaying = false;

  // ------------------------------------------
  // Toast notification
  // ------------------------------------------

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // ------------------------------------------
  // Music controls
  // Mobile browsers require a user interaction
  // before audio can start.
  // ------------------------------------------

  function updateMusicUI(playing) {
    musicPlaying = playing;

    if (musicToggle) {
      musicToggle.setAttribute("aria-pressed", String(playing));
      musicToggle.setAttribute(
        "aria-label",
        playing ? "Pause birthday music" : "Play birthday music"
      );
    }

    if (musicText) {
      musicText.textContent = playing ? "Music on" : "Music off";
    }

    if (musicHint) {
      musicHint.style.display = playing ? "none" : "flex";
    }
  }

  async function playMusic() {
    if (!music) {
      showToast("Music file nahi mili — check assets folder ♫");
      return;
    }

    try {
      await music.play();
      updateMusicUI(true);
      showToast("Birthday vibes are on ♫");
    } catch (error) {
      updateMusicUI(false);
      showToast("Music play karne ke liye dobara tap karo ♡");
    }
  }

  function pauseMusic() {
    if (music) music.pause();
    updateMusicUI(false);
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", () => {
      if (musicPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  if (startMusic) {
    startMusic.addEventListener("click", playMusic);
  }

  if (music) {
    music.addEventListener("play", () => updateMusicUI(true));
    music.addEventListener("pause", () => updateMusicUI(false));

    music.addEventListener("error", () => {
      updateMusicUI(false);
    });
  }

  // ------------------------------------------
  // Floating balloons and hearts
  // ------------------------------------------

  if (balloonLayer) {
    const decorations = ["♡", "♥", "✦", "✧", "🎈"];

    for (let i = 0; i < 14; i++) {
      const item = document.createElement("span");

      item.className = "floating-heart";
      item.textContent = decorations[i % decorations.length];
      item.style.left = Math.random() * 96 + "%";
      item.style.animationDelay = Math.random() * 14 + "s";
      item.style.animationDuration = 12 + Math.random() * 10 + "s";
      item.style.fontSize = 14 + Math.random() * 13 + "px";

      balloonLayer.appendChild(item);
    }
  }

  // ------------------------------------------
  // Confetti effect
  // ------------------------------------------

  function launchConfetti(amount = 90) {
    const colors = [
      "#f27ca7",
      "#ffb6cc",
      "#d9baff",
      "#f7d58b",
      "#ffffff",
      "#e98eb2"
    ];

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
      const piece = document.createElement("span");

      piece.style.position = "fixed";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.top = "-20px";
      piece.style.width = 6 + Math.random() * 6 + "px";
      piece.style.height = 8 + Math.random() * 8 + "px";
      piece.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      piece.style.pointerEvents = "none";
      piece.style.zIndex = "9999";
      piece.style.opacity = "1";

      document.body.appendChild(piece);

      const distance = window.innerHeight + 80;
      const duration = 2200 + Math.random() * 2400;
      const drift = (Math.random() - 0.5) * 240;
      const rotation = Math.random() * 900;

      const animation = piece.animate(
        [
          {
            transform: "translate3d(0, 0, 0) rotate(0deg)",
            opacity: 1
          },
          {
            transform:
              `translate3d(${drift}px, ${distance}px, 0) rotate(${rotation}deg)`,
            opacity: 0.1
          }
        ],
        {
          duration,
          easing: "cubic-bezier(.25,.46,.45,.94)"
        }
      );

      animation.onfinish = () => piece.remove();
    }
  }

  // ------------------------------------------
  // Cake click
  // ------------------------------------------

  if (cake) {
    cake.addEventListener("click", () => {
      cake.animate(
        [
          { transform: "scale(1) rotate(0deg)" },
          { transform: "scale(1.2) rotate(-7deg)" },
          { transform: "scale(1.08) rotate(7deg)" },
          { transform: "scale(1) rotate(0deg)" }
        ],
        {
          duration: 550,
          easing: "ease-out"
        }
      );

      launchConfetti(35);
      showToast("Make a wish, Riya! 🎂♡");
    });
  }

  // ------------------------------------------
  // Main celebration button
  // ------------------------------------------

  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      launchConfetti(100);
      showToast("This little surprise is made for you, Riya! ♡");

      const wishes = $("#wishes");

      if (wishes) {
        wishes.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  // ------------------------------------------
  // Final wish button
  // ------------------------------------------

  if (wishBtn) {
    wishBtn.addEventListener("click", () => {
      launchConfetti(130);
      showToast("May all your wishes come true, Riya! ✨♡");

      wishBtn.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.06)" },
          { transform: "scale(1)" }
        ],
        { duration: 350 }
      );
    });
  }

  // ------------------------------------------
  // Photo gallery lightbox
  // ------------------------------------------

  function openLightbox(photoSrc, altText) {
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = photoSrc;
    lightboxImg.alt = altText || "Riya photo enlarged";
    lightbox.style.display = "flex";
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    if (closeLightbox) closeLightbox.focus();
  }

  function hideLightbox() {
    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove("active");
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  $$(".photo-card").forEach((card) => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img");
      const source =
        card.getAttribute("data-photo") ||
        (image ? image.src : "");

      const alt = image ? image.alt : "Riya photo enlarged";

      if (source) openLightbox(source, alt);
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener("click", hideLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        hideLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideLightbox();
    }
  });

  // ------------------------------------------
  // Keyboard accessibility for interactive cake
  // ------------------------------------------

  if (cake) {
    cake.setAttribute("role", "button");
    cake.setAttribute("tabindex", "0");
    cake.setAttribute("aria-label", "Tap the birthday cake to make a wish");

    cake.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        cake.click();
      }
    });
  }

  // ------------------------------------------
  // Initial state
  // ------------------------------------------

  updateMusicUI(false);

  console.log("Riya's birthday website is ready ♡");
});
