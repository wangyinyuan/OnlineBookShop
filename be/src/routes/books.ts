import express from "express";
import pool from "../config/database";
import { getResResult } from "../utils/api";
import { auth } from "../middleware/auth";
import { permission } from "../middleware/permission";

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

// 获取库存列表
router.get("/inventory", auth, permission, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        b.book_id as id,
        b.title,
        b.isbn,
        GROUP_CONCAT(a.name) as author,
        COALESCE(SUM(i.quantity), 0) as stock
      FROM Book b
      LEFT JOIN Book_Author ba ON b.book_id = ba.book_id
      LEFT JOIN Author a ON ba.author_id = a.author_id
      LEFT JOIN Inventory i ON b.book_id = i.book_id
      GROUP BY b.book_id
    `);
    res.send(getResResult(200, "success", rows));
  } catch (error) {
    res.status(500).send(getResResult(500, "Server Error"));
  }
});

// 添加新书并设置库存
router.post("/inventory", auth, permission, async (req, res) => {
  const { title, author, isbn, stock } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [bookResult]: any = await conn.execute(
      "INSERT INTO Book (title, isbn) VALUES (?, ?)",
      [title, isbn]
    );
    const bookId = bookResult.insertId;

    const authors = author.split(",").map((a) => a.trim());
    for (const authorName of authors) {
      // 查找或创建作者
      let [authorRows]: any = await conn.execute(
        "SELECT author_id FROM Author WHERE name = ?",
        [authorName]
      );

      let authorId;
      if (authorRows.length === 0) {
        const [newAuthor]: any = await conn.execute(
          "INSERT INTO Author (name) VALUES (?)",
          [authorName]
        );
        authorId = newAuthor.insertId;
      } else {
        authorId = authorRows[0].author_id;
      }

      await conn.execute(
        "INSERT INTO Book_Author (book_id, author_id) VALUES (?, ?)",
        [bookId, authorId]
      );
    }

    await conn.execute(
      "INSERT INTO Inventory (book_id, quantity) VALUES (?, ?)",
      [bookId, stock]
    );

    await conn.commit();
    res.send(getResResult(200, "Book and inventory added successfully"));
  } catch (error) {
    await conn.rollback();
    res.status(500).send(getResResult(500, "Server Error"));
  } finally {
    conn.release();
  }
});

// 更新库存数量
router.put("/inventory/:bookId", auth, permission, async (req, res) => {
  const { bookId } = req.params;
  const { quantity } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    await conn.execute("UPDATE Inventory SET quantity = ? WHERE book_id = ?", [
      quantity,
      bookId,
    ]);
    await conn.commit();
    res.send(getResResult(200, "Inventory updated successfully"));
  } catch (error) {
    await conn.rollback();
    res.status(500).send(getResResult(500, "Server Error"));
  } finally {
    conn.release();
  }
});

// 获取所有采购订单
router.get("/purchase-orders", auth, permission, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        po.po_id as id,
        s.name as supplier,
        b.title as book,
        po.quantity,
        po.status,
        po.order_date as orderDate,
        po.price
      FROM Purchase_Order po 
      JOIN Supplier s ON po.supplier_id = s.supplier_id
      JOIN Book b ON po.book_id = b.book_id
      ORDER BY po.order_date DESC
    `);

    const mappedOrders = rows.map((row: any) => {
      return {
        id: row.id,
        supplier: row.supplier,
        book: row.book,
        quantity: row.quantity,
        status: row.status,
        orderDate: row.orderDate,
        price: parseFloat(row.price),
      };
    });

    console.log(mappedOrders);

    res.send(getResResult(200, "success", mappedOrders));
  } catch (error) {
    res.status(500).send(getResResult(500, "Server Error"));
  }
});

// 创建采购订单
router.post("/purchase-orders", auth, permission, async (req, res) => {
  const { supplier, book, quantity } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 获取供应商ID
    const [supplierRows]: any = await conn.execute(
      "SELECT supplier_id FROM Supplier WHERE name = ?",
      [supplier]
    );
    if (supplierRows.length === 0) {
      throw new Error("Supplier not found");
    }
    const supplierId = supplierRows[0].supplier_id;

    // 获取图书信息和价格
    const [bookRows]: any = await conn.execute(
      "SELECT book_id, price FROM Book WHERE title = ?",
      [book]
    );
    if (bookRows.length === 0) {
      throw new Error("Book not found");
    }
    const bookId = bookRows[0].book_id;
    const totalPrice = bookRows[0].price * quantity;

    // 创建采购订单
    const [result]: any = await conn.execute(
      `INSERT INTO Purchase_Order 
       (supplier_id, book_id, quantity, status, order_date, price) 
       VALUES (?, ?, ?, 'Pending', CURDATE(), ?)`,
      [supplierId, bookId, quantity, totalPrice]
    );

    await conn.commit();
    res.send(getResResult(200, "Purchase order created successfully"));
  } catch (error) {
    await conn.rollback();
    const message = error instanceof Error ? error.message : "Server Error";
    res.status(500).send(getResResult(500, message));
  } finally {
    conn.release();
  }
});

// 更新采购订单状态
router.put("/purchase-orders/:id", auth, permission, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    await conn.execute("UPDATE Purchase_Order SET status = ? WHERE po_id = ?", [
      status,
      id,
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
