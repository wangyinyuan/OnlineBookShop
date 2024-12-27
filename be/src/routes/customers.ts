import express from "express";
import pool from "../config/database";
import bcrypt from "bcryptjs";
import { generateToken, getResResult } from "../utils/api";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 检查邮箱是否已存在
    const [existing] = await pool.execute(
      "SELECT email FROM Customer WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .send(getResResult(400, "Email already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO Customer (
        email,
        password, 
        name,
        address,
        account_balance,
        credit_level,
        is_admin
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, null, 0, 1, false]
    );

    console.log("result", result);
    // 生成 token
    const token = generateToken({
      id: result.insertId,
      email,
    });

    res.status(201).send(
      getResResult(201, "Registration successful", {
        email,
        name,
        isAdmin: false,
        token,
      })
    );
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send(getResResult(500, "Server error"));
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM Customer WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).send(getResResult(400, "Customer not found"));
    }
    console.log(rows);
    const customer = rows[0];
    const isValidPassword = await bcrypt.compare(password, customer.PASSWORD);

    if (!isValidPassword) {
      return res.status(400).send(getResResult(400, "Invalid password"));
    }

    const token = generateToken({
      id: customer.customer_id,
      email: customer.email,
    });

    res.send(
      getResResult(200, "Login successful", {
        email: customer.email,
        name: customer.NAME,
        isAdmin: Boolean(customer.is_admin),
        token,
      })
    );
  } catch (error) {
    res.status(500).json(getResResult(500, "Server error"));
  }
});

export default router;
