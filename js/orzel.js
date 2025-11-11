<script>
(function () {
  console.log("Hologram script loaded");

  // --- Setup ---
  function initHologram() {
    const holos = document.querySelectorAll(".holo-back");
    const bases = document.querySelectorAll(".base-back");
    const tops = document.querySelectorAll(".godlo-top");

    if (!holos.length) return console.warn("No .holo-back found!");

    bases.forEach(b => { b.style.display = "block"; b.style.opacity = "1"; });
    tops.forEach(t => { t.style.display = "block"; t.style.opacity = "1"; });

    holos.forEach(h => {
      h.style.opacity = "0.7";
      h.style.backgroundPosition = "center 50%";
    });
  }

  function handleOrientation(e) {
    if (e.beta === null) return;
    const holos = document.querySelectorAll(".holo-back");
    let t = Math.sin(((e.beta - 90) * Math.PI) / 180);
    t = Math.abs(t);
    t = Math.pow(t, 0.8);
    let minOpacity = (e.beta >= 60 && e.beta <= 140) ? 0.7 : 0.3;
    const opacity = Math.max(minOpacity, t);
    const pos = 100 * t;
    holos.forEach(h => {
      h.style.backgroundPosition = `center ${pos}%`;
      h.style.opacity = opacity;
    });
  }

  // --- Popup logic ---
  const popup = document.getElementById("motion-popup");
  const button = document.getElementById("enableMotionBtn");

  function showPopup() {
    popup.style.visibility = "visible";
    popup.style.opacity = "1";
  }
  function hidePopup() {
    popup.style.opacity = "0";
    setTimeout(() => popup.style.visibility = "hidden", 300);
  }

  function enableMotion() {
    console.log("Trying to enable motion...");
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          console.log("Motion permission:", response);
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            hidePopup();
          } else {
            alert("Brak zgody – efekt hologramu nie będzie działał.");
          }
        })
        .catch(err => console.error("Permission error:", err));
    } else {
      console.log("Standard motion access (non-iOS)");
      window.addEventListener("deviceorientation", handleOrientation);
      hidePopup();
    }
  }

  // --- Run setup ---
  document.addEventListener("DOMContentLoaded", () => {
    initHologram();
    window.addEventListener("pageshow", initHologram);

    if (button) button.addEventListener("click", enableMotion);

    const iOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    console.log("iOS detected:", iOS);

    // iOS Safari often delays showing the popup until touchstart
    if (iOS) {
      window.addEventListener("touchstart", function once() {
        showPopup();
        window.removeEventListener("touchstart", once);
      });
    } else {
      // Non-iOS: enable motion automatically
      window.addEventListener("deviceorientation", handleOrientation);
    }
  });
})();
</script>
