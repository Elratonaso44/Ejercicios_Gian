// Importamos express, el framework que maneja el servidor HTTP y las rutas.
import express from "express";

// Importamos cors, que permite que un frontend en otro dominio/puerto
// (por ejemplo un React en localhost:5173) pueda hacer peticiones a esta API.
import cors from "cors";

// Cargamos las variables de entorno del archivo .env (PORT, etc).
import "dotenv/config";

// Importamos el router de profesores que armamos en routes/profesoresRoutes.js.
import profesoresRoutes from "./routes/profesoresRoutes.js";
import estudiantesRoutes from "./routes/estudiantesRoutes.js";

// Importamos el router de autenticación (login, verificar, info).
// Este router maneja todo lo relacionado con tokens Bearer JWT.
import authRoutes from "./routes/authRoutes.js";

// Creamos la aplicacion de express. "app" es el objeto principal
// que representa nuestro servidor.
const app = express();

// Habilitamos CORS para todas las rutas y todos los origenes
// (para un proyecto en produccion conviene restringirlo a dominios especificos).
app.use(cors());

// Middleware que le dice a express que interprete el body de las
// peticiones como JSON y lo deje disponible en req.body.
// Sin esto, req.body llegaria undefined en los POST/PUT.
app.use(express.json());

// Montamos el router de profesores bajo el prefijo "/profesores".
// Esto significa que router.get("/listar", ...) en realidad
// responde en la ruta completa GET /profesores/listar.
app.use("/profesores", profesoresRoutes);

// Montamos el router de estudiantes bajo el prefijo "/estudiantes".
app.use("/estudiantes", estudiantesRoutes);

// Montamos el router de autenticación bajo el prefijo "/auth".
// Quedan las rutas:
//   POST /auth/login     -> público, devuelve token Bearer (no pide token previo)
//   GET  /auth/info      -> público, explica cómo autenticarse
//   GET  /auth/verificar -> protegido, verifica si tu token sigue válido
app.use("/auth", authRoutes);

// Ruta raíz simple, solo para verificar que el servidor está levantado
// entrando a http://localhost:3000/ desde el navegador.
// Además muestra un resumen de la autenticación para quien recién descubre la API.
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de la escuela funcionando",
    version: "1.2.0 - Profesores y estudiantes con autenticación Bearer JWT",
    autenticacion: {
      tipo: "Bearer JWT",
      login: "POST /auth/login con { username, password } para obtener token",
      uso: "Header Authorization: Bearer <token> en rutas protegidas",
      info: "GET /auth/info para ver documentación completa",
    },
    rutas: {
      publicas: [
        "GET /profesores/listar",
        "GET /estudiantes/listar",
        "POST /auth/login",
        "GET /auth/info",
      ],
      protegidas: [
        "POST /profesores/alta",
        "PUT /profesores/modificar",
        "DELETE /profesores/eliminar/:id",
        "POST /estudiantes/alta",
        "PUT /estudiantes/modificar",
        "DELETE /estudiantes/eliminar/:id",
      ],
    },
  });
});

// Definimos el puerto: usamos el de la variable de entorno PORT,
// o 3000 por defecto si no esta definida.
const PORT = process.env.PORT || 3000;

// Levantamos el servidor y lo dejamos escuchando peticiones en ese puerto.
// El callback se ejecuta una sola vez, cuando el servidor ya arranco.
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
