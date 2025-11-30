const sql = require("mssql");
const { getPool } = require("../config/db");
const { generarIdRopa, generarIdComestible, generarIdInventario } = require("../utils/idGenerator");

// ============================================================
// REGISTRAR ENTRADA DE ROPA NUEVA
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
    .input("img_comp", sql.NVarChar(sql.MAX), img_comp || null)
    .query(`
      INSERT INTO InventarioRopa
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario, @img_comp)
    `);
}

// ============================================================
// REGISTRAR ENTRADA DE ROPA EXISTENTE
// ============================================================
async function registrarEntradaRopaExistente(data) {
  const pool = await getPool();
  const { id_ropa, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp } = data;
  const idInventario = generarIdInventario("IR");

  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE RopaDeportiva
      SET stock_actual = stock_actual + @cantidad
      WHERE id_ropa = @id_ropa
    `);

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
    .input("img_comp", sql.NVarChar(sql.MAX), img_comp || null)
    .query(`
      INSERT INTO InventarioRopa
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario, @img_comp)
    `);
}

// ============================================================
// REGISTRAR ENTRADA COMESTIBLE NUEVO
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
    .input("img_comp", sql.NVarChar(sql.MAX), img_comp || null)
    .query(`
      INSERT INTO InventarioComestible
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario, @img_comp)
    `);
}

// ============================================================
// REGISTRAR ENTRADA COMESTIBLE EXISTENTE
// ============================================================
async function registrarEntradaComestibleExistente(data) {
  const pool = await getPool();
  const { id_comestible, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp } = data;
  const idInventario = generarIdInventario("IC");

  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE ProductosComestibles
      SET stock_actual = stock_actual + @cantidad
      WHERE id_comestible = @id_comestible
    `);

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
    .input("img_comp", sql.NVarChar(sql.MAX), img_comp || null)
    .query(`
      INSERT INTO InventarioComestible
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario, img_comp)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario, @img_comp)
    `);
}

// ============================================================
// SALIDA ROPA
// ============================================================
async function registrarSalidaRopa(data) {
  const pool = await getPool();
  const { id_ropa, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario } = data;
  const idInventario = generarIdInventario("IR");

  const stockResult = await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .query(`SELECT stock_actual FROM RopaDeportiva WHERE id_ropa = @id_ropa`);

  if (stockResult.recordset.length === 0) throw new Error("Producto no encontrado");
  if (stockResult.recordset[0].stock_actual < cantidad) throw new Error("Stock insuficiente");

  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE RopaDeportiva
      SET stock_actual = stock_actual - @cantidad
      WHERE id_ropa = @id_ropa
    `);

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
// SALIDA COMESTIBLE
// ============================================================
async function registrarSalidaComestible(data) {
  const pool = await getPool();
  const { id_comestible, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario } = data;
  const idInventario = generarIdInventario("IC");

  const stockResult = await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .query(`SELECT stock_actual FROM ProductosComestibles WHERE id_comestible = @id_comestible`);

  if (stockResult.recordset.length === 0) throw new Error("Producto no encontrado");
  if (stockResult.recordset[0].stock_actual < cantidad) throw new Error("Stock insuficiente");

  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE ProductosComestibles
      SET stock_actual = stock_actual - @cantidad
      WHERE id_comestible = @id_comestible
    `);

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
// LISTAR ROPA
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
// LISTAR MOVIMIENTOS ROPA
// ============================================================
async function listarMovimientosRopa(anio, mes) {
  const pool = await getPool();
  let query = `
    SELECT 
      ir.id_inventario,
      r.nombre AS producto,
      ir.cantidad,
      ir.tipo_movimiento,
      ir.tipo_comprobante,
      ir.numero_comprobante,
      ir.metodo_pago,
      ir.monto_pagado,
      ir.fecha,
      u.username AS usuario,
      ir.img_comp
    FROM InventarioRopa ir
    JOIN RopaDeportiva r ON ir.id_producto = r.id_ropa
    LEFT JOIN Usuarios u ON ir.id_usuario = u.id_usuario
  `;

  const conditions = [];
  if (anio) conditions.push("YEAR(ir.fecha) = @anio");
  if (mes) conditions.push("MONTH(ir.fecha) = @mes");

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY ir.fecha DESC";

  const request = pool.request();
  if (anio) request.input("anio", sql.Int, anio);
  if (mes) request.input("mes", sql.Int, mes);

  const result = await request.query(query);
  return result.recordset;
}

