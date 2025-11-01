const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload");

const {
  entradaRopa,
  entradaRopaExistente, 
  listarRopaController,
  entradaComestible,
  entradaComestibleExistente,
  listarComestiblesController,
  listarMovimientosRopaController,
  listarMovimientosComestibleController,
  buscarRopaController,
  buscarComestibleController,
  actualizarComestibleController,
  actualizarRopaController,
  eliminarRopaController,
  eliminarComestibleController,
  salidaRopaController,
  salidaComestibleController,
} = require("../Controllers/inventarioController");

// --- ROPA ---
router.get("/ropa", listarRopaController);
router.get("/ropa/buscar", buscarRopaController);
router.post("/ropa/entrada", upload.single("imagen"), entradaRopa);
router.put("/ropa/actualizar", upload.single("imagen"), actualizarRopaController);
router.post("/ropa/entrada-existente", entradaRopaExistente); // 👈 para producto ya existente

// --- COMESTIBLES ---
router.get("/comestibles", listarComestiblesController);
router.get("/comestibles/buscar", buscarComestibleController);
router.put("/comestibles/actualizar", upload.single("imagen"), actualizarComestibleController);
router.post("/comestibles/entrada", upload.single("imagen"), entradaComestible);
router.post("/comestibles/entrada-existente", entradaComestibleExistente); // 👈 para producto ya existente

router.delete("/ropa/:id", eliminarRopaController);
router.delete("/comestible/:id", eliminarComestibleController);

// routes/inventario.js
router.get("/movimientos/ropa", listarMovimientosRopaController);
router.get("/movimientos/comestibles", listarMovimientosComestibleController);

// SALIDAS
router.post("/salida-ropa", salidaRopaController);
router.post("/salida-comestible", salidaComestibleController);


module.exports = router;

