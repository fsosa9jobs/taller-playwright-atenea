import { Page, Locator } from "@playwright/test";
import { log } from "console";

export class DashboardPage
 {
  readonly page: Page;

  readonly dashboardTitle: Locator;
  readonly botonAgregarCuenta: Locator;
  readonly botonEnviarDinero: Locator;

  readonly elementosListaTransferencia: Locator;
  readonly elementosListaMontoTransferencia: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle= page.getByTestId('titulo-dashboard');
    this.botonAgregarCuenta= page.getByTestId('tarjeta-agregar-cuenta');
    this.botonEnviarDinero= page.getByTestId('boton-enviar');
    this.elementosListaTransferencia = page.locator('[data-testid="descripcion-transaccion"]');
    this.elementosListaMontoTransferencia = page.locator('[data-testid="monto-transaccion"]');

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

  async visitarPaginaDashboard() {
        await this.page.goto('http://localhost:3000/dashboard');
        await this.page.waitForLoadState('networkidle');
    }

}
