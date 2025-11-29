const sql = require("mssql");
const { getPool } = require("../config/db");
const { generarIdRopa, generarIdComestible, generarIdInventario } = require("../utils/idGenerator");

// ============================================================
// 👕 REGISTRAR ENTRADA DE ROPA NUEVA
// ============================================================
async function registrarEntradaRopa(data) {
  const pool = await getPool();
  const { 
    id_ropa = generarIdRopa(), 
    nombre, 
    marca, 
    talla, 
    color, 
    precio, 
    stock_actual, 
    ubicacion, 
    imagen,
    tipo_comprobante,
    numero_comprobante,
    metodo_pago,
    monto_pagado,
    id_usuario,
    img_comp
  } = data;

  // Registrar producto
  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("nombre", sql.NVarChar(20), nombre)
    .input("marca", sql.NVarChar(20), marca)
    .input("talla", sql.NVarChar(8), talla)
    .input("color", sql.NVarChar(20), color)
    .input("precio", sql.Decimal(10, 2), precio)
    .input("stock_actual", sql.Int, stock_actual)
    .input("ubicacion", sql.NVarChar(50), ubicacion)
    .input("imagen", sql.NVarChar(255), imagen)
    .query(`
      INSERT INTO RopaDeportiva (id_ropa, nombre, marca, talla, color, precio, stock_actual, ubicacion, imagen)
      VALUES (@id_ropa, @nombre, @marca, @talla, @color, @precio, @stock_actual, @ubicacion, @imagen)
    `);

  // Registrar movimiento
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), generarIdInventario("IR"))
    .input("id_producto", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, stock_actual)
    .input("tipo_movimiento", sql.NVarChar(20), "entrada")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("metodo_pago", sql.NVarChar(20), metodo_pago)
    .input("monto_pagado", sql.Decimal(10, 2), monto_pagado)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .input("img_comp", sql.NVarChar(255), img_comp)
    .query(`
      INSERT INTO InventarioRopa
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario, @img_comp)
    `);
}

// ============================================================
// 👕 REGISTRAR ENTRADA DE ROPA EXISTENTE
// ============================================================
async function registrarEntradaRopaExistente(data) {
  const pool = await getPool();
  const { id_ropa, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp } = data;
  const idInventario = generarIdInventario("IR");

  // Actualizar stock
  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE RopaDeportiva
      SET stock_actual = stock_actual + @cantidad
      WHERE id_ropa = @id_ropa
    `);

  // Registrar movimiento
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), idInventario)
    .input("id_producto", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, cantidad)
    .input("tipo_movimiento", sql.NVarChar(20), "entrada")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("metodo_pago", sql.NVarChar(20), metodo_pago)
    .input("monto_pagado", sql.Decimal(10, 2), monto_pagado)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .input("img_comp", sql.NVarChar(255), img_comp)
    .query(`
      INSERT INTO InventarioRopa
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario, @img_comp)
    `);
}

// ============================================================
// 🍪 REGISTRAR ENTRADA DE PRODUCTO COMESTIBLE NUEVO
// ============================================================
async function registrarEntradaComestible(data) {
  const pool = await getPool();
  const { 
    id_comestible = generarIdComestible(), 
    nombre, 
    marca, 
    sabor,
    peso,
    litros,
    precio, 
    stock_actual, 
    fecha_vencimiento,
    lote,
    ubicacion, 
    imagen,
    tipo_comprobante,
    numero_comprobante,
    metodo_pago,
    monto_pagado,
    id_usuario,
    img_comp
  } = data;

  const idInventario = generarIdInventario("IC");

  // Registrar producto
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("nombre", sql.NVarChar(50), nombre)
    .input("marca", sql.NVarChar(20), marca)
    .input("sabor", sql.NVarChar(20), sabor)
    .input("peso", sql.Decimal(10, 2), peso || null)
    .input("litros", sql.Decimal(10, 2), litros || null)
    .input("precio", sql.Decimal(10, 2), precio)
    .input("stock_actual", sql.Int, stock_actual)
    .input("fecha_vencimiento", sql.Date, fecha_vencimiento)
    .input("lote", sql.NVarChar(30), lote)
    .input("fecha_creacion", sql.DateTime, new Date())
    .input("ubicacion", sql.NVarChar(50), ubicacion)
    .input("imagen", sql.NVarChar(255), imagen)
    .query(`
      INSERT INTO ProductosComestibles 
      (id_comestible, nombre, marca, sabor, peso, litros, precio, stock_actual, 
       fecha_vencimiento, lote, fecha_creacion, ubicacion, imagen)
      VALUES (@id_comestible, @nombre, @marca, @sabor, @peso, @litros, @precio, @stock_actual, 
       @fecha_vencimiento, @lote, @fecha_creacion, @ubicacion, @imagen)
    `);

  // Registrar movimiento
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), idInventario)
    .input("id_producto", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, stock_actual)
    .input("tipo_movimiento", sql.NVarChar(20), "entrada")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("metodo_pago", sql.NVarChar(20), metodo_pago)
    .input("monto_pagado", sql.Decimal(10, 2), monto_pagado)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .input("img_comp", sql.NVarChar(255), img_comp)
    .query(`
      INSERT INTO InventarioComestible
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario, @img_comp)
    `);
}

// ============================================================
// 🍪 REGISTRAR ENTRADA DE PRODUCTO COMESTIBLE EXISTENTE
// ============================================================
async function registrarEntradaComestibleExistente(data) {
  const pool = await getPool();
  const { id_comestible, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp } = data;
  const idInventario = generarIdInventario("IC");

  // Actualizar stock
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE ProductosComestibles
      SET stock_actual = stock_actual + @cantidad
      WHERE id_comestible = @id_comestible
    `);

  // Registrar movimiento
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), idInventario)
    .input("id_producto", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .input("tipo_movimiento", sql.NVarChar(20), "entrada")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("metodo_pago", sql.NVarChar(20), metodo_pago)
    .input("monto_pagado", sql.Decimal(10, 2), monto_pagado)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .input("img_comp", sql.NVarChar(255), img_comp)
    .query(`
      INSERT INTO InventarioComestible
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario, @img_comp)
    `);
}

