import mysql from "mysql2/promise";

export default function (on, config) {
  on("task", {
    async resetTestDB() {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bookstore_test",
        multipleStatements: true,
      });

      try {
        await connection.query(`
          TRUNCATE TABLE Customer;
          TRUNCATE TABLE Book;
          TRUNCATE TABLE Inventory;
          TRUNCATE TABLE Author;
          TRUNCATE TABLE Book_Author;

          -- 插入测试账户
          INSERT INTO Customer (email, password, name, is_admin, credit_level, account_balance)
          VALUES
            ('admin@test.com', '$2a$10$1JR/d2TLSfjlFoWrV2uP3.C4Lgdza8N79HAQKomVACGF3jgZMBhbm', 'Admin', true, 5, 1000),
            ('normal@test.com', '$2a$10$1JR/d2TLSfjlFoWrV2uP3.C4Lgdza8N79HAQKomVACGF3jgZMBhbm', 'Normal User', false, 3, 500);

          -- 插入测试图书
          INSERT INTO Book (book_id, isbn, title, publisher, price, table_of_contents, cover_image, series_id, description) 
          VALUES 
            (1, '9781234567897', 'Test Book 1', NULL, 29.99, NULL, NULL, NULL, NULL),
            (2, '9781234567898', 'Test Book 2', NULL, 19.99, NULL, NULL, NULL, NULL);
          
          -- 插入测试库存
          INSERT INTO Inventory (inventory_id, book_id, location, quantity) 
          VALUES 
            (1, 1, NULL, 50),
            (2, 2, NULL, 30);

          -- 插入测试作者
          INSERT INTO Author (author_id, name)
          VALUES 
            (1, 'Test Author 1'),
            (2, 'Test Author 2');

          
        `);

        console.log("Test database reset successfully");
        return true;
      } catch (error) {
        console.error("Error resetting test database:", error);
        throw error;
      } finally {
        await connection.end();
      }
    },
  });

  return config;
}
