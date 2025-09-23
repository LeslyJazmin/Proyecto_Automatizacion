const express = require("express");
const router = express.Router();
const inventarioController = require("../Controllers/inventarioController");

router.get("/ropa", inventarioController.obtenerRopa);
router.get("/comestible", inventarioController.obtenerComestibles);

router.post("/entrada", inventarioController.crearEntrada);
router.post("/salida", inventarioController.crearSalida);

module.exports = router;
