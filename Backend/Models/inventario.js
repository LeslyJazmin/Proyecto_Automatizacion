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
    id_ropa, nombre, marca, talla, color, precio, cantidad,
    tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario,
    ubicacion, imagen
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
    .input("cantidad", sql.Int, cantidad)
    .input("ubicacion", sql.NVarChar(50), ubicacion)
    .input("imagen", sql.NVarChar(255), imagen)
    .query(`
      INSERT INTO RopaDeportiva (id_ropa, nombre, marca, talla, color, precio, cantidad, ubicacion, imagen)
      VALUES (@id_ropa, @nombre, @marca, @talla, @color, @precio, @cantidad, @ubicacion, @imagen)
    `);

  // Registrar movimiento con monto_pagado
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
    .query(`
      INSERT INTO InventarioRopa
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario)
    `);
}


// ============================================================
// 👕 REGISTRAR ENTRADA DE ROPA EXISTENTE
// ============================================================
async function registrarEntradaRopaExistente(data) {
  const pool = await getPool();
  const { id_ropa, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario } = data;
  const idInventario = generarIdInventario("IR");

  // Actualizar stock
  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE RopaDeportiva
      SET cantidad = cantidad + @cantidad
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
    .query(`
      INSERT INTO InventarioRopa
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario)
    `);
}


// ============================================================
// 🍪 REGISTRAR ENTRADA DE PRODUCTO COMESTIBLE NUEVO
// ============================================================
async function registrarEntradaComestible(data) {
  const pool = await getPool();
  const { 
    id_comestible, nombre, marca, sabor, peso, litros, precio, cantidad,
    tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario,
    ubicacion, imagen
  } = data;

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
    .input("cantidad", sql.Int, cantidad)
    .input("ubicacion", sql.NVarChar(50), ubicacion)
    .input("imagen", sql.NVarChar(255), imagen)
    .query(`
      INSERT INTO ProductosComestibles 
      (id_comestible, nombre, marca, sabor, peso, litros, precio, cantidad, ubicacion, imagen)
      VALUES (@id_comestible, @nombre, @marca, @sabor, @peso, @litros, @precio, @cantidad, @ubicacion, @imagen)
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
    .query(`
      INSERT INTO InventarioComestible
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario)
    `);
}


// ============================================================
// 🍪 REGISTRAR ENTRADA DE PRODUCTO COMESTIBLE EXISTENTE
// ============================================================
async function registrarEntradaComestibleExistente(data) {
  const pool = await getPool();
  const { id_comestible, cantidad, tipo_comprobante, numero_comprobante, metodo_pago, monto_pagado, id_usuario } = data;
  const idInventario = generarIdInventario("IC");

  // Actualizar stock
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .query(`
      UPDATE ProductosComestibles
      SET cantidad = cantidad + @cantidad
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
    .query(`
      INSERT INTO InventarioComestible
      (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante,
       numero_comprobante, metodo_pago, monto_pagado, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento,
       @tipo_comprobante, @numero_comprobante, @metodo_pago, @monto_pagado, @id_usuario)
    `);
}

// ============================================================
// 📋 LISTADOS
// ============================================================

// Ropa
async function listarRopa() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT *
    FROM RopaDeportiva
    ORDER BY nombre
  `);
  return result.recordset;
}

// Comestibles
async function listarComestibles() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT *
    FROM ProductosComestibles
    ORDER BY nombre
  `);
  return result.recordset;
}

// 📋 Movimientos de Ropa
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

// 📋 Movimientos de Comestibles
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
      SELECT r.*, i.cantidad
      FROM RopaDeportiva r
      LEFT JOIN InventarioRopa i ON r.id_ropa = i.id_producto
      WHERE r.id_ropa LIKE @criterio OR r.nombre LIKE @criterio
    `);
  return result.recordset;
}

async function buscarComestible(criterio) {
  const pool = await getPool();
  const result = await pool.request()
    .input("criterio", sql.NVarChar(50), `%${criterio}%`)
    .query(`
      SELECT c.*, i.cantidad
      FROM ProductosComestibles c
      LEFT JOIN InventarioComestible i ON c.id_comestible = i.id_producto
      WHERE c.id_comestible LIKE @criterio OR c.nombre LIKE @criterio
    `);
  return result.recordset;
}
// ============================================================
// ✏️ ACTUALIZAR DATOS DE ROPA (marca, talla, color, ubicación, imagen)
// ============================================================
async function actualizarRopa(data) {
  const pool = await getPool();
  const { id_ropa, marca, talla, color, ubicacion, imagen } = data;

  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("marca", sql.NVarChar(20), marca)
    .input("talla", sql.NVarChar(8), talla)
    .input("color", sql.NVarChar(20), color)
    .input("ubicacion", sql.NVarChar(50), ubicacion)
    .input("imagen", sql.NVarChar(255), imagen)
    .query(`
      UPDATE RopaDeportiva
      SET 
        marca = @marca,
        talla = @talla,
        color = @color,
        ubicacion = @ubicacion,
        imagen = @imagen
      WHERE id_ropa = @id_ropa
    `);

  return { message: "✅ Datos de ropa actualizados correctamente" };
}

// ============================================================
// ✏️ ACTUALIZAR DATOS DE PRODUCTO COMESTIBLE 
// (marca, sabor, peso, litros, ubicación, imagen)
// ============================================================
async function actualizarComestible(data) {
  const pool = await getPool();
  let { id_comestible, marca, sabor, peso, litros, ubicacion, imagen } = data;

  // Convertir a null si no es un número válido
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
    .query(`
      UPDATE ProductosComestibles
      SET 
        marca = @marca,
        sabor = @sabor,
        peso = @peso,
        litros = @litros,
        ubicacion = @ubicacion,
        imagen = @imagen
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

module.exports = {
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
  actualizarRopa,
  actualizarComestible,
  eliminarRopa,
  eliminarComestible
};
