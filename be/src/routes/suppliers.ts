import express from "express";
import pool from "../config/database";
import { auth } from "../middleware/auth";
import { permission } from "../middleware/permission";
import { getResResult } from "../utils/api";

const router = express.Router();

// 获取所有供应商
router.get("/", auth, permission, async (req, res) => {
  try {
    const [suppliers] = await pool.execute(`
      SELECT 
        supplier_id as id,
        name,
        contact_info as contactInfo
      FROM Supplier
    `);
    res.send(getResResult(200, "success", suppliers));
  } catch (error) {
    res.status(500).send(getResResult(500, "Server Error"));
  }
});

// 添加新供应商
router.post("/", auth, permission, async (req, res) => {
  const { name, contactInfo } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    const [result]: any = await conn.execute(
      "INSERT INTO Supplier (name, contact_info) VALUES (?, ?)",
      [name, contactInfo]
    );
    await conn.commit();
    res.send(
      getResResult(200, "Supplier added successfully", {
        id: result.insertId,
        name,
        contactInfo,
      })
    );
  } catch (error) {
    await conn.rollback();
    res.status(500).send(getResResult(500, "Server Error"));
  } finally {
    conn.release();
  }
});

// 更新供应商信息
router.put("/:id", auth, permission, async (req, res) => {
  const { id } = req.params;
  const { name, contactInfo } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      "SELECT name, contact_info FROM Supplier WHERE supplier_id = ?",
      [id]
    );

    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).send(getResResult(404, "Supplier not found"));
    }

    const currentSupplier = rows[0];

    const newName = name ?? currentSupplier.name;
    const newContactInfo = contactInfo ?? currentSupplier.contact_info;

    await conn.execute(
      "UPDATE Supplier SET name = ?, contact_info = ? WHERE supplier_id = ?",
      [newName, newContactInfo, id]
    );

    await conn.commit();
    res.send(getResResult(200, "Supplier updated successfully"));
  } catch (error) {
    await conn.rollback();
    res.status(500).send(getResResult(500, "Server Error"));
  } finally {
    conn.release();
  }
});

export default router;
