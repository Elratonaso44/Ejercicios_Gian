import pool from "../config/conexion.js";

import Estudiante from "../entities/Estudiante.js";

const filaAalumno = (fila) => {
  return new Estudiante(fila.id_estudiante, fila.nombre, fila.apellido, fila.curso, fila.carrera, fila.edad);
}

const obtenerTodos = async () => {
  const [rows] = await pool.query("SELECT * FROM estudiantes");
  return rows.map(filaAalumno);
}

const obtenerPorId = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM estudiantes WHERE id_estudiante = ?",
    [id]
  );

  if (rows.length === 0) return null;

  return filaAalumno(rows[0]);
}

const crear = async (estudiante) => {
  const { nombre, apellido, curso, carrera, edad } = estudiante;

  const [result] = await pool.query(
    "INSERT INTO estudiantes (nombre, apellido, curso, carrera, edad) VALUES (?,?,?,?,?)",
    [nombre, apellido, curso, carrera, edad]
  );

  return new Estudiante(result.insertId, nombre, apellido, curso, carrera, edad);
}

const actualizar = async (id, estudiante) => {
  const { nombre, apellido, curso, carrera, edad } = estudiante;

  await pool.query(
    "UPDATE estudiantes SET nombre = ?, apellido = ?, curso = ?, carrera = ?, edad = ? WHERE id_estudiante = ?",
    [nombre, apellido, curso, carrera, edad, id]
  )

  return new Estudiante(Number(id), nombre, apellido, curso, carrera, edad);

};

const eliminar = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM estudiantes WHERE id_estudiante = ?",
    [id]
  )

  return result.affectedRows > 0;
}

export default { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
