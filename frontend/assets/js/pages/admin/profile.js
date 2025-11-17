import { apiFetch } from "../../utils/api-client.js";
import { requireAuth } from "../../utils/auth.js";
import { ENDPOINTS } from "../../config/api.js";

requireAuth("admin");

const form = document.getElementById("editProfileForm");
const successMsg = document.getElementById("successMsg");
const errorMsg = document.getElementById("errorMsg");

async function loadProfile() {
  try {
    // Use ENDPOINTS.ADMIN.GET_PROFILE instead of hardcoded URL
    const res = await apiFetch(ENDPOINTS.ADMIN.GET_PROFILE);
    const user = res.data || {}; // safety fallback

    form.name.value = user.name || "";
    form.email.value = user.email || "";
  } catch (err) {
    errorMsg.textContent = err.message;
  }
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  successMsg.textContent = "";
  errorMsg.textContent = "";

  const payload = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value || undefined
  };

  try {
    // Use ENDPOINTS.ADMIN.UPDATE_PROFILE instead of hardcoded URL
    const res = await apiFetch(ENDPOINTS.ADMIN.UPDATE_PROFILE, {
      method: "PUT",
      body: payload
    });
    successMsg.textContent = res.message || "Profile updated successfully!";
  } catch (err) {
    errorMsg.textContent = err.message;
  }
});

// Load profile data on page load
loadProfile();
