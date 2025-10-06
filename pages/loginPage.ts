import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registerButton = page.getByTestId("boton-registrarse");
    this.loginButton = page.getByTestId("boton-login");
  }

  async visitarPaginaLogin() {
    try 
    {
        await this.page.goto('http://localhost:3000/login');
    } 
    catch (error) {}
    {
      console.log('Error al visitar pagina');      
    }
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

  async completarFormularioLogin(firstName: string, lastName: string, email:string, password: string)
  {
    try 
    {
        await this.emailInput.fill(email);   
        await this.passwordInput.fill(password);   
    } catch (error) {
        console.log('Error al completar formulario de la pagina'); 
    }
  }

  async completarFormularioLoginJson(usuario: {firstName: string, lastName: string, email:string, password: string})
  {
    try 
    {  
        await this.emailInput.fill(usuario.email);   
        await this.passwordInput.fill(usuario.password);   
    } catch (error) {
        console.log('Error al completar formulario de la pagina'); 
    }
  }
}
