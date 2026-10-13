// Importamos el modelo: sigue siendo el único que habla con MySQL.
import ProfesorModel from "../models/ProfesorModel.js";

// Importamos la entidad Profesor: la usamos acá para armar objetos
// antes de guardarlos, y para aprovechar sus métodos
// (validar, esJubilable) sin repetir esa lógica en el controlador.
import Profesor from "../entities/Profesor.js";

// ============================================================================
// GET /profesores/listar  ->  RUTA PÚBLICA (NO pide token)
// ============================================================================
// Devuelve todos los profesores. Si se pasa ?id=X por query,
// devuelve solamente ese profesor.
// Esta ruta es PÚBLICA a propósito: cualquiera puede consultar sin loguearse.
// No pasa por el middleware verificarToken, así que no necesita header Authorization.
const consultar = async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      // El modelo ya nos devuelve una instancia de Profesor (o null).
      const profesor = await ProfesorModel.obtenerPorId(id);

      if (!profesor) {
        return res.status(404).json({
          mensaje: `No se encontro un profesor con id ${id}`,
        });
      }

      // res.json llama automáticamente a profesor.toJSON() por dentro,
      // así que "data" sale con la forma que definimos en la entidad.
      // Además aprovechamos el método esJubilable() de la entidad,
      // como ejemplo de comportamiento propio del objeto.
      return res.json({
        mensaje: "consulta profesor",
        data: profesor,
        jubilable: profesor.esJubilable(),
      });
    }

    // obtenerTodos devuelve un array de instancias de Profesor.
    const profesores = await ProfesorModel.obtenerTodos();

    res.json({
      mensaje: "consulta profesores",
      data: profesores,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar profesores",
      error: error.message,
    });
  }
};

// ============================================================================
// POST /profesores/alta  ->  RUTA PROTEGIDA (SÍ pide token Bearer)
// ============================================================================
// Recibe nombre, apellido, edad y materia por body y crea un profesor nuevo.
//
// SEGURIDAD: Esta función solo se ejecuta si el middleware verificarToken
// ya validó el header "Authorization: Bearer <token>".
// Si el token falta, es inválido o expiró, el middleware responde 401
// y esta función NUNCA llega a ejecutarse. Ver routes/profesoresRoutes.js: router.post("/alta", verificarToken, ingresar)
// Dentro de esta función podés acceder a req.usuario (payload del token) si necesitás saber quién hizo la petición.
// Ejemplo: console.log("Creado por:", req.usuario.username);
const ingresar = async (req, res) => {
  try {
    const { nombre, apellido, edad, materia } = req.body;

    // Armamos una instancia de Profesor con los datos crudos del body.
    // El id va en null porque todavía no existe en la base de datos.
    const nuevoProfesor = new Profesor(null, nombre, apellido, edad, materia);

    // En vez de validar "a mano" con ifs sueltos en el controlador,
    // le delegamos la validación a la propia entidad. Si algo está
    // mal, profesor.validar() lanza un Error (throw).
    try {
      nuevoProfesor.validar();
    } catch (errorValidacion) {
      // Atajamos específicamente el error de validación acá,
      // para responder 400 (pedido mal formado) en vez de 500.
      return res.status(400).json({
        mensaje: errorValidacion.message,
      });
    }

    // Si la validación pasó, le pedimos al modelo que lo guarde.
    // El modelo devuelve una nueva instancia de Profesor con el id real.
    const profesorGuardado = await ProfesorModel.crear(nuevoProfesor);

    res.status(201).json({
      mensaje: "ingreso profesor",
      data: profesorGuardado,
      // Info de auditoría: quién lo creó (viene del token Bearer)
      creadoPor: req.usuario ? req.usuario.username : "desconocido",
    });
  } catch (error) {
    // Este catch atrapa errores "reales" (de conexión, de la query),
    // distintos del error de validación de arriba.
    res.status(500).json({
      mensaje: "Error al ingresar profesor",
      error: error.message,
    });
  }
};

// ============================================================================
// PUT /profesores/modificar  ->  RUTA PROTEGIDA (SÍ pide token Bearer)
// ============================================================================
// Recibe id (obligatorio) y los campos que se quieran actualizar por body.
//
// SEGURIDAD: Protegida con verificarToken. Solo usuarios con token válido pueden editar.
// Si intentás hacer PUT sin header Authorization: Bearer <token>, el servidor responde:
//   401 { mensaje: "Acceso denegado. No se proporcionó token..." }
// Flujo:  req -> verificarToken (valida) -> actualizar (esta función) -> res
// req.usuario contiene el payload del token (ej: { username: "admin", iat, exp })
const actualizar = async (req, res) => {
  try {
    const { id, nombre, apellido, edad, materia } = req.body;

    if (!id) {
      return res.status(400).json({
        mensaje: "el id es obligatorio para modificar un profesor",
      });
    }

    // Traemos el profesor actual como instancia de Profesor.
    const profesorActual = await ProfesorModel.obtenerPorId(id);

    if (!profesorActual) {
      return res.status(404).json({
        mensaje: `No se encontro un profesor con id ${id}`,
      });
    }

    // Armamos una NUEVA instancia de Profesor combinando lo que vino
    // en el body con lo que ya había en la base (actualización parcial).
    const profesorActualizado = new Profesor(
      profesorActual.id,
      nombre !== undefined ? nombre : profesorActual.nombre,
      apellido !== undefined ? apellido : profesorActual.apellido,
      edad !== undefined ? edad : profesorActual.edad,
      materia !== undefined ? materia : profesorActual.materia
    );

    // Volvemos a usar la validación de la entidad, para no permitir
    // que una actualización deje nombre/apellido vacíos.
    try {
      profesorActualizado.validar();
    } catch (errorValidacion) {
      return res.status(400).json({
        mensaje: errorValidacion.message,
      });
    }

    // Le pedimos al modelo que persista los cambios en la base.
    const resultado = await ProfesorModel.actualizar(id, profesorActualizado);

    res.json({
      mensaje: "modificacion profesores",
      data: resultado,
      modificadoPor: req.usuario ? req.usuario.username : "desconocido",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar profesor",
      error: error.message,
    });
  }
};

// ============================================================================
// DELETE /profesores/eliminar  ->  RUTA PROTEGIDA (SÍ pide token Bearer)
// ============================================================================
// Recibe id en la URL (y admite también el body para clientes anteriores).
//
// SEGURIDAD: Protegida con verificarToken. Solo con token válido se puede borrar.
// Sin token: 401 Unauthorized. Con token expirado: 401 Token expirado.
// Esta es la operación más sensible, por eso exigimos autenticación.
// El middleware ya verificó el token antes de llegar acá, así que podés confiar
// que req.usuario es válido. Si querés loguear quién borró, usá req.usuario.username.
const borrar = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;

    if (!id) {
      return res.status(400).json({
        mensaje: "el id es obligatorio para eliminar un profesor",
      });
    }

    const seElimino = await ProfesorModel.eliminar(id);

    if (!seElimino) {
      return res.status(404).json({
        mensaje: `No se encontro un profesor con id ${id}`,
      });
    }

    res.json({
      mensaje: "eliminacion profesores",
      eliminadoPor: req.usuario ? req.usuario.username : "desconocido",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar profesor",
      error: error.message,
    });
  }
};

// Exportamos las 4 funciones del controlador, agrupadas en un objeto.
export default { consultar, ingresar, actualizar, borrar };
