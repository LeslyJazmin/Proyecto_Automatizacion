const express = require("express");
const router = express.Router();
const inventarioController = require("../Controllers/inventarioController");
const multer = require("multer");
const path = require("path");

// 📂 Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images")); // Guardar en public/images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `producto-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// 📥 Registrar entradas (con imagen opcional)
router.post("/entrada", upload.single("imagen"), inventarioController.crearEntrada);

// 📤 Registrar salidas
router.post("/salida", inventarioController.crearSalida);

// 📦 Obtener inventarios
router.get("/ropa", inventarioController.obtenerRopa);
router.get("/comestibles", inventarioController.obtenerComestibles);

// 🔍 Búsquedas
router.get("/buscar-ropa", inventarioController.buscarRopa);
router.get("/buscar-comestibles", inventarioController.buscarComestibles);

module.exports = router;
