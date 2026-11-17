import pool from "../config/conexion.js";

const buscarPorEmail = async (email) => {
  const [filas] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
  return filas[0];
};
const crear = async (nombre, email, contrasena) => {
  const [resultado] = await pool.query("INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)", [nombre, email, contrasena]);
  return resultado.insertId;
};
export default { buscarPorEmail, crear };
