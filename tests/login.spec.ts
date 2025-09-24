import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

import TestData from "../data/testData.json";
import { DashboardPage } from "../pages/dashboardPAge";

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();
});

test("Tc-7 Verificar inicio de sesion exitoso con credenciales validas", async ({
  page,
}) => {
  await loginPage.completarFormularioLoginJson(TestData.usuarioValido);
  await loginPage.loginButton.click();
  await expect(page.getByText("Inicio de sesión exitoso")).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});
