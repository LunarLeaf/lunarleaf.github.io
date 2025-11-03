document.addEventListener("DOMContentLoaded", function () {
  try {
  } catch (e) {}
});

window.addEventListener("load", function () {
  try {
    if (typeof checkInstallation === "function") checkInstallation();
  } catch (e) {}
});

// Funkcja pomocnicza do cachowania zdjęcia
async function cacheProfileImage(imageData) {
  try {
    // Zapisz w localStorage
    localStorage.setItem("profileImage", imageData);

    // Zapisz w Cache API dla szybszego dostępu
    const cache = await caches.open("profile-images-v1");
    const blob = await fetch(imageData).then((r) => r.blob());
    await cache.put(
      "profile-image",
      new Response(blob, {
        headers: { "Content-Type": "image/jpeg" },
      })
    );
  } catch (err) {
    console.log("Cache API not available, using localStorage only");
  }
}

// Funkcja do ładowania zdjęcia z cache
async function loadCachedProfileImage() {
  try {
    var img = document.getElementById("profileImage");
    if (!img) return;

    // Najpierw sprawdź Cache API
    try {
      const cache = await caches.open("profile-images-v1");
      const cachedResponse = await cache.match("profile-image");
      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        const objectURL = URL.createObjectURL(blob);
        img.src = objectURL;
        img.style.opacity = "1";
        return;
      }
    } catch (cacheErr) {
      console.log("Cache API not available");
    }

    // Fallback do localStorage
    var savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      img.src = savedImage;
      img.style.opacity = "1";

      // Zapisz do cache dla następnego razu
      await cacheProfileImage(savedImage);
    }
  } catch (e) {
    console.error("Error loading profile image:", e);
  }
}

(function () {
  try {
    var imageInput = document.getElementById("imageInput");
    if (imageInput) {
      imageInput.addEventListener("change", function (event) {
        var file = event.target.files && event.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = async function (e) {
          var imageUrl = e.target && e.target.result;
          var img = document.getElementById("profileImage");
          if (img && imageUrl) {
            img.src = imageUrl;
            img.style.opacity = "1";
            // Cachuj nowe zdjęcie
            await cacheProfileImage(imageUrl);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  } catch (e) {}
})();

window.addEventListener("load", function () {
  loadCachedProfileImage();
});

document.addEventListener("DOMContentLoaded", function () {
  try {
    var fieldMap = [
      ["name", "name"],
      ["surname", "surname"],
      ["nationality", "nationality"],
      ["birthDate", "birthDate"],
      ["pesel", "pesel"],
      ["lastName", "lastName"],
      ["gender", "gender"],
      ["fatherSurname", "fatherSurname"],
      ["motherSurname", "motherSurname"],
      ["placeOfBirth", "placeOfBirth"],
      ["address", "address"],
      ["postalcode", "postalcode"],
      ["registrationDate", "registrationDate"],
      // mDowód (MD_*) — używa istniejących pól
      ["idSeries", "md_idSeries"],
      ["expiryDate", "md_expiryDate"],
      ["issueDate", "md_issueDate"],
      // Dowód osobisty (DO_*) — oddzielne pola
      ["idSeries_do", "do_idSeries"],
      ["issuingAuthority_do", "do_issuingAuthority"],
      ["expiryDate_do", "do_expiryDate"],
      ["issueDate_do", "do_issueDate"],
      ["fathername", "fathername"],
      ["mothername", "mothername"],
    ];

    var up = function (s) {
      if (s == null) return s;
      try {
        return String(s).toLocaleUpperCase("pl");
      } catch (_) {
        return String(s).toUpperCase();
      }
    };

    // Prefill values from storage
    fieldMap.forEach(function (pair) {
      var id = pair[0],
        key = pair[1];
      var el = document.getElementById(id);
      if (!el) return;
      var val = localStorage.getItem(key);
      if (val != null && String(val).trim() !== "") el.value = val;
    });

    // Auto-save on change/input for instant sync
    var saveField = function (key, val) {
      var s = String(val || "").trim();
      try {
        if (s) localStorage.setItem(key, s);
        else localStorage.removeItem(key);
      } catch (_) {}
    };

    fieldMap.forEach(function (pair) {
      var id = pair[0],
        key = pair[1];
      var el = document.getElementById(id);
      if (!el) return;
      var tag = (el.tagName || "").toLowerCase();
      if (tag === "select") {
        el.addEventListener("change", function () {
          saveField(key, up(el.value));
        });
      } else if (tag === "input") {
        var type = (el.getAttribute("type") || "").toLowerCase();
        if (type === "text") {
          el.addEventListener("input", function () {
            convertToUpperCase(el);
            saveField(key, el.value);
          });
        } else {
          el.addEventListener("change", function () {
            saveField(key, el.value);
          });
        }
      }
    });
  } catch (e) {}
});

function convertToUpperCase(input) {
  if (!input) return;
  input.value = String(input.value || "").toUpperCase();
}

function saveData() {
  try {
    var get = function (id) {
      var el = document.getElementById(id);
      return el ? el.value : "";
    };
    var put = function (key, val) {
      var s = String(val || "").trim();
      try {
        if (s) localStorage.setItem(key, s);
        else localStorage.removeItem(key);
      } catch (_) {}
    };

    put("name", get("name"));
    put("surname", get("surname"));
    put("nationality", get("nationality"));
    put("birthDate", get("birthDate"));
    put("pesel", get("pesel"));
    put("lastName", get("lastName"));
    put("gender", get("gender"));
    put("fatherSurname", get("fatherSurname"));
    put("motherSurname", get("motherSurname"));
    put("placeOfBirth", get("placeOfBirth"));
    put("address", get("address"));
    put("postalcode", get("postalcode"));
    put("registrationDate", get("registrationDate"));
    // mDowód
    put("md_idSeries", get("idSeries"));
    put("md_expiryDate", get("expiryDate"));
    put("md_issueDate", get("issueDate"));
    // Dowód osobisty
    put("do_idSeries", get("idSeries_do"));
    put("do_issuingAuthority", get("issuingAuthority_do"));
    put("do_expiryDate", get("expiryDate_do"));
    put("do_issueDate", get("issueDate_do"));
    put("fathername", get("fathername"));
    put("mothername", get("mothername"));
    // usunięto sekcję paszportową, pola nie są już zapisywane

    alert("Dane zostały zapisane!");
  } catch (e) {}
}
