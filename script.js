<script>
  // ===== Vanilla JS Health Dashboard (Form -> Timeline Cards + LocalStorage) =====

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("healthForm");
    const timeline = document.getElementById("todayTimeline");

    // If your IDs differ, update them here:
    const categoryInput = document.getElementById("category");
    const timeInput = document.getElementById("time");
    const descriptionInput = document.getElementById("description");
    const moodInput = document.getElementById("mood");

    const STORAGE_KEY = "health_todays_timeline_entries_v1";

    // Load existing entries (if any)
    const entries = loadEntries();

    // Render them
    entries.forEach(entry => {
      timeline.appendChild(createCard(entry));
    });

    // Form submit handler
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // prevent default submission

      const entry = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "_" + Math.random(16).slice(2),
        category: (categoryInput.value || "").trim(),
        time: (timeInput.value || "").trim(),
        description: (descriptionInput.value || "").trim(),
        mood: (moodInput.value || "").trim(),
        createdAt: Date.now()
      };

      // Basic validation (optional; you can remove if not needed)
      if (!entry.category || !entry.time || !entry.description || !entry.mood) {
        // You can replace with your preferred UI messaging
        alert("Please fill out category, time, description, and mood.");
        return;
      }

      // Update state
      entries.push(entry);
      saveEntries(entries);

      // Add card to UI
      timeline.appendChild(createCard(entry));

      // Clear inputs after adding
      form.reset();
      categoryInput.focus();
    });

    // ---- Helpers ----

    function loadEntries() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.error("Failed to load entries from LocalStorage:", err);
        return [];
      }
    }

    function saveEntries(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (err) {
        console.error("Failed to save entries to LocalStorage:", err);
      }
    }

    function moodColor(mood) {
      const m = (mood || "").toLowerCase();
      if (["great", "awesome", "good", "happy", "positive"].includes(m)) return "#16a34a";   // green
      if (["okay", "neutral", "meh"].includes(m)) return "#f59e0b";                           // amber
      if (["bad", "sad", "anxious", "stressed", "angry"].includes(m)) return "#dc2626";        // red
      return "#64748b"; // slate/neutral default
    }

    function createCard(entry) {
      const card = document.createElement("div");
      card.className = "timeline-card";
      card.dataset.id = entry.id;

      const color = moodColor(entry.mood);

      card.innerHTML = `
        <div class="card-top">
          <div class="pill" style="background:${color}; color:#fff;">${escapeHtml(entry.mood)}</div>
          <div class="meta">
            <div class="meta-row"><strong>Time:</strong> <span>${escapeHtml(entry.time)}</span></div>
            <div class="meta-row"><strong>Category:</strong> <span>${escapeHtml(entry.category)}</span></div>
          </div>
        </div>

        <div class="card-body">
          <p class="card-description">${escapeHtml(entry.description)}</p>
        </div>

        <div class="card-actions">
          <button type="button" class="delete-btn" aria-label="Delete entry">Delete</button>
        </div>
      `;

      // Delete logic
      card.querySelector(".delete-btn").addEventListener("click", () => {
        const idx = entries.findIndex(x => x.id === entry.id);
        if (idx !== -1) {
          entries.splice(idx, 1);
          saveEntries(entries);
        }
        card.remove();
      });

      // Basic styling (optional). Add your own CSS instead if you prefer.
      injectMinimalStyles();

      return card;
    }

    let stylesInjected = false;
    function injectMinimalStyles() {
      if (stylesInjected) return;
      stylesInjected = true;

      const style = document.createElement("style");
      style.textContent = `
        .timeline-card {
          border: 1px solid rgba(148,163,184,0.4);
          border-radius: 12px;
          padding: 12px 12px 10px;
          background: #0b1220;
          color: #e5e7eb;
          margin: 10px 0;
          box-shadow: 0 6px 18px rgba(0,0,0,0.25);
          overflow: hidden;
        }
        .timeline-card .card-top{
          display:flex;
          justify-content: space-between;
          align-items:flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }
        .timeline-card .pill{
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 12px;
          white-space: nowrap;
        }
        .timeline-card .meta{
          display:flex;
          flex-direction: column;
          gap: 3px;
          text-align:right;
          font-size: 13px;
          opacity: 0.95;
        }
        .timeline-card .meta-row span{ opacity: 0.95; }
        .timeline-card .card-body{
          margin-top: 6px;
        }
        .timeline-card .card-description{
          margin: 0;
          line-height: 1.35;
        }
        .timeline-card .card-actions{
          margin-top: 12px;
          display:flex;
          justify-content:flex-end;
        }
        .timeline-card .delete-btn{
          border: 1px solid rgba(248,113,113,0.6);
          background: rgba(220,38,38,0.15);
          color: #fecaca;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
        }
        .timeline-card .delete-btn:hover{
          background: rgba(220,38,38,0.28);
        }
        /* Optional responsive tweaks */
        @media (max-width: 520px){
          .timeline-card .card-top{ flex-direction: column; align-items:flex-start; }
          .timeline-card .meta{ text-align:left; }
        }
      `;
      document.head.appendChild(style);
    }

    // Prevent HTML injection in user content
    function escapeHtml(str) {
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  });
</script>
