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
  buscarComestiblePorNombreYLote,
  actualizarRopa,
  actualizarComestible,
  eliminarRopa,
  eliminarComestible,
} = require("../Models/inventario");

// --- ROPA NUEVA ---
async function entradaRopa(req, res) {
  try {
    // Priorizar URL enviada en el body (ej. Cloudinary); si no existe, usar archivos locales (multer)
    const imagen = req.body.imagen || (req.file ? `/uploads/ropa/imagenes/${req.file.filename}` : (req.files && req.files.imagen ? `/uploads/ropa/imagenes/${req.files.imagen[0].filename}` : null));
    let img_comp = req.body.img_comp || null;
    if (!img_comp && req.files && req.files.img_comp) {
      img_comp = `/uploads/ropa/comprobantes/${req.files.img_comp[0].filename}`;
    }
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235", imagen, img_comp };
    const registro = await registrarEntradaRopa(data);
    res.json(registro);
  } catch (err) {
    res.status(500).json({ message: "Error al registrar entrada de ropa" });
  }
}

// --- ROPA EXISTENTE ---
async function entradaRopaExistente(req, res) {
    try {
    let img_comp = req.body.img_comp || null;
    if (!img_comp && req.files && req.files.img_comp) {
      img_comp = `/uploads/ropa/comprobantes/${req.files.img_comp[0].filename}`;
    }
    const data = { ...req.body, id_usuario: req.user?.id || "ADM2235", img_comp };
    const registro = await registrarEntradaRopaExistente(data);
    res.json(registro);
  } catch (err) {
    res.status(500).json({ message: "Error al registrar entrada de ropa existente" });
  }
}

// --- COMESTIBLE NUEVO ---
async function entradaComestible(req, res) {
  try {
    // Priorizar URL enviada en el body (ej. Cloudinary); si no existe, usar archivos locales (multer)
    const imagen = req.body.imagen || (req.file ? `/uploads/comestibles/imagenes/${req.file.filename}` : (req.files && req.files.imagen ? `/uploads/comestibles/imagenes/${req.files.imagen[0].filename}` : null));
    let img_comp = req.body.img_comp || null;
    if (!img_comp && req.files && req.files.img_comp) {
      img_comp = `/uploads/comestibles/comprobantes/${req.files.img_comp[0].filename}`;
    }

    const data = { 
      ...req.body,
      lote: req.body.lote, // ⬅ NECESARIO
      id_usuario: req.user?.id || "ADM2235", 
      imagen,
      fecha_vencimiento: req.body.fecha_vencimiento,
      img_comp
    };

    const registro = await registrarEntradaComestible(data);
    res.json(registro);
  } catch (err) {
    res.status(500).json({ message: "Error al registrar entrada de comestible" });
  }
}

// --- COMESTIBLE EXISTENTE ---
async function entradaComestibleExistente(req, res) {
  try {
    let img_comp = req.body.img_comp || null;
    if (!img_comp && req.files && req.files.img_comp) {
      img_comp = `/uploads/comestibles/comprobantes/${req.files.img_comp[0].filename}`;
    }

    const data = { 
      ...req.body, 
      id_usuario: req.user?.id || "ADM2235",
      img_comp
    };

    const registro = await registrarEntradaComestibleExistente(data);
    res.json(registro);
  } catch (err) {
    res.status(500).json({ message: "Error al registrar entrada de comestible existente" });
  }
}

// --- LISTAR ROPA ---
async function listarRopaController(req, res) {
  try {
    const productos = await listarRopa();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: "Error al listar ropa" });
  }
}

// --- LISTAR COMESTIBLES ---
async function listarComestiblesController(req, res) {
  try {
    const productos = await listarComestibles();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: "Error al listar comestibles" });
  }
}

// --- LISTAR MOVIMIENTOS ROPA ---
async function listarMovimientosRopaController(req, res) {
  try {
    // Manejar correctamente los parámetros nulos o indefinidos
    const { anio, mes } = req.query;
    
    // Convertir a número si están definidos y no son nulos
    const anioNum = (anio !== undefined && anio !== null && anio !== '') ? parseInt(anio, 10) : null;
    const mesNum = (mes !== undefined && mes !== null && mes !== '') ? parseInt(mes, 10) : null;
    
    const movimientos = await listarMovimientosRopa(anioNum, mesNum);

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
    res.status(500).json({ message: err.message });
  }
}


