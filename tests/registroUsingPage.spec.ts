import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';

import TestData  from '../data/testData.json';

let regPage: RegisterPage;

test.beforeEach(async ({ page }) => {
    regPage = new RegisterPage(page);
    await regPage.visitarPaginaRegistro();
});


test('TC-01 Verificacion de elementos visuales en la pagina registro', async ({ page }) => {


  await expect (regPage.firstNameInput).toBeVisible();
  await expect (regPage.lastNameInput).toBeVisible();
  await expect (regPage.emailInput).toBeVisible();
  await expect (regPage.passwordInput).toBeVisible();

  await expect  (regPage.registerButton).toBeVisible();

});

test('TC-02 Verificacion boton de registro esta inhabilitado por defecto', async ({ page }) => {


  await expect  (regPage.registerButton).toBeDisabled();

  await expect  (regPage.registerButton).toBeVisible();

});

test('TC-03 Verificacion boton de registro se habilita al completar los campos obligatorios', async ({ page }) => {


  await regPage.completarFormularioRegistro(TestData.usuarioValido.firstname, 'Doe', 'jhon.Doe@gmail.com', 'jdoe123');

 await expect  (regPage.registerButton).toBeEnabled();
});

test('TC-04 Verificacion redireccionamiento a pagina de inicio de sesion al hacer clic en boton de inisio sesion', async ({ page }) => {

  await regPage.loginButton.click();

   await regPage.visitarPaginaLogin();
   await page.waitForTimeout(5000);
});

test('TC-05 Verificar registro exitoso con datos validos', async ({ page }) => {

  test.step('Completar formulario de registro con datos validos', async () => {

    const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' +(TestData.usuarioValido.email.split('@')[1]) ;
    TestData.usuarioValido.email = email;
    await regPage.completarFormularioRegistroJson(TestData.usuarioValido);
  });

// await regPage.completarFormularioRegistro('Jhon', 'Doe', 'jhon.Doe1' + Date.now().toString() +'@gmail.com', 'jdoe123');

 await regPage.registerButton.click();

 await expect (page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-06 Verificar que un usuario no pueda registrarse con un email existente', async ({ page }) => {
  
  // const email1 =  'jhon.Doe1' + Date.now().toString() +'@gmail.com';

  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' +(TestData.usuarioValido.email.split('@')[1]) ;

 await regPage.completarFormularioRegistro('Jhon', 'Doe', email, 'jdoe123');

 await regPage.registerButton.click();

 await expect (page.getByText('Registro exitoso')).toBeVisible();

  await regPage.visitarPaginaRegistro(); 

 await regPage.completarFormularioRegistro('Jhon', 'Doe', email, 'jdoe123');

 await regPage.registerButton.click();

 await expect (page.getByText('Email already in use')).toBeVisible();
await expect (page.getByText('Registro exitoso')).not.toBeVisible();

});
