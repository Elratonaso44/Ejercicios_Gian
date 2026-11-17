import Modelo from "../models/dispositivoModel.js";

const consultar = async (req, res) => {
  try {
    if (req.params.id) {
      if (!Number.isInteger(Number(req.params.id)) || Number(req.params.id) < 1) return res.status(400).json({ mensaje: "ID inválido" });
      const dato = await Modelo.obtenerPorId(req.params.id);
      if (!dato) return res.status(404).json({ mensaje: "Registro no encontrado" });
      return res.json({ data: dato });
    }
    const datos = await Modelo.obtenerTodos();
    res.json({ data: datos });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar" });
  }
};
const ingresar = async (req, res) => {
  try {
    const { nombre, marca, cliente_id } = req.body || {};
    if (typeof nombre !== "string" || !nombre.trim() || nombre.trim().length > 100 ||
      typeof marca !== "string" || !marca.trim() || marca.trim().length > 100 ||
      !Number.isInteger(Number(cliente_id)) || Number(cliente_id) < 1) return res.status(400).json({ mensaje: "Datos inválidos o incompletos" });
    const id = await Modelo.crear(nombre.trim(), marca.trim(), cliente_id);
    const dato = await Modelo.obtenerPorId(id);
    res.status(201).json({ mensaje: "Registro creado", data: dato });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") return res.status(400).json({ mensaje: "La referencia seleccionada no existe" });
    res.status(500).json({ mensaje: "Error al crear" });
  }
};
const actualizar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ mensaje: "ID inválido" });
    const { nombre, marca, cliente_id } = req.body || {};
    if (typeof nombre !== "string" || !nombre.trim() || nombre.trim().length > 100 ||
      typeof marca !== "string" || !marca.trim() || marca.trim().length > 100 ||
      !Number.isInteger(Number(cliente_id)) || Number(cliente_id) < 1) return res.status(400).json({ mensaje: "Datos inválidos o incompletos" });
    if (!(await Modelo.obtenerPorId(id))) return res.status(404).json({ mensaje: "Registro no encontrado" });
    await Modelo.actualizar(id, nombre.trim(), marca.trim(), cliente_id);
    res.json({ mensaje: "Registro actualizado", data: await Modelo.obtenerPorId(id) });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") return res.status(400).json({ mensaje: "La referencia seleccionada no existe" });
    res.status(500).json({ mensaje: "Error al actualizar" });
  }
};
const borrar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ mensaje: "ID inválido" });
    if (!(await Modelo.eliminar(id))) return res.status(404).json({ mensaje: "Registro no encontrado" });
    res.json({ mensaje: "Registro eliminado" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") return res.status(400).json({ mensaje: "No se puede borrar porque tiene registros relacionados" });
    res.status(500).json({ mensaje: "Error al eliminar" });
  }
};
export default { consultar, ingresar, actualizar, borrar };
