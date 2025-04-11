/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// 管理员登录
Cypress.Commands.add("loginAsAdmin", () => {
  return cy
    .request({
      method: "POST",
      url: "http://localhost:8080/api/customers/login",
      body: {
        email: "admin@test.com",
        password: "test",
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property("token");

      // 保存token
      Cypress.env("adminToken", response.body.data.token);
    });
});

// 普通用户登录
Cypress.Commands.add("loginAsUser", () => {
  return cy
    .request({
      method: "POST",
      url: "http://localhost:8080/api/customers/login",
      body: {
        email: "normal@test.com",
        password: "test",
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property("token");

      // 保存token
      Cypress.env("userToken", response.body.data.token);
    });
});

// 检查API响应的标准结构
Cypress.Commands.add(
  "verifyResponseStructure",
  (response, expectedStatus = 200) => {
    expect(response.status).to.eq(expectedStatus);
    expect(response.body).to.have.property("code", expectedStatus);
    expect(response.body).to.have.property("message");

    // 只有在成功响应中检查data属性
    if (expectedStatus >= 200 && expectedStatus < 300) {
      expect(response.body).to.have.property("data");
    }
  }
);
