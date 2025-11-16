import { apiFetch } from "../utils/api-client.js";
import { ENDPOINTS } from "../config/api.js";
import { toast } from "../utils/toast.js";

export function createWorkerRequestCard(req, opts = {}) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.padding = "14px";
  card.style.marginBottom = "14px";

  card.innerHTML = `
    <h3>${req.category}</h3>
    <p>${req.description}</p>
    <p style="color:var(--muted)">Status: <b>${req.status}</b></p>
    <p style="font-size:12px;color:var(--muted)">User: ${req.user_name} (${req.user_email})</p>
    <div class="actions" style="margin-top:10px"></div>
  `;

  const act = card.querySelector(".actions");

  if (opts.fullActions) {
    // accept
    if (req.status === "Assigned") {
      const acceptBtn = document.createElement("button");
      acceptBtn.className = "btn btn-primary";
      acceptBtn.textContent = "Accept";
      acceptBtn.onclick = () => updateRequest(req.id, "accept", card);
      act.appendChild(acceptBtn);

      const rejectBtn = document.createElement("button");
      rejectBtn.className = "btn btn-danger";
      rejectBtn.textContent = "Reject";
      rejectBtn.onclick = () => updateRequest(req.id, "reject", card);
      act.appendChild(rejectBtn);
    }

    if (req.status === "Accepted") {
      const completeBtn = document.createElement("button");
      completeBtn.className = "btn btn-secondary";
      completeBtn.textContent = "Mark Completed";
      completeBtn.onclick = () => updateRequest(req.id, "complete", card);
      act.appendChild(completeBtn);
    }
  }

  return card;
}

async function updateRequest(id, action, card) {
  try {
    await apiFetch(`${ENDPOINTS.REQUESTS.BASE}/${id}/${action}`, {
      method: "PUT"
    });

    toast.success(`Request ${action}ed`);
    card.remove();
  } catch (err) {
    toast.error(err.message);
  }
}