// ============================================================
// 👕 REGISTRAR SALIDA DE PRODUCTO DE ROPA 
// ============================================================
async function registrarSalidaRopa(data) {
  const pool = await getPool();
  const { id_ropa, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario } = data;
  const idInventario = generarIdInventario("IR");

  // Verificar stock suficiente
  const stockResult = await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .query(`SELECT stock_actual FROM RopaDeportiva WHERE id_ropa = @id_ropa`);

  if (stockResult.recordset.length === 0) {
    throw new Error("Producto no encontrado");
  }

  const stockActual = stockResult.recordset[0].stock_actual;
  if (stockActual < cantidad) {
    throw new Error("Stock insuficiente");
  }

  // Restar stock
  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE RopaDeportiva
      SET stock_actual = stock_actual - @cantidad
      WHERE id_ropa = @id_ropa
    `);

  // Registrar movimiento
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), idInventario)
    .input("id_producto", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, cantidad)
    .input("tipo_movimiento", sql.NVarChar(20), "salida")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("metodo_pago", sql.NVarChar(20), metodo_pago)
    .input("monto_pagado", sql.Decimal(10, 2), monto_pagado)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .query(`
      INSERT INTO InventarioRopa
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario)
    `);
}

// ============================================================
// 🍪 REGISTRAR SALIDA DE PRODUCTO COMESTIBLE 
// ============================================================
async function registrarSalidaComestible(data) {
  const pool = await getPool();
  const { id_comestible, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario } = data;
  const idInventario = generarIdInventario("IC");

  // Verificar stock suficiente
  const stockResult = await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .query(`SELECT stock_actual FROM ProductosComestibles WHERE id_comestible = @id_comestible`);

  if (stockResult.recordset.length === 0) {
    throw new Error("Producto no encontrado");
  }

  const stockActual = stockResult.recordset[0].stock_actual;
  if (stockActual < cantidad) {
    throw new Error("Stock insuficiente");
  }

  // Restar stock
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE ProductosComestibles
      SET stock_actual = stock_actual - @cantidad
      WHERE id_comestible = @id_comestible
    `);

  // Registrar movimiento
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), idInventario)
    .input("id_producto", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .input("tipo_movimiento", sql.NVarChar(20), "salida")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("metodo_pago", sql.NVarChar(20), metodo_pago)
    .input("monto_pagado", sql.Decimal(10, 2), monto_pagado)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .query(`
      INSERT INTO InventarioComestible
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario)
    `);
}

// ============================================================
// 📦 LISTAR TODO EL INVENTARIO DE ROPA
// ============================================================
async function listarRopa() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT 
      id_ropa,
      nombre,
      marca,
      talla,
      color,
      precio,
      stock_actual,
      ubicacion,
      imagen,
      (SELECT TOP 1 img_comp FROM InventarioRopa WHERE id_producto = r.id_ropa AND img_comp IS NOT NULL ORDER BY id_inventario DESC) AS img_comp
    FROM RopaDeportiva r
    ORDER BY r.nombre
  `);
  return result.recordset;
}

// ============================================================
// 📦 LISTAR TODO EL INVENTARIO DE COMESTIBLES
// ============================================================
async function listarComestibles() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT 
      id_comestible,
      nombre,
      marca,
      sabor,
      peso,
      litros,
      precio,
      stock_actual,
      fecha_vencimiento,
      lote,
      fecha_creacion,
      ubicacion,
      imagen,
      (SELECT TOP 1 img_comp FROM InventarioComestible WHERE id_producto = c.id_comestible AND img_comp IS NOT NULL ORDER BY id_inventario DESC) AS img_comp
    FROM ProductosComestibles c
    ORDER BY c.nombre
  `);
  return result.recordset;
}

// ============================================================
// 📊 LISTAR MOVIMIENTOS DE ROPA (con filtros opcionales de año y mes)
// ============================================================
async function listarMovimientosRopa(anio = null, mes = null) {
  const pool = await getPool();
  
  let query = `
    SELECT 
      i.tipo_movimiento, 
      i.cantidad, 
      i.tipo_comprobante, 
      i.numero_comprobante, 
      i.metodo_pago, 
      i.monto_pagado,            
      u.username AS usuario, 
      r.nombre AS producto, 
      i.fecha
    FROM InventarioRopa i
    LEFT JOIN Usuarios u ON i.id_usuario = u.id_usuario
    LEFT JOIN RopaDeportiva r ON i.id_producto = r.id_ropa
  `;

  const request = pool.request();
  let whereClauses = [];

  // Solo aplicar filtros si los parámetros no son nulos
  if (anio !== null) {
    whereClauses.push(`YEAR(i.fecha) = @anio`);
    request.input("anio", sql.Int, anio);
  }
  if (mes !== null) {
    whereClauses.push(`MONTH(i.fecha) = @mes`);
    request.input("mes", sql.Int, mes);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ` + whereClauses.join(' AND ');
  }

  query += ` ORDER BY i.fecha DESC`;

  const result = await request.query(query);
  return result.recordset;
}

// ============================================================
// 📊 LISTAR MOVIMIENTOS DE COMESTIBLES (con filtros opcionales de año y mes)
// ============================================================
async function listarMovimientosComestible(anio = null, mes = null) {
  const pool = await getPool();
  
  let query = `
    SELECT 
      i.tipo_movimiento, 
      i.cantidad, 
      i.tipo_comprobante, 
      i.numero_comprobante, 
      i.metodo_pago, 
      i.monto_pagado,            
      u.username AS usuario, 
      c.nombre AS producto, 
      i.fecha
    FROM InventarioComestible i
    LEFT JOIN Usuarios u ON i.id_usuario = u.id_usuario
    LEFT JOIN ProductosComestibles c ON i.id_producto = c.id_comestible
  `;

  const request = pool.request();
  let whereClauses = [];

  // Solo aplicar filtros si los parámetros no son nulos
  if (anio !== null) {
    whereClauses.push(`YEAR(i.fecha) = @anio`);
    request.input("anio", sql.Int, anio);
  }
  if (mes !== null) {
    whereClauses.push(`MONTH(i.fecha) = @mes`);
    request.input("mes", sql.Int, mes);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ` + whereClauses.join(' AND ');
  }

  query += ` ORDER BY i.fecha DESC`;

  const result = await request.query(query);
  return result.recordset;
}

// ============================================================
// 🔍 BÚSQUEDAS
// ============================================================
async function buscarRopa(criterio) {
  const pool = await getPool();
  const result = await pool.request()
    .input("criterio", sql.NVarChar(100), `%${criterio}%`)
    .query(`
      SELECT 
        id_ropa,
        nombre,
        marca,
        talla,
        color,
        precio,
        stock_actual,
        ubicacion,
        imagen
      FROM RopaDeportiva
      WHERE nombre LIKE @criterio OR marca LIKE @criterio
      ORDER BY nombre
    `);
  return result.recordset;
}

async function buscarComestible(criterio) {
  const pool = await getPool();
  const result = await pool.request()
    .input("criterio", sql.NVarChar(200), `%${criterio}%`)
    .query(`
      SELECT 
        id_comestible,
        nombre,
        marca,
        sabor,
        peso,
        litros,
        precio,
        stock_actual,
        fecha_vencimiento,
        lote,
        fecha_creacion,
        ubicacion,
        imagen
      FROM ProductosComestibles
      WHERE nombre LIKE @criterio OR marca LIKE @criterio OR sabor LIKE @criterio
      ORDER BY nombre
    `);
  return result.recordset;
}

