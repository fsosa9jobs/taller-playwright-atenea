import { expect, APIRequestContext } from "@playwright/test";
import TestData from '../data/testData.json';
import { log } from "console";

export class BackendUtils
{
  static async crearUsuarioPorAPI(request: APIRequestContext, usuario: any, esNuevo: boolean = true ) {

    let email :string = '';

    console.log(usuario);

    if(esNuevo)
    {
       email = (usuario.email.split('@'))[0] + Math.floor(Math.random() * 1000) + '@' + usuario.email.split('@')[1];
    }
    else
    {
      email = usuario.email;
    }

        const datosEnvio = {
                firstName: usuario.firstName,
                lastName: usuario.lastName,
                email: email,
                password: usuario.password,
            }

        const response = await request.post('http://localhost:6007/api/auth/signup', {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            data: datosEnvio,
        })
        expect(response.status()).toBe(201);
        return { email: email, password: usuario.password, firstName: usuario.firstName, lastName: usuario.lastName}
    }

  static async enviarRequestDeBackend(request: APIRequestContext, endpoint: string, email: string)
  {
    // Create a repository.

  const response = await request.post(endpoint, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    data: {
      firstName: TestData.usuarioValido.firstName,
      lastName: TestData.usuarioValido.lastName,
      email: email,
      password: TestData.usuarioValido.password,
    },
  });
  }

}
