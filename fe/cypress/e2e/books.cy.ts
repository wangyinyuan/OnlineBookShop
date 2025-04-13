describe("图书浏览功能", () => {
  describe("图书列表页", () => {
    beforeEach(() => {
      cy.visit("/books");
    });

    it("加载并显示图书列表", () => {
      cy.get("[data-test=book-list]").should("be.visible");
      cy.get("[data-test=book-card]").should("have.length.at.least", 2);
      cy.get("[data-test=book-title]").first().should("not.be.empty");
      cy.get("[data-test=book-author]").first().should("not.be.empty");
      cy.get("[data-test=book-price]").first().should("not.be.empty");
    });

    it("图书排序功能正常工作", () => {
      // 默认排序
      cy.get("[data-test=book-title]").then(($titles) => {
        const originalTitles = [...$titles].map((el) => el.innerText);

        // 按价格升序排列
        cy.get("[data-test=sort-select]").select("price-asc");
        cy.get("[data-test=book-price]").then(($prices) => {
          const sortedPrices = [...$prices].map((el) =>
            parseFloat(el.innerText.replace("￥", ""))
          );

          // 验证价格确实是升序的
          const isSorted = sortedPrices.every(
            (price, i) => i === 0 || price >= sortedPrices[i - 1]
          );
          expect(isSorted).to.be.true;
        });

        // 按价格降序排列
        cy.get("[data-test=sort-select]").select("price-desc");
        cy.get("[data-test=book-price]").then(($prices) => {
          const sortedPrices = [...$prices].map((el) =>
            parseFloat(el.innerText.replace("￥", ""))
          );

          // 验证价格确实是降序的
          const isSorted = sortedPrices.every(
            (price, i) => i === 0 || price <= sortedPrices[i - 1]
          );
          expect(isSorted).to.be.true;
        });

        // 按名称排序
        cy.get("[data-test=sort-select]").select("title");
        cy.get("[data-test=book-title]").then(($newTitles) => {
          const newTitleList = [...$newTitles].map((el) => el.innerText);
          expect(newTitleList).to.not.deep.equal(originalTitles);
        });
      });
    });

    it("分页功能正常工作", () => {
      cy.get("[data-test=pagination]").should("be.visible");

      // 获取第一页的第一本书
      cy.get("[data-test=book-title]")
        .first()
        .invoke("text")
        .as("firstBookTitle");

      // 点击下一页
      cy.get("[data-test=next-page]").click();
      cy.url().should("include", "page=2");

      // 验证书籍已改变
      cy.get("[data-test=book-title]")
        .first()
        .invoke("text")
        .then(function (secondPageTitle) {
          expect(secondPageTitle).to.not.equal(this.firstBookTitle);
        });

      // 点击上一页
      cy.get("[data-test=prev-page]").click();
      cy.url().should("include", "page=1");

      // 验证回到第一页
      cy.get("[data-test=book-title]")
        .first()
        .invoke("text")
        .then(function (firstPageTitle) {
          expect(firstPageTitle).to.equal(this.firstBookTitle);
        });
    });

    it("搜索功能正常工作", () => {
      const searchTerm = "Test";

      cy.intercept("GET", `/api/books?search=${searchTerm}*`).as("searchBooks");

      cy.get("[data-test=search-input]").type(searchTerm);
      cy.get("[data-test=search-button]").click();

      cy.wait("@searchBooks");
      cy.url().should("include", `search=${searchTerm}`);

      // 验证搜索结果
      cy.get("[data-test=book-card]").each(($card) => {
        const text = $card.text().toLowerCase();
        expect(text).to.include(searchTerm.toLowerCase());
      });
    });

    it("无搜索结果时显示提示信息", () => {
      const nonExistentTerm = "xyznonexistent";

      cy.intercept("GET", `/api/books?search=${nonExistentTerm}*`, {
        body: {
          code: 200,
          message: "success",
          data: [],
        },
      }).as("emptySearch");

      cy.get("[data-test=search-input]").type(nonExistentTerm);
      cy.get("[data-test=search-button]").click();

      cy.wait("@emptySearch");
      cy.get("[data-test=no-results]").should("be.visible");
      cy.get("[data-test=no-results]").should("contain", "未找到相关图书");
    });
  });

  describe("图书详情页", () => {
    beforeEach(() => {
      cy.visit("/books/1");
    });

    it("显示图书详细信息", () => {
      cy.get("[data-test=book-detail]").should("be.visible");
      cy.get("[data-test=book-title]").should("not.be.empty");
      cy.get("[data-test=book-author]").should("not.be.empty");
      cy.get("[data-test=book-isbn]").should("not.be.empty");
      cy.get("[data-test=book-price]").should("not.be.empty");
      cy.get("[data-test=book-description]").should("exist");
    });

    it("未登录用户添加图书到购物车时重定向到登录", () => {
      cy.get("[data-test=quantity-input]").clear().type("2");
      cy.get("[data-test=add-to-cart-button]").click();
      cy.url().should("include", "/login");
    });

    it("已登录用户可以添加图书到购物车", () => {
      cy.loginAsUser();
      cy.visit("/books/1");
      cy.intercept("POST", "/api/carts/add").as("addToCart");

      cy.get("[data-test=quantity-input]").clear().type("2");
      cy.get("[data-test=add-to-cart-button]").click();

      cy.wait("@addToCart");
      cy.get("[data-test=notification]").should("contain", "成功添加到购物车");

      // 验证购物车计数器增加
      cy.get("[data-test=cart-count]").should("contain", "2");
    });

    it("从列表页导航到详情页", () => {
      cy.visit("/books");
      cy.get("[data-test=book-card]").first().click();
      cy.url().should("include", "/books/");
      cy.get("[data-test=book-detail]").should("be.visible");
    });
  });

  describe("高级搜索", () => {
    it("可以按照作者筛选", () => {
      cy.visit("/books");
      cy.get("[data-test=advanced-search-button]").click();
      cy.get("[data-test=author-filter]").type("Test Author 1");
      cy.get("[data-test=apply-filters]").click();

      cy.url().should("include", "author=Test%20Author%201");
      cy.get("[data-test=book-author]").each(($author) => {
        expect($author.text()).to.include("Test Author 1");
      });
    });

    it("可以按价格范围筛选", () => {
      cy.visit("/books");
      cy.get("[data-test=advanced-search-button]").click();
      cy.get("[data-test=min-price]").type("20");
      cy.get("[data-test=max-price]").type("30");
      cy.get("[data-test=apply-filters]").click();

      cy.url().should("include", "minPrice=20&maxPrice=30");
      cy.get("[data-test=book-price]").each(($price) => {
        const price = parseFloat($price.text().replace("￥", ""));
        expect(price).to.be.gte(20);
        expect(price).to.be.lte(30);
      });
    });
  });
});
