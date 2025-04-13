describe("管理员功能", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  describe("图书管理", () => {
    it("管理员可以查看所有图书库存", () => {
      cy.visit("/admin/inventory");
      cy.get("[data-test=inventory-table]").should("be.visible");
      cy.get("[data-test=inventory-row]").should("have.length.at.least", 2);
      cy.get("[data-test=book-title]").should("be.visible");
      cy.get("[data-test=book-isbn]").should("be.visible");
      cy.get("[data-test=book-stock]").should("be.visible");
    });

    it("管理员可以添加新图书", () => {
      cy.visit("/admin/books/add");
      cy.intercept("POST", "/api/books/inventory").as("addBook");

      // 填写图书信息
      cy.get("[data-test=book-title]").type("Test Cypress Book");
      cy.get("[data-test=book-isbn]").type("9781234567890");
      cy.get("[data-test=book-author]").type("Cypress Author");
      cy.get("[data-test=book-price]").type("29.99");
      cy.get("[data-test=book-stock]").type("25");
      cy.get("[data-test=book-description]").type(
        "A test book created by Cypress"
      );

      // 提交表单
      cy.get("[data-test=submit-book]").click();
      cy.wait("@addBook");

      // 验证成功提示
      cy.get("[data-test=notification]").should("contain", "图书添加成功");

      // 验证图书已添加到列表
      cy.visit("/admin/inventory");
      cy.get("[data-test=book-title]").should("contain", "Test Cypress Book");
    });

    it("管理员可以更新图书库存", () => {
      cy.visit("/admin/inventory");

      // 获取第一本书的ID
      cy.get("[data-test=inventory-row]")
        .first()
        .invoke("attr", "data-book-id")
        .then((bookId) => {
          // 点击编辑按钮
          cy.get(`[data-book-id="${bookId}"] [data-test=edit-stock]`).click();
          cy.intercept("PUT", `/api/books/inventory/${bookId}`).as(
            "updateStock"
          );

          // 更新库存
          cy.get("[data-test=stock-input]").clear().type("100");
          cy.get("[data-test=update-confirm]").click();
          cy.wait("@updateStock");

          // 验证更新成功
          cy.get("[data-test=notification]").should("contain", "库存已更新");
          cy.get(`[data-book-id="${bookId}"] [data-test=book-stock]`).should(
            "contain",
            "100"
          );
        });
    });
  });

  describe("供应商管理", () => {
    it("管理员可以查看供应商列表", () => {
      cy.visit("/admin/suppliers");
      cy.get("[data-test=suppliers-table]").should("be.visible");
      cy.get("[data-test=supplier-row]").should("have.length.at.least", 2);
    });

    it("管理员可以添加新供应商", () => {
      cy.visit("/admin/suppliers/add");
      cy.intercept("POST", "/api/suppliers").as("addSupplier");

      // 填写供应商信息
      cy.get("[data-test=supplier-name]").type("Cypress Test Supplier");
      cy.get("[data-test=supplier-contact]").type("cypress@test.com");

      // 提交表单
      cy.get("[data-test=submit-supplier]").click();
      cy.wait("@addSupplier");

      // 验证成功提示
      cy.get("[data-test=notification]").should("contain", "供应商添加成功");

      // 验证供应商已添加到列表
      cy.visit("/admin/suppliers");
      cy.get("[data-test=supplier-name]").should(
        "contain",
        "Cypress Test Supplier"
      );
    });

    it("管理员可以更新供应商信息", () => {
      cy.visit("/admin/suppliers");

      // 获取第一个供应商的ID
      cy.get("[data-test=supplier-row]")
        .first()
        .invoke("attr", "data-supplier-id")
        .then((supplierId) => {
          // 点击编辑按钮
          cy.get(
            `[data-supplier-id="${supplierId}"] [data-test=edit-supplier]`
          ).click();
          cy.intercept("PUT", `/api/suppliers/${supplierId}`).as(
            "updateSupplier"
          );

          // 更新信息
          cy.get("[data-test=supplier-name]")
            .clear()
            .type("Updated Supplier Name");
          cy.get("[data-test=supplier-contact]")
            .clear()
            .type("updated@test.com");
          cy.get("[data-test=submit-supplier]").click();
          cy.wait("@updateSupplier");

          // 验证更新成功
          cy.get("[data-test=notification]").should("contain", "供应商已更新");

          // 验证列表已更新
          cy.visit("/admin/suppliers");
          cy.get(
            `[data-supplier-id="${supplierId}"] [data-test=supplier-name]`
          ).should("contain", "Updated Supplier Name");
        });
    });
  });

  describe("采购订单管理", () => {
    it("管理员可以查看所有采购订单", () => {
      cy.visit("/admin/purchase-orders");
      cy.get("[data-test=purchase-orders-table]").should("be.visible");
    });

    it("管理员可以创建采购订单", () => {
      cy.visit("/admin/purchase-orders/add");
      cy.intercept("POST", "/api/books/purchase-orders").as("addPurchaseOrder");

      // 选择供应商和图书
      cy.get("[data-test=supplier-select]").select("Test Supplier 1");
      cy.get("[data-test=book-select]").select("Test Book 1");
      cy.get("[data-test=quantity-input]").type("10");

      // 提交表单
      cy.get("[data-test=submit-purchase-order]").click();
      cy.wait("@addPurchaseOrder");

      // 验证成功提示
      cy.get("[data-test=notification]").should("contain", "采购订单创建成功");
    });

    it("管理员可以更新采购订单状态", () => {
      cy.visit("/admin/purchase-orders");

      // 获取第一个订单
      cy.get("[data-test=order-row]")
        .first()
        .invoke("attr", "data-order-id")
        .then((orderId) => {
          // 更新状态
          cy.get(
            `[data-order-id="${orderId}"] [data-test=status-select]`
          ).select("Delivered");
          cy.get(
            `[data-order-id="${orderId}"] [data-test=update-status]`
          ).click();

          // 验证成功提示
          cy.get("[data-test=notification]").should("contain", "状态已更新");
          cy.get(
            `[data-order-id="${orderId}"] [data-test=order-status]`
          ).should("contain", "Delivered");
        });
    });
  });
});
