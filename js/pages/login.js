(function () {
  // Gyroscope permission handling
  let gyroPopup = null;

  function createGyroPopup() {
    if (gyroPopup) return;

    gyroPopup = document.createElement('div');
    gyroPopup.id = 'gyroPopup';
    gyroPopup.innerHTML = `
      <div class="gyro-popup__overlay"></div>
      <div class="gyro-popup__content">
        <div class="gyro-popup__header">
          <img src="assets/icons/gyroscope.svg" alt="Gyroscope" class="gyro-popup__icon">
          <h2 class="gyro-popup__title">Funkcja Gyroscope</h2>
        </div>
        <div class="gyro-popup__body">
          <p>Aby zapewnić pełną funkcjonalność aplikacji, potrzebujemy dostępu do czujnika ruchu (gyroscope).</p>
          <p>Funkcja pozwala na interakcję z dokumentami za pomocą ruchu urządzenia.</p>
          <div class="gyro-popup__buttons">
            <button type="button" class="gyro-popup__btn gyro-popup__btn--primary" id="enableGyroBtn">
              Włącz gyroscope
            </button>
            <button type="button" class="gyro-popup__btn gyro-popup__btn--secondary" id="skipGyroBtn">
              Pomiń na razie
            </button>
          </div>
          <p class="gyro-popup__note"><small>Ta prośba pojawi się przy każdym logowaniu.</small></p>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #gyroPopup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: none;
      }
      
      .gyro-popup__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      
      .gyro-popup__content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--background-primary, #ffffff);
        border-radius: 16px;
        padding: 24px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-primary, #e5e7eb);
      }
      
      .gyro-popup__header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .gyro-popup__icon {
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }
      
      .gyro-popup__title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary, #111827);
      }
      
      .gyro-popup__body p {
        margin: 0 0 16px 0;
        color: var(--text-secondary, #4b5563);
        line-height: 1.5;
      }
      
      .gyro-popup__buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin: 24px 0 16px;
      }
      
      .gyro-popup__btn {
        padding: 14px 20px;
        border-radius: 10px;
        border: none;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
      }
      
      .gyro-popup__btn--primary {
        background: var(--accent-primary, #3b82f6);
        color: white;
      }
      
      .gyro-popup__btn--primary:hover {
        background: var(--accent-hover, #2563eb);
      }
      
      .gyro-popup__btn--secondary {
        background: var(--background-secondary, #f3f4f6);
        color: var(--text-primary, #111827);
        border: 1px solid var(--border-primary, #e5e7eb);
      }
      
      .gyro-popup__btn--secondary:hover {
        background: var(--background-tertiary, #e5e7eb);
      }
      
      .gyro-popup__note {
        text-align: center;
        color: var(--text-tertiary, #6b7280) !important;
        margin-top: 12px !important;
      }
      
      @media (prefers-color-scheme: dark) {
        .gyro-popup__content {
          background: var(--background-primary-dark, #1f2937);
          border-color: var(--border-primary-dark, #374151);
        }
        
        .gyro-popup__title {
          color: var(--text-primary-dark, #f9fafb);
        }
        
        .gyro-popup__body p {
          color: var(--text-secondary-dark, #d1d5db);
        }
        
        .gyro-popup__btn--secondary {
          background: var(--background-secondary-dark, #374151);
          color: var(--text-primary-dark, #f9fafb);
          border-color: var(--border-primary-dark, #4b5563);
        }
        
        .gyro-popup__btn--secondary:hover {
          background: var(--background-tertiary-dark, #4b5563);
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(gyroPopup);
  }

  function showGyroPopup() {
    // ALWAYS show the popup, don't check localStorage or previous choices
    createGyroPopup();
    gyroPopup.style.display = 'block';
    
    // Add button handlers
    document.getElementById('enableGyroBtn').addEventListener('click', function() {
      requestMotionPermission();
    });
    
    document.getElementById('skipGyroBtn').addEventListener('click', function() {
      hideGyroPopup();
      // Don't save to localStorage, we'll ask again next time
      proceedWithLogin();
    });
  }

  function hideGyroPopup() {
    if (gyroPopup) {
      gyroPopup.style.display = 'none';
    }
  }

  function requestMotionPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      
      console.log('[Gyroscope] Requesting permission on iOS...');
      
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          console.log('[Gyroscope] Permission state:', permissionState);
          
          if (permissionState === 'granted') {
            // Don't save to localStorage, we'll ask again next time
            alert('Gyroscope został włączony dla tej sesji!');
          } else {
            // Don't save to localStorage
            alert('Gyroscope nie został włączony. Możesz to zmienić w ustawieniach Safari.');
          }
          
          hideGyroPopup();
          proceedWithLogin();
        })
        .catch(err => {
          console.error('[Gyroscope] Permission error:', err);
          hideGyroPopup();
          proceedWithLogin();
        });
        
    } else {
      // For non-iOS devices
      console.log('[Gyroscope] Non-iOS device, gyro available');
      // Don't save to localStorage
      alert('Gyroscope został włączony dla tej sesji!');
      hideGyroPopup();
      proceedWithLogin();
    }
  }

  function proceedWithLogin() {
    // This function is called after gyro popup is handled
    // Now we can actually process the login
    processLoginAfterGyro();
  }

  function processLoginAfterGyro() {
    // Get password input value
    const input = document.getElementById("passwordInput");
    const pwd = input && input.value ? String(input.value) : "";
    
    if (!pwd) {
      showPwdError("Wpisz hasło.");
      return;
    }

    // Validate password and proceed with login
    var stored = null;
    try {
      stored = localStorage.getItem("userPasswordHash");
    } catch (_) {
      stored = null;
    }
    
    sha256Hex(pwd)
      .then(function (h) {
        console.log("[Login] Password validated");
        if (!stored) {
          // First login - set password
          try {
            localStorage.setItem("userPasswordHash", h);
          } catch (_) {}
          try {
            sessionStorage.setItem("userUnlocked", "1");
          } catch (_) {}
          showPwdError("");
          console.log("[Login] First time login successful");
          redirectToDashboard();
          return;
        }
        if (stored && stored === h) {
          // Correct password
          try {
            sessionStorage.setItem("userUnlocked", "1");
          } catch (_) {}
          showPwdError("");
          console.log("[Login] Login successful");
          redirectToDashboard();
          return;
        }
        // Incorrect password
        showPwdError("Wpisz poprawne hasło.");
      })
      .catch(function (err) {
        console.error("[Login] Password hash error:", err);
        showPwdError("Błąd");
      });
  }

  // Modified handleLoginSubmit to ALWAYS show gyro popup
  function handleLoginSubmit(e) {
    console.log("[Login] handleLoginSubmit called");
    try {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      
      const input = document.getElementById("passwordInput");
      const pwd = input && input.value ? String(input.value) : "";
      
      if (!pwd) {
        showPwdError("Wpisz hasło.");
        return;
      }
      
      // ALWAYS show gyro popup on login
      showGyroPopup();
      return false;
    } catch (err) {
      console.error("[Login] Error:", err);
      showPwdError("Błąd");
    }
  }

  // Stabilizacja viewportu w PWA/Safari
  function updateVh() {
    try {
      var h = (window.visualViewport && window.visualViewport.height) || window.innerHeight || document.documentElement.clientHeight || 0;
      if (h > 0) {
        var vh = h * 0.01;
        document.documentElement.style.setProperty("--vh", vh + "px");
      }
    } catch (_) {}
  }

  function rafFix() {
    requestAnimationFrame(function () {
      requestAnimationFrame(updateVh);
    });
  }

  // inicjalne ustawienie + zdarzenia zmiany
  document.addEventListener("DOMContentLoaded", rafFix, { once: true });
  window.addEventListener("pageshow", rafFix);
  window.addEventListener("resize", rafFix);
  window.addEventListener("orientationchange", rafFix);
  
  try {
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", rafFix);
      window.visualViewport.addEventListener("scroll", rafFix);
    }
  } catch (_) {}
  
  setTimeout(rafFix, 300);
  setTimeout(rafFix, 1000);

  // Lokalne logowanie z localStorage
  try {
    var pi = document.getElementById("passwordInput");
    if (pi) {
      pi.addEventListener("input", function () {
        if ((this.value || "").length > 0) {
          try {
            showPwdError("");
          } catch (_) {
            try {
              var pe = document.getElementById("passwordError");
              if (pe) {
                pe.textContent = "";
                pe.style.display = "none";
                if (pe.classList) pe.classList.remove("warn");
              }
            } catch (_) {}
            if (this.classList) this.classList.remove("input-error");
          }
        }
      });
    }
  } catch (_) {}

  function resetLocalPassword() {
    try {
      try {
        localStorage.removeItem("userPasswordHash");
      } catch (_) {}
      try {
        sessionStorage.removeItem("userUnlocked");
      } catch (_) {}
      try {
        var pi = document.getElementById("passwordInput");
        if (pi) {
          pi.value = "";
          pi.focus();
        }
      } catch (_) {}
      try {
        showPwdError("");
      } catch (_) {}
      try {
        alert("Hasło zostało zresetowane. Ustaw nowe przy następnym logowaniu.");
      } catch (_) {}
    } catch (_) {}
  }

  function redirectToDashboard() {
    try {
      sessionStorage.setItem("from-login", "true");
    } catch (e) {}
    window.location.href = "documents.html";
  }

  function showPwdError(msg) {
    try {
      var el = document.getElementById("passwordError");
      if (!el) {
        var f = document.querySelector(".login__forgot");
        if (!f) {
          if (msg) alert(msg);
          return;
        }
        el = document.createElement("div");
        el.id = "passwordError";
        el.className = "login__error";
        el.style.color = "#b91c1c";
        el.style.margin = "1px 0";
        el.style.display = "none";
        f.parentNode.insertBefore(el, f);
      }
      if (msg) {
        el.textContent = msg;
        try {
          if (msg === "Wpisz hasło." || msg === "Wpisz poprawne hasło.") {
            el.classList.add("warn");
          } else {
            el.classList.remove("warn");
          }
        } catch (_) {}
        el.style.display = "";
      } else {
        el.textContent = "";
        try {
          el.classList.remove("warn");
        } catch (_) {}
        el.style.display = "none";
      }
    } catch (_) {
      if (msg) alert(msg);
    }
  }

  function togglePasswordVisibility() {
    const input = document.getElementById("passwordInput");
    const btn = document.querySelector(".login__eye");
    if (!input || !btn) return;
    const icon = btn.querySelector("img");
    if (input.type === "password") {
      input.type = "text";
      if (icon) {
        icon.src = "assets/icons/hide_password.svg";
        icon.alt = "Ukryj hasło";
      } else {
        btn.innerHTML = "<img src='assets/icons/hide_password.svg' alt='Ukryj hasło'>";
      }
      btn.setAttribute("aria-label", "Ukryj hasło");
    } else {
      input.type = "password";
      if (icon) {
        icon.src = "assets/icons/show_password.svg";
        icon.alt = "Pokaż hasło";
      } else {
        btn.innerHTML = "<img src='assets/icons/show_password.svg' alt='Pokaż hasło'>";
      }
      btn.setAttribute("aria-label", "Pokaż hasło");
    }
  }

  window.addEventListener("load", function () {
    try {
      checkInstallation();
    } catch (e) {}
  });

  document.addEventListener("DOMContentLoaded", function () {
    try {
      var forgot = document.querySelector(".login__forgot");
      if (forgot) {
        forgot.addEventListener("click", function (e) {
          try {
            if (e && typeof e.preventDefault === "function") e.preventDefault();
          } catch (_) {}
          var doReset = true;
          try {
            doReset = confirm("Zresetować zapisane hasło na tym urządzeniu?");
          } catch (_) {}
          if (doReset) resetLocalPassword();
        });
      }
    } catch (_) {}
  });

  async function sha256Hex(str) {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const buf = await (window.crypto && crypto.subtle && crypto.subtle.digest ? crypto.subtle.digest("SHA-256", data) : Promise.resolve(new Uint8Array()));
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Dynamiczne powitanie
  (function () {
    var scheduleId = null;
    var tickId = null;
    
    function setGreeting() {
      var title = document.querySelector(".login__title");
      if (!title) return;
      var now = new Date();
      var hour = now.getHours();
      var isEvening = hour >= 18 || hour < 6;
      title.textContent = isEvening ? "Dobry wieczór!" : "Dzień dobry!";
    }
    
    function msUntilNextChange() {
      var now = new Date();
      var next = new Date(now.getTime());
      var h = now.getHours();
      if (h < 6) {
        next.setHours(6, 0, 0, 0);
      } else if (h < 18) {
        next.setHours(18, 0, 0, 0);
      } else {
        next.setDate(next.getDate() + 1);
        next.setHours(6, 0, 0, 0);
      }
      var diff = next.getTime() - now.getTime();
      return Math.max(0, diff) + 500;
    }
    
    function scheduleNext() {
      if (scheduleId) {
        clearTimeout(scheduleId);
        scheduleId = null;
      }
      scheduleId = setTimeout(function () {
        setGreeting();
        scheduleNext();
      }, msUntilNextChange());
    }
    
    document.addEventListener("DOMContentLoaded", function () {
      try {
        setGreeting();
        scheduleNext();
        if (tickId) {
          clearInterval(tickId);
        }
        tickId = setInterval(function () {
          try {
            setGreeting();
            scheduleNext();
          } catch (_) {}
        }, 60000);
      } catch (e) {}
    });
    
    try {
      window.addEventListener("focus", function () {
        try {
          setGreeting();
          scheduleNext();
        } catch (_) {}
      });
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) {
          try {
            setGreeting();
            scheduleNext();
          } catch (_) {}
        }
      });
    } catch (_) {}
  })();

  // Obsługa dark mode dla KPO logo
  (function () {
    function updateKPOLogo() {
      try {
        const kpoLogo = document.querySelector(".login__kpoLogo");
        if (!kpoLogo) return;
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        if (isDark) {
          kpoLogo.src = kpoLogo.getAttribute("data-dark-src");
        } else {
          kpoLogo.src = "assets/icons/coi_common_ui_kpo_logo_group.svg";
        }
      } catch (_) {}
    }
    
    document.addEventListener("DOMContentLoaded", updateKPOLogo);
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "data-theme") {
          updateKPOLogo();
        }
      });
    });
    document.addEventListener("DOMContentLoaded", function () {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    });
  })();

  // Attach form submit handler
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    if (form) {
      form.addEventListener("submit", handleLoginSubmit);
      console.log("[Login] Form submit handler attached");
    }
  });
})();