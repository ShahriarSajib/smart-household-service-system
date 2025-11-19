import { apiFetch } from '../../utils/api-client.js';
import { ENDPOINTS } from '../../config/api.js';
import { toast } from '../../utils/toast.js';

document.getElementById("forgotForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  if (!email) return toast.error("Email is required");

  try {
    const res = await apiFetch(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: "POST",
      body: { email }
    });

    toast.success("Reset link sent to your email");
  } catch (err) {
    toast.error(err.message || "Failed to send email");
  }
});