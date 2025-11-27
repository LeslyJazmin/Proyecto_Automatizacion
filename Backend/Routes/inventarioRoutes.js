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
  buscarComestiblePorNombreYLoteController,
  actualizarComestibleController,
  actualizarRopaController,
  eliminarRopaController,
  eliminarComestibleController,
  salidaRopaController,
  salidaComestibleController,
} = require("../Controllers/inventarioController");

// Middleware para etiquetar tipo de producto
const setProductType = (productType) => (req, res, next) => {
  req.productType = productType;
  next();
};

// --- ROPA ---
router.get("/ropa", listarRopaController);
router.get("/ropa/buscar", buscarRopaController);
// Aceptar tanto 'imagen' como 'img_comp' (comprobante)
router.post("/ropa/entrada", setProductType("ropa"), upload.fields([{ name: 'imagen', maxCount: 1 }, { name: 'img_comp', maxCount: 1 }]), entradaRopa);
router.put("/ropa/actualizar", setProductType("ropa"), upload.fields([{ name: 'imagen', maxCount: 1 }, { name: 'img_comp', maxCount: 1 }]), actualizarRopaController);
router.post("/ropa/entrada-existente", setProductType("ropa"), entradaRopaExistente); // 👈 para producto ya existente

// --- COMESTIBLES ---
router.get("/comestibles", listarComestiblesController);
router.get("/comestibles/buscar", buscarComestibleController);
router.put("/comestibles/actualizar", setProductType("comestibles"), upload.fields([{ name: 'imagen', maxCount: 1 }, { name: 'img_comp', maxCount: 1 }]), actualizarComestibleController);
router.post("/comestibles/entrada", setProductType("comestibles"), upload.fields([{ name: 'imagen', maxCount: 1 }, { name: 'img_comp', maxCount: 1 }]), entradaComestible);
router.post("/comestibles/entrada-existente", setProductType("comestibles"), upload.fields([{ name: 'img_comp', maxCount: 1 }]), entradaComestibleExistente); // 👈 para producto ya existente
router.get(
  "/comestibles/buscar-lote",
  buscarComestiblePorNombreYLoteController
);

router.delete("/ropa/:id", eliminarRopaController);
router.delete("/comestible/:id", eliminarComestibleController);

// routes/inventario.js
router.get("/movimientos/ropa", listarMovimientosRopaController);
router.get("/movimientos/comestibles", listarMovimientosComestibleController);

// SALIDAS
router.post("/salida-ropa", salidaRopaController);
router.post("/salida-comestible", salidaComestibleController);


module.exports = router;

