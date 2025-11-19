import { apiFetch } from '../../utils/api-client.js';
import { ENDPOINTS } from '../../config/api.js';
import { toast } from '../../utils/toast.js';

// get ?token=xyz
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

if (!token) {
  toast.error("Invalid reset link");
}

document.getElementById("resetForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value.trim();
  if (!newPassword) return toast.error("Password required");

  try {
    await apiFetch(ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: "POST",
      body: { token, newPassword }
    });

    toast.success("Password reset successful");
    setTimeout(() => (window.location.href = "/pages/auth/login.html"), 1000);
  } catch (err) {
    toast.error(err.message || "Failed to reset password");
  }
});