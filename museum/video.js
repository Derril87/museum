document.addEventListener("DOMContentLoaded", () => {
  const videos = [
    {
      src: "assets/video/video0.mp4",
      poster: "assets/video/poster0.jpg",
      title: "Welcome to the Louvre...",
    },
    {
      src: "assets/video/video3.mp4",
      poster: "assets/video/poster3.jpg",
      title: "Exposition - Le Corps et l'Ame. De Dona...",
    },
    {
      src: "assets/video/video1.mp4",
      poster: "assets/video/poster1.jpg",
      title: "Au Louvre ! La Venus de Milo",
    },
    {
      src: "assets/video/video2.mp4",
      poster: "assets/video/poster2.jpg",
      title: "Promenade dans les collections mesop...",
    },
    {
      src: "assets/video/video4.mp4",
      poster: "assets/video/poster4.jpg",
      title: "Petits contes de Printemps...",
    },
  ];

  const player = document.querySelector(".player");
  const video = document.getElementById("mainVideo");
  const playIconButton = document.getElementById("playIconButton");
  const playWrap = document.querySelector(".controls__play");
  const pauseWrap = document.querySelector(".controls__stop");
  const progressEl = document.getElementById("progress");
  const progressBox = document.querySelector(".controls__progress");
  const volOnWrap = document.querySelector(".controls__progress-volume-on");
  const volOffWrap = document.querySelector(".controls__progress-volume-off");
  const volRange = document.getElementById("volumeRange");
  const volBox = document.querySelector(".controls__volume-range");
  const fsOnWrap = document.querySelector(".controls__fullscreen-on");
  const fsOffWrap = document.querySelector(".controls__fullscreen-off");

  if (!player || !video) return;

  let prevVolume = 0.5;
  video.volume = 0.5;
  video.muted = false;
  volRange && (volRange.value = "0.5");
  volBox?.style.setProperty("--volume-progress", "50%");

  const ui = {
    showPlay: (show) => {
      playWrap?.classList.toggle("hidden", !show);
      pauseWrap?.classList.toggle("hidden", show);
    },
    showMute: (muted) => {
      volOnWrap?.classList.toggle("hidden", muted);
      volOffWrap?.classList.toggle("hidden", !muted);
    },
    showFs: (on) => {
      fsOnWrap?.classList.toggle("hidden", on);
      fsOffWrap?.classList.toggle("hidden", !on);
    },
    bigPlay: (playing) => {
      if (!playIconButton) return;
      playIconButton.style.display = playing ? "none" : "block";
    },
    setProgress: (val) => {
      progressEl && (progressEl.value = val);
      progressBox?.style.setProperty("--progress", `${val}%`);
    },
    setVolumeBar: (v01) => {
      volBox?.style.setProperty(
        "--volume-progress",
        `${Math.round(v01 * 100)}%`
      );
    },
  };

  const ensureCanPlay = async (v) => {
    if (v.readyState >= 2) return;
    await new Promise((res) =>
      v.addEventListener("canplay", res, { once: true })
    );
  };

  async function togglePlay() {
    if (video.paused) {
      await ensureCanPlay(video);
      try {
        await video.play();
        ui.showPlay(false);
        ui.bigPlay(true);
      } catch (e) {
        console.warn("play blocked", e);
      }
    } else {
      video.pause();
      ui.showPlay(true);
      ui.bigPlay(false);
    }
  }

  playWrap?.addEventListener("click", togglePlay);
  pauseWrap?.addEventListener("click", togglePlay);
  playIconButton?.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  video.addEventListener("play", () => {
    ui.showPlay(false);
    ui.bigPlay(true);
  });
  video.addEventListener("pause", () => {
    ui.showPlay(true);
    ui.bigPlay(false);
  });

  video.addEventListener("timeupdate", () => {
    if (!isFinite(video.duration) || video.duration === 0) return;
    ui.setProgress((video.currentTime / video.duration) * 100);
  });

  progressEl?.addEventListener("input", () => {
    if (!isFinite(video.duration) || video.duration === 0) return;
    video.currentTime = (progressEl.value / 100) * video.duration;
    ui.setProgress(progressEl.value);
  });

  video.addEventListener("ended", () => {
    ui.showPlay(true);
    ui.bigPlay(false);
    ui.setProgress(0);
  });

  function toggleMute() {
    if (!video.muted) {
      prevVolume = video.volume || prevVolume;
      video.muted = true;
      volRange && (volRange.value = "0");
      ui.setVolumeBar(0);
    } else {
      video.muted = false;
      video.volume = prevVolume > 0 ? prevVolume : 0.5;
      volRange && (volRange.value = String(video.volume));
      ui.setVolumeBar(video.volume);
    }
    ui.showMute(video.muted);
  }
  volOnWrap?.addEventListener("click", toggleMute);
  volOffWrap?.addEventListener("click", toggleMute);

  volRange?.addEventListener("input", () => {
    const v = Math.min(1, Math.max(0, parseFloat(volRange.value) || 0));
    video.volume = v;
    ui.setVolumeBar(v);
    if (v === 0) video.muted = true;
    else {
      video.muted = false;
      prevVolume = v;
    }
    ui.showMute(video.muted);
  });

  const isFullscreen = () =>
    !!(document.fullscreenElement || document.webkitFullscreenElement);
  function enterFs() {
    if (isFullscreen()) return;
    const p =
      player.requestFullscreen?.() || player.webkitRequestFullscreen?.();
    p?.catch?.(() => {});
  }
  function exitFs() {
    if (!isFullscreen()) return;
    const p = document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    p?.catch?.(() => {});
  }
  fsOnWrap?.addEventListener("click", enterFs);
  fsOffWrap?.addEventListener("click", exitFs);
  const onFsChange = () => ui.showFs(isFullscreen());
  document.addEventListener("fullscreenchange", onFsChange);
  document.addEventListener("webkitfullscreenchange", onFsChange);

  document.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;
    switch (e.key.toLowerCase()) {
      case " ":
        e.preventDefault();
        togglePlay();
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        isFullscreen() ? exitFs() : enterFs();
        break;
      case "arrowright":
        video.currentTime = Math.min(
          video.currentTime + 5,
          video.duration || video.currentTime
        );
        break;
      case "arrowleft":
        video.currentTime = Math.max(video.currentTime - 5, 0);
        break;
      case "arrowup": {
        const v = Math.min(video.volume + 0.05, 1);
        video.volume = v;
        video.muted = v === 0;
        volRange && (volRange.value = String(v));
        ui.setVolumeBar(v);
        if (v > 0) prevVolume = v;
        ui.showMute(video.muted);
        break;
      }
      case "arrowdown": {
        const v = Math.max(video.volume - 0.05, 0);
        video.volume = v;
        video.muted = v === 0;
        volRange && (volRange.value = String(v));
        ui.setVolumeBar(v);
        if (v > 0) prevVolume = v;
        ui.showMute(video.muted);
        break;
      }
    }
  });

  const carouselRoot = document.querySelector(
    ".videojourney-container-carousel"
  );
  const dots = document.querySelectorAll(".pagination-buttons circle");
  const arrows = document.querySelectorAll(".pagination-buttons path");
  let currentMain = 0;
  let carouselOffset = 1;

  function renderCarousel() {
    if (!carouselRoot) return;
    carouselRoot.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const idx = (currentMain + carouselOffset + i) % videos.length;
      const item = videos[idx];

      const div = document.createElement("div");
      div.className = "video-block-image";
      div.dataset.videoIndex = idx;

      div.innerHTML = `
        <video src="${item.src}" poster="${item.poster}" class="video-picture"></video>
        <div class="play-mini-button">
          <img src="assets/img/video-blocks/youtube-icon.png" alt="play-icon" class="play-icon-button">
        </div>
        <img src="assets/img/video-blocks/Ellipse9.png" alt="ellipse-icon-mini" class="ellipse-icon-mini">
        <p>${item.title}</p>
        <img src="assets/img/video-blocks/Group18.png" alt="group-icon-mini" class="group-icon-mini">
      `;
      div.addEventListener("click", () => moveToMain(idx, true));
      div.querySelector(".play-mini-button")?.addEventListener("click", (e) => {
        e.stopPropagation();
        moveToMain(idx, true);
      });
      const pv = div.querySelector("video");
      pv.controls = false;
      pv.addEventListener(
        "play",
        (e) => {
          e.preventDefault();
          pv.pause();
        },
        true
      );

      carouselRoot.appendChild(div);
    }
  }

  async function replaceMain(idx, auto) {
    const muted = video.muted;
    const vol = video.volume;

    video.pause();
    video.src = videos[idx].src;
    video.poster = videos[idx].poster;
    video.load();

    ui.setProgress(0);

    video.muted = muted;
    video.volume = vol;
    volRange && (volRange.value = String(muted ? 0 : vol));
    ui.setVolumeBar(muted ? 0 : vol);
    ui.showMute(muted);

    if (auto) {
      await ensureCanPlay(video);
      try {
        await video.play();
        ui.showPlay(false);
        ui.bigPlay(true);
      } catch {
        ui.showPlay(true);
        ui.bigPlay(false);
      }
    } else {
      ui.showPlay(true);
      ui.bigPlay(false);
    }
  }

  function moveToMain(idx, autoPlay) {
    currentMain = idx;
    renderCarousel();
    updateDots();
    replaceMain(idx, !!autoPlay);
  }

  function updateDots() {
    dots.forEach((c, i) => {
      c.setAttribute("fill", i === currentMain ? "#710707" : "#999999");
    });
  }

  dots.forEach((c, i) => {
    c.style.cursor = "pointer";
    c.addEventListener("click", () => moveToMain(i, true));
  });
  arrows.forEach((p, i) => {
    p.style.cursor = "pointer";
    const left = i < arrows.length / 2;
    p.addEventListener("click", () => {
      if (left) {
        carouselOffset = (carouselOffset - 1 + videos.length) % videos.length;
      } else {
        carouselOffset = (carouselOffset + 1) % videos.length;
      }
      renderCarousel();
    });
  });

  renderCarousel();
  updateDots();
  ui.showPlay(true);
  ui.bigPlay(false);
  ui.showMute(video.muted);
  ui.showFs(!!(document.fullscreenElement || document.webkitFullscreenElement));
});
