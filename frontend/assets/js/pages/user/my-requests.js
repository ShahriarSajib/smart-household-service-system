import { createRequestCard } from "../../components/requestCard.js";
import { ENDPOINTS } from "../../config/api.js";
import { apiFetch } from "../../utils/api-client.js";
import { getUser } from "../../utils/storage.js";

const user = getUser();
if (!user) window.location.href = "/pages/auth/login.html";

const container = document.getElementById("requestsContainer");
const sortSelect = document.getElementById("sortSelect");
const filterSelect = document.getElementById("filterSelect");

let allRequests = []; // store original list

async function loadRequests() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await apiFetch(ENDPOINTS.REQUESTS.USER_REQUESTS(user.id));
    console.log("Fetched user requests:", res);

    allRequests = Array.isArray(res) ? res : [];

    renderRequests();

  } catch (err) {
    container.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

function renderRequests() {
  let list = [...allRequests];

  // Filter by status
  const filter = filterSelect.value;
  if (filter !== "all") {
    list = list.filter(r => r.status === filter);
  }

  // Sort by created_at
  const sort = sortSelect.value;

  list.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sort === "asc" ? dateA - dateB : dateB - dateA;
  });

  if (list.length === 0) {
    container.innerHTML = "<p>No requests found.</p>";
    return;
  }

  container.innerHTML = "";
  list.forEach(req => {
    container.appendChild(createRequestCard(req, { showCancel: true }));
  });
}

// Re-render when sorting/filter changes
sortSelect.addEventListener("change", renderRequests);
filterSelect.addEventListener("change", renderRequests);

loadRequests();
