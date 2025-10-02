const {
  registrarEntradaRopa,
  registrarEntradaComestible,
  listarRopa,
  listarComestibles,
} = require("../Models/inventario");

// --- ROPA ---
async function entradaRopa(req, res) {
  try {
    const imagen = req.file ? `/images/${req.file.filename}` : null; // URL accesible
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235", imagen };
    const registro = await registrarEntradaRopa(data);
    res.json(registro);
  } catch (err) {
    console.error("❌ Error al registrar entrada de ropa:", err);
    res.status(500).json({ message: "Error al registrar entrada de ropa" });
  }
}

async function listarRopaController(req, res) {
  try {
    const productos = await listarRopa();
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al listar ropa deportiva" });
  }
}

// --- COMESTIBLES ---

async function entradaComestible(req, res) {
  try {
    const imagen = req.file ? `/images/${req.file.filename}` : null;
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235", imagen };
    const registro = await registrarEntradaComestible(data);
    res.json(registro);
  } catch (err) {
    console.error("❌ Error al registrar entrada de comestibles:", err);
    res.status(500).json({ message: "Error al registrar entrada de comestibles" });
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
  listarRopaController,
  entradaComestible,
  listarComestiblesController,
};
