// 📂 routes/empresaRoutes.js
const express = require("express");
const router = express.Router();
const empresaController = require("../Controllers/empresaController");
const { verifyToken, isAdmin } = require("../Middleware/authMiddleware");

// 📌 Ruta protegida para obtener la información de la empresa
router.get("/", verifyToken, isAdmin, empresaController.getInfoEmpresa);

module.exports = router;
