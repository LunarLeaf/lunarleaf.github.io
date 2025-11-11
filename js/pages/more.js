document.addEventListener("DOMContentLoaded", function () {
  try {
  } catch (e) {}
  const introLabel = document.querySelector(".intro__label");
  try {
    if (typeof initHeaderTitleObserver === "function") {
      initHeaderTitleObserver({
        onEnter: function () {
          if (introLabel) introLabel.classList.remove("is-hidden");
        },
        onLeave: function () {
          if (introLabel) introLabel.classList.add("is-hidden");
        },
      });
    }
  } catch (_) {}

  try {
    window.logoutUser = function (ev) {
      try {
        if (ev && ev.preventDefault) ev.preventDefault();
      } catch (_) {}
      try {
        sessionStorage.removeItem("userUnlocked");
        localStorage.removeItem("userPasswordHash");
      } catch (_) {}
      window.location.replace("login.html");
    };
  } catch (_) {}

  try {
    var themeOverlay = document.getElementById("themeOverlay");
    if (themeOverlay) {
      var applyBtn = document.getElementById("themeApply");
      var cancelBtn = document.getElementById("themeCancel");
      var radios = themeOverlay.querySelectorAll('input[name="theme-mode"]');

      var openOverlay = function () {
        try {
          var mode =
            (window.Theme && window.Theme.getMode && window.Theme.getMode()) ||
            "auto";
          Array.prototype.forEach.call(radios, function (r) {
            r.checked = r.value === mode;
          });
        } catch (_) {}
        try {
          document.body.classList.add("camera-open");
          document.body.classList.add("no-scroll");
        } catch (_) {}
        try {
          themeOverlay.removeAttribute("hidden");
        } catch (_) {}
      };

      var closeOverlay = function () {
        try {
          themeOverlay.setAttribute("hidden", "");
        } catch (_) {}
        try {
          document.body.classList.remove("camera-open");
          document.body.classList.remove("no-scroll");
        } catch (_) {}
      };
      try {
        window.closeThemeOverlay = closeOverlay;
      } catch (_) {}

      if (applyBtn)
        applyBtn.addEventListener("click", function () {
          try {
            var selected = themeOverlay.querySelector(
              'input[name="theme-mode"]:checked'
            );
            if (
              selected &&
              window.Theme &&
              typeof window.Theme.setMode === "function"
            ) {
              window.Theme.setMode(selected.value);
            }
          } catch (_) {}
          closeOverlay();
        });

      if (cancelBtn) cancelBtn.addEventListener("click", closeOverlay);
      try {
        var themeCards = themeOverlay.querySelectorAll(".card[data-theme]");
        Array.prototype.forEach.call(themeCards, function (card) {
          var applyMode = function () {
            try {
              var mode = card.getAttribute("data-theme");
              var r = card.querySelector('input[name="theme-mode"]');
              if (r) {
                r.checked = true;
                try {
                  r.dispatchEvent(new Event("change", { bubbles: true }));
                } catch (_) {}
              } else if (
                mode &&
                window.Theme &&
                typeof window.Theme.setMode === "function"
              ) {
                window.Theme.setMode(mode);
              }
            } catch (_) {}
          };
          card.addEventListener("click", function () {
            applyMode();
          });
          card.addEventListener("keydown", function (e) {
            if (e && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              applyMode();
            }
          });
        });
      } catch (_) {}
      var radiosLive = themeOverlay.querySelectorAll(
        'input[name="theme-mode"]'
      );
      Array.prototype.forEach.call(radiosLive, function (r) {
        r.addEventListener("change", function () {
          try {
            var v = r.value;
            if (window.Theme && typeof window.Theme.setMode === "function" && v)
              window.Theme.setMode(v);
          } catch (_) {}
        });
      });

      var appearanceCardIcon = document.querySelector(
        'img[src$="assets/icons/aa073_mode.svg"], img[src$="aa073_mode.svg"]'
      );
      if (appearanceCardIcon && appearanceCardIcon.closest) {
        var card = appearanceCardIcon.closest(".card");
        if (card) {
          card.style.cursor = "pointer";
          card.addEventListener("click", openOverlay);
          card.addEventListener("keydown", function (e) {
            if (e && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              openOverlay();
            }
          });
          try {
            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "button");
          } catch (_) {}
        }
      }
    }
  } catch (_) {}
});
