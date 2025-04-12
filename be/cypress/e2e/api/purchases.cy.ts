// cypress/e2e/api/purchases.cy.js
describe("Purchase Orders API", () => {
  before(() => {
    cy.task("resetTestDB");
    cy.loginAsAdmin();
    cy.loginAsUser();
  });

  after(() => {
    cy.task("resetTestDB");
  });

  it("管理员获取图书购买订单", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/books/purchase-orders",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data).to.be.an("array");
      // 订单可能为空，不检查长度
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.include.keys(
          "id",
          "supplier",
          "book",
          "quantity",
          "status",
          "orderDate",
          "price"
        );
      }
    });
  });

  it("普通用户不能获取图书购买订单", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/books/purchase-orders",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 403);
    });
  });

  it("管理员创建新的图书购买订单", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/books/purchase-orders",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      body: {
        supplier: "Test Supplier 1",
        book: "Test Book 1",
        quantity: 10,
      },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.message).to.include(
        "Purchase order created successfully"
      );

      // 验证采购订单是否被创建
      cy.request({
        method: "GET",
        url: "http://localhost:8080/api/books/purchase-orders",
        headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      }).then((verifyResponse) => {
        const recentOrder = verifyResponse.body.data[0]; // 最新订单应该排在第一位
        expect(recentOrder.supplier).to.eq("Test Supplier 1");
        expect(recentOrder.book).to.eq("Test Book 1");
        expect(recentOrder.quantity).to.eq(10);
        expect(recentOrder.status).to.eq("Pending");

        // 保存订单ID用于后续测试
        Cypress.env("testPurchaseOrderId", recentOrder.id);
      });
    });
  });

  it("供应商不存在", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/books/purchase-orders",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      body: {
        supplier: "Non-Existent Supplier",
        book: "Test Book 1",
        quantity: 5,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 500);
      expect(response.body.message).to.include("Supplier not found");
    });
  });

  it("图书不存在", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/books/purchase-orders",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      body: {
        supplier: "Test Supplier 1",
        book: "Non-Existent Book",
        quantity: 5,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 500);
      expect(response.body.message).to.include("Book not found");
    });
  });

  it("管理员更新订单状态", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/books/purchase-orders",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      const orderId = response.body.data[0].id;

      // 更新订单状态
      cy.request({
        method: "PUT",
        url: `http://localhost:8080/api/books/purchase-orders/${orderId}`,
        headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
        body: {
          status: "Delivered",
        },
      }).then((updateResponse) => {
        cy.verifyResponseStructure(updateResponse);
        expect(updateResponse.body.message).to.include(
          "Order status updated successfully"
        );

        // 验证状态是否被更新
        cy.request({
          method: "GET",
          url: "http://localhost:8080/api/books/purchase-orders",
          headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
        }).then((verifyResponse) => {
          const updatedOrder = verifyResponse.body.data.find(
            (order) => order.id === orderId
          );
          expect(updatedOrder.status).to.eq("Delivered");
        });
      });
    });
  });
});