// --- LISTAR MOVIMIENTOS COMESTIBLE ---
async function listarMovimientosComestibleController(req, res) {
  try {
    // Manejar correctamente los parámetros nulos o indefinidos
    const { anio, mes } = req.query;
    
    // Convertir a número si están definidos y no son nulos
    const anioNum = (anio !== undefined && anio !== null && anio !== '') ? parseInt(anio, 10) : null;
    const mesNum = (mes !== undefined && mes !== null && mes !== '') ? parseInt(mes, 10) : null;
    
    const movimientos = await listarMovimientosComestible(anioNum, mesNum);

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
    const exactMatch = resultados.find(r => 
      r.nombre.toLowerCase() === q.toLowerCase()
    );

    if (exactMatch) {
      return res.json([exactMatch, ...resultados.filter(r => r.id_ropa !== exactMatch.id_ropa)]);
    }

    res.json(resultados);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar ropa" });
  }
}

// --- BUSCAR COMESTIBLE (exacta primero, luego parcial) ---
async function buscarComestibleController(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Debe ingresar un criterio de búsqueda" });

    const resultados = await buscarComestible(q);

    // Buscar coincidencia exacta
    const exactMatch = resultados.find(c => 
      c.nombre.toLowerCase() === q.toLowerCase()
    );

    if (exactMatch) {
      return res.json([exactMatch, ...resultados.filter(c => c.id_comestible !== exactMatch.id_comestible)]);
    }

    res.json(resultados);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar comestible" });
  }
}

// --- BUSCAR COMESTIBLE POR NOMBRE + LOTE ---
async function buscarComestiblePorNombreYLoteController(req, res) {
  try {
    const { nombre, lote } = req.query;
    if (!nombre || !lote) return res.status(400).json({ message: "Debe ingresar nombre y lote" });

    const resultados = await buscarComestiblePorNombreYLote(nombre, lote);
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar comestible por nombre y lote" });
  }
}

// --- ACTUALIZAR COMESTIBLE ---
async function actualizarComestibleController(req, res) {
  try {
    const { id_comestible, ...updates } = req.body;

    // Si hay imagen nueva, usar esa; si no, mantener la existente
    let imagen = updates.imagen;
    if (!imagen && req.file) {
      imagen = `/uploads/comestibles/imagenes/${req.file.filename}`;
    }

    // Si hay comprobante nuevo, usar ese; si no, mantener el existente
    let img_comp = updates.img_comp;
    if (!img_comp && req.files && req.files.img_comp) {
      img_comp = `/uploads/comestibles/comprobantes/${req.files.img_comp[0].filename}`;
    }

    const data = {
      id_comestible,
      nombre: updates.nombre,
      marca: updates.marca,
      sabor: updates.sabor,
      peso: updates.peso,
      litros: updates.litros,
      precio: updates.precio,
      stock_actual: updates.stock_actual,
      fecha_vencimiento: updates.fecha_vencimiento,
      lote: updates.lote,
      ubicacion: updates.ubicacion,
      imagen: imagen,
      img_comp: img_comp
    };

    const resultado = await actualizarComestible(data);
    res.json(resultado);

  } catch (err) {
    res.status(500).json({ message: "Error al actualizar comestible" });
  }
}

// --- ACTUALIZAR ROPA ---
async function actualizarRopaController(req, res) {
  try {
    const { id_ropa, ...updates } = req.body;

    // Si hay imagen nueva, usar esa; si no, mantener la existente
    let imagen = updates.imagen;
    if (!imagen && req.file) {
      imagen = `/uploads/ropa/imagenes/${req.file.filename}`;
    }

    // Si hay comprobante nuevo, usar ese; si no, mantener el existente
    let img_comp = updates.img_comp;
    if (!img_comp && req.files && req.files.img_comp) {
      img_comp = `/uploads/ropa/comprobantes/${req.files.img_comp[0].filename}`;
    }

    const ropaActual = await listarRopa();
    const ropaEncontrada = ropaActual.find(r => r.id_ropa === id_ropa);
    if (!ropaEncontrada) {
      return res.status(404).json({ message: "Ropa no encontrada" });
    }

    const { nombre, marca, talla, color, precio, stock_actual, ubicacion } = updates;

    const data = {
      id_ropa,
      nombre: nombre ?? ropaEncontrada.nombre,
      marca: marca ?? ropaEncontrada.marca,
      talla: talla ?? ropaEncontrada.talla,
      color: color ?? ropaEncontrada.color,
      ubicacion: ubicacion ?? ropaEncontrada.ubicacion,
      imagen: imagen,
      precio: precio ?? ropaEncontrada.precio // 👈 se agrega aquí
    };

    const resultado = await actualizarRopa(data);
    res.json(resultado);

  } catch (err) {
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
  buscarComestiblePorNombreYLoteController,
  actualizarComestibleController,
  actualizarRopaController,
  eliminarRopaController,      
  eliminarComestibleController,    
};