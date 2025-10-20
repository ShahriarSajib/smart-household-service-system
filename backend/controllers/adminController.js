export const getPendingWorkers = async (req, res) => {
  try {
    const [rows] = await global.db.query(
      "SELECT id, name, email, skill_category, location, availability FROM workers WHERE availability = 'Offline'"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const [worker] = await global.db.query("SELECT * FROM workers WHERE id = ?", [id]);
    if (!worker.length) return res.status(404).json({ message: "Worker not found" });

    await global.db.query("UPDATE workers SET availability = 'Available' WHERE id = ?", [id]);

    await global.db.query(
      "INSERT INTO admin_logs (admin_id, action_type, description) VALUES (?, ?, ?)",
      [adminId, "approve_worker", `Approved worker id=${id}`]
    );

    res.json({ message: "Worker approved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
