import { apiFetch } from "../../utils/api-client.js";
import { toast } from "../../utils/toast.js";

const form = document.getElementById("adminLoginForm");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value.trim();

  try {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email, password }
    });

    if (res.user.role !== "admin") {
      errorMessage.textContent = "Access denied — only admins allowed.";
      return;
    }

    // Save session
    localStorage.setItem("token", res.token);
    localStorage.setItem("role", "admin");
    localStorage.setItem("userId", res.user.id);

    toast.success("Login success!");
    window.location.href = "/pages/admin/dashboard.html";

  } catch (err) {
    errorMessage.textContent = err.message;
  }
});
