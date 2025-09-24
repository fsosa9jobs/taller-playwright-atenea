import { Page, Locator } from "@playwright/test";
import { log } from "console";

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registerButton = page.getByTestId("boton-registrarse");
    this.loginButton = page.getByTestId("boton-login-header-signup");
  }

  async visitarPaginaRegistro() {
    try 
    {
        await this.page.goto('http://localhost:3000/');
    } 
    catch (error) {}
    {
      console.log('Error al visitar pagina');      
    }
  }

  async visitarPaginaLogin() {
    try 
    {
        await this.page.goto('http://localhost:3000/Login');
    } 
    catch (error) {}
    {
      console.log('Error al visitar pagina');      
    }
  }

  async completarFormularioRegistro(firstname: string, lastName: string, email:string, password: string)
  {
    try 
    {
        await this.firstNameInput.fill(firstname);        
        await this.lastNameInput.fill(lastName);   
        await this.emailInput.fill(email);   
        await this.passwordInput.fill(password);   
    } catch (error) {
        console.log('Error al completar formulario de la pagina'); 
    }
  }

  async completarFormularioRegistroJson(usuario: {firstname: string, lastName: string, email:string, password: string})
  {
    try 
    {
        await this.firstNameInput.fill(usuario.firstname);        
        await this.lastNameInput.fill(usuario.lastName);   
        await this.emailInput.fill(usuario.email);   
        await this.passwordInput.fill(usuario.password);   
    } catch (error) {
        console.log('Error al completar formulario de la pagina'); 
    }
  }
}
