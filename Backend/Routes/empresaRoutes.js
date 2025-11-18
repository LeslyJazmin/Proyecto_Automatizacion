// 📂 routes/infoEmpresaRoutes.js
const express = require("express");
const { fetchInfoEmpresa, updateEmpresa } = require("../Controllers/empresaController");
const { verifyToken } = require("../Middleware/authMiddleware");

const router = express.Router();

// ▶ Ver empresa — cualquier rol con cuenta puede ver: admin, trabajador, user
router.get("/", verifyToken, fetchInfoEmpresa);

// ▶ Editar empresa — solo admin (validado dentro del controller)
router.put("/", verifyToken, updateEmpresa);

module.exports = router;
