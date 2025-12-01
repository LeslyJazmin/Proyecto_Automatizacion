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
const moment = require('moment-timezone');

moment.locale('es'); 


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
    console.error("Error en entradaRopa:", err);
    res.status(500).json({ message: "Error al registrar entrada de ropa" });
  }
}

// --- ROPA EXISTENTE ---
async function entradaRopaExistente(req, res) {
  try {
    const { id_producto, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado } = req.body

    if (!id_producto) return res.status(400).json({ message: "id_producto requerido" })
    if (!cantidad) return res.status(400).json({ message: "cantidad requerida" })

    let img_comp = null
    if (req.files?.img_comp) {
      img_comp = `/uploads/ropa/comprobantes/${req.files.img_comp[0].filename}`
    }

    const data = {
      id_producto,
      cantidad: Number(cantidad),
      tipo_comprobante,
      numero_comprobante,
      metodo_pago,
      monto_pagado: monto_pagado ? Number(monto_pagado) : null,
      id_usuario: req.user?.id || "ADM2235",
      img_comp
    }

    const resp = await registrarEntradaRopaExistente(data)
    res.json(resp)
  } catch (err) {
    res.status(500).json({ message: "Error al registrar entrada existente" })
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
    console.error("Error en entradaComestible:", err);
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
    console.error("Error en entradaComestibleExistente:", err);
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

    const movimientosFormateados = movimientos.map(m => {
      if (!m.fecha) {
        return { ...m, fecha: null };
      }

      // Convertir a la zona horaria de Guatemala y formatear
      const fechaFormateada = moment(m.fecha)
        .tz("America/Lima").add(1, 'hours')
        .format("dddd DD/MM/YYYY - [Hora]: hh:mm:ss A");

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

    const movimientosFormateados = movimientos.map(m => {
      if (!m.fecha) {
        return { ...m, fecha: null };
      }

      // Convertir a la zona horaria de Guatemala y formatear
      const fechaFormateada = moment(m.fecha)
        .tz("America/Lima").add(1, 'hours')
        .format("dddd DD/MM/YYYY - [Hora]: hh:mm:ss A");

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

    // Obtener datos actuales
    const comestiblesActuales = await listarComestibles();
    const comestibleEncontrado = comestiblesActuales.find(c => c.id_comestible === id_comestible);
    if (!comestibleEncontrado) {
      return res.status(404).json({ message: "Comestible no encontrado" });
    }

    // ✅ SOLUCIÓN: Determinar qué imagen usar
    let imagen;
    
    if (req.file) {
      // Caso 1: Usuario subió un nuevo archivo (multer)
      imagen = `/uploads/comestibles/imagenes/${req.file.filename}`;
    } else if (req.files && req.files.imagen) {
      // Caso 2: Usuario subió archivo con nombre 'imagen' en array
      imagen = `/uploads/comestibles/imagenes/${req.files.imagen[0].filename}`;
    } else if (updates.imagen) {
      // Caso 3: Usuario NO subió archivo, pero envió la URL como string
      imagen = updates.imagen;
    } else {
      // Caso 4: No se envió nada → mantener la imagen existente
      imagen = comestibleEncontrado.imagen;
    }

    // ✅ FUNCIÓN HELPER: Convertir "null" string a null real
    const parseValue = (value, currentValue) => {
      if (value === "null" || value === null || value === undefined || value === "") {
        return null;
      }
      return value ?? currentValue;
    };

    const data = {
      id_comestible,
      nombre: parseValue(updates.nombre, comestibleEncontrado.nombre),
      marca: parseValue(updates.marca, comestibleEncontrado.marca),
      sabor: parseValue(updates.sabor, comestibleEncontrado.sabor),
      peso: parseValue(updates.peso, comestibleEncontrado.peso),
      litros: parseValue(updates.litros, comestibleEncontrado.litros), // ← CORREGIDO
      precio: parseValue(updates.precio, comestibleEncontrado.precio),
      stock_actual: updates.stock_actual ?? comestibleEncontrado.stock_actual,
      fecha_vencimiento: parseValue(updates.fecha_vencimiento, comestibleEncontrado.fecha_vencimiento),
      lote: parseValue(updates.lote, comestibleEncontrado.lote),
      ubicacion: parseValue(updates.ubicacion, comestibleEncontrado.ubicacion),
      imagen: imagen
    };

    const resultado = await actualizarComestible(data);
    res.json(resultado);

  } catch (err) {
    console.error("Error en actualizarComestibleController:", err);
    res.status(500).json({ message: "Error al actualizar comestible" });
  }
}

// --- ACTUALIZAR ROPA ---
async function actualizarRopaController(req, res) {
  try {
    const { id_ropa, ...updates } = req.body;

    // Obtener datos actuales
    const ropaActual = await listarRopa();
    const ropaEncontrada = ropaActual.find(r => r.id_ropa === id_ropa);
    if (!ropaEncontrada) {
      return res.status(404).json({ message: "Ropa no encontrada" });
    }

    // ✅ SOLUCIÓN: Determinar qué imagen usar
    let imagen;
    
    if (req.file) {
      // Caso 1: Usuario subió un nuevo archivo (multer)
      imagen = `/uploads/ropa/imagenes/${req.file.filename}`;
    } else if (req.files && req.files.imagen) {
      // Caso 2: Usuario subió archivo con nombre 'imagen' en array
      imagen = `/uploads/ropa/imagenes/${req.files.imagen[0].filename}`;
    } else if (updates.imagen) {
      // Caso 3: Usuario NO subió archivo, pero envió la URL como string
      imagen = updates.imagen;
    } else {
      // Caso 4: No se envió nada → mantener la imagen existente
      imagen = ropaEncontrada.imagen;
    }

    // Mismo proceso para comprobante
    let img_comp;
    if (req.files && req.files.img_comp) {
      img_comp = `/uploads/ropa/comprobantes/${req.files.img_comp[0].filename}`;
    } else if (updates.img_comp) {
      img_comp = updates.img_comp;
    } else {
      img_comp = ropaEncontrada.img_comp;
    }

    const { nombre, marca, talla, color, precio, ubicacion } = updates;

    const data = {
      id_ropa,
      nombre: nombre ?? ropaEncontrada.nombre,
      marca: marca ?? ropaEncontrada.marca,
      talla: talla ?? ropaEncontrada.talla,
      color: color ?? ropaEncontrada.color,
      precio: precio ?? ropaEncontrada.precio,
      ubicacion: ubicacion ?? ropaEncontrada.ubicacion,
      imagen: imagen // ← Ya tiene el valor correcto
    };

    const resultado = await actualizarRopa(data);
    res.json(resultado);

  } catch (err) {
    console.error("Error en actualizarRopaController:", err);
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