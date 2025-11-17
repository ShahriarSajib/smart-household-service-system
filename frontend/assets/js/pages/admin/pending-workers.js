import { apiFetch } from "../../utils/api-client.js";
import { requireAuth } from "../../utils/auth.js";

requireAuth("admin");

const container = document.getElementById("pendingWorkers");

async function loadPending() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await apiFetch("/api/admin/workers/pending");
    const workers = res.data || [];

    if (!workers.length) {
      container.innerHTML = "<p>No pending workers.</p>";
      return;
    }

    container.innerHTML = "";
    workers.forEach(worker => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.padding = "10px";
      card.style.marginBottom = "10px";
      card.innerHTML = `
        <p><b>${worker.name}</b> (${worker.skill_category}) - ${worker.location || 'N/A'}</p>
        <button class="btn btn-primary approve-btn" data-id="${worker.id}">Approve</button>
      `;
      container.appendChild(card);
    });

    // Approve button handlers
    container.querySelectorAll(".approve-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        btn.disabled = true;
        try {
          await apiFetch(`/api/admin/workers/${id}/approve`, { method: "PUT" });
          btn.textContent = "Approved";
        } catch (err) {
          alert(err.message);
          btn.disabled = false;
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<p>${err.message}</p>`;
  }
}

loadPending();
