// 📂 routes/infoEmpresaRoutes.js
const express = require("express");
const { fetchInfoEmpresa, updateEmpresa } = require("../Controllers/empresaController");
const { verifyToken } = require("../middleware/authMiddleware"); // middleware JWT

const router = express.Router();

// 📌 Rutas de infoEmpresa
router.get("/", verifyToken, fetchInfoEmpresa);
router.put("/", verifyToken, updateEmpresa);

module.exports = router;
