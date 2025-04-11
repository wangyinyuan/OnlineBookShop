// cypress/e2e/api/carts.cy.js
describe("Shopping Cart API", () => {
  beforeEach(() => {
    cy.task("resetTestDB");
    cy.loginAsUser();
  });

  it("should start with empty cart", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/carts",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data.items).to.be.an("array");
      expect(response.body.data.items.length).to.eq(0);
      expect(response.body.data.total).to.eq(0);
    });
  });

  it("should add item to cart", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/carts/add",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      body: {
        bookId: 100, // 测试书籍ID
        quantity: 3,
      },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.message).to.include("Success");

      // 验证购物车是否包含添加的商品
      cy.request({
        method: "GET",
        url: "http://localhost:8080/api/carts",
        headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      }).then((cartResponse) => {
        expect(cartResponse.body.data.items).to.have.length(1);
        expect(cartResponse.body.data.items[0].book_id).to.eq(100);
        expect(cartResponse.body.data.items[0].quantity).to.eq(3);

        // 保存cart_id用于后续测试
        Cypress.env("testCartItemId", cartResponse.body.data.items[0].cart_id);
      });
    });
  });

  it("should increase quantity when adding existing item", () => {
    // 先添加一个商品
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/carts/add",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      body: { bookId: 100, quantity: 2 },
    });

    // 再添加同一个商品
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/carts/add",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      body: { bookId: 100, quantity: 3 },
    });

    // 验证数量是否累加
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/carts",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
    }).then((response) => {
      expect(response.body.data.items).to.have.length(1);
      expect(response.body.data.items[0].quantity).to.eq(5);
    });
  });

  it("should reject adding non-existent book", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/carts/add",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      body: { bookId: 9999, quantity: 1 },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 400);
      expect(response.body.message).to.include("Book not found");
    });
  });

  it("should update cart item quantity", () => {
    // 先添加商品
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/carts/add",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      body: { bookId: 100, quantity: 2 },
    });

    // 获取购物车项ID
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/carts",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
    }).then((response) => {
      const cartItemId = response.body.data.items[0].cart_id;

      // 更新数量
      cy.request({
        method: "PUT",
        url: `http://localhost:8080/api/carts/${cartItemId}`,
        headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
        body: { quantity: 10 },
      }).then((updateResponse) => {
        cy.verifyResponseStructure(updateResponse);
        expect(updateResponse.body.message).to.include("Success");

        // 验证数量是否更新
        cy.request({
          method: "GET",
          url: "http://localhost:8080/api/carts",
          headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
        }).then((verifyResponse) => {
          expect(verifyResponse.body.data.items[0].quantity).to.eq(10);
        });
      });
    });
  });

  it("should remove item from cart", () => {
    // 先添加商品
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/carts/add",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      body: { bookId: 100, quantity: 1 },
    });

    // 获取购物车项ID
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/carts",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
    }).then((response) => {
      const cartItemId = response.body.data.items[0].cart_id;

      // 删除购物车项
      cy.request({
        method: "DELETE",
        url: `http://localhost:8080/api/carts/${cartItemId}`,
        headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      }).then((deleteResponse) => {
        cy.verifyResponseStructure(deleteResponse);
        expect(deleteResponse.body.message).to.include("Success");

        // 验证购物车是否为空
        cy.request({
          method: "GET",
          url: "http://localhost:8080/api/carts",
          headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
        }).then((verifyResponse) => {
          expect(verifyResponse.body.data.items).to.have.length(0);
        });
      });
    });
  });
});
