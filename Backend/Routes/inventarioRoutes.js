const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload");

const {
  entradaRopa,
  entradaRopaExistente, // 👈 nuevo
  listarRopaController,
  entradaComestible,
  entradaComestibleExistente, // 👈 nuevo
  listarComestiblesController,
} = require("../Controllers/inventarioController");

// --- ROPA ---
router.get("/ropa", listarRopaController);
router.post("/ropa/entrada", upload.single("imagen"), entradaRopa);
router.post("/ropa/entrada-existente", entradaRopaExistente); // 👈 para producto ya existente

// --- COMESTIBLES ---
router.get("/comestibles", listarComestiblesController);
router.post("/comestibles/entrada", upload.single("imagen"), entradaComestible);
router.post("/comestibles/entrada-existente", entradaComestibleExistente); // 👈 para producto ya existente

module.exports = router;
