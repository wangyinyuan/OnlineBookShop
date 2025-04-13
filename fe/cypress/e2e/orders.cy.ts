describe("订单管理功能", () => {
  describe("普通用户订单", () => {
    beforeEach(() => {
      cy.loginAsUser();

      // 创建测试订单
      cy.intercept("GET", "/api/carts").as("getCart");
      cy.visit("/cart");
      cy.wait("@getCart");

      // 如果购物车为空，添加商品
      cy.get("body").then(($body) => {
        if ($body.text().includes("购物车是空的")) {
          cy.addBookToCart(1, 1);
          cy.visit("/cart");
        }
      });

      // 创建订单
      cy.get("[data-test=checkout-button]").then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click();
          cy.get("[data-test=confirm-order-button]").click();
          cy.url().should("include", "/order-success");
        }
      });
    });

    it("用户可以查看订单列表", () => {
      cy.visit("/orders");
      cy.get("[data-test=order-list]").should("be.visible");
      cy.get("[data-test=order-item]").should("have.length.at.least", 1);
      cy.get("[data-test=order-id]").should("be.visible");
      cy.get("[data-test=order-date]").should("be.visible");
      cy.get("[data-test=order-status]").should("be.visible");
      cy.get("[data-test=order-total]").should("be.visible");
    });

    it("用户可以查看订单详情", () => {
      cy.visit("/orders");
      cy.get("[data-test=view-details-button]").first().click();

      cy.get("[data-test=order-detail]").should("be.visible");
      cy.get("[data-test=order-items]").should("have.length.at.least", 1);
      cy.get("[data-test=order-status]").should("be.visible");
      cy.get("[data-test=order-total]").should("be.visible");
    });

    it("订单状态更新反映在订单详情中", () => {
      // 先获取订单ID
      cy.visit("/orders");
      cy.get("[data-test=order-id]")
        .first()
        .invoke("text")
        .then((orderId) => {
          // 管理员更新订单状态
          cy.loginAsAdmin();
          cy.visit("/admin/orders");

          cy.get(
            `[data-order-id="${orderId}"] [data-test=status-select]`
          ).select("Shipped");
          cy.get(
            `[data-order-id="${orderId}"] [data-test=update-status]`
          ).click();

          // 用户查看更新后的状态
          cy.loginAsUser();
          cy.visit("/orders");
          cy.get("[data-test=view-details-button]").first().click();

          cy.get("[data-test=order-status]").should("contain", "Shipped");
        });
    });

    it("可以按订单状态筛选", () => {
      cy.visit("/orders");
      cy.get("[data-test=status-filter]").select("Pending");

      cy.get("[data-test=order-status]").each(($status) => {
        expect($status.text().trim()).to.equal("Pending");
      });
    });
  });

  describe("管理员订单管理", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
    });

    it("管理员可以查看所有用户的订单", () => {
      cy.visit("/admin/orders");
      cy.get("[data-test=all-orders-table]").should("be.visible");
      cy.get("[data-test=order-row]").should("have.length.at.least", 1);
    });

    it("管理员可以更新订单状态", () => {
      cy.visit("/admin/orders");
      cy.get("[data-test=status-select]").first().select("Delivered");
      cy.get("[data-test=update-status]").first().click();

      cy.get("[data-test=notification]").should("contain", "订单状态已更新");
      cy.get("[data-test=status-cell]").first().should("contain", "Delivered");
    });

    it("管理员可以查看订单详情", () => {
      cy.visit("/admin/orders");
      cy.get("[data-test=view-details]").first().click();

      cy.get("[data-test=order-detail-admin]").should("be.visible");
      cy.get("[data-test=customer-info]").should("be.visible");
      cy.get("[data-test=order-items]").should("have.length.at.least", 1);
    });

    it("管理员可以按客户筛选订单", () => {
      cy.visit("/admin/orders");

      // 获取第一个客户名称
      cy.get("[data-test=customer-name]")
        .first()
        .invoke("text")
        .then((name) => {
          // 使用客户名称筛选
          cy.get("[data-test=customer-filter]").type(name);
          cy.get("[data-test=apply-filter]").click();

          // 验证所有显示的订单都是该客户的
          cy.get("[data-test=customer-name]").each(($name) => {
            expect($name.text().trim()).to.equal(name);
          });
        });
    });
  });
});
