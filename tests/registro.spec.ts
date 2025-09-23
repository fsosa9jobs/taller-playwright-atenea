import { test, expect } from '@playwright/test';


test('TC-01 Verificacion de elementos visuales en la pagina registro', async ({ page }) => {
  await page.goto('http://localhost:3000/'); 

  await expect (page.locator('input[name="firstName"]')).toBeVisible();
  await expect (page.locator('input[name="lastName"]')).toBeVisible();
  await expect (page.locator('input[name="email"]')).toBeVisible();
  await expect (page.locator('input[name="password"]')).toBeVisible();

  await expect  (page.getByTestId('boton-registrarse')).toBeVisible();

});

test('TC-02 Verificacion boton de registro esta inhabilitado por defecto', async ({ page }) => {
  await page.goto('http://localhost:3000/'); 

  await expect  (page.getByTestId('boton-registrarse')).toBeDisabled();

  await expect  (page.getByTestId('boton-registrarse')).toBeVisible();

});

test('TC-03 Verificacion boton de registro se habilita al completar los campos obligatorios', async ({ page }) => {
  await page.goto('http://localhost:3000/'); 

 await page.locator('input[name="firstName"]').fill('Jhon');
 await page.locator('input[name="lastName"]').fill('Doe');
 await page.locator('input[name="email"]').fill('jhon.Doe@gmail.com');
 await page.locator('input[name="password"]').fill('jdoe123');

 await expect  (page.getByTestId('boton-registrarse')).toBeEnabled();
});

test('TC-04 Verificacion redireccionamiento a pagina de inicio de sesion al hacer clic en boton de inisio sesion', async ({ page }) => {
  await page.goto('http://localhost:3000/'); 

  await page.getByTestId('boton-login-header-signup').click();

   await page.goto('http://localhost:3000/Login'); 
   await page.waitForTimeout(5000);
});

test('TC-05 Verificar registro exitoso con datos validos', async ({ page }) => {
  await page.goto('http://localhost:3000/'); 

 await page.locator('input[name="firstName"]').fill('Jhon');
 await page.locator('input[name="lastName"]').fill('Doe');
 await page.locator('input[name="email"]').fill('jhon.Doe1' + Date.now().toString() +'@gmail.com');
 await page.locator('input[name="password"]').fill('jdoe123');

 await page.getByTestId('boton-registrarse').click();

 await expect (page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-06 Verificar que un usuario no pueda registrarse con un email existente', async ({ page }) => {
  
  const email =  'jhon.Doe1' + Date.now().toString() +'@gmail.com';

  await page.goto('http://localhost:3000/');

 await page.locator('input[name="firstName"]').fill('Jhon');
 await page.locator('input[name="lastName"]').fill('Doe');
 await page.locator('input[name="email"]').fill(email);
 await page.locator('input[name="password"]').fill('jdoe123');

 await page.getByTestId('boton-registrarse').click();

 await expect (page.getByText('Registro exitoso')).toBeVisible();

  await page.goto('http://localhost:3000/');

 await page.locator('input[name="firstName"]').fill('Jhon');
 await page.locator('input[name="lastName"]').fill('Doe');
 await page.locator('input[name="email"]').fill(email);
 await page.locator('input[name="password"]').fill('jdoe123');

 await page.getByTestId('boton-registrarse').click();

 await expect (page.getByText('Email already in use')).toBeVisible();
await expect (page.getByText('Registro exitoso')).not.toBeVisible();

});
