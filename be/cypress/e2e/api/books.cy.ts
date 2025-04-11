// cypress/e2e/api/books.cy.js
describe("Books API", () => {
  before(() => {
    cy.task("resetTestDB");
    cy.loginAsAdmin();
    cy.loginAsUser();
  });

  it("should get all books (public access)", () => {
    cy.request("http://localhost:8080/api/books/").then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.at.least(2);
      expect(response.body.data[0]).to.include.keys(
        "id",
        "isbn",
        "title",
        "price",
        "author"
      );
    });
  });

  it("should get inventory (admin only)", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/books/inventory",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.at.least(2);
      expect(response.body.data[0]).to.include.keys(
        "id",
        "title",
        "isbn",
        "author",
        "stock"
      );
    });
  });

  it("should deny regular user access to inventory", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/books/inventory",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 403);
    });
  });

  it("should add a new book (admin only)", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/books/inventory",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      body: {
        title: "Cypress Testing Book",
        author: "Test Author",
        isbn: "9781234567899",
        stock: 25,
      },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.message).to.include(
        "Book and inventory added successfully"
      );

      // 验证书籍是否被添加
      cy.request("http://localhost:8080/api/books/").then((booksResponse) => {
        const addedBook = booksResponse.body.data.find(
          (book) => book.title === "Cypress Testing Book"
        );
        expect(addedBook).to.exist;
        expect(addedBook.isbn).to.eq("9781234567899");
      });
    });
  });

  it("should update book inventory (admin only)", () => {
    // 获取书籍ID
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/books/inventory",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      const bookId = response.body.data[0].id;

      cy.request({
        method: "PUT",
        url: `http://localhost:8080/api/books/inventory/${bookId}`,
        headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
        body: {
          quantity: 75,
        },
      }).then((updateResponse) => {
        cy.verifyResponseStructure(updateResponse);
        expect(updateResponse.body.message).to.include(
          "Inventory updated successfully"
        );

        // 验证库存是否更新
        cy.request({
          method: "GET",
          url: "http://localhost:8080/api/books/inventory",
          headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
        }).then((verifyResponse) => {
          const updatedBook = verifyResponse.body.data.find(
            (book) => book.id === bookId
          );
          expect(updatedBook.stock).to.eq(75);
        });
      });
    });
  });
});
