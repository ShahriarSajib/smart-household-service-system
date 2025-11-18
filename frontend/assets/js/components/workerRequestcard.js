import { ENDPOINTS } from "../config/api.js";
import { apiFetch } from "../utils/api-client.js";
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

    <div style="font-size:12px;color:var(--muted);margin-top:6px;">
      <p><b>User Info:</b></p>
      <p>Name: ${req.user_name}</p>
      <p>Email: ${req.user_email}</p>
      <p>Phone: ${req.user_phone || "Not provided"}</p>
    </div>

    <div class="actions" style="margin-top:10px"></div>
  `;

  const act = card.querySelector(".actions");


  if (opts.fullActions) {
    // ACCEPT / REJECT
    if (req.status.toLowerCase() === "assigned") {
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

    // COMPLETED + NAVIGATION BUTTON
    if (req.status.toLowerCase() === "accepted") {
      // Navigate button
      const navBtn = document.createElement("button");
      navBtn.className = "btn btn-primary";
      navBtn.textContent = "Navigate";
      navBtn.onclick = () => openNavigation(req);
      act.appendChild(navBtn);

      // Mark completed
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
    let endpoint =
      action === "accept"
        ? ENDPOINTS.REQUESTS.ACCEPT(id)
        : action === "reject"
        ? ENDPOINTS.REQUESTS.REJECT(id)
        : ENDPOINTS.REQUESTS.COMPLETE(id);

    await apiFetch(endpoint, { method: "PUT" });

    toast.success(`Request ${action}ed`);
    card.remove();
  } catch (err) {
    toast.error(err.message);
  }
}

function openNavigation(req) {
  const destLat = req.latitude;
  const destLng = req.longitude;

  if (!destLat || !destLng) {
    toast.error("User location not available.");
    return;
  }

  if (!navigator.geolocation) {
    openDestinationOnly(destLat, destLng);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const workerLat = pos.coords.latitude;
      const workerLng = pos.coords.longitude;

      const url = `https://www.google.com/maps/dir/?api=1&origin=${workerLat},${workerLng}&destination=${destLat},${destLng}&travelmode=driving`;

      window.open(url, "_blank");
    },
    () => openDestinationOnly(destLat, destLng)
  );
}

function openDestinationOnly(lat, lng) {
  const url = `https://www.google.com/maps/place/${lat},${lng}`;
  window.open(url, "_blank");
}
