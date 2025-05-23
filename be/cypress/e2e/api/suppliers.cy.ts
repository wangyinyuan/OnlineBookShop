// cypress/e2e/api/suppliers.cy.js
describe("Suppliers API", () => {
  before(() => {
    cy.task("resetTestDB");
    cy.loginAsAdmin();
    cy.loginAsUser();
  });

  after(() => {
    cy.task("resetTestDB");
  });

  it("管理员获取所有供应商信息", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/suppliers",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.at.least(2);
      expect(response.body.data[0]).to.include.keys(
        "id",
        "name",
        "contactInfo"
      );
    });
  });

  it("普通用户不能获取管理员信息", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/api/suppliers",
      headers: { Authorization: `Bearer ${Cypress.env("userToken")}` },
      failOnStatusCode: false,
    }).then((response) => {
      cy.verifyResponseStructure(response, 403);
    });
  });

  it("管理员添加新供应商", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/api/suppliers",
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      body: {
        name: "Cypress Test Supplier",
        contactInfo: "cypress@test.com",
      },
    }).then((response) => {
      cy.verifyResponseStructure(response);
      expect(response.body.message).to.include("Supplier added successfully");
      expect(response.body.data).to.include.keys("id", "name", "contactInfo");
      expect(response.body.data.name).to.eq("Cypress Test Supplier");

      // 保存供应商ID用于后续测试
      const supplierId = response.body.data.id;
      Cypress.env("testSupplierId", supplierId);

      // 验证供应商是否被添加
      cy.request({
        method: "GET",
        url: "http://localhost:8080/api/suppliers",
        headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      }).then((verifyResponse) => {
        const addedSupplier = verifyResponse.body.data.find(
          (s) => s.id === supplierId
        );
        expect(addedSupplier).to.exist;
        expect(addedSupplier.name).to.eq("Cypress Test Supplier");
        expect(addedSupplier.contactInfo).to.eq("cypress@test.com");
      });
    });
  });

  it("管理员更新供应商信息", () => {
    const supplierId = Cypress.env("testSupplierId");

    // 更新供应商
    cy.request({
      method: "PUT",
      url: `http://localhost:8080/api/suppliers/${supplierId}`,
      headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      body: {
        name: "Updated Supplier Name",
        contactInfo: "updated@test.com",
      },
    }).then((updateResponse) => {
      cy.verifyResponseStructure(updateResponse);
      expect(updateResponse.body.message).to.include(
        "Supplier updated successfully"
      );

      // 验证更新是否成功
      cy.request({
        method: "GET",
        url: "http://localhost:8080/api/suppliers",
        headers: { Authorization: `Bearer ${Cypress.env("adminToken")}` },
      }).then((verifyResponse) => {
        const updatedSupplier = verifyResponse.body.data.find(
          (s) => s.id === supplierId
        );
        expect(updatedSupplier.name).to.eq("Updated Supplier Name");
        expect(updatedSupplier.contactInfo).to.eq("updated@test.com");
      });
    });
  });
});
