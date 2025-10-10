const {
  registrarEntradaRopa,
  registrarEntradaComestible,
  registrarEntradaRopaExistente,
  registrarEntradaComestibleExistente,
  listarRopa,
  listarComestibles,
  listarMovimientosRopa,
  listarMovimientosComestible,
  buscarRopa,
  buscarComestible,
  eliminarRopa,
  eliminarComestible,
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

// --- LISTAR MOVIMIENTOS ROPA ---
async function listarMovimientosRopaController(req, res) {
  try {
    const movimientos = await listarMovimientosRopa();

    const dias = [
      "Domingo", "Lunes", "Martes", "Miércoles",
      "Jueves", "Viernes", "Sábado"
    ];

    const movimientosFormateados = movimientos.map(m => {
      const fechaBD = m.fecha ? new Date(m.fecha) : null;

      const fechaFormateada = fechaBD
        ? `${dias[fechaBD.getDay()]} ${String(fechaBD.getDate()).padStart(2, "0")}/${String(fechaBD.getMonth() + 1).padStart(2, "0")}/${fechaBD.getFullYear()} - Hora: ` +
          `${String(fechaBD.getHours()).padStart(2, "0")}:${String(fechaBD.getMinutes()).padStart(2, "0")}:${String(fechaBD.getSeconds()).padStart(2, "0")}`
        : null;

      return { ...m, fecha: fechaFormateada };
    });

    res.json(movimientosFormateados);
  } catch (err) {
    console.error("❌ Error al listar movimientos de ropa:", err);
    res.status(500).json({ message: err.message });
  }
}


// --- LISTAR MOVIMIENTOS COMESTIBLE ---
async function listarMovimientosComestibleController(req, res) {
  try {
    const movimientos = await listarMovimientosComestible();

    const dias = [
      "Domingo", "Lunes", "Martes", "Miércoles",
      "Jueves", "Viernes", "Sábado"
    ];

    const movimientosFormateados = movimientos.map(m => {
      const fechaBD = m.fecha ? new Date(m.fecha) : null;

      const fechaFormateada = fechaBD
        ? `${dias[fechaBD.getDay()]} ${String(fechaBD.getDate()).padStart(2, "0")}/${String(fechaBD.getMonth() + 1).padStart(2, "0")}/${fechaBD.getFullYear()} - Hora: ` +
          `${String(fechaBD.getHours()).padStart(2, "0")}:${String(fechaBD.getMinutes()).padStart(2, "0")}:${String(fechaBD.getSeconds()).padStart(2, "0")}`
        : null;

      return { ...m, fecha: fechaFormateada };
    });

    res.json(movimientosFormateados);
  } catch (err) {
    console.error("❌ Error al listar movimientos de comestible:", err);
    res.status(500).json({ message: err.message });
  }
}

// --- BUSCAR ROPA (exacta primero, luego parcial) ---
async function buscarRopaController(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Debe ingresar un criterio de búsqueda" });

    const resultados = await buscarRopa(q);

    // Buscar coincidencia exacta
    const exacto = resultados.find(
      (r) =>
        r.id_ropa?.toLowerCase() === q.toLowerCase() ||
        r.nombre?.toLowerCase() === q.toLowerCase()
    );

    // Si hay coincidencia exacta, solo devolvemos esa
    if (exacto) {
      return res.json([exacto]);
    }

    // Si no hay coincidencia exacta, devolvemos resultados parciales
    const parciales = resultados.filter(
      (r) =>
        r.id_ropa?.toLowerCase().includes(q.toLowerCase()) ||
        r.nombre?.toLowerCase().includes(q.toLowerCase())
    );

    res.json(parciales);
  } catch (err) {
    console.error("❌ Error al buscar ropa:", err);
    res.status(500).json({ message: "Error al buscar ropa" });
  }
}

// --- BUSCAR COMESTIBLE (exacta primero, luego parcial) ---
async function buscarComestibleController(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Debe ingresar un criterio de búsqueda" });

    const resultados = await buscarComestible(q);

    const exacto = resultados.find(
      (c) =>
        c.id_comestible?.toLowerCase() === q.toLowerCase() ||
        c.nombre?.toLowerCase() === q.toLowerCase()
    );

    if (exacto) {
      return res.json([exacto]);
    }

    const parciales = resultados.filter(
      (c) =>
        c.id_comestible?.toLowerCase().includes(q.toLowerCase()) ||
        c.nombre?.toLowerCase().includes(q.toLowerCase())
    );

    res.json(parciales);
  } catch (err) {
    console.error("❌ Error al buscar comestibles:", err);
    res.status(500).json({ message: "Error al buscar comestibles" });
  }
}
// --- ELIMINAR ROPA ---
async function eliminarRopaController(req, res) {
  try {
    const { id } = req.params;
    const resultado = await eliminarRopa(id);
    res.json(resultado);
  } catch (err) {
    console.error("❌ Error al eliminar ropa:", err);
    res.status(500).json({ message: "Error al eliminar ropa" });
  }
}

// --- ELIMINAR COMESTIBLE ---
async function eliminarComestibleController(req, res) {
  try {
    const { id } = req.params;
    const resultado = await eliminarComestible(id);
    res.json(resultado);
  } catch (err) {
    console.error("❌ Error al eliminar comestible:", err);
    res.status(500).json({ message: "Error al eliminar comestible" });
  }
}

module.exports = {
  entradaRopa,
  entradaRopaExistente,
  entradaComestible,
  entradaComestibleExistente,
  listarRopaController,
  listarComestiblesController,
  listarMovimientosRopaController,
  listarMovimientosComestibleController,
  buscarRopaController,
  buscarComestibleController,
  eliminarRopaController,      
  eliminarComestibleController,    
};
