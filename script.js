 <script>
    // ---------- Helpers ----------
    function todayISO() {
      const d = new Date();
      // Convert to YYYY-MM-DD in local time
      const tzOffset = d.getTimezoneOffset() * 60000;
      const local = new Date(d.getTime() - tzOffset);
      return local.toISOString().slice(0, 10);
    }

    function uid() {
      return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
    }

    function getTasks() {
      try {
        const raw = localStorage.getItem("caretakerTasks_v1");
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }

    function setTasks(tasks) {
      localStorage.setItem("caretakerTasks_v1", JSON.stringify(tasks));
    }

    function escapeText(s) {
      // basic safety for text injection
      return (s ?? "").toString()
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    // ---------- State ----------
    let tasks = getTasks();

    // Default both date inputs to today
    const taskDateInput = document.getElementById("taskDate");
    const filterDateInput = document.getElementById("filterDate");
    const listEl = document.getElementById("taskList");
    const daySummaryEl = document.getElementById("daySummary");
    const countsLineEl = document.getElementById("countsLine");

    taskDateInput.value = todayISO();
    filterDateInput.value = taskDateInput.value;

    // ---------- Render ----------
    function getDayTasks(dayISO) {
      return tasks
        .filter(t => t.date === dayISO)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    function countByType(dayISO) {
      const dayTasks = tasks.filter(t => t.date === dayISO);
      const counts = {
        Medication: 0,
        Meal: 0,
        Appointment: 0,
        Other: 0
      };
      for (const t of dayTasks) {
        if (!counts[t.type]) counts[t.type] = 0;
        counts[t.type]++;
      }
      return counts;
    }

    function render() {
      const day = filterDateInput.value || todayISO();
      const dayTasks = getDayTasks(day);

      daySummaryEl.textContent = `Showing tasks for ${day}. (${dayTasks.length} total)`;

      if (dayTasks.length === 0) {
        listEl.innerHTML = '<div class="empty">No tasks logged for this day yet.</div>';
        const c = countByType(day);
        countsLineEl.textContent =
          `Medication: ${c.Medication} • Meal: ${c.Meal} • Appointment: ${c.Appointment} • Other: ${c.Other}`;
        return;
      }

      listEl.innerHTML = dayTasks.map(t => {
        const details = (t.details && t.details.trim()) ? t.details.trim() : "—";
        return `
          <div class="task-item">
            <div class="task-top">
              <div class="badge">${escapeText(t.type)}</div>
              <div class="meta">
                ${escapeText(t.caregiver)} • added ${new Date(t.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
            <div class="task-desc">${escapeText(details)}</div>
            <div class="task-actions">
              <button class="link-btn" type="button" data-action="delete" data-id="${escapeText(t.id)}">Delete</button>
            </div>
          </div>
        `;
      }).join("");

      const c = countByType(day);
      countsLineEl.textContent =
        `Medication: ${c.Medication} • Meal: ${c.Meal} • Appointment: ${c.Appointment} • Other: ${c.Other}`;
    }

    // ---------- Events ----------
    document.getElementById("taskForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const caregiverName = document.getElementById("caregiverName").value.trim();
      const date = document.getElementById("taskDate").value;
      const type = document.getElementById("taskType").value;
      const details = document.getElementById("taskDetails").value.trim();

      if (!caregiverName || !date || !type) return;

      const newTask = {
        id: uid(),
        caregiver: caregiverName,
        date: date,
        type: type,
        details: details,
        createdAt: Date.now()
      };

      tasks.push(newTask);
      setTasks(tasks);

      // Move the view to the selected task day
      filterDateInput.value = date;

      // Reset some fields
      document.getElementById("taskDetails").value = "";

      render();
    });

    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest('button[data-action="delete"]');
      if (!btn) return;

      const id = btn.getAttribute("data-id");
      tasks = tasks.filter(t => t.id !== id);
      setTasks(tasks);
      render();
    });

    filterDateInput.addEventListener("change", render);

    document.getElementById("clearDayBtn").addEventListener("click", () => {
      const day = filterDateInput.value || todayISO();
      const remaining = tasks.filter(t => t.date !== day);

      if (remaining.length === tasks.length) {
        render();
        return;
      }

      tasks = remaining;
      setTasks(tasks);
      render();
    });

    // Accessibility toggles
    const toggleInvertBtn = document.getElementById("toggleInvert");
    const toggleDyslexicBtn = document.getElementById("toggleDyslexic");

    toggleInvertBtn.addEventListener("click", () => {
      document.body.classList.toggle("access-invert");
    });

    toggleDyslexicBtn.addEventListener("click", () => {
      document.body.classList.toggle("access-dyslexic");
    });

    // Export / Import
    document.getElementById("exportBtn").addEventListener("click", () => {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        tasks
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "caregiver-task-tracker-export.json";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    });

    document.getElementById("importFile").addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!data || !Array.isArray(data.tasks)) {
          alert("Invalid import file format.");
          return;
        }

        // Replace tasks with imported tasks
        tasks = data.tasks;
        setTasks(tasks);

        // Sync view to today or the date used in imported data if available
        filterDateInput.value = taskDateInput.value = todayISO();

        render();
      } catch {
        alert("Could not read that file. Please import a valid JSON export.");
      } finally {
        e.target.value = "";
      }
    });

    // Initial render
    render();
  </script>
