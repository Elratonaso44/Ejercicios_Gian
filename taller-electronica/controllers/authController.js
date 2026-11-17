import bcrypt from "bcrypt";
import UsuarioModel from "../models/usuarioModel.js";

const registro = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body || {};
    if (typeof nombre !== "string" || !nombre.trim() || nombre.trim().length > 100 || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150 || typeof contrasena !== "string" || contrasena.length < 6 || Buffer.byteLength(contrasena) > 72) {
      return res.status(400).json({ mensaje: "Ingresá nombre, email válido y contraseña de al menos 6 caracteres" });
    }
    const correo = email.trim().toLowerCase();
    if (await UsuarioModel.buscarPorEmail(correo)) return res.status(400).json({ mensaje: "El email ya está registrado" });
    const hash = await bcrypt.hash(contrasena, 10);
    const id = await UsuarioModel.crear(nombre.trim(), correo, hash);
    res.status(201).json({ mensaje: "Usuario registrado", data: { id, nombre: nombre.trim(), email: correo } });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(400).json({ mensaje: "El email ya está registrado" });
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
};
const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body || {};
    if (typeof email !== "string" || typeof contrasena !== "string") return res.status(400).json({ mensaje: "Ingresá email y contraseña" });
    const usuario = await UsuarioModel.buscarPorEmail(email.trim().toLowerCase());
    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) return res.status(401).json({ mensaje: "Email o contraseña incorrectos" });
    req.session.regenerate((error) => {
      if (error) return res.status(500).json({ mensaje: "Error al iniciar sesión" });
      req.session.usuario = { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
      req.session.save((error) => {
        if (error) return res.status(500).json({ mensaje: "Error al guardar sesión" });
        res.json({ mensaje: "Sesión iniciada", data: req.session.usuario });
      });
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};
const sesion = (req, res) => res.json({ data: req.session.usuario || null });
const salir = (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ mensaje: "Error al cerrar sesión" });
    res.clearCookie("connect.sid");
    res.json({ mensaje: "Sesión cerrada" });
  });
};
export default { registro, login, sesion, salir };
