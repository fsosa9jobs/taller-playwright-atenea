import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

import TestData from "../data/testData.json";

import { BackendUtils } from '../utils/backendUtils';

import { DashboardPage } from '../pages/dashboardPage_back';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();
});

test("Tc-7 Verificar inicio de sesion exitoso con credenciales validas", async ({
  page, request
}) => {

  //const nuevoUsuario = await BackendUtils.crearUsuarioPorAPI(request, TestData.usuarioValido, false);

  await loginPage.completarFormularioLoginJson(TestData.usuarioValido);
  await loginPage.loginButton.click();
  await expect(page.getByText("Inicio de sesión exitoso")).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});

test("Tc-11 Loguearse con usuario creado por backend", async ({
  page,
  request,
}) => {
  const email =
    TestData.usuarioValido.email.split("@")[0] +
    Date.now().toString() +
    "@" +
    TestData.usuarioValido.email.split("@")[1];
  TestData.usuarioValido.email = email;

  // Create a repository.
  const response = await request.post("http://localhost:6007/api/auth/signup", {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    data: {
      firstName: TestData.usuarioValido.firstName,
      lastName: TestData.usuarioValido.lastName,
      email: email,
      password: TestData.usuarioValido.password,
    },
  });

  const responseBody = await response.json();
  expect(response.status()).toBe(201);

  TestData.usuarioValido.email = email;

  await loginPage.completarFormularioLoginJson(TestData.usuarioValido);
  await loginPage.loginButton.click();

  test.step("Verificar API y sus datos", async () => {
    expect(responseBody).toHaveProperty("token");
    expect(typeof responseBody.token).toBe("string");
    expect(responseBody).toHaveProperty("user");
    expect(responseBody.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        firstName: TestData.usuarioValido.firstName,
        lastName: TestData.usuarioValido.lastName,
        email: TestData.usuarioValido.email,
      })
    );
  });
   

  await expect(page.getByText("Inicio de sesión exitoso")).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();

});


test("Tc-12 Loguearse con nuevo usuario creado por backend", async ({  page,  request,}) => {

  const nuevoUsuario = await BackendUtils.crearUsuarioPorAPI(request, TestData.usuarioValido);

  const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login');

  TestData.usuarioValido.email = nuevoUsuario.email;

  await loginPage.completarFormularioLoginJson(TestData.usuarioValido);
  await loginPage.loginButton.click();

  const responseLogin = await responsePromiseLogin;
  const responseBodyLoginJson = await responseLogin.json();

  expect(responseLogin.status()).toBe(200);
  expect(responseBodyLoginJson).toHaveProperty('token');
  expect(typeof responseBodyLoginJson.token).toBe('string');
  expect(responseBodyLoginJson).toHaveProperty('user');
  expect(responseBodyLoginJson.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: TestData.usuarioValido.firstName,
    lastName: TestData.usuarioValido.lastName,
    email: nuevoUsuario.email,
  }));


  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});
