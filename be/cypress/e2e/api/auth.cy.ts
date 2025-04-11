// cypress/e2e/api/auth.cy.js
describe("Authentication API", () => {
  before(() => {
    cy.task("resetTestDB");
  });

  after(() => {
    cy.task("resetTestDB");
  });

  const newUser = {
    email: "newuser@test.com",
    password: "test",
    name: "New User",
  };

  it("注册一个新用户", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/customers/register",
      body: newUser,
    }).then((response) => {
      cy.verifyResponseStructure(response, 201);
      expect(response.body.data).to.have.property("email", newUser.email);
      expect(response.body.data).to.have.property("name", newUser.name);
      expect(response.body.data).to.have.property("token");
      expect(response.body.data).to.have.property("isAdmin", false);
    });
  });

  it("不能重复注册用户", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/customers/register",
      body: newUser,
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 400);
      expect(response.body.message).to.include("Email already registered");
    });
  });

  it("登录密码正确", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/customers/login",
      body: {
        email: "admin@test.com",
        password: "test",
      },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data).to.have.property("email", "admin@test.com");
      expect(response.body.data).to.have.property("token");
      expect(response.body.data).to.have.property("isAdmin", true);
    });
  });

  it("登录密码错误", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/customers/login",
      body: {
        email: "admin@test.com",
        password: "badpassword",
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 400);
      expect(response.body.message).to.include("Invalid password");
    });
  });

  it("用户不存在", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/customers/login",
      body: {
        email: "nonexistent@test.com",
        password: "xxx",
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 400);
      expect(response.body.message).to.include("Customer not found");
    });
  });
});