// ============================================================
// LISTAR MOVIMIENTOS COMESTIBLE
// ============================================================
async function listarMovimientosComestible(anio, mes) {
  const pool = await getPool();
  let query = `
    SELECT 
      ic.id_inventario,
      c.nombre AS producto,
      ic.cantidad,
      ic.tipo_movimiento,
      ic.tipo_comprobante,
      ic.numero_comprobante,
      ic.metodo_pago,
      ic.monto_pagado,
      ic.fecha,
      u.username AS usuario,
      ic.img_comp
    FROM InventarioComestible ic
    JOIN ProductosComestibles c ON ic.id_producto = c.id_comestible
    LEFT JOIN Usuarios u ON ic.id_usuario = u.id_usuario
  `;

  const conditions = [];
  if (anio) conditions.push("YEAR(ic.fecha) = @anio");
  if (mes) conditions.push("MONTH(ic.fecha) = @mes");

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY ic.fecha DESC";

  const request = pool.request();
  if (anio) request.input("anio", sql.Int, anio);
  if (mes) request.input("mes", sql.Int, mes);

  const result = await request.query(query);
  return result.recordset;
}

// ============================================================
// LISTAR COMESTIBLES
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
// ACTUALIZAR ROPA
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

  return { message: "Ropa actualizada", rowsAffected: result.rowsAffected };
}

// ============================================================
// ACTUALIZAR COMESTIBLE
// ============================================================
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
    .input("peso", sql.Decimal(10, 2), peso || null)
    .input("litros", sql.Decimal(10, 2), litros || null)
    .input("precio", sql.Decimal(10, 2), precio)
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
        fecha_vencimiento = @fecha_vencimiento,
        lote = @lote,
        ubicacion = @ubicacion,
        imagen = @imagen
      WHERE id_comestible = @id_comestible
    `);

  return { message: "Comestible actualizado", rowsAffected: result.rowsAffected };
}
// ============================================================
// ELIMINAR ROPA
// ============================================================
async function eliminarRopa(id_ropa) {
  const pool = await getPool();

  // Borra primero inventario asociado
  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .query(`
      DELETE FROM InventarioRopa
      WHERE id_producto = @id_ropa
    `);

  // Borra producto
  const result = await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .query(`
      DELETE FROM RopaDeportiva
      WHERE id_ropa = @id_ropa
    `);

  if (result.rowsAffected[0] === 0) {
    throw new Error("Producto no encontrado");
  }

  return { message: "Ropa eliminada" };
}

// ============================================================
// ELIMINAR COMESTIBLE
// ============================================================
async function eliminarComestible(id_comestible) {
  const pool = await getPool();

  // Borra entradas y salidas de inventario
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .query(`
      DELETE FROM InventarioComestible
      WHERE id_producto = @id_comestible
    `);

  // Borra el producto
  const result = await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .query(`
      DELETE FROM ProductosComestibles
      WHERE id_comestible = @id_comestible
    `);

  if (result.rowsAffected[0] === 0) {
    throw new Error("Producto no encontrado");
  }

  return { message: "Comestible eliminado" };
}

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

module.exports = {
  registrarEntradaRopa,
  registrarEntradaRopaExistente,
  registrarEntradaComestible,
  registrarEntradaComestibleExistente,
  registrarSalidaRopa,
  registrarSalidaComestible,
  listarRopa,
  listarComestibles,
  listarMovimientosRopa,
  listarMovimientosComestible,
  actualizarRopa,
  actualizarComestible,
  buscarComestiblePorNombreYLote,
  buscarRopa,
  buscarComestible,
  eliminarRopa,
  eliminarComestible
};

