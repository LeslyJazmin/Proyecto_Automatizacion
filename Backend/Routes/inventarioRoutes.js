const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload");

const {
  entradaRopa,
  listarRopaController,
  entradaComestible,
  listarComestiblesController,
} = require("../Controllers/inventarioController");

// --- ROPA ---
router.get("/ropa", listarRopaController);
router.post("/ropa/entrada", upload.single("imagen"), entradaRopa);

// --- COMESTIBLES ---
router.get("/comestibles", listarComestiblesController);
router.post("/comestibles/entrada", upload.single("imagen"), entradaComestible);

module.exports = router;
