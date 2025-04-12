// cypress/e2e/api/orders.cy.js
describe("Orders API", () => {
  before(() => {
    cy.task("resetTestDB");
    cy.loginAsAdmin();
    cy.loginAsUser().then(() => {
      cy.request({
        method: "POST",
        url: "http://localhost:8080/api/carts/add",
        headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
        body: {
          bookId: 1,
          quantity: 2,
        },
      });
    });
  });

  after(() => {
    cy.task("resetTestDB");
  });

  it("从购物车创建订单", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/orders",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.message).to.include("Order placed successfully");
      expect(response.body.data).to.have.property("orderId");

      // 保存订单ID以供后续测试使用
      const orderId = response.body.data.orderId;
      Cypress.env("testOrderId", orderId);

      // 验证购物车被清空
      cy.request({
        method: "GET",
        url: "http://localhost:8080/api/carts",
        headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      }).then((cartResponse) => {
        expect(cartResponse.body.data.items).to.have.length(0);
      });
    });
  });

  it("获取用户订单", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/orders",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.at.least(1);
      expect(response.body.data[0]).to.include.keys(
        "order_id",
        "order_date",
        "status",
        "total"
      );
    });
  });

  it("获取订单详情", () => {
    const orderId = Cypress.env("testOrderId");

    // 获取订单详情
    cy.request({
      method: "GET",
      url: `http://localhost:8080/api/orders/${orderId}`,
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.at.least(1);
      expect(response.body.data[0]).to.include.keys(
        "order_id",
        "order_date",
        "status",
        "book_id",
        "title",
        "quantity",
        "price"
      );
    });
  });

  it("管理员获取全部订单", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/orders/all",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.at.least(1);
      expect(response.body.data[0]).to.include.keys(
        "id",
        "customerName",
        "orderDate",
        "status",
        "totalAmount"
      );
    });
  });

  it("普通用户不能获取全部订单", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/orders/all",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 403);
    });
  });

  it("管理员更新订单状态", () => {
    const orderId = Cypress.env("testOrderId");

    // 更新订单状态
    cy.request({
      method: "PUT",
      url: `http://localhost:8080/api/orders/${orderId}/status`,
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      body: {
        status: "Shipped",
      },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.message).to.include(
        "Order status updated successfully"
      );

      // 验证订单状态是否更新
      cy.request({
        method: "GET",
        url: "http://localhost:8080/api/orders/all",
        headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      }).then((verifyResponse) => {
        const updatedOrder = verifyResponse.body.data.find(
          (order) => order.id === orderId
        );
        expect(updatedOrder.status).to.eq("Shipped");
      });
    });
  });
});
