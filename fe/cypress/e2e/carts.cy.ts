describe("购物车功能", () => {
  beforeEach(() => {
    cy.loginAsUser();
  });

  describe("购物车管理", () => {
    beforeEach(() => {
      // 确保购物车为空
      cy.intercept("GET", "/api/carts").as("getCart");
      cy.visit("/cart");
      cy.wait("@getCart");

      // 如果有商品，全部删除
      cy.get("body").then(($body) => {
        if ($body.find("[data-test=cart-item]").length > 0) {
          cy.get("[data-test=remove-button]").each(($btn) => {
            cy.wrap($btn).click();
            cy.wait(500); // 等待删除操作完成
          });
        }
      });
    });

    it("空购物车显示提示信息", () => {
      cy.visit("/cart");
      cy.get("[data-test=empty-cart-message]").should("be.visible");
      cy.get("[data-test=continue-shopping]").should("be.visible");
    });

    it("添加商品到购物车", () => {
      // 添加第一本书
      cy.addBookToCart(1, 2);

      // 验证购物车
      cy.visit("/cart");
      cy.get("[data-test=cart-item]").should("have.length", 1);
      cy.get("[data-test=item-quantity]").should("have.value", "2");
      cy.get("[data-test=cart-total]").should("be.visible");
    });

    it("更新商品数量", () => {
      // 先添加书到购物车
      cy.addBookToCart(1, 1);

      // 访问购物车并修改数量
      cy.visit("/cart");
      cy.intercept("PUT", "/api/carts/*").as("updateCart");

      // 保存原价格
      cy.get("[data-test=item-subtotal]").invoke("text").as("originalPrice");

      // 更新数量
      cy.get("[data-test=item-quantity]").clear().type("3");
      cy.get("[data-test=update-button]").click();
      cy.wait("@updateCart");

      // 验证小计已更新
      cy.get("@originalPrice").then((originalPrice) => {
        cy.get("[data-test=item-subtotal]")
          .invoke("text")
          .should((newPrice) => {
            expect(parseFloat(newPrice)).to.be.greaterThan(
              parseFloat(originalPrice as string)
            );
          });
      });

      // 验证总价已更新
      cy.get("[data-test=cart-total]").should("be.visible");
    });

    it("从购物车移除商品", () => {
      // 先添加书到购物车
      cy.addBookToCart(1, 1);

      // 访问购物车并删除
      cy.visit("/cart");
      cy.intercept("DELETE", "/api/carts/*").as("deleteItem");

      cy.get("[data-test=remove-button]").click();
      cy.wait("@deleteItem");

      // 验证购物车为空
      cy.get("[data-test=empty-cart-message]").should("be.visible");
    });

    it("购物车在页面刷新后保持状态", () => {
      // 添加商品
      cy.addBookToCart(1, 2);

      // 刷新页面
      cy.reload();

      // 验证商品仍然存在
      cy.visit("/cart");
      cy.get("[data-test=cart-item]").should("have.length", 1);
      cy.get("[data-test=item-quantity]").should("have.value", "2");
    });
  });

  describe("结账流程", () => {
    beforeEach(() => {
      // 添加商品到购物车
      cy.addBookToCart(1, 2);
    });

    it("从购物车导航到结账页面", () => {
      cy.visit("/cart");
      cy.get("[data-test=checkout-button]").click();
      cy.url().should("include", "/checkout");
    });

    it("显示订单预览并计算总额", () => {
      cy.visit("/checkout");
      cy.get("[data-test=order-summary]").should("be.visible");
      cy.get("[data-test=order-items]").should("have.length.at.least", 1);

      // 验证总额计算正确
      cy.get("[data-test=item-price]")
        .invoke("text")
        .then((price) => {
          cy.get("[data-test=item-quantity]")
            .invoke("text")
            .then((quantity) => {
              const expectedTotal =
                parseFloat(price as string) * parseInt(quantity as string);
              cy.get("[data-test=order-total]")
                .invoke("text")
                .then((total) => {
                  expect(parseFloat(total as string)).to.be.closeTo(
                    expectedTotal,
                    0.01
                  );
                });
            });
        });
    });

    it("完成订单创建流程", () => {
      cy.visit("/checkout");
      cy.intercept("POST", "/api/orders").as("createOrder");

      // 选择送货地址
      cy.get("[data-test=address-radio]").first().check();

      // 提交订单
      cy.get("[data-test=confirm-order-button]").click();
      cy.wait("@createOrder");

      // 验证跳转到成功页面
      cy.url().should("include", "/order-success");
      cy.get("[data-test=success-message]").should("be.visible");
      cy.get("[data-test=order-number]").should("be.visible");

      // 验证购物车被清空
      cy.visit("/cart");
      cy.get("[data-test=empty-cart-message]").should("be.visible");
    });
  });
});
