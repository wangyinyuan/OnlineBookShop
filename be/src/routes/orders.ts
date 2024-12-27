import express from "express";
import pool from "../config/database";

const router = express.Router();

router.post("/", async (req, res) => {
  const { customer_id, book_id, quantity } = req.body;

  try {
    const [result] = await pool.query("CALL sp_place_order(?, ?, ?)", [
      customer_id,
      book_id,
      quantity,
    ]);
    res.json(result[0][0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/customer/:customerId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM vw_customer_orders WHERE customer_id = ?",
      [req.params.customerId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
