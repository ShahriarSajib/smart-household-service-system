import { apiFetch } from "../../utils/api-client.js";
import { getUser, saveUser } from "../../utils/storage.js";
import { requireAuth } from "../../utils/auth.js";
import { toast } from "../../utils/toast.js";
import renderNavbarInto from "../../components/navbar.js";
import { ENDPOINTS, API_BASE_URL } from "../../config/api.js";

requireAuth("user");
renderNavbarInto("navbar-dynamic");

const user = getUser();

const profileForm = document.getElementById("profileForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const profilePicInput = document.getElementById("profilePic");
const profileImg = document.getElementById("profileImg");
const submitBtn = document.getElementById("submitBtn");

async function loadProfile() {
  try {
    const res = await apiFetch(ENDPOINTS.USER.GET_PROFILE(user.id));

    nameInput.value = res.data.name;
    emailInput.value = res.data.email;

    // SHOW PROFILE PIC
    if (res.data.profilePic) {
      profileImg.src = res.data.profilePic;
    } else {
      profileImg.src = "/assets/img/default-avatar.png"; // fallback avatar
    }

  } catch (err) {
    toast.error("Failed to load profile");
  }
}
loadProfile();

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.textContent = "Updating...";
  submitBtn.disabled = true;

  const formData = new FormData();
  formData.append("name", nameInput.value);
  formData.append("email", emailInput.value);
  if (passInput.value.trim()) formData.append("password", passInput.value);
  if (profilePicInput.files.length > 0)
    formData.append("profilePic", profilePicInput.files[0]);

  try {
    const res = await fetch(API_BASE_URL + ENDPOINTS.USER.UPDATE_PROFILE(user.id), {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("fixmate_token"),
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    user.name = nameInput.value;
    user.email = emailInput.value;
    saveUser(user);

    toast.success("Profile updated!");
    passInput.value = "";

    await loadProfile();

  } catch (err) {
    toast.error(err.message);
  } finally {
    submitBtn.textContent = "Update Profile";
    submitBtn.disabled = false;
  }
});
