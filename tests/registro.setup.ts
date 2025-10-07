import { test as setup, expect } from '@playwright/test';
import { BackendUtils } from '../utils/backendUtils';
import TestData from '../data/testData.json';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { ModalCrearCuenta } from '../pages/modalCrearCuenta';
import fs from 'fs/promises';
import path from 'path';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let modalCrearCuenta: ModalCrearCuenta;

const usuarioEnviaAuthFile = 'playwright/.auth/usuarioEnvia.json';
const usuarioRecibeAuthFile = 'playwright/.auth/usuarioRecibe.json';
const usuarioEnviaDataFile = 'playwright/.auth/usuarioEnvia.data.json';

setup.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    modalCrearCuenta = new ModalCrearCuenta(page);
    await loginPage.visitarPaginaLogin();
})

setup('Generar usuario que envía dinero', async ({ page, request }) => {
    const nuevoUsuario = await BackendUtils.crearUsuarioPorAPI(request, TestData.usuarioValido);

    await loginPage.completarFormularioLoginJson(nuevoUsuario);
    await loginPage.loginButton.click();

    await dashboardPage.botonAgregarCuenta.click();

    // Guardamos los datos del nuevo usuario para poder usarlso en los tests de transacciones
    await fs.writeFile(path.resolve(__dirname, '..', usuarioEnviaDataFile), JSON.stringify(nuevoUsuario, null, 2))


    await modalCrearCuenta.seleccionarTipoDeCuenta('Débito');
    await modalCrearCuenta.completarMonto('1000');
    await modalCrearCuenta.botonCrearCuenta.click();
    await expect(page.getByText('Cuenta creada exitosamente')).toBeVisible();
    await page.context().storageState({ path: usuarioEnviaAuthFile });

await page.waitForTimeout(5000);
 })

setup('Loguearse con usuario que recibe dinero', async ({ page }) => {
    await loginPage.completarFormularioLoginJson(TestData.usuarioValido);
    await loginPage.loginButton.click();    
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await page.context().storageState({ path: usuarioRecibeAuthFile });
})