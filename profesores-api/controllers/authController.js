// Importamos la función que genera tokens JWT desde el middleware de autenticación.
// Este helper ya viene configurado con JWT_SECRET y JWT_EXPIRES_IN del .env.
import { generarToken } from "../middleware/authMiddleware.js";

// Cargamos dotenv para leer AUTH_USER y AUTH_PASSWORD desde .env
import "dotenv/config";

// ============================================================================
// CONTROLADOR DE AUTENTICACIÓN
// ============================================================================
// Este controlador NO toca la base de datos. Su única responsabilidad es:
// 1) Verificar que username y password coincidan con los del .env
// 2) Si coinciden, generar y devolver un token JWT
// 3) Si no coinciden, devolver 401 Unauthorized
//
// En un proyecto real, acá consultarías una tabla "usuarios" en MySQL y
// compararías contraseñas hasheadas con bcrypt. Acá simplificamos con
// variables de entorno para no agregar más tablas.
// ============================================================================

// Obtenemos las credenciales válidas desde el .env.
// Si no están definidas, usamos valores por defecto para que la API siga andando
// en desarrollo, pero avisamos que conviene cambiarlas en producción.
const AUTH_USER = process.env.AUTH_USER || "admin";
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || "admin123";

// ----------------------------------------------------------------------------
// POST /auth/login
// ----------------------------------------------------------------------------
// El cliente manda por body: { "username": "admin", "password": "admin123" }
// Si son correctas, le devolvemos un token que debe usar en los headers:
//   Authorization: Bearer <token>
// Ese token le servirá para POST /profesores/alta, PUT /modificar, DELETE /eliminar
// ----------------------------------------------------------------------------
const login = async (req, res) => {
  try {
    // Extraemos username y password del body del request.
    // El cliente debe mandar JSON con Content-Type: application/json
    const { username, password } = req.body;

    // Validación básica: si faltan campos, devolvemos 400 Bad Request.
    // 400 = el cliente mandó mal la petición (falta info obligatoria).
    if (!username || !password) {
      return res.status(400).json({
        mensaje: "Faltan credenciales.",
        detalle: "Tenes que enviar username y password en el body.",
        ejemplo: { username: "admin", password: "admin123" },
      });
    }

    // Comparamos lo que mandó el cliente con lo que tenemos en .env.
    // Usamos comparación estricta (===) para evitar coerciones raras.
    // En un proyecto real acá harías: SELECT * FROM usuarios WHERE username = ? y luego bcrypt.compare()
    const credencialesValidas = username === AUTH_USER && password === AUTH_PASSWORD;

    // Si no coinciden, devolvemos 401 Unauthorized.
    // 401 = no estás autenticado (credenciales incorrectas).
    // No decimos si falló el usuario o la contraseña por seguridad (no dar pistas a atacantes).
    if (!credencialesValidas) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas.",
        detalle: "Usuario o contraseña incorrectos.",
      });
    }

    // ¡Credenciales correctas! Generamos el payload del token.
    // El payload es la info que va DENTRO del token y que luego podremos leer en
    // req.usuario después que el middleware verifique el token.
    // Acá guardamos solo username, pero podrías agregar rol, id, email, etc.
    // OJO: nunca guardes la contraseña en el payload, porque el token se puede decodificar fácilmente
    // (la firma es segura, pero el payload es solo base64, no encriptado).
    const payload = {
      username: username,
      // Podrías agregar más datos si querés:
      // rol: "admin",
      // emitidoEn: new Date().toISOString(),
    };

    // Generamos el token firmado. Esta función usa JWT_SECRET y JWT_EXPIRES_IN del .env.
    // El token será un string largo con 3 partes: header.payload.signature
    const token = generarToken(payload);

    // Respondemos 200 OK con el token y datos útiles para el cliente.
    // El cliente debe guardar este token (en localStorage, memoria, etc.) y mandarlo
    // en cada petición protegida como header Authorization: Bearer <token>
    return res.json({
      mensaje: "Login exitoso.",
      token: token, // <- ¡Este es el token que el cliente debe usar!
      tipo: "Bearer", // Indica que debe usarse como "Bearer <token>"
      expiraEn: process.env.JWT_EXPIRES_IN || "2h", // cuánto dura, para que el cliente sepa cuándo renovar
      uso: "Incluí este token en el header Authorization para acceder a rutas protegidas.",
      ejemploHeader: `Authorization: Bearer ${token}` // mostramos solo inicio por brevedad
    });
  } catch (error) {
    // Si algo inesperado falla (ej: JWT_SECRET no definido y jsonwebtoken lanza error),
    // respondemos 500 Internal Server Error.
    return res.status(500).json({
      mensaje: "Error interno al intentar loguearse.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------------------------------
// GET /auth/verificar
// ----------------------------------------------------------------------------
// Ruta útil para que el cliente verifique si su token sigue válido sin hacer
// una operación real (como crear un profesor).
// Usa el middleware verificarToken, así que si llega acá es porque el token es válido.
// Devuelve el payload decodificado (username, iat, exp).
// ----------------------------------------------------------------------------
const verificar = async (req, res) => {
  // req.usuario fue seteado por el middleware verificarToken (ver authMiddleware.js)
  // Si el middleware no hubiera validado el token, esta función nunca se ejecutaría
  // porque el middleware ya habría respondido 401 y cortado la cadena.
  return res.json({
    mensaje: "Token válido.",
    usuario: req.usuario, // payload decodificado
    detalle: "Podés usar este token para acceder a POST /alta, PUT /modificar, DELETE /eliminar",
  });
};

// ----------------------------------------------------------------------------
// GET /auth/info
// ----------------------------------------------------------------------------
// Ruta pública (sin token) que explica cómo autenticarse.
// Útil para quien recién descubre la API y no sabe cómo obtener un token.
// ----------------------------------------------------------------------------
const info = async (req, res) => {
  return res.json({
    mensaje: "Información de autenticación - API de la escuela",
    pasos: [
      "1) Hacé POST a /auth/login con body { username, password }",
      "2) Copiá el token que te devuelve",
      "3) En cada petición a rutas protegidas, agregá el header Authorization: Bearer <token>",
    ],
    credencialesPorDefecto: {
      username: AUTH_USER,
      password: "**** (ver archivo .env variable AUTH_PASSWORD)",
      nota: "En producción cambiá estas credenciales en el archivo .env",
    },
    rutasProtegidas: [
      "POST /profesores/alta       -> requiere token (crear profesor)",
      "PUT /profesores/modificar   -> requiere token (editar profesor)",
      "DELETE /profesores/eliminar/:id -> requiere token (borrar profesor)",
      "POST /estudiantes/alta      -> requiere token (crear estudiante)",
      "PUT /estudiantes/modificar  -> requiere token (editar estudiante)",
      "DELETE /estudiantes/eliminar/:id -> requiere token (borrar estudiante)",
    ],
    rutasPublicas: [
      "GET /profesores/listar           -> NO requiere token (consultar)",
      "GET /profesores/listar?id=1      -> NO requiere token (consultar uno)",
      "GET /estudiantes/listar          -> NO requiere token (consultar)",
      "POST /auth/login                 -> NO requiere token (obtener token)",
      "GET /auth/info                   -> NO requiere token (esta info)",
    ],
    ejemploLogin: {
      metodo: "POST",
      url: "/auth/login",
      headers: { "Content-Type": "application/json" },
      body: { username: "<AUTH_USER>", password: "<AUTH_PASSWORD>" },
    },
    ejemploAltaProfesor: {
      metodo: "POST",
      url: "/profesores/alta",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer <TOKEN_OBTENIDO_EN_LOGIN>",
      },
      body: { nombre: "Ana", apellido: "Diaz", edad: 35, materia: "Matematica" },
    },
  });
};

// Exportamos las 3 funciones agrupadas en un objeto, igual que en profesoresController.js
// Así las rutas pueden hacer: authController.login, authController.verificar, etc.
export default { login, verificar, info };
