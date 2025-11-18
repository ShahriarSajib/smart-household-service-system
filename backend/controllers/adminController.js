import { query } from "../config/db.js";
import { error, success } from "../utils/responseHelper.js";

// Get all pending workers (availability = 'Offline')
export const getPendingWorkers = async (req, res) => {
  try {
    const [rows] = await query(
      "SELECT id, name, email, skill_category, location, availability FROM workers WHERE availability='Offline'"
    );
    return res.json({ data: rows });
  } catch (err) {
    console.error("getPendingWorkers error:", err);
    return res.status(500).json(error(err.message));
  }
};

// Approve a worker
export const approveWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const [existing] = await query("SELECT * FROM workers WHERE id=?", [id]);
    if (!existing.length) return res.status(404).json(error("Worker not found"));

    await query("UPDATE workers SET availability='Available' WHERE id=?", [id]);
    await query(
      "INSERT INTO admin_logs (admin_id, action_type, description) VALUES (?, ?, ?)",
      [adminId, "approve_worker", `Approved worker id=${id}`]
    );

    return res.json(success("Worker approved successfully"));
  } catch (err) {
    console.error("approveWorker error:", err);
    return res.status(500).json(error(err.message));
  }
};

// Reject a worker
export const rejectWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const [worker] = await query("SELECT * FROM workers WHERE id=?", [id]);
    if (!worker.length) return res.status(404).json(error("Worker not found"));

    await query("DELETE FROM workers WHERE id=?", [id]);

    return res.json(success("Worker rejected and removed"));
  } catch (err) {
    console.error("rejectWorker error:", err);
    return res.status(500).json(error(err.message));
  }
};


// Get work requests
export const getWorkRequests = async (req, res) => {
  try {
    const [rows] = await query(`
      SELECT r.id, r.user_id, r.category, r.description, r.location, r.status,
             r.assigned_worker_id, r.service_type_id, r.created_at,
             u.name AS user_name
      FROM service_requests r
      JOIN users u ON u.id = r.user_id
    `);
    return res.json({ data: rows });
  } catch (err) {
    console.error("getWorkRequests error:", err);
    return res.status(500).json(error(err.message));
  }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const [rows] = await query(
      "SELECT id, name, email FROM users WHERE id=? AND role='admin'",
      [id]
    );
    if (!rows.length) return res.status(404).json(error("Admin not found"));
    return res.json({ data: rows[0] });
  } catch (err) {
    return res.status(500).json(error(err.message));
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, email, password } = req.body;

    const updates = [];
    const values = [];

    if (name) { updates.push("name=?"); values.push(name); }
    if (email) { updates.push("email=?"); values.push(email); }
    if (password) {
      const bcrypt = await import("bcrypt");
      const hash = await bcrypt.hash(password, 10);
      updates.push("password_hash=?");
      values.push(hash);
    }

    if (!updates.length) return res.status(400).json(error("No updates provided"));

    values.push(adminId);
    await query(`UPDATE users SET ${updates.join(", ")} WHERE id=? AND role='admin'`, values);

    const [updated] = await query("SELECT id, name, email FROM users WHERE id=?", [adminId]);
    return res.json({ data: updated[0], message: "Profile updated successfully" });
  } catch (err) {
    console.error("updateAdminProfile error:", err);
    return res.status(500).json(error(err.message));
  }
};
