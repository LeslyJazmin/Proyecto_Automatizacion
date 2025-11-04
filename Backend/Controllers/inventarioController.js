const {
  registrarEntradaRopa,
  registrarEntradaComestible,
  registrarEntradaRopaExistente,
  registrarEntradaComestibleExistente,
  registrarSalidaRopa,
  registrarSalidaComestible,
  listarRopa,
  listarComestibles,
  listarMovimientosRopa,
  listarMovimientosComestible,
  buscarRopa,
  buscarComestible,
  actualizarRopa,
  actualizarComestible,
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
    const data = { 
      ...req.body, 
      id_usuario: req.user?.id || "ADM2235", 
      imagen,
      fecha_vencimiento: req.body.fecha_vencimiento // ✅ agregado
    };
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

// --- ACTUALIZAR COMESTIBLE (editar peso, litros o fecha de vencimiento según corresponda) ---
async function actualizarComestibleController(req, res) {
  try {
    const { 
      id_comestible, 
      marca, 
      sabor, 
      peso, 
      litros, 
      ubicacion, 
      precio, 
      fecha_vencimiento
    } = req.body;

    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    if (!id_comestible) {
      return res.status(400).json({ message: "Falta el id_comestible" });
    }

    // 🔍 Obtener producto actual
    const productos = await listarComestibles();
    const productoActual = productos.find(p => p.id_comestible === id_comestible);

    if (!productoActual) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // ⚖️ Determinar si el producto usa peso o litros
    let nuevoPeso = productoActual.peso;
    let nuevoLitros = productoActual.litros;

    if (productoActual.litros !== null && productoActual.litros !== 0) {
      nuevoLitros = litros ?? productoActual.litros;
      nuevoPeso = null;
    } else if (productoActual.peso !== null && productoActual.peso !== 0) {
      nuevoPeso = peso ?? productoActual.peso;
      nuevoLitros = null;
    } else {
      nuevoPeso = peso ?? null;
      nuevoLitros = litros ?? null;
    }

    // 🧾 Preparar datos para actualizar
    const data = {
      id_comestible,
      marca: marca ?? productoActual.marca,
      sabor: sabor ?? productoActual.sabor,
      peso: nuevoPeso,
      litros: nuevoLitros,
      ubicacion: ubicacion ?? productoActual.ubicacion,
      imagen: imagen ?? productoActual.imagen,
      precio: precio ?? productoActual.precio,
      fecha_vencimiento: fecha_vencimiento ?? productoActual.fecha_vencimiento // ✅ añadido
    };

    const resultado = await actualizarComestible(data);
    res.json(resultado);

  } catch (err) {
    console.error("❌ Error al actualizar comestible:", err);
    res.status(500).json({ message: "Error al actualizar comestible" });
  }
}

// --- ACTUALIZAR ROPA DEPORTIVA ---
async function actualizarRopaController(req, res) {
  try {
    const { id_ropa, nombre, marca, talla, tipo_ropa, color, ubicacion, precio } = req.body; 
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    if (!id_ropa) {
      return res.status(400).json({ message: "Falta el id_ropa" });
    }

    // Traer el producto actual
    const productos = await listarRopa();
    const ropaActual = productos.find(p => p.id_ropa === id_ropa);

    if (!ropaActual) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const data = {
      id_ropa,
      nombre: nombre ?? ropaActual.nombre,
      marca: marca ?? ropaActual.marca,
      talla: talla ?? ropaActual.talla,
      tipo_ropa: tipo_ropa ?? ropaActual.tipo_ropa,
      color: color ?? ropaActual.color,
      ubicacion: ubicacion ?? ropaActual.ubicacion,
      imagen: imagen ?? ropaActual.imagen,
      precio: precio ?? ropaActual.precio // 👈 se agrega aquí
    };

    const resultado = await actualizarRopa(data);
    res.json(resultado);

  } catch (err) {
    console.error("❌ Error al actualizar ropa:", err);
    res.status(500).json({ message: "Error al actualizar ropa" });
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
// --- SALIDA DE ROPA ---
async function salidaRopaController(req, res) {
  try {
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235" };
    const registro = await registrarSalidaRopa(data);
    res.json({ message: "✅ Salida de ropa registrada correctamente", registro });
  } catch (err) {
    console.error("❌ Error al registrar salida de ropa:", err);
    res.status(500).json({ message: err.message || "Error al registrar salida de ropa" });
  }
}

// --- SALIDA DE COMESTIBLE ---
async function salidaComestibleController(req, res) {
  try {
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235" };
    const registro = await registrarSalidaComestible(data);
    res.json({ message: "✅ Salida de comestible registrada correctamente", registro });
  } catch (err) {
    console.error("❌ Error al registrar salida de comestible:", err);
    res.status(500).json({ message: err.message || "Error al registrar salida de comestible" });
  }
}

module.exports = {
  entradaRopa,
  entradaRopaExistente,
  entradaComestible,
  entradaComestibleExistente,
  salidaRopaController,
  salidaComestibleController,
  listarRopaController,
  listarComestiblesController,
  listarMovimientosRopaController,
  listarMovimientosComestibleController,
  buscarRopaController,
  buscarComestibleController,
  actualizarComestibleController,
  actualizarRopaController,
  eliminarRopaController,      
  eliminarComestibleController,    
};
