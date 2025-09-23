const express = require("express");
const router = express.Router();
const inventarioController = require("../Controllers/inventarioController");

router.post("/entrada", inventarioController.crearEntrada);
router.post("/salida", inventarioController.crearSalida);

module.exports = router;
