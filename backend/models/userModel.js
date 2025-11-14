// Simple user model helpers using query
import { query } from "../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};
