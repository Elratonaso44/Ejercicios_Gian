import EstudianteModel from "../models/EstudianteModel.js";

import Estudiante from "../entities/Estudiante.js";

const consultar = async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      const estudiante = await EstudianteModel.obtenerPorId(id);

      if (!estudiante) {
        return res.status(404).json({
          mensaje: "No se encontro un estudiante con este id"
        });
      }

      return res.json({
        mensaje: "Consulta estudiante",
        data: estudiante,
      })
    }

    const estudiantes = await EstudianteModel.obtenerTodos();

    res.json({
      mensaje: "Consulta estudiantes",
      data: estudiantes,
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar estudiantes",
      error: error.message,
    });
  }
};

const ingresar = async (req, res) => {
  try {
    const { nombre, apellido, curso, carrera, edad } = req.body;

    const nuevoEstudiante = new Estudiante(null, nombre, apellido, curso, carrera, edad);

    try {
      nuevoEstudiante.validar();
    } catch (errorValidacion) {
      return res.status(400).json({
        mensaje: errorValidacion.message,
      });
    }

    const estudianteGuardado = await EstudianteModel.crear(nuevoEstudiante);

    res.status(201).json({
      mensaje: "Ingreso estudiante",
      data: estudianteGuardado,
      creadoPor: req.usuario ? req.usuario.username : "desconocido",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al ingresar estudiante",
      error: error.message,
    });
  }
};


const actualizar = async (req, res) => {
  try {
    const { id, nombre, apellido, curso, carrera, edad } = req.body;

    if (!id) {
      return res.status(400).json({
        mensaje: "El id es obligatorio para modificar un estudiante"
      });
    }

    const estudianteActual = await EstudianteModel.obtenerPorId(id);

    if (!estudianteActual) {
      return res.status(404).json({
        mensaje: 'No se encontro un estudiante con esta id'
      });
    }

    const estudianteActualizado = new Estudiante(
      estudianteActual.id,
      nombre !== undefined ? nombre : estudianteActual.nombre,
      apellido !== undefined ? apellido : estudianteActual.apellido,
      curso !== undefined ? curso : estudianteActual.curso,
      carrera !== undefined ? carrera : estudianteActual.carrera,
      edad !== undefined ? edad : estudianteActual.edad
    );

    try {
      estudianteActualizado.validar();
    } catch (errorValidacion) {
      return res.status(400).json({
        mensaje: errorValidacion.message,
      });
    }

    const resultado = await EstudianteModel.actualizar(id, estudianteActualizado);

    res.json({
      mensaje: "Modificación de estudiante",
      data: resultado,
      modificadoPor: req.usuario ? req.usuario.username : "desconocido",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar Estudiante",
      error: error.message,
    });
  }
};

const borrar = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;

    if (!id) {
      return res.status(400).json({
        mensaje: "El id es obligatorio para eliminar",
      });
    }

    const seElimino = await EstudianteModel.eliminar(id);

    if (!seElimino) {
      return res.status(404).json({
        mensaje: "No se encontro un estudiante con esta ID",
      });
    }

    res.json({
      mensaje: "Eliminacion estudiantes",
      eliminadoPor: req.usuario ? req.usuario.username : "desconocido",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "error al eliminar estudiante",
      error: error.message,
    });
  }
};

export default { consultar, ingresar, actualizar, borrar };
