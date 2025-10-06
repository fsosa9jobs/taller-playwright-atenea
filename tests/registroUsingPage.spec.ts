import { test, expect, request } from "@playwright/test";
import { RegisterPage } from "../pages/registerPage";

import TestData from "../data/testData.json";
import { json } from "stream/consumers";

let regPage: RegisterPage;

test.beforeEach(async ({ page }) => {
  regPage = new RegisterPage(page);
  await regPage.visitarPaginaRegistro();
});

test("TC-01 Verificacion de elementos visuales en la pagina registro", async ({
  page,
}) => {
  await expect(regPage.firstNameInput).toBeVisible();
  await expect(regPage.lastNameInput).toBeVisible();
  await expect(regPage.emailInput).toBeVisible();
  await expect(regPage.passwordInput).toBeVisible();

  await expect(regPage.registerButton).toBeVisible();
});

test("TC-02 Verificacion boton de registro esta inhabilitado por defecto", async ({
  page,
}) => {
  await expect(regPage.registerButton).toBeDisabled();

  await expect(regPage.registerButton).toBeVisible();
});

test("TC-03 Verificacion boton de registro se habilita al completar los campos obligatorios", async ({
  page,
}) => {
  await regPage.completarFormularioRegistro(
    TestData.usuarioValido.firstname,
    "Doe",
    "jhon.Doe@gmail.com",
    "jdoe123"
  );

  await expect(regPage.registerButton).toBeEnabled();
});

test("TC-04 Verificacion redireccionamiento a pagina de inicio de sesion al hacer clic en boton de inisio sesion", async ({
  page,
}) => {
  await regPage.loginButton.click();

  await regPage.visitarPaginaLogin();
  await page.waitForTimeout(5000);
});

test("TC-05 Verificar registro exitoso con datos validos", async ({ page }) => {
  test.step("Completar formulario de registro con datos validos", async () => {
    const email =
      TestData.usuarioValido.email.split("@")[0] +
      Date.now().toString() +
      "@" +
      TestData.usuarioValido.email.split("@")[1];
    TestData.usuarioValido.email = email;
    await regPage.completarFormularioRegistroJson(TestData.usuarioValido);
  });

  // await regPage.completarFormularioRegistro('Jhon', 'Doe', 'jhon.Doe1' + Date.now().toString() +'@gmail.com', 'jdoe123');

  await regPage.registerButton.click();

  await expect(page.getByText("Registro exitoso")).toBeVisible();
});

test("TC-06 Verificar que un usuario no pueda registrarse con un email existente", async ({
  page,
}) => {
  // const email1 =  'jhon.Doe1' + Date.now().toString() +'@gmail.com';

  const email =
    TestData.usuarioValido.email.split("@")[0] +
    Date.now().toString() +
    "@" +
    TestData.usuarioValido.email.split("@")[1];

  await regPage.completarFormularioRegistro("Jhon", "Doe", email, "jdoe123");

  await regPage.registerButton.click();

  await expect(page.getByText("Registro exitoso")).toBeVisible();

  await regPage.visitarPaginaRegistro();

  await regPage.completarFormularioRegistro("Jhon", "Doe", email, "jdoe123");

  await regPage.registerButton.click();

  await expect(page.getByText("Email already in use")).toBeVisible();
  await expect(page.getByText("Registro exitoso")).not.toBeVisible();
});

test("TC-08 Verificar registro exitoso con datos validos  verificando respuesta de la API", async ({
  page,
}) => {
  test.step("Completar formulario de registro con datos validos", async () => {
    const email =
      TestData.usuarioValido.email.split("@")[0] +
      Date.now().toString() +
      "@" +
      TestData.usuarioValido.email.split("@")[1];
    TestData.usuarioValido.email = email;
    await regPage.completarFormularioRegistroJson(TestData.usuarioValido);
  });

  // vamos a verificare que la api de tipo post responde con un sttus code 201
  // http://localhost:6007/api/auth/signup

  test.step("Verificar API y sus datos", async () => {
    const responsePromise = page.waitForResponse(
      "http://localhost:6007/api/auth/signup"
    );

    await regPage.registerButton.click();
    const response = await responsePromise;
    const responseBody = await response.json();

    expect(response.status()).toBe(201);
    // expect((await response.body()).toString()).toContain("token");
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

  await expect(page.getByText("Registro exitoso")).toBeVisible();
});

test("TC-09 Generar SIgnup desde la API", async ({ page, request }) => {

  // const context = await request.newContext({
  //   baseURL: "http://localhost:6007/api/auth/",
  // });

  const email =
      TestData.usuarioValido.email.split("@")[0] +
      Date.now().toString() +
      "@" +
      TestData.usuarioValido.email.split("@")[1];
    TestData.usuarioValido.email = email;

  // Create a repository.
  const response = await request.post("http://localhost:6007/api/auth/signup", {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    data: {
      firstName: TestData.usuarioValido.firstname,
      lastName: TestData.usuarioValido.lastName,
      email: TestData.usuarioValido.email,
      password: TestData.usuarioValido.password,
    },
  });

  const responseBody = await response.json();

    expect(response.status()).toBe(201);
    // expect((await response.body()).toString()).toContain("token");
    expect(responseBody).toHaveProperty("token");
    expect(typeof responseBody.token).toBe("string");
    expect(responseBody).toHaveProperty("user");
    expect(responseBody.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        firstName: TestData.usuarioValido.firstname,
        lastName: TestData.usuarioValido.lastName,
        email: TestData.usuarioValido.email,
      })
    );
  
});


test("TC-10 Verificar comportamiento del front ante un error 500 en el registro", async ({ page, request }) => {

  const email = TestData.usuarioValido.email.split("@")[0] +
      Date.now().toString() +
      "@" +
      TestData.usuarioValido.email.split("@")[1];
    TestData.usuarioValido.email = email;

//interceptar la solicitud de registro y devovler un error 500
  await page.route('**/api/auth/signup', route => {
  route.fulfill({ status: 500, contentType: 'application/json', 
    body: JSON.stringify({ message: 'Internal Server Error'}) });
});


await regPage.completarFormularioRegistroJson(TestData.usuarioValido);
await regPage.registerButton.click();

await expect(page.getByText('Internal Server Error')).toBeVisible();

});