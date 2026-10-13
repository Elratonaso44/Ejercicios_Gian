import express from 'express';

import estudiantesController from "../controllers/estudiantesController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// La consulta queda pública, igual que en profesores.
router.get("/listar", estudiantesController.consultar);

// Las operaciones que escriben datos requieren un token Bearer.
router.post("/alta", verificarToken, estudiantesController.ingresar);

router.put("/modificar", verificarToken, estudiantesController.actualizar);

router.delete("/eliminar/:id", verificarToken, estudiantesController.borrar);

export default router;
