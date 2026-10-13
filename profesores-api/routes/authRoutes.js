// Importamos express para crear un Router específico para autenticación.
// Este router manejará todo lo relacionado con /auth (login, verificar, info).
import express from "express";

// Importamos el controlador de autenticación con sus 3 funciones: login, verificar, info.
import authController from "../controllers/authController.js";

// Importamos el middleware que verifica tokens. Solo lo usamos en /verificar,
// porque /login e /info deben ser públicas (no tiene sentido pedir token para loguearse).
import { verificarToken } from "../middleware/authMiddleware.js";

// Creamos el router. Es como un "mini app" de express solo para rutas /auth.
const router = express.Router();

// ----------------------------------------------------------------------------
// RUTAS PÚBLICAS (NO requieren token)
// ----------------------------------------------------------------------------

// POST /auth/login
// Ruta PÚBLICA: cualquiera puede intentar loguearse sin token previo.
// El cliente manda { username, password } y si son correctos recibe un token JWT.
// Este token es el que luego usará como "Bearer <token>" en rutas protegidas.
// Ejemplo de uso con curl:
//   curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'
router.post("/login", authController.login);

// GET /auth/info
// Ruta PÚBLICA: explica cómo funciona la autenticación de la API.
// No pide token, así que cualquiera que descubra la API puede leer cómo loguearse.
// Es como una "página de ayuda" en formato JSON.
router.get("/info", authController.info);

// ----------------------------------------------------------------------------
// RUTAS PROTEGIDAS (SÍ requieren token)
// ----------------------------------------------------------------------------

// GET /auth/verificar
// Ruta PROTEGIDA: requiere header Authorization: Bearer <token>
// Sirve para que el frontend verifique si el token que guardó sigue válido
// sin tener que hacer una operación real (como crear un profesor).
// El middleware verificarToken se ejecuta ANTES que authController.verificar:
//   1) verificarToken revisa el header, verifica firma y expiración
//   2) si es válido, llama a next() y deja pasar a authController.verificar
//   3) si es inválido, responde 401 y NUNCA llega al controlador
// Ejemplo de uso con curl:
//   curl http://localhost:3000/auth/verificar -H "Authorization: Bearer <tu_token>"
router.get("/verificar", verificarToken, authController.verificar);

// Exportamos el router para montarlo en server.js como app.use("/auth", authRoutes)
// Quedando las rutas finales: /auth/login, /auth/info, /auth/verificar
export default router;
