<script>
document.addEventListener("DOMContentLoaded", () => {
  const invertBtn = document.getElementById("toggleInvertBtn");
  const dyslexicBtn = document.getElementById("toggleDyslexicBtn");

  const STORAGE_KEYS = {
    invert: "accessibility_invert_v1",
    dyslexic: "accessibility_dyslexic_v1"
  };

  const root = document.body;

  function loadPref(key) {
    return localStorage.getItem(key) === "true";
  }

  function savePref(key, value) {
    localStorage.setItem(key, String(!!value));
  }

  // Apply saved preferences
  if (loadPref(STORAGE_KEYS.invert)) root.classList.add("access-invert");
  if (loadPref(STORAGE_KEYS.dyslexic)) root.classList.add("access-dyslexic");

  // Guard: if buttons aren’t found, log and stop
  if (!invertBtn) console.warn("Missing button with id: toggleInvertBtn");
  if (!dyslexicBtn) console.warn("Missing button with id: toggleDyslexicBtn");

  // Wire up click handlers
  if (invertBtn) {
    invertBtn.addEventListener("click", () => {
      const enabled = root.classList.toggle("access-invert");
      savePref(STORAGE_KEYS.invert, enabled);
      // For debugging:
      console.log("Invert enabled:", enabled);
    });
  }

  if (dyslexicBtn) {
    dyslexicBtn.addEventListener("click", () => {
      const enabled = root.classList.toggle("access-dyslexic");
      savePref(STORAGE_KEYS.dyslexic, enabled);
      console.log("Dyslexic enabled:", enabled);
    });
  }
});
</script>