// --- BUSCAR COMESTIBLE POR NOMBRE + LOTE ---
async function buscarComestiblePorNombreYLote(nombre, lote) {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .input("nombre", sql.NVarChar(50), nombre)
      .input("lote", sql.NVarChar(30), lote)
      .query(`
        SELECT *
        FROM ProductosComestibles
        WHERE nombre = @nombre AND lote = @lote
      `);

    return result.recordset;

  } catch (err) {
    console.error("❌ Error en buscarComestiblePorNombreYLote:", err);
    return [];
  }
}

// ============================================================
// 🛠️ ACTUALIZACIONES
// ============================================================
async function actualizarRopa(data) {
  const pool = await getPool();
  const { 
    id_ropa, 
    nombre, 
    marca, 
    talla, 
    color, 
    precio, 
    ubicacion, 
    imagen 
  } = data;

  const result = await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("nombre", sql.NVarChar(20), nombre)
    .input("marca", sql.NVarChar(20), marca)
    .input("talla", sql.NVarChar(8), talla)
    .input("color", sql.NVarChar(20), color)
    .input("precio", sql.Decimal(10, 2), precio)
    .input("ubicacion", sql.NVarChar(50), ubicacion)
    .input("imagen", sql.NVarChar(255), imagen)
    .query(`
      UPDATE RopaDeportiva
      SET 
        nombre = @nombre,
        marca = @marca,
        talla = @talla,
        color = @color,
        precio = @precio,
        ubicacion = @ubicacion,
        imagen = @imagen
      WHERE id_ropa = @id_ropa
    `);

  return { message: "✅ Ropa actualizada correctamente", rowsAffected: result.rowsAffected };
}

async function actualizarComestible(data) {
  const pool = await getPool();
  const { 
    id_comestible,
    nombre,
    marca,
    sabor,
    peso,
    litros,
    precio,
    stock_actual,
    fecha_vencimiento,
    lote,
    ubicacion,
    imagen
  } = data;

  const result = await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("nombre", sql.NVarChar(50), nombre)
    .input("marca", sql.NVarChar(20), marca)
    .input("sabor", sql.NVarChar(20), sabor)
    .input("peso", sql.Decimal(10, 2), peso)
    .input("litros", sql.Decimal(10, 2), litros)
    .input("precio", sql.Decimal(10, 2), precio)
    .input("stock_actual", sql.Int, stock_actual)
    .input("fecha_vencimiento", sql.Date, fecha_vencimiento)
    .input("lote", sql.NVarChar(30), lote)
    .input("ubicacion", sql.NVarChar(50), ubicacion)
    .input("imagen", sql.NVarChar(255), imagen)
    .query(`
      UPDATE ProductosComestibles
      SET 
        nombre = @nombre,
        marca = @marca,
        sabor = @sabor,
        peso = @peso,
        litros = @litros,
        precio = @precio,
        stock_actual = @stock_actual,
        fecha_vencimiento = @fecha_vencimiento,
        lote = @lote,
        ubicacion = @ubicacion,
        imagen = @imagen
      WHERE id_comestible = @id_comestible
    `);

  return { message: "✅ Comestible actualizado correctamente", rowsAffected: result.rowsAffected };
}

// ============================================================
// 🗑️ ELIMINACIONES
// ============================================================
async function eliminarRopa(id) {
  const pool = await getPool();
  
  // Eliminar movimientos relacionados
  await pool.request()
    .input("id_producto", sql.NVarChar(7), id)
    .query(`DELETE FROM InventarioRopa WHERE id_producto = @id_producto`);
  
  // Eliminar producto
  const result = await pool.request()
    .input("id_ropa", sql.NVarChar(7), id)
    .query(`DELETE FROM RopaDeportiva WHERE id_ropa = @id_ropa`);
  
  return { message: "✅ Ropa eliminada correctamente", rowsAffected: result.rowsAffected };
}

async function eliminarComestible(id) {
  const pool = await getPool();
  
  // Eliminar movimientos relacionados
  await pool.request()
    .input("id_producto", sql.NVarChar(7), id)
    .query(`DELETE FROM InventarioComestible WHERE id_producto = @id_producto`);
  
  // Eliminar producto
  const result = await pool.request()
    .input("id_comestible", sql.NVarChar(7), id)
    .query(`DELETE FROM ProductosComestibles WHERE id_comestible = @id_comestible`);
  
  return { message: "✅ Comestible eliminado correctamente", rowsAffected: result.rowsAffected };
}

module.exports = {
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
  eliminarComestible
};