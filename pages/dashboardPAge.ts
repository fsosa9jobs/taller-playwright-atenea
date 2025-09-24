import { Page, Locator } from "@playwright/test";
import { log } from "console";

export class DashboardPage
 {
  readonly page: Page;

  readonly dashboardTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle= page.getByTestId('titulo-dashboard');

  }

  async visitarPaginaLogin() {
    try 
    {
        await this.page.goto('http://localhost:3000/dashboard');
    } 
    catch (error) {}
    {
      console.log('Error al visitar pagina');      
    }
  }

}
