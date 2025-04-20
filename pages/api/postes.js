import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const result = await pool.query("SELECT * FROM dados_poste");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
