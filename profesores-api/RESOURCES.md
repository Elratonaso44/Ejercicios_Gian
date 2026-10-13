# Recursos para aprender TypeScript y Angular con la API de profesores

## Conocimiento

- [Angular: Build your first Angular app](https://angular.dev/tutorials/first-app)
  Tutorial oficial de componentes y estructura de Angular. Usar como referencia al crear la interfaz inicial.
- [Angular: HTTP Client](https://angular.dev/guide/http)
  Documentación oficial de `HttpClient`. Usar cuando conectemos Angular con `GET /profesores/listar`.
- [Angular: configurar HttpClient](https://angular.dev/guide/http/setup)
  Explica cómo habilitar `provideHttpClient` en la configuración de la aplicación.
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
  Referencia oficial para tipos, interfaces, funciones y módulos. Consultar a medida que aparezcan en el código.
- [Compatibilidad de versiones de Angular](https://angular.dev/reference/versions)
  Tabla oficial para elegir Node.js y TypeScript compatibles antes de generar el cliente.

## Brechas

- `GET /profesores/listar` respondió 200 con dos profesores, pero cada objeto no incluye `id`. El modelo usa `fila.id` aunque la tabla expone `id_profesor`; resolver antes de implementar editar o borrar.
