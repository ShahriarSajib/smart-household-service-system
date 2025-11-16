import { ENDPOINTS } from "../config/api.js";
import { apiFetch } from "../utils/api-client.js";
import { toast } from "../utils/toast.js";

export function createRequestCard(request, opts = {}) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.marginBottom = "14px";
  card.style.padding = "14px";

  card.innerHTML = `
    <h3 style="margin:0">${request.category}</h3>
    <p>${request.description}</p>

    <p style="color:var(--muted);margin:4px 0">
      Status: <b>${request.status}</b>
    </p>

    <p style="font-size:13px;color:var(--muted)">Location: ${request.location}</p>

    ${
      request.worker_name
        ? `<div style="font-size:13px;margin-top:4px">Assigned to: <b>${request.worker_name}</b></div>`
        : `<div style="font-size:13px;margin-top:4px">No worker assigned</div>`
    }

    <div class="actions" style="margin-top:10px"></div>
  `;

  const actions = card.querySelector(".actions");

  // cancel button
  if (opts.showCancel && request.status !== "completed" && request.status !== "cancelled") {
    const btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.textContent = "Cancel";
    btn.onclick = () => cancelRequest(request.id, card);
    actions.appendChild(btn);
  }

  return card;
}

async function cancelRequest(id, card) {
  if (!confirm("Cancel this request?")) return;

  try {
    await apiFetch(`${ENDPOINTS.REQUESTS.BASE}/${id}/cancel`, {
      method: "PUT"
    });
    toast.success("Cancelled");
    card.remove();
  } catch (err) {
    toast.error(err.message);
  }
}
