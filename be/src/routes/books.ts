import express from "express";
import pool from "../config/database";
import { getResResult } from "../utils/api";

const router = express.Router();

// 获取所有书籍信息
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM vw_book_details");
    // 字段映射
    const mappedBooks = rows.map((row: any) => {
      return {
        id: row.book_id,
        isbn: row.isbn,
        title: row.title,
        publisher: row.publisher,
        price: parseFloat(row.price),
        content: row.table_of_contents,
        img: row.cover_image,
        seriesId: row.series_id,
        description: row.description,
        author: row.authors,
        keywords: row.keywords,
        suppliers: row.suppliers,
        stock: parseFloat(row.total_inventory),
      };
    });

    res.send(getResResult(200, "success", mappedBooks));
  } catch (error) {
    res.status(500).send(getResResult(500, "Server Error"));
  }
});

export default router;
