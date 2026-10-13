// Importamos express para poder crear un "Router": un mini-servidor
// de rutas que despues montamos dentro de server.js.
import express from "express";

// Importamos el controlador de profesores, que tiene las 4 funciones
// (consultar, ingresar, actualizar, borrar) que van a manejar la logica
// de cada endpoint. Ojo con la extension ".js": es obligatoria en ESM.
import profesoresController from "../controllers/profesoresController.js";

// Importamos el middleware de autenticación Bearer.
// Este middleware verifica que el cliente haya mandado un header
// "Authorization: Bearer <token>" válido antes de dejarlo crear/editar/borrar.
// Si el token falta, está mal formado, tiene firma inválida o expiró, el
// middleware responde 401 y corta la petición (no llega al controlador).
import { verificarToken } from "../middleware/authMiddleware.js";

// Creamos una instancia de Router. A partir de aca, "router" funciona
// como un mini "app" de express, pero solo para las rutas de profesores.
const router = express.Router();

// ============================================================================
// RUTAS PÚBLICAS (NO requieren token)
// ============================================================================

// GET /profesores/listar
// Ruta PÚBLICA: cualquiera puede consultar sin necesidad de autenticarse.
// Cuando llega una petición GET a esta ruta, express ejecuta directamente
// la función "consultar" del controlador (lista todos o uno por ?id=).
// No pasamos por verificarToken, así que no pide header Authorization.
// Ejemplos:
//   GET /profesores/listar        -> lista todos
//   GET /profesores/listar?id=2   -> lista solo el id 2
router.get("/listar", profesoresController.consultar);

// ============================================================================
// RUTAS PROTEGIDAS (SÍ requieren token Bearer)
// ============================================================================
// Las siguientes 3 rutas usan el middleware verificarToken como segundo argumento.
// Flujo cuando llega una petición, por ejemplo POST /profesores/alta:
//   1) Express ve que la ruta coincide con router.post("/alta", verificarToken, ingresar)
//   2) Ejecuta primero verificarToken(req, res, next):
//      - Si el token es válido -> llama next() y continúa al siguiente paso
//      - Si el token falta/inválido/expirado -> responde 401 y CORTA (no llega a ingresar)
//   3) Si pasó el middleware, recién ahí ejecuta profesoresController.ingresar
// Esto protege operaciones que modifican datos (Crear, Editar, Borrar) y deja
// libre solo la lectura (Consultar), que es un patrón muy común en APIs REST.
// Para probar en Postman/curl, agregar header: Authorization: Bearer <token_obtenido_de_/auth/login>

// POST /profesores/alta -> PROTEGIDA con Bearer Token
// Crea un profesor nuevo. Requiere token válido.
// Body esperado: { "nombre": "Ana", "apellido": "Diaz", "edad": 35, "materia": "Matematica" }
// Header requerido: Authorization: Bearer <tu_token_jwt>
router.post("/alta", verificarToken, profesoresController.ingresar);

// PUT /profesores/modificar -> PROTEGIDA con Bearer Token
// Modifica un profesor existente. Requiere token válido.
// Body esperado: { "id": 1, "materia": "Fisica" } (id obligatorio, resto opcional)
// Header requerido: Authorization: Bearer <tu_token_jwt>
router.put("/modificar", verificarToken, profesoresController.actualizar);

// DELETE /profesores/eliminar/:id -> PROTEGIDA con Bearer Token
// Elimina un profesor. Requiere token válido y recibe el id en la URL.
// Header requerido: Authorization: Bearer <tu_token_jwt>
router.delete("/eliminar/:id", verificarToken, profesoresController.borrar);

// Exportamos el router como export default para poder importarlo
// en server.js y montarlo bajo un prefijo, por ejemplo:
// app.use("/profesores", profesoresRoutes)
export default router;
