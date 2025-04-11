// cypress/e2e/api/customers.cy.js
describe("Customer Management API", () => {
  before(() => {
    cy.task("resetTestDB");
    cy.loginAsAdmin();
    cy.loginAsUser();
  });

  after(() => {
    cy.task("resetTestDB");
  });

  it("管理员可以查看所有用户", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/customers",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.at.least(1);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "name",
        "email",
        "creditLevel",
        "accountBalance"
      );
    });
  });

  it("普通用户不能查看所有用户", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/customers",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 403);
      expect(response.body.message).to.include(
        "Administrator permission required"
      );
    });
  });

  it("管理员更新用户全部信息", () => {
    // 首先获取用户列表以获取ID
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/customers",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      const userId = response.body.data.find(
        (user) => user.email === "normal@test.com"
      ).id;

      // 更新用户
      cy.request({
        method: "PUT",
        url: `http://localhost:8080/api/customers/${userId}`,
        headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
        body: {
          creditLevel: 4,
          accountBalance: 1000,
        },
      }).then((updateResponse) => {
        cy.verifyResponseStructure(updateResponse);
        expect(updateResponse.body.message).to.include(
          "Customer updated successfully"
        );

        // 验证更新是否成功
        cy.request({
          method: "GET",
          url: "http://localhost:8080/api/customers",
          headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
        }).then((verifyResponse) => {
          const updatedUser = verifyResponse.body.data.find(
            (user) => user.id === userId
          );
          expect(updatedUser.creditLevel).to.eq(4);
          expect(updatedUser.accountBalance).to.eq(1000);
        });
      });
    });
  });

  it("管理员更新用户部分信息", () => {
    // 获取用户ID
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/customers",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      const userId = response.body.data.find(
        (user) => user.email === "normal@test.com"
      ).id;

      // 只更新信用等级
      cy.request({
        method: "PUT",
        url: `http://localhost:8080/api/customers/${userId}`,
        headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
        body: {
          creditLevel: 5,
        },
      }).then((updateResponse) => {
        cy.verifyResponseStructure(updateResponse);

        // 验证只有信用等级被更新
        cy.request({
          method: "GET",
          url: "http://localhost:8080/api/customers",
          headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
        }).then((verifyResponse) => {
          const updatedUser = verifyResponse.body.data.find(
            (user) => user.id === userId
          );
          expect(updatedUser.creditLevel).to.eq(5);
          // 账户余额应保持不变
          expect(updatedUser.accountBalance).to.eq(1000);
        });
      });
    });
  });
});
