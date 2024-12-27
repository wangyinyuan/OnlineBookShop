import express from "express";
import pool from "../config/database";
import { auth } from "../middleware/auth";
import { getResResult } from "../utils/api";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const customerId = req.user.id;

  try {
    const [cartItems] = await pool.execute(
      `
      SELECT 
        sc.cart_id,
        sc.quantity,
        sc.added_date,
        b.book_id,
        b.title,
        b.price,
        b.cover_image
      FROM Shopping_Cart sc
      JOIN Book b ON sc.book_id = b.book_id
      WHERE sc.customer_id = ?
      ORDER BY sc.added_date DESC
    `,
      [customerId]
    );

    console.log("cartItems:", cartItems);
    const items = cartItems.map((item) => ({
      ...item,
      price: parseFloat(item.price),
    }));

    res.status(200).send(
      getResResult(200, "Success", {
        items: items,
        total: (items as any[]).reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      })
    );
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).send(getResResult(500, "Server Error"));
  }
});

router.post("/add", auth, async (req, res) => {
  const { bookId, quantity } = req.body;
  const customerId = req.user.id;

  if (!bookId || !quantity || quantity <= 0) {
    return res.status(400).send(getResResult(400, "Invalid Request"));
  }

  try {
    const [books] = await pool.execute(
      "SELECT book_id FROM Book WHERE book_id = ?",
      [bookId]
    );

    if (!books || (books as any[]).length === 0) {
      return res.status(400).send(getResResult(400, "Book not found"));
    }

    const [existingItems] = await pool.execute(
      "SELECT cart_id, quantity FROM Shopping_Cart WHERE customer_id = ? AND book_id = ?",
      [customerId, bookId]
    );

    if ((existingItems as any[]).length > 0) {
      // 更新现有记录
      const currentItem = (existingItems as any[])[0];
      const newQuantity = currentItem.quantity + quantity;

      await pool.execute(
        "UPDATE Shopping_Cart SET quantity = ?, added_date = NOW() WHERE cart_id = ?",
        [newQuantity, currentItem.cart_id]
      );
    } else {
      await pool.execute(
        "INSERT INTO Shopping_Cart (customer_id, book_id, quantity, added_date) VALUES (?, ?, ?, NOW())",
        [customerId, bookId, quantity]
      );
    }

    res.status(200).send(getResResult(200, "Success"));
  } catch (error) {
    console.error("添加购物车错误:", error);
    res.status(500).send(getResResult(500, "Server Error"));
  }
});

router.delete("/:cartId", auth, async (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const customerId = req.user.id;

  try {
    const [result] = await pool.execute(
      "DELETE FROM Shopping_Cart WHERE cart_id = ? AND customer_id = ?",
      [cartId, customerId]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).send(getResResult(404, "Item not found"));
    }

    res.status(200).send(getResResult(200, "Success"));
  } catch (error) {
    console.error("删除购物车错误:", error);
    res.status(500).send(getResResult(500, "Server Error"));
  }
});

router.put("/:cartId", auth, async (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const { quantity } = req.body;
  const customerId = req.user.id;

  if (!quantity || quantity <= 0) {
    return res.status(400).send(getResResult(400, "Invalid quantity"));
  }

  try {
    const [result] = await pool.execute(
      "UPDATE Shopping_Cart SET quantity = ? WHERE cart_id = ? AND customer_id = ?",
      [quantity, cartId, customerId]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).send(getResResult(404, "Item not found"));
    }

    res.status(200).send(getResResult(200, "Success"));
  } catch (error) {
    console.error("更新购物车错误:", error);
    res.status(500).send(getResResult(500, "Server Error"));
  }
});

export default router;
