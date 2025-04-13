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
import authSelectors from "../selectors/auth";

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit("/login");
    cy.get(authSelectors.email).type(email);
    cy.get(authSelectors.password).type(password);
    cy.get(authSelectors.loginButton).click();
  });
});

// 管理员登录
Cypress.Commands.add("loginAsAdmin", () => {
  cy.login("admin@test.com", "test");
});

// 普通用户登录
Cypress.Commands.add("loginAsUser", () => {
  cy.login("normal@test.com", "test");
});

// 注销用户
Cypress.Commands.add("logout", () => {
  cy.visit("/account");
});

// 添加图书到购物车
Cypress.Commands.add("addBookToCart", (bookId: number, quantity: number) => {
  cy.intercept("POST", "/api/carts/add").as("addToCart");
  cy.visit(`/books/${bookId}`);
  cy.get("[data-test=quantity-input]").clear().type(`${quantity}`);
  cy.get("[data-test=add-to-cart-button]").click();
  cy.wait("@addToCart").its("response.statusCode").should("eq", 200);
});

// 创建订单
Cypress.Commands.add("createOrder", () => {
  cy.intercept("POST", "/api/orders").as("createOrder");
  cy.visit("/cart");
  cy.get("[data-test=checkout-button]").click();
  cy.get("[data-test=confirm-order-button]").click();
  cy.wait("@createOrder");
  return cy.get("@createOrder").then((xhr) => {
    return xhr.response.body.data.orderId;
  });
});

// API 拦截简化命令
Cypress.Commands.add("interceptApi", (route, fixture) => {
  if (fixture) {
    cy.intercept("GET", `/api${route}`, { fixture }).as(
      route.replace(/\//g, "_")
    );
  } else {
    cy.intercept("GET", `/api${route}`).as(route.replace(/\//g, "_"));
  }
});
