import pool from "../config/conexion.js";

const obtenerTodos = async () => {
  const [filas] = await pool.query("SELECT reparaciones.*, dispositivos.nombre AS dispositivo, tipos_falla.nombre AS tipo_falla, usuarios.nombre AS usuario FROM reparaciones JOIN dispositivos ON dispositivos.id = reparaciones.dispositivo_id JOIN tipos_falla ON tipos_falla.id = reparaciones.tipo_falla_id JOIN usuarios ON usuarios.id = reparaciones.usuario_id ORDER BY reparaciones.id DESC");
  return filas;
};
const obtenerPorId = async (id) => {
  const [filas] = await pool.query("SELECT * FROM reparaciones WHERE id = ?", [id]);
  return filas[0];
};
const crear = async (dispositivo_id, tipo_falla_id, descripcion, estado, usuarioId) => {
  const [resultado] = await pool.query("INSERT INTO reparaciones (dispositivo_id, tipo_falla_id, descripcion, estado, usuario_id) VALUES (?, ?, ?, ?, ?)", [dispositivo_id, tipo_falla_id, descripcion, estado, usuarioId]);
  return resultado.insertId;
};
const actualizar = async (id, dispositivo_id, tipo_falla_id, descripcion, estado) => {
  const [resultado] = await pool.query("UPDATE reparaciones SET dispositivo_id = ?, tipo_falla_id = ?, descripcion = ?, estado = ? WHERE id = ?", [dispositivo_id, tipo_falla_id, descripcion, estado, id]);
  return resultado.affectedRows;
};
const eliminar = async (id) => {
  const [resultado] = await pool.query("DELETE FROM reparaciones WHERE id = ?", [id]);
  return resultado.affectedRows;
};
export default { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
