const express = require("express");
const pool = require("../db");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { email, password, type, active } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required." });
  }
  try {
    const [rows] = await pool.query("CALL addUser(?, ?, ?, ?)", [
      email,
      password,
      type || "member",
      active ?? 1,
    ]);
    res.json({ success: true, result: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error." });
  }
});

module.exports = router;