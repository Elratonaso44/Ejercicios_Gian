// Importamos jsonwebtoken: librería que nos permite firmar y verificar tokens JWT.
// JWT = JSON Web Token, un estándar para transmitir información segura entre partes.
import jwt from "jsonwebtoken";

// Cargamos las variables de entorno (dotenv ya se encarga automáticamente si importamos "dotenv/config",
// pero acá lo importamos explícitamente para asegurarnos que JWT_SECRET esté disponible
// aunque este archivo se cargue antes que server.js).
import "dotenv/config";

// ============================================================================
// ¿QUÉ ES UN TOKEN BEARER?
// ============================================================================
// - "Bearer" significa "portador" en inglés. Cuando un cliente (Postman, frontend)
//   manda el header "Authorization: Bearer <token>", básicamente está diciendo:
//   "Soy el portador de este token, confía en mí si el token es válido".
// - El servidor NO guarda sesiones en memoria. Solo verifica que el token esté
//   firmado con su clave secreta (JWT_SECRET). Si la firma coincide y no expiró,
//   el token es válido y deja pasar la petición.
// - Ventajas: es stateless (no ocupa memoria en el servidor), funciona entre
//   distintos dominios, y puede llevar información dentro (payload).
// ============================================================================

// Obtenemos la clave secreta desde las variables de entorno.
// Esta clave NUNCA debe subirse a GitHub ni compartirse. Es como la "llave maestra"
// que usa el servidor para firmar y verificar todos los tokens.
// Si alguien conoce esta clave, puede fabricar tokens válidos.
const JWT_SECRET = process.env.JWT_SECRET || "wachiiin";

