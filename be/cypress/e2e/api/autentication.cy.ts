// cypress/e2e/api/authentication.cy.js
describe("Authentication and Authorization", () => {
  beforeEach(() => {
    cy.task("resetTestDB");
    cy.loginAsAdmin();
    cy.loginAsUser();
  });

  it("should reject requests without token", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/customers",
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 401);
      expect(response.body.message).to.include("Authentication required");
    });
  });

  it("should reject requests with invalid token", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/customers",
      headers: { Authorization: "Bearer invalid_token" },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 401);
      expect(response.body.message).to.include("Invalid token");
    });
  });

  it("should correctly identify admin users", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/customers",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
    });
  });

  it("should correctly enforce permission restrictions", () => {
    // 普通用户尝试访问管理员API
    const restrictedApis = [
      "http://localhost:8080/api/customers",
      "http://localhost:8080/api/books/inventory",
      "http://localhost:8080/api/suppliers",
      "http://localhost:8080/api/orders/all",
    ];

    restrictedApis.forEach((api) => {
      cy.request({
        method: "GET",
        url: api,
        headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
        failOnStatusCode: false,
      }).then((response) => {
        cy.verifyResponseStructure(response, 403);
        expect(response.body.message).to.include(
          "Administrator permission required"
        );
      });
    });
  });
});
