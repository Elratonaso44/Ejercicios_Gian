import express from "express";
import session from "express-session";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import clientesRoutes from "./routes/clientesRoutes.js";
import dispositivosRoutes from "./routes/dispositivosRoutes.js";
import reparacionesRoutes from "./routes/reparacionesRoutes.js";
import pool from "./config/conexion.js";

const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "clave-local-para-desarrollo",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 86400000 },
}));
app.use(express.static("public"));
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/dispositivos", dispositivosRoutes);
app.use("/api/reparaciones", reparacionesRoutes);
app.get("/api/tipos-falla", async (req, res) => {
  try {
    const [tipos] = await pool.query("SELECT * FROM tipos_falla ORDER BY nombre");
    res.json({ data: tipos });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar tipos de falla" });
  }
});
app.listen(process.env.PORT || 3000, () => console.log(`Servidor en http://localhost:${process.env.PORT || 3000}`));
