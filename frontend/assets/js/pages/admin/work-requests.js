// frontend/assets/js/pages/admin/work-requests.js
import { apiFetch } from "../../utils/api-client.js";
import { ENDPOINTS } from "../../config/api.js";
import { requireAuth } from "../../utils/auth.js";

requireAuth("admin");

const container = document.getElementById("workRequests");

async function loadRequests() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await apiFetch(ENDPOINTS.ADMIN.WORK_REQUESTS);
    const requests = Array.isArray(res?.data) ? res.data : [];

    if (!requests.length) {
      container.innerHTML = "<p>No work requests found.</p>";
      return;
    }

    container.innerHTML = "";
    requests.forEach(r => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.padding = "10px";
      card.style.marginBottom = "10px";
      card.innerHTML = `
        <h4>${r.category || "General"} - <span class="status">${r.status}</span></h4>
        <p><b>User:</b> ${r.user_name}</p>
        <p><b>Description:</b> ${r.description}</p>
        <p><b>Location:</b> ${r.location || 'N/A'}</p>
        <p><b>Assigned Worker ID:</b> ${r.assigned_worker_id || 'Not assigned'}</p>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = `<p style="color:var(--error)">${err.message || "Failed to load requests"}</p>`;
  }
}

loadRequests();
