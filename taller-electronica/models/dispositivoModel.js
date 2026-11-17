import pool from "../config/conexion.js";

const obtenerTodos = async () => {
  const [filas] = await pool.query("SELECT dispositivos.*, clientes.nombre AS cliente FROM dispositivos JOIN clientes ON clientes.id = dispositivos.cliente_id ORDER BY dispositivos.id DESC");
  return filas;
};
const obtenerPorId = async (id) => {
  const [filas] = await pool.query("SELECT * FROM dispositivos WHERE id = ?", [id]);
  return filas[0];
};
const crear = async (nombre, marca, cliente_id) => {
  const [resultado] = await pool.query("INSERT INTO dispositivos (nombre, marca, cliente_id) VALUES (?, ?, ?)", [nombre, marca, cliente_id]);
  return resultado.insertId;
};
const actualizar = async (id, nombre, marca, cliente_id) => {
  const [resultado] = await pool.query("UPDATE dispositivos SET nombre = ?, marca = ?, cliente_id = ? WHERE id = ?", [nombre, marca, cliente_id, id]);
  return resultado.affectedRows;
};
const eliminar = async (id) => {
  const [resultado] = await pool.query("DELETE FROM dispositivos WHERE id = ?", [id]);
  return resultado.affectedRows;
};
export default { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
