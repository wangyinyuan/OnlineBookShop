import express from "express";
import pool from "../config/database";
import { auth } from "../middleware/auth";
import { permission } from "../middleware/permission";
import { getResResult } from "../utils/api";

const router = express.Router();

// 创建订单（从购物车）
router.post("/", auth, async (req, res) => {
  const customerId = req.user.id;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      "INSERT INTO `Order` (customer_id, order_date, status) VALUES (?, NOW(), 'Processing')",
      [customerId]
    );
    const orderId = (orderResult as any).insertId;

    const [cartItems] = await connection.execute(
      `SELECT sc.*, b.price 
       FROM Shopping_Cart sc
       JOIN Book b ON sc.book_id = b.book_id
       WHERE sc.customer_id = ?`,
      [customerId]
    );

    for (const item of cartItems as any[]) {
      await connection.execute(
        "INSERT INTO Order_Item (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.book_id, item.quantity, item.price]
      );
    }

    await connection.execute(
      "DELETE FROM Shopping_Cart WHERE customer_id = ?",
      [customerId]
    );

    await connection.commit();
    res
      .status(200)
      .send(getResResult(200, "Order placed successfully", { orderId }));
  } catch (error) {
    await connection.rollback();
    console.error("Create order error:", error);
    res.status(500).send(getResResult(500, "Failed to create order"));
  } finally {
    connection.release();
  }
});

// 获取用户订单列表
router.get("/", auth, async (req, res) => {
  const customerId = req.user.id;

  try {
    const [orders] = await pool.execute(
      `
      SELECT 
        o.order_id,
        o.order_date,
        o.status,
        SUM(oi.quantity * oi.price) as total
      FROM \`Order\` o
      JOIN Order_Item oi ON o.order_id = oi.order_id
      WHERE o.customer_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
    `,
      [customerId]
    );

    res.status(200).send(getResResult(200, "Success", orders));
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).send(getResResult(500, "Failed to fetch orders"));
  }
});

// 获取所有订单（管理员）
router.get("/all", auth, permission, async (req, res) => {
  console.log("get all orders");
  try {
    const [orders] = await pool.execute(`
      SELECT 
        o.order_id as id,
        c.name as customerName,
        DATE_FORMAT(o.order_date, '%Y-%m-%d') as orderDate,
        o.status,
        o.shipping_address as shippingAddress,
        SUM(oi.quantity * oi.price) as totalAmount
      FROM \`Order\` o
      JOIN Customer c ON o.customer_id = c.customer_id
      JOIN Order_Item oi ON o.order_id = oi.order_id
      GROUP BY 
        o.order_id,
        c.name,
        o.order_date,
        o.status,
        o.shipping_address
      ORDER BY o.order_date DESC
    `);

    const formattedOrders = (orders as any[]).map((order) => ({
      ...order,
      totalAmount: parseFloat(order.totalAmount),
    }));

    console.log(formattedOrders);

    res.status(200).send(getResResult(200, "success", formattedOrders));
  } catch (error) {
    res.status(500).send(getResResult(500, "Server Error"));
  }
});

router.get("/:orderId", auth, async (req, res) => {
  const customerId = req.user.id;
  const orderId = parseInt(req.params.orderId);

  try {
    const [orderDetails] = await pool.execute(
      `
      SELECT 
        o.order_id,
        o.order_date,
        o.status,
        oi.book_id,
        b.title,
        b.cover_image,
        oi.quantity,
        oi.price
      FROM \`Order\` o
      JOIN Order_Item oi ON o.order_id = oi.order_id
      JOIN Book b ON oi.book_id = b.book_id
      WHERE o.order_id = ? AND o.customer_id = ?
    `,
      [orderId, customerId]
    );

    if (!(orderDetails as any[]).length) {
      return res.status(404).send(getResResult(404, "Order not found"));
    }

    const formattedDetails = (orderDetails as any[]).map((item) => ({
      ...item,
      price: parseFloat(item.price),
    }));

    res.status(200).send(getResResult(200, "Success", formattedDetails));
  } catch (error) {
    console.error("Fetch order details error:", error);
    res.status(500).send(getResResult(500, "Failed to fetch order details"));
  }
});

// 更新订单状态（管理员）
router.put("/:orderId/status", auth, permission, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    await conn.execute("UPDATE `Order` SET status = ? WHERE order_id = ?", [
      status,
      orderId,
    ]);
    await conn.commit();
    res.send(getResResult(200, "Order status updated successfully"));
  } catch (error) {
    await conn.rollback();
    res.status(500).send(getResResult(500, "Server Error"));
  } finally {
    conn.release();
  }
});

export default router;
