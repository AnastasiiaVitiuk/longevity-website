const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// PostgreSQL pool
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// POST /submit
app.post("/submit", async (req, res) => {
  console.log("Incoming data:", req.body); 

  const { fname, lname, email } = req.body;

  if (!fname || !lname || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO submissions (fname, lname, email) VALUES ($1, $2, $3) RETURNING *",
      [fname, lname, email]
    );
    console.log("Inserted:", result.rows[0]);
    res.json({
        message: "Form submitted successfully!",
        data: { fname: result.rows[0].fname, lname: result.rows[0].lname , email: result.rows[0].email}
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    }
  });

// GET /submissions
app.get("/submissions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM submissions ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});