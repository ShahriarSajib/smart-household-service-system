import { createRequestCard } from "../../components/requestCard.js";
import { ENDPOINTS } from "../../config/api.js";
import { apiFetch } from "../../utils/api-client.js";
import { getUser } from "../../utils/storage.js";

const user = getUser();
if (!user) {
  window.location.href = "/pages/auth/login.html";
}

const container = document.getElementById("requestsContainer");

async function loadRequests() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await apiFetch(ENDPOINTS.REQUESTS.USER_REQUESTS(user.id));

    console.log("Fetched user requests:", res);

    if (!Array.isArray(res) || res.length === 0) {
      container.innerHTML = "<p>No requests yet.</p>";
      return;
    }

    container.innerHTML = "";

    res.forEach(req => {
      container.appendChild(createRequestCard(req, { showCancel: true }));
    });

  } catch (err) {
    container.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

loadRequests();
