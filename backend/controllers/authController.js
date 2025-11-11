import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const SALT = 10;

//Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const [existing] = await global.db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, SALT);
    await global.db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [name, email, hashed]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register Worker
export const registerWorker = async (req, res) => {
  try {
    const { name, email, password, skill_category, location, latitude, longitude } = req.body;

    if (!name || !email || !password || !skill_category)
      return res.status(400).json({ message: "All fields required" });

    const [existing] = await global.db.query("SELECT * FROM workers WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: "Worker already exists" });

    const hashed = await bcrypt.hash(password, SALT);
   await global.db.query(
  `INSERT INTO workers 
     (name, email, password_hash, skill_category, location, availability, latitude, longitude)
   VALUES (?, ?, ?, ?, ?, 'Offline', ?, ?)`,
  [name, email, hashed, skill_category, location, latitude, longitude]
);


    res.status(201).json({ message: "Worker registered successfully (Pending Admin Approval)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login (both user & worker)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [userRows] = await global.db.query("SELECT * FROM users WHERE email = ?", [email]);
    const [workerRows] = await global.db.query("SELECT * FROM workers WHERE email = ?", [email]);

    const account = userRows[0] || workerRows[0];
    if (!account) return res.status(404).json({ message: "Account not found" });

    const match = await bcrypt.compare(password, account.password_hash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const role = userRows[0] ? account.role : "worker";
    const token = jwt.sign({ id: account.id, role }, process.env.JWT_SECRET, { expiresIn: "8h" });

    res.json({
      message: "Login successful",
      token,
      user: { id: account.id, name: account.name, email: account.email, role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
