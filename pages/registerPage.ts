import { Page, Locator, test } from "@playwright/test";
import { log } from "console";
import { LoginPage } from "../pages/loginPage";
import { ModalCrearCuenta } from "./modalCrearCuenta";
import TestData from "../data/testData.json";
import { DashboardPage } from "./dashboardPage_back";


export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginButton: Locator;

  readonly logP: LoginPage;
  readonly dashboardPage: DashboardPage;
  readonly modalCrearCuenta: ModalCrearCuenta;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registerButton = page.getByTestId("boton-registrarse");
    this.loginButton = page.getByTestId("boton-login-header-signup");

    this.logP = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.modalCrearCuenta = new ModalCrearCuenta(page);
  }

  async visitarPaginaRegistro() {
    try {
      await this.page.goto("http://localhost:3000/");
    } catch (error) {}
    {
      console.log("Error al visitar pagina");
    }
  }

  async visitarPaginaLogin() {
    try {
      await this.page.goto("http://localhost:3000/Login");
    } catch (error) {}
    {
      console.log("Error al visitar pagina");
    }
  }

  async completarFormularioRegistro(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    try {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
    } catch (error) {
      console.log("Error al completar formulario de la pagina");
    }
  }

  async completarFormularioRegistroJson(usuario: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    try {
      await this.firstNameInput.fill(usuario.firstName);
      await this.lastNameInput.fill(usuario.lastName);
      await this.emailInput.fill(usuario.email);
      await this.passwordInput.fill(usuario.password);
    } catch (error) {
      console.log("Error al completar formulario de la pagina");
    }
  }

  async crearCuentaUsuario(): Promise<boolean> 
  {
    try {

      await this.crearUsuario();

      await this.visitarPaginaLogin();
      await this.logP.completarFormularioLoginJson(TestData.usuarioValido);
      await this.logP.loginButton.click();

      await this.dashboardPage.botonAgregarCuenta.click();

      await this.modalCrearCuenta.seleccionarTipoDeCuenta("Débito");
      await this.modalCrearCuenta.completarMonto("1000");
      await this.modalCrearCuenta.botonCrearCuenta.click();

      return true;
    } catch (error) { return false }
  }

  async crearUsuario()
  {



  //   await this.visitarPaginaRegistro();
  //   test.step("Completar formulario de registro con datos validos", async () => {
  //   const email =
  //     TestData.usuarioValido.email.split("@")[0] +
  //     Date.now().toString() +
  //     "@" +
  //     TestData.usuarioValido.email.split("@")[1];
  //   TestData.usuarioValido.email = email;
  //   await this.completarFormularioRegistroJson(TestData.usuarioValido);
  //   await this.registerButton.click();
  // });
  }
}
