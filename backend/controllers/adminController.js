import { query } from "../config/db.js";

// Get all pending workers (availability = 'Offline')
export const getPendingWorkers = async (req, res) => {
  try {
    const [rows] = await query(
      "SELECT id, name, email, skill_category, location, availability FROM workers WHERE availability = 'Offline'"
    );
    res.json(rows);
  } catch (err) {
    console.error("getPendingWorkers error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Approve a worker (make them Available + log admin action)
export const approveWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const [worker] = await query("SELECT * FROM workers WHERE id = ?", [id]);
    if (!worker.length)
      return res.status(404).json({ message: "Worker not found" });

    await query("UPDATE workers SET availability = 'Available' WHERE id = ?", [id]);

    await query(
      "INSERT INTO admin_logs (admin_id, action_type, description) VALUES (?, ?, ?)",
      [adminId, "approve_worker", `Approved worker id=${id}`]
    );

    res.json({ message: "Worker approved successfully" });
  } catch (err) {
    console.error("approveWorker error:", err);
    res.status(500).json({ message: err.message });
  }
};
