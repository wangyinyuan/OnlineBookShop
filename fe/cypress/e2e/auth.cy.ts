import authSelectors from "../selectors/auth";

describe("用户认证与授权", () => {
  beforeEach(() => {
    cy.visit("/account");
  });

  it("测试登出", () => {
    cy.get(authSelectors.logoutButton).then(($button) => {
      console.log($button);
    });
  });
  // beforeEach(() => {
  //   cy.visit("/");
  // });

  // describe("用户注册", () => {
  //   const randomEmail = `test${Date.now()}@example.com`;

  //   beforeEach(() => {
  //     cy.visit("/register");
  //   });

  //   afterEach(() => {
  //     cy.logout();
  //   });

  //   it("使用有效信息注册新用户", () => {
  //     cy.intercept("POST", "/api/customers/register").as("register");

  //     cy.get(authSelectors.name).type("Test User");
  //     cy.get(authSelectors.email).type(randomEmail);
  //     cy.get(authSelectors.password).type("114514");
  //     cy.get(authSelectors.confirmPassword).type("114514");
  //     cy.get(authSelectors.registerButton).click();

  //     cy.wait("@register");
  //     cy.url().should("include", "/account");
  //   });

  //   it("密码不匹配显示错误消息", () => {
  //     cy.get("[data-test=name-input]").type("Test User");
  //     cy.get("[data-test=email-input]").type(
  //       `test${Date.now() + 1}@example.com`
  //     );
  //     cy.get("[data-test=password-input]").type("Password123!");
  //     cy.get("[data-test=confirm-password-input]").type("DifferentPassword!");
  //     cy.get("[data-test=register-button]").click();

  //     cy.get("[data-test=password-error]").should("be.visible");
  //     cy.get("[data-test=password-error]").should("contain", "密码不匹配");
  //   });

  //   it("注册表单验证必填字段", () => {
  //     cy.get("[data-test=register-button]").click();
  //     cy.get("[data-test=name-error]").should("be.visible");
  //     cy.get("[data-test=email-error]").should("be.visible");
  //     cy.get("[data-test=password-error]").should("be.visible");
  //   });

  //   it("注册已存在的邮箱显示错误", () => {
  //     cy.intercept("POST", "/api/customers/register", {
  //       statusCode: 400,
  //       body: {
  //         code: 400,
  //         message: "Email already registered",
  //         data: null,
  //       },
  //     }).as("registerExisting");

  //     cy.get("[data-test=name-input]").type("Test User");
  //     cy.get("[data-test=email-input]").type("normal@test.com");
  //     cy.get("[data-test=password-input]").type("Password123!");
  //     cy.get("[data-test=confirm-password-input]").type("Password123!");
  //     cy.get("[data-test=register-button]").click();

  //     cy.wait("@registerExisting");
  //     cy.get("[data-test=notification]").should("contain", "已被注册");
  //   });
  // });

  // describe("用户登录", () => {
  //   beforeEach(() => {
  //     cy.visit("/login");
  //   });

  //   it("使用有效凭据登录", () => {
  //     cy.intercept("POST", "/api/customers/login").as("login");
  //     cy.get("[data-test=email-input]").type("normal@test.com");
  //     cy.get("[data-test=password-input]").type("test");
  //     cy.get("[data-test=login-button]").click();

  //     cy.wait("@login");
  //     cy.url().should("include", "/books");
  //     cy.get("[data-test=user-menu]").should("be.visible");
  //   });

  //   it("使用错误密码登录失败", () => {
  //     cy.intercept("POST", "/api/customers/login", {
  //       statusCode: 400,
  //       body: {
  //         code: 400,
  //         message: "Invalid password",
  //         data: null,
  //       },
  //     }).as("loginFailed");

  //     cy.get("[data-test=email-input]").type("normal@test.com");
  //     cy.get("[data-test=password-input]").type("wrongpassword");
  //     cy.get("[data-test=login-button]").click();

  //     cy.wait("@loginFailed");
  //     cy.get("[data-test=notification]").should("contain", "密码错误");
  //     cy.url().should("include", "/login");
  //   });

  //   it("登录表单验证必填字段", () => {
  //     cy.get("[data-test=login-button]").click();
  //     cy.get("[data-test=email-error]").should("be.visible");
  //     cy.get("[data-test=password-error]").should("be.visible");
  //   });
  // });

  // describe("用户登出", () => {
  //   beforeEach(() => {
  //     cy.loginAsUser();
  //     cy.visit("/");
  //   });

  //   it("用户成功登出", () => {
  //     cy.get("[data-test=user-menu]").click();
  //     cy.get("[data-test=logout-button]").click();
  //     cy.get("[data-test=nav-login-button]").should("be.visible");
  //     cy.get("[data-test=notification]").should("contain", "成功登出");
  //   });

  //   it("登出后无法访问受保护页面", () => {
  //     cy.get("[data-test=user-menu]").click();
  //     cy.get("[data-test=logout-button]").click();
  //     cy.visit("/orders");
  //     cy.url().should("include", "/login");
  //   });
  // });
});
