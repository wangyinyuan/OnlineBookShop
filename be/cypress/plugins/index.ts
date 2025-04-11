import mysql from "mysql2/promise";

export default function (on, config) {
  let dbConnection = null;

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

          -- 插入测试账户
          INSERT INTO Customer (email, password, name, is_admin, credit_level, account_balance)
          VALUES
            ('admin@test.com', '$2a$10$1JR/d2TLSfjlFoWrV2uP3.C4Lgdza8N79HAQKomVACGF3jgZMBhbm', 'Admin', true, 5, 1000),
            ('normal@test.com', '$2a$10$1JR/d2TLSfjlFoWrV2uP3.C4Lgdza8N79HAQKomVACGF3jgZMBhbm', 'Normal User', false, 3, 500);
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