// ----------------------------------------------------------------------------
// MIDDLEWARE: verificarToken
// ----------------------------------------------------------------------------
// Un middleware en Express es una función que se ejecuta ANTES que el controlador.
// Recibe (req, res, next):
//   - req  = la petición entrante (headers, body, params)
//   - res  = la respuesta que vamos a enviar
//   - next = función para decirle a Express "todo ok, pasa al siguiente paso
//            (siguiente middleware o controlador)". Si no llamamos next(), la
//            petición se queda trabada.
//
// Este middleware protege rutas sensibles (alta, modificar, eliminar).
// Solo deja pasar si el cliente trae un token Bearer válido.
// Si no trae token o el token es inválido/expirado, responde 401 Unauthorized.
// ----------------------------------------------------------------------------
export const verificarToken = (req, res, next) => {
  // 1) Leemos el header "Authorization" que manda el cliente.
  // Ejemplo esperado: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // Usamos optional chaining (?.) por si el header no existe (evita crash).
  const authHeader = req.headers.authorization;

  // 2) Si no hay header Authorization, el cliente ni siquiera intentó autenticarse.
  // Respondemos 401 (No autorizado) y cortamos la cadena (no llamamos next()).
  if (!authHeader) {
    return res.status(401).json({
      mensaje: "Acceso denegado. No se proporcionó token de autenticación.",
      detalle: "Debes incluir el header: Authorization: Bearer <tu_token>",
      // Tip para el usuario: cómo conseguir el token
      ayuda: "Primero hacé POST a /auth/login con { username, password } para obtener un token.",
    });
  }

  // 3) El header debe tener formato "Bearer <token>".
  // Lo separamos por espacio: parte[0] = "Bearer", parte[1] = el token real.
  const partes = authHeader.split(" ");

  // Validamos que tenga exactamente 2 partes y que la primera sea "Bearer".
  // Algunos clientes mandan mal el header (ej: "Token xyz" o solo "xyz"), así que lo chequeamos.
  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({
      mensaje: "Formato de token inválido.",
      detalle: "El header Authorization debe ser exactamente: Bearer <token>",
      recibido: authHeader,
      ejemplo: "Authorization: Bearer eyJhbGciOiJIUzI1NiIs...",
    });
  }

  // Extraemos el token (segunda parte). Ej: "eyJhbGciOiJIUzI1NiIs..."
  const token = partes[1];

  // Si por alguna razón el token viene vacío (ej: "Bearer " sin nada después)
  if (!token) {
    return res.status(401).json({
      mensaje: "Token vacío.",
      detalle: "Después de 'Bearer ' debe venir el token JWT.",
    });
  }

  // 4) Verificamos el token con la clave secreta.
  // jwt.verify() hace 3 cosas internas:
  //   a) Decodifica el token en sus 3 partes: header.payload.signature
  //   b) Verifica que la firma (signature) coincida con JWT_SECRET
  //      (si no coincide, significa que el token fue modificado o firmado con otra clave)
  //   c) Verifica que no haya expirado (campo exp del payload)
  // Si algo falla, lanza un error que atrapamos en el catch.
  try {
    // jwt.verify devuelve el payload decodificado si el token es válido.
    // Ejemplo de payload: { username: "admin", iat: 123456, exp: 123789 }
    // iat = issued at (cuándo se creó), exp = expiration (cuándo vence)
    const payload = jwt.verify(token, JWT_SECRET);

    // Guardamos el payload en req.usuario para que los controladores siguientes
    // puedan saber QUIÉN hizo la petición (ej: req.usuario.username === "admin").
    // Esto es útil para logs, auditoría, o permisos por rol en el futuro.
    req.usuario = payload;

    // ¡Token válido! Llamamos next() para que Express continúe hacia el controlador
    // protegido (ej: profesoresController.ingresar).
    next();
  } catch (error) {
    // Si entramos acá, el token es inválido por alguna razón.
    // Diferenciamos los tipos de error para dar mensajes más claros.

    // Token expirado: jwt lanza error con name === "TokenExpiredError"
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        mensaje: "Token expirado.",
        detalle: "Tu token ya venció. Volvé a hacer POST a /auth/login para obtener uno nuevo.",
        expiradoEn: error.expiredAt, // fecha/hora en que expiró
      });
    }

    // Token mal formado, firma inválida, etc: JsonWebTokenError
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        mensaje: "Token inválido.",
        detalle: "La firma del token no es válida o el token está mal formado.",
        error: error.message,
      });
    }

    // Cualquier otro error inesperado
    return res.status(401).json({
      mensaje: "No se pudo verificar el token.",
      error: error.message,
    });
  }
};

// ----------------------------------------------------------------------------
// FUNCIÓN AUXILIAR: generarToken
// ----------------------------------------------------------------------------
// Esta función NO es un middleware, es un helper que usa authController para
// crear un nuevo token cuando el usuario hace login correctamente.
//
// Recibe un payload (ej: { username: "admin" }) y devuelve un string token.
// El token tiene 3 partes separadas por puntos: header.payload.signature
// Ejemplo: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.SflKxwRJSMeKKF2QT4fwp...
//
// - header: indica algoritmo (HS256) y tipo (JWT)
// - payload: datos del usuario + iat + exp
// - signature: firma HMAC SHA256 de header+payload con JWT_SECRET
// ----------------------------------------------------------------------------
export const generarToken = (payload) => {
  // Leemos cuánto debe durar el token desde .env (ej: "2h", "1d", "30m").
  // Si no está definido, por defecto dura 2 horas.
  const expiracion = process.env.JWT_EXPIRES_IN || "2h";

  // jwt.sign() crea el token firmado.
  // Primer parámetro: payload (datos que queremos guardar dentro del token)
  // Segundo parámetro: clave secreta para firmar
  // Tercer parámetro: opciones, acá solo expiresIn
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiracion });

  // Devolvemos el token como string. El controlador se lo mandará al cliente.
  return token;
};

// Export default también para poder importarlo como import verificarToken from "..."
// (compatibilidad con distintos estilos de import).
export default verificarToken;
