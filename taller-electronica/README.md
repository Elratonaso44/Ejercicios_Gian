# Taller de electrónica

Sistema para registrar clientes, sus dispositivos y las reparaciones. Está hecho con Node.js, Express, MySQL, HTML, CSS y JavaScript.

## Instalación

Necesitás Node.js, npm y MySQL o MariaDB funcionando.

1. Crear la base y las tablas con un usuario de MySQL que tenga permiso para crear bases:

```bash
mysql -u root -p < database.sql
```

2. Copiar la configuración de ejemplo:

```bash
cp .env.example .env
```

3. Abrir `.env` y completar el usuario y la contraseña de MySQL. Cambiar `SESSION_SECRET` por una clave propia.
4. Instalar e iniciar:

```bash
npm install
npm start
```

5. Abrir `http://localhost:3000`, crear una cuenta e iniciar sesión. Para detener el servidor, presionar `Ctrl+C` en la terminal.

La base empieza sin usuarios. Para probar se puede registrar `prueba@example.com` con contraseña `prueba123` desde la pantalla o con el curl de registro. Son datos de ejemplo, no una cuenta creada automáticamente.

Las sesiones se guardan en memoria y se pierden al reiniciar el servidor; esta configuración está pensada para ejecutar el proyecto localmente.

## Tablas

- `usuarios`: personas que inician sesión. La contraseña se guarda con bcrypt.
- `clientes`: dueños de los dispositivos.
- `dispositivos`: cada uno pertenece a un cliente.
- `tipos_falla`: opciones de falla cargadas por el SQL.
- `reparaciones`: relaciona un dispositivo, un tipo de falla y el usuario que la registró.

Un cliente con dispositivos no se puede borrar hasta quitar sus dispositivos; lo mismo ocurre con un dispositivo que tenga reparaciones.

## Probar con curl

Dejá el servidor abierto y ejecutá estos comandos en otra terminal. Los IDs de ejemplo suponen una base recién creada; revisá los IDs que devuelve cada alta y reemplazalos si son distintos. `cookies.txt` guarda la sesión de prueba, no lo compartas.

Registro:

```bash
curl -i -X POST http://localhost:3000/api/auth/registro -H 'Content-Type: application/json' -d '{"nombre":"Usuario de prueba","email":"prueba@example.com","contrasena":"prueba123"}'
```

Inicio de sesión y consulta de sesión:

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"prueba@example.com","contrasena":"prueba123"}'
curl -i -b cookies.txt http://localhost:3000/api/auth/sesion
```

Clientes:

```bash
curl -i http://localhost:3000/api/clientes
curl -i http://localhost:3000/api/clientes/1
curl -i -b cookies.txt -X POST http://localhost:3000/api/clientes -H 'Content-Type: application/json' -d '{"nombre":"Ana Pérez","telefono":"123456"}'
curl -i -b cookies.txt -X PUT http://localhost:3000/api/clientes/1 -H 'Content-Type: application/json' -d '{"nombre":"Ana Pérez","telefono":"987654"}'
curl -i -b cookies.txt -X DELETE http://localhost:3000/api/clientes/1
```

Dispositivos: crear primero un cliente y usar su ID.

```bash
curl -i http://localhost:3000/api/dispositivos
curl -i http://localhost:3000/api/dispositivos/1
curl -i -b cookies.txt -X POST http://localhost:3000/api/dispositivos -H 'Content-Type: application/json' -d '{"nombre":"Radio","marca":"Sony","cliente_id":1}'
curl -i -b cookies.txt -X PUT http://localhost:3000/api/dispositivos/1 -H 'Content-Type: application/json' -d '{"nombre":"Radio portátil","marca":"Sony","cliente_id":1}'
curl -i -b cookies.txt -X DELETE http://localhost:3000/api/dispositivos/1
```

Reparaciones: crear primero un dispositivo y consultar los tipos de falla.

```bash
curl -i http://localhost:3000/api/tipos-falla
curl -i http://localhost:3000/api/reparaciones
curl -i http://localhost:3000/api/reparaciones/1
curl -i -b cookies.txt -X POST http://localhost:3000/api/reparaciones -H 'Content-Type: application/json' -d '{"dispositivo_id":1,"tipo_falla_id":1,"descripcion":"Revisar fuente","estado":"Pendiente"}'
curl -i -b cookies.txt -X PUT http://localhost:3000/api/reparaciones/1 -H 'Content-Type: application/json' -d '{"dispositivo_id":1,"tipo_falla_id":1,"descripcion":"Fuente reparada","estado":"Terminada"}'
curl -i -b cookies.txt -X DELETE http://localhost:3000/api/reparaciones/1
```

Para probar los tres CRUD juntos, dejá los DELETE para el final y ejecutalos en orden: reparación, dispositivo y cliente.

Casos de error:

```bash
curl -i -X POST http://localhost:3000/api/clientes -H 'Content-Type: application/json' -d '{"nombre":"Ana","telefono":"123"}'
curl -i -b cookies.txt -X POST http://localhost:3000/api/clientes -H 'Content-Type: application/json' -d '{"nombre":"","telefono":"123"}'
curl -i http://localhost:3000/api/clientes/999999
```

El primero responde 401 por falta de sesión, el segundo 400 por datos inválidos y el tercero 404 si ese ID no existe. Para cerrar sesión:

```bash
curl -i -b cookies.txt -X POST http://localhost:3000/api/auth/salir
```
