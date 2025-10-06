const {
  registrarEntradaRopa,
  registrarEntradaComestible,
  registrarEntradaRopaExistente,
  registrarEntradaComestibleExistente,
  listarRopa,
  listarComestibles,
} = require("../Models/inventario");

// --- ROPA NUEVA ---
async function entradaRopa(req, res) {
  try {
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235", imagen };
    const registro = await registrarEntradaRopa(data);
    res.json(registro);
  } catch (err) {
    console.error("❌ Error al registrar entrada de ropa:", err);
    res.status(500).json({ message: "Error al registrar entrada de ropa" });
  }
}

// --- ROPA EXISTENTE ---
async function entradaRopaExistente(req, res) {
  try {
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235" };
    const registro = await registrarEntradaRopaExistente(data);
    res.json(registro);
  } catch (err) {
    console.error("❌ Error al registrar entrada de ropa existente:", err);
    res.status(500).json({ message: "Error al registrar entrada de ropa existente" });
  }
}

// --- COMESTIBLE NUEVO ---
async function entradaComestible(req, res) {
  try {
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235", imagen };
    const registro = await registrarEntradaComestible(data);
    res.json(registro);
  } catch (err) {
    console.error("❌ Error al registrar entrada de comestibles:", err);
    res.status(500).json({ message: "Error al registrar entrada de comestibles" });
  }
}

// --- COMESTIBLE EXISTENTE ---
async function entradaComestibleExistente(req, res) {
  try {
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235" };
    const registro = await registrarEntradaComestibleExistente(data);
    res.json(registro);
  } catch (err) {
    console.error("❌ Error al registrar entrada de comestible existente:", err);
    res.status(500).json({ message: "Error al registrar entrada de comestible existente" });
  }
}

// --- LISTADOS ---
async function listarRopaController(req, res) {
  try {
    const productos = await listarRopa();
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al listar ropa" });
  }
}

async function listarComestiblesController(req, res) {
  try {
    const productos = await listarComestibles();
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al listar comestibles" });
  }
}

module.exports = {
  entradaRopa,
  entradaRopaExistente,
  entradaComestible,
  entradaComestibleExistente,
  listarRopaController,
  listarComestiblesController,
};
