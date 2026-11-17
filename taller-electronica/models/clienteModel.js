import pool from "../config/conexion.js";

const obtenerTodos = async () => {
  const [filas] = await pool.query("SELECT * FROM clientes ORDER BY id DESC");
  return filas;
};
const obtenerPorId = async (id) => {
  const [filas] = await pool.query("SELECT * FROM clientes WHERE id = ?", [id]);
  return filas[0];
};
const crear = async (nombre, telefono) => {
  const [resultado] = await pool.query("INSERT INTO clientes (nombre, telefono) VALUES (?, ?)", [nombre, telefono]);
  return resultado.insertId;
};
const actualizar = async (id, nombre, telefono) => {
  const [resultado] = await pool.query("UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?", [nombre, telefono, id]);
  return resultado.affectedRows;
};
const eliminar = async (id) => {
  const [resultado] = await pool.query("DELETE FROM clientes WHERE id = ?", [id]);
  return resultado.affectedRows;
};
export default { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
