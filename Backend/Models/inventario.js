const { getPool, sql } = require("../config/db");

// ============================================================
// 📌 FUNCIÓN PARA GENERAR ID DE 7 CARACTERES (prefijo + número)
// ============================================================
function generarIdInventario(prefijo) {
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return prefijo + random;
}

// ============================================================
// 👕 REGISTRAR ENTRADA DE ROPA NUEVA
// ============================================================
async function registrarEntradaRopa(data) {
  const pool = await getPool();
  const { 
    id_ropa, nombre, marca, talla, color, precio, stock_actual,
    tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario,
    ubicacion, imagen, img_comp
  } = data;

  const idInventario = generarIdInventario("IR");

  // Registrar producto nuevo
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
    .input("id_inventario", sql.NVarChar(7), idInventario)
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
// 🍪 REGISTRAR ENTRADA DE PRODUCTO COMESTIBLE NUEVO (con LOTE)
// ============================================================
async function registrarEntradaComestible(data) {
  const pool = await getPool(); // <-- ❗ NECESARIO

  const { 
    id_comestible, nombre, marca, sabor, peso, litros, precio, stock_actual,
    tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario,
    ubicacion, imagen, fecha_vencimiento, lote, img_comp
  } = data;

  // 🔍 VALIDACIÓN FIFO: verificar si ya existe el mismo nombre + lote
  const existe = await pool.request()
    .input("nombre", sql.NVarChar(50), nombre)
    .input("lote", sql.NVarChar(30), lote)
    .query(`
        SELECT id_comestible 
        FROM ProductosComestibles
        WHERE nombre = @nombre AND lote = @lote
    `);

  if (existe.recordset.length > 0) {
    throw new Error("❌ Ya existe un producto con el mismo nombre y el mismo lote. En FIFO el lote debe ser único.");
  }

  const idInventario = generarIdInventario("IC");

  // Registrar producto nuevo
  await pool.request()
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
      INSERT INTO ProductosComestibles 
      (id_comestible, nombre, marca, sabor, peso, litros, precio, stock_actual, fecha_vencimiento, lote, ubicacion, imagen)
      VALUES (@id_comestible, @nombre, @marca, @sabor, @peso, @litros, @precio, @stock_actual, @fecha_vencimiento, @lote, @ubicacion, @imagen)
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
  const { id_comestible, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario, fecha_vencimiento, img_comp } = data;
  const idInventario = generarIdInventario("IC");

  // Actualizar stock
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .input("fecha_vencimiento", sql.Date, fecha_vencimiento)
    .query(`
      UPDATE ProductosComestibles
      SET stock_actual = stock_actual + @cantidad,
      fecha_vencimiento = @fecha_vencimiento
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
// 📋 LISTADOS
// ============================================================
async function listarRopa() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT *
    FROM RopaDeportiva
    ORDER BY nombre
  `);
  return result.recordset;
}

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
      lote, -- ✅ agregamos explícitamente
      fecha_creacion,
      ubicacion,
      imagen
    FROM ProductosComestibles
    ORDER BY nombre
  `);
  return result.recordset;
}

async function listarMovimientosRopa() {
  const pool = await getPool();
  const result = await pool.request().query(`
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
    ORDER BY i.fecha DESC
  `);
  return result.recordset;
}

async function listarMovimientosComestible() {
  const pool = await getPool();
  const result = await pool.request().query(`
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
    ORDER BY i.fecha DESC
  `);
  return result.recordset;
}

// ============================================================
// 🔍 BÚSQUEDAS
// ============================================================
async function buscarRopa(criterio) {
  const pool = await getPool();
  const result = await pool.request()
    .input("criterio", sql.NVarChar(50), `%${criterio}%`)
    .query(`
      SELECT 
        r.id_ropa, 
        r.nombre, 
        r.marca, 
        r.talla, 
        r.color, 
        r.precio, 
        r.stock_actual, 
        r.ubicacion, 
        r.imagen, 
        r.fecha_creacion
      FROM RopaDeportiva r
      WHERE r.id_ropa LIKE @criterio OR r.nombre LIKE @criterio
    `);
  return result.recordset;
}

// Buscar comestible
async function buscarComestible(criterio) {
  const pool = await getPool();
  const result = await pool.request()
    .input("criterio", sql.NVarChar(50), `%${criterio}%`)
    .query(`
      SELECT 
        c.id_comestible, 
        c.nombre, 
        c.marca, 
        c.sabor, 
        c.peso, 
        c.litros, 
        c.precio, 
        c.stock_actual, 
        c.fecha_vencimiento, 
        c.ubicacion, 
        c.imagen, 
        c.fecha_creacion
      FROM ProductosComestibles c
      WHERE c.id_comestible LIKE @criterio OR c.nombre LIKE @criterio
    `);
  return result.recordset;
}

// ============================================================
// ✏️ ACTUALIZAR DATOS DE ROPA
// ============================================================
async function actualizarRopa(data) {
  const pool = await getPool();
  const { id_ropa, marca, talla, color, ubicacion, imagen, precio } = data;

  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("marca", sql.NVarChar(20), marca)
    .input("talla", sql.NVarChar(8), talla)
    .input("color", sql.NVarChar(20), color)
    .input("ubicacion", sql.NVarChar(50), ubicacion)
    .input("imagen", sql.NVarChar(255), imagen)
    .input("precio", sql.Decimal(10, 2), precio)
    .query(`
      UPDATE RopaDeportiva
      SET 
        marca = @marca,
        talla = @talla,
        color = @color,
        ubicacion = @ubicacion,
        imagen = @imagen,
        precio = @precio
      WHERE id_ropa = @id_ropa
    `);

  return { message: " Datos de ropa actualizados correctamente" };
}

// ============================================================
// ✏️ ACTUALIZAR DATOS DE PRODUCTO COMESTIBLE
// ============================================================
async function actualizarComestible(data) {
  const pool = await getPool();
  let { id_comestible, marca, sabor, peso, litros, ubicacion, imagen, precio,fecha_vencimiento } = data;

  peso = !isNaN(parseFloat(peso)) ? parseFloat(peso) : null;
  litros = !isNaN(parseFloat(litros)) ? parseFloat(litros) : null;

  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("marca", sql.NVarChar(20), marca)
    .input("sabor", sql.NVarChar(20), sabor)
    .input("peso", sql.Decimal(10, 2), peso)
    .input("litros", sql.Decimal(10, 2), litros)
    .input("ubicacion", sql.NVarChar(50), ubicacion)
    .input("imagen", sql.NVarChar(255), imagen)
    .input("precio", sql.Decimal(10, 2), precio)
    .input("fecha_vencimiento", sql.Date, fecha_vencimiento) 
    .query(`
      UPDATE ProductosComestibles
      SET 
        marca = @marca,
        sabor = @sabor,
        peso = @peso,
        litros = @litros,
        ubicacion = @ubicacion,
        imagen = @imagen,
        precio = @precio,
        fecha_vencimiento = @fecha_vencimiento
      WHERE id_comestible = @id_comestible
    `);

  return { message: "✅ Datos de producto comestible actualizados correctamente" };
}

// ============================================================
// 🗑️ ELIMINACIONES
// ============================================================
async function eliminarRopa(id_ropa) {
  const pool = await getPool();
  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .query(`DELETE FROM InventarioRopa WHERE id_producto = @id_ropa`);

  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .query(`DELETE FROM RopaDeportiva WHERE id_ropa = @id_ropa`);

  return { message: "🗑️ Producto de ropa y sus registros eliminados correctamente" };
}

async function eliminarComestible(id_comestible) {
  const pool = await getPool();
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .query(`DELETE FROM InventarioComestible WHERE id_producto = @id_comestible`);

  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .query(`DELETE FROM ProductosComestibles WHERE id_comestible = @id_comestible`);

  return { message: "🗑️ Producto comestible y sus registros eliminados correctamente" };
}
// ============================================================
// 👕 REGISTRAR SALIDA DE ROPA 
// ============================================================
async function registrarSalidaRopa(data) {
  const pool = await getPool();
  const { id_ropa, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario } = data;
  const idInventario = generarIdInventario("SR");

  // Verificar que haya suficiente stock
  const stockResult = await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .query(`SELECT stock_actual FROM RopaDeportiva WHERE id_ropa = @id_ropa`);
  const stockActual = stockResult.recordset[0]?.stock_actual || 0;

  if (cantidad > stockActual) {
    throw new Error("❌ No hay suficiente stock para realizar la salida");
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
  const idInventario = generarIdInventario("SC");

  // Verificar que haya suficiente stock
  const stockResult = await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .query(`SELECT stock_actual FROM ProductosComestibles WHERE id_comestible = @id_comestible`);
  const stockActual = stockResult.recordset[0]?.stock_actual || 0;

  if (cantidad > stockActual) {
    throw new Error("❌ No hay suficiente stock para realizar la salida");
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
// --- BUSCAR COMESTIBLE POR NOMBRE + LOTE ---
async function buscarComestiblePorNombreYLote(nombre, lote) {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request()
      .input("nombre", sql.NVarChar(200), nombre)
      .input("lote", sql.NVarChar(100), lote)
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