# API de la escuela

API REST de profesores y estudiantes con Node.js, Express, MySQL y autenticación Bearer JWT.

## Iniciar

1. Instalar dependencias con `npm install`.
2. Crear la base de datos ejecutando `s_escuela.sql`.
3. Configurar la conexión y las credenciales de autenticación en `.env`.
4. Iniciar el servidor con `npm run dev`.

El servidor escucha en `http://localhost:3000` por defecto.

## Login y token

El login es público. Enviá el usuario y contraseña configurados localmente en `.env`:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"<AUTH_USER>","password":"<AUTH_PASSWORD>"}'
```

La respuesta incluye `token`. En las rutas protegidas mandalo en el encabezado:

```text
Authorization: Bearer <TOKEN>
```

## Profesores

`GET /profesores/listar` y `GET /profesores/listar?id=1` son públicos. Las escrituras requieren token.

| Método | Endpoint | Body |
|---|---|---|
| GET | `/profesores/listar` | — |
| POST | `/profesores/alta` | `nombre`, `apellido`, `edad`, `materia` |
| PUT | `/profesores/modificar` | `id` y campos a modificar |
| DELETE | `/profesores/eliminar/:id` | El ID va en la URL |

Ejemplo de alta:

```bash
curl -X POST http://localhost:3000/profesores/alta \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"nombre":"Ana","apellido":"Diaz","edad":35,"materia":"Matematica"}'
```

Ejemplo de modificación:

```bash
curl -X PUT http://localhost:3000/profesores/modificar \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"id":1,"materia":"Fisica"}'
```

Ejemplo de eliminación:

```bash
curl -X DELETE http://localhost:3000/profesores/eliminar/1 \
  -H 'Authorization: Bearer <TOKEN>'
```

## Estudiantes

`GET /estudiantes/listar` y `GET /estudiantes/listar?id=1` son públicos. Las escrituras requieren token.

| Método | Endpoint | Body |
|---|---|---|
| GET | `/estudiantes/listar` | — |
| POST | `/estudiantes/alta` | `nombre`, `apellido`, `curso`, `carrera`, `edad` |
| PUT | `/estudiantes/modificar` | `id` y campos a modificar |
| DELETE | `/estudiantes/eliminar/:id` | El ID va en la URL |

Ejemplo de alta:

```bash
curl -X POST http://localhost:3000/estudiantes/alta \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"nombre":"Juan","apellido":"Perez","curso":"5A","carrera":"Informatica","edad":17}'
```

También podés consultar `GET /auth/info` para ver las rutas y ejemplos de autenticación en JSON.
