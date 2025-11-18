// frontend/assets/js/pages/admin/pending-workers.js
import { apiFetch } from "../../utils/api-client.js";
import { ENDPOINTS } from "../../config/api.js";
import { requireAuth } from "../../utils/auth.js";
import { toast } from "../../utils/toast.js";

requireAuth("admin");

const container = document.getElementById("pendingWorkers");

async function loadPending() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await apiFetch(ENDPOINTS.ADMIN.PENDING_WORKERS);
    const workers = Array.isArray(res?.data) ? res.data : [];

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
          await apiFetch(ENDPOINTS.ADMIN.APPROVE_WORKER(id), { method: "PUT" });
          toast.success("Worker approved");
          btn.textContent = "Approved";
          // Optionally remove the card
          btn.closest(".card")?.remove();
        } catch (err) {
          toast.error(err.message || "Approve failed");
          btn.disabled = false;
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<p style="color:var(--error)">${err.message || "Failed to load pending workers"}</p>`;
  }
}

loadPending();
