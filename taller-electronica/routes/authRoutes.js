import { Router } from "express";
import authController from "../controllers/authController.js";
const router = Router();
router.post("/registro", authController.registro);
router.post("/login", authController.login);
router.get("/sesion", authController.sesion);
router.post("/salir", authController.salir);
export default router;
