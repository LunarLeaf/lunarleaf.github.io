/**
 * Adjusts the dashboard page's minimum height to ensure the header covers the title properly,
 * accounting for dynamic viewport changes and safe areas on mobile devices.
 * This prevents layout shifts and maintains visual consistency during scrolling.
 */
function setDashboardScrollLimit() {
  try {
    const body = document.body;
    if (!body || !body.classList.contains("dashboard-page")) return;
    const header = document.querySelector("header.app-header");
    const title = document.getElementById("main-title");
    if (!header || !title) return;

    // Measure current viewport height (dynamic where supported)
    const viewportH =
      (window.visualViewport && window.visualViewport.height) ||
      window.innerHeight ||
      document.documentElement.clientHeight ||
      0;
    const headerH = Math.ceil(header.getBoundingClientRect().height || 0);
    const titleRect = title.getBoundingClientRect();
    const coverDistance = Math.max(
      0,
      Math.ceil(titleRect.bottom - headerH + 1)
    );

    // Subtract any bottom safe-area spacer from ::after to keep net extra scroll precise
    let afterH = 0;
    try {
      const afterStyle = window.getComputedStyle(body, "::after");
      const h = afterStyle && afterStyle.getPropertyValue("height");
      afterH = h ? Math.max(0, parseFloat(h)) : 0;
    } catch (_) {
      afterH = 0;
    }

    const extra = Math.max(0, coverDistance - afterH);
    const minH = Math.max(0, Math.round(viewportH + extra));

    // Apply in px to work across browsers (fallback for dvh)
    body.style.minHeight = minH + "px";
  } catch (_) {}
}

document.addEventListener("DOMContentLoaded", function () {
  try {
  } catch (e) {}

  const addBtn = document.querySelector(".floating-add-doc-btn");
  try {
    if (typeof initHeaderTitleObserver === "function") {
      initHeaderTitleObserver({
        onEnter: function () {
          if (addBtn) addBtn.classList.remove("compact");
        },
        onLeave: function () {
          if (addBtn) addBtn.classList.add("compact");
        },
      });
    }
  } catch (_) {}

  // Set precise scroll limit so the header can just cover the title
  setDashboardScrollLimit();

  // Lift animation on mDowód card before navigating to dowod.html
  try {
    var idCard = document.querySelector('a.id-card[href="dowod.html"]');
    if (idCard) {
      idCard.addEventListener("click", function (e) {
        try {
          e.preventDefault();
        } catch (_) {}
        // Guard against double-activation
        if (idCard.classList.contains("is-activating")) return;
        idCard.classList.add("is-activating");
        idCard.style.pointerEvents = "none";
        // Navigate after a short, pleasant delay
        setTimeout(function () {
          window.location.href = idCard.getAttribute("href");
        }, 320);
      });
    }
  } catch (_) {}
});

window.addEventListener("load", setDashboardScrollLimit);
window.addEventListener("resize", setDashboardScrollLimit);
window.addEventListener("orientationchange", setDashboardScrollLimit);
if (window.visualViewport) {
  try {
    window.visualViewport.addEventListener("resize", setDashboardScrollLimit);
  } catch (_) {}
}
