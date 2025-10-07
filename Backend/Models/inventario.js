const { getPool, sql } = require("../config/db");

// =============================
// 📌 GENERAR ID de 7 caracteres
// =============================
function generarIdInventario(prefijo) {
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return prefijo + random; // Ejemplo: IR1234 o IC5678
}

// =============================
// 📌 ROPA NUEVA
// =============================
async function registrarEntradaRopa(data) {
  const pool = await getPool();
  const { id_ropa, nombre, marca, talla, color, precio, cantidad, tipo_comprobante, numero_comprobante, tipo_venta, id_usuario } = data;

  // Insertar o actualizar ropa
  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .input("nombre", sql.NVarChar(20), nombre)
    .input("marca", sql.NVarChar(20), marca)
    .input("talla", sql.NVarChar(8), talla)
    .input("color", sql.NVarChar(20), color)
    .input("precio", sql.Decimal(10, 2), precio)
    .input("ubicacion", sql.NVarChar(50), data.ubicacion || null)
    .input("imagen", sql.NVarChar(255), data.imagen || null)
    .query(`
      IF EXISTS (SELECT 1 FROM RopaDeportiva WHERE id_ropa = @id_ropa)
        UPDATE RopaDeportiva
        SET nombre=@nombre, marca=@marca, talla=@talla, color=@color, precio=@precio, ubicacion=@ubicacion, imagen=@imagen
        WHERE id_ropa=@id_ropa
      ELSE
        INSERT INTO RopaDeportiva (id_ropa, nombre, marca, talla, color, precio, ubicacion, imagen)
        VALUES (@id_ropa, @nombre, @marca, @talla, @color, @precio, @ubicacion, @imagen)
    `);

  // Insertar movimiento
  const idInventario = generarIdInventario("IR");
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), idInventario)
    .input("id_producto", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, cantidad)
    .input("tipo_movimiento", sql.NVarChar(20), "entrada")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("tipo_venta", sql.NVarChar(20), tipo_venta)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .query(`
      INSERT INTO InventarioRopa (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante, numero_comprobante, tipo_venta, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento, @tipo_comprobante, @numero_comprobante, @tipo_venta, @id_usuario)
    `);

  return { message: "✅ Entrada de ropa registrada correctamente" };
}

// =============================
// 📌 ROPA EXISTENTE (solo suma stock y guarda comprobante)
// =============================
async function registrarEntradaRopaExistente(data) {
  const pool = await getPool();
  const { id_ropa, cantidad, tipo_comprobante, numero_comprobante, tipo_venta, id_usuario } = data;

  // Insertar movimiento en InventarioRopa
  const idInventario = generarIdInventario("IR");
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), idInventario)
    .input("id_producto", sql.NVarChar(7), id_ropa)
    .input("cantidad", sql.Int, cantidad)
    .input("tipo_movimiento", sql.NVarChar(20), "entrada")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("tipo_venta", sql.NVarChar(20), tipo_venta)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .query(`
      INSERT INTO InventarioRopa (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante, numero_comprobante, tipo_venta, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento, @tipo_comprobante, @numero_comprobante, @tipo_venta, @id_usuario)
    `);

  return { message: "✅ Entrada de ropa existente registrada correctamente" };
}

// =============================
// 📌 COMESTIBLE NUEVO
// =============================
async function registrarEntradaComestible(data) {
  const pool = await getPool();
  const { id_comestible, nombre, marca, sabor, peso, litros, precio, cantidad, tipo_comprobante, numero_comprobante, tipo_venta, id_usuario } = data;

  // Insertar o actualizar comestible
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .input("nombre", sql.NVarChar(50), nombre)
    .input("marca", sql.NVarChar(20), marca)
    .input("sabor", sql.NVarChar(20), sabor)
    .input("peso", sql.Decimal(10, 2), peso)
    .input("litros", sql.Decimal(10, 2), litros)
    .input("precio", sql.Decimal(10, 2), precio)
    .input("ubicacion", sql.NVarChar(50), data.ubicacion || null)
    .input("imagen", sql.NVarChar(255), data.imagen || null)
    .query(`
      IF EXISTS (SELECT 1 FROM ProductosComestibles WHERE id_comestible = @id_comestible)
        UPDATE ProductosComestibles
        SET nombre=@nombre, marca=@marca, sabor=@sabor, peso=@peso, litros=@litros, precio=@precio, ubicacion=@ubicacion, imagen=@imagen
        WHERE id_comestible=@id_comestible
      ELSE
        INSERT INTO ProductosComestibles (id_comestible, nombre, marca, sabor, peso, litros, precio, ubicacion, imagen)
        VALUES (@id_comestible, @nombre, @marca, @sabor, @peso, @litros, @precio, @ubicacion, @imagen)
    `);

  // Insertar movimiento
  const idInventario = generarIdInventario("IC");
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), idInventario)
    .input("id_producto", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .input("tipo_movimiento", sql.NVarChar(20), "entrada")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("tipo_venta", sql.NVarChar(20), tipo_venta)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .query(`
      INSERT INTO InventarioComestible (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante, numero_comprobante, tipo_venta, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento, @tipo_comprobante, @numero_comprobante, @tipo_venta, @id_usuario)
    `);

  return { message: "✅ Entrada de comestible registrada correctamente" };
}

// =============================
// 📌 COMESTIBLE EXISTENTE
// =============================
async function registrarEntradaComestibleExistente(data) {
  const pool = await getPool();
  const { id_comestible, cantidad, tipo_comprobante, numero_comprobante, tipo_venta, id_usuario } = data;

  // Insertar movimiento en InventarioComestible
  const idInventario = generarIdInventario("IC");
  await pool.request()
    .input("id_inventario", sql.NVarChar(7), idInventario)
    .input("id_producto", sql.NVarChar(7), id_comestible)
    .input("cantidad", sql.Int, cantidad)
    .input("tipo_movimiento", sql.NVarChar(20), "entrada")
    .input("tipo_comprobante", sql.NVarChar(20), tipo_comprobante)
    .input("numero_comprobante", sql.NVarChar(20), numero_comprobante)
    .input("tipo_venta", sql.NVarChar(20), tipo_venta)
    .input("id_usuario", sql.NVarChar(7), id_usuario)
    .query(`
      INSERT INTO InventarioComestible (id_inventario, id_producto, cantidad, tipo_movimiento, tipo_comprobante, numero_comprobante, tipo_venta, id_usuario)
      VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento, @tipo_comprobante, @numero_comprobante, @tipo_venta, @id_usuario)
    `);

  return { message: "✅ Entrada de comestible existente registrada correctamente" };
}

// =============================
// 📌 LISTAR PRODUCTOS CON CANTIDAD
// =============================

// Ropa
async function listarRopa() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT r.*, i.cantidad
    FROM RopaDeportiva r
    LEFT JOIN InventarioRopa i ON r.id_ropa = i.id_producto
  `);
  return result.recordset;
}

// Comestibles
async function listarComestibles() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT c.*, i.cantidad
    FROM ProductosComestibles c
    LEFT JOIN InventarioComestible i ON c.id_comestible = i.id_producto
  `);
  return result.recordset;
}

async function listarMovimientosRopa() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT i.tipo_movimiento, i.cantidad, i.tipo_comprobante, i.numero_comprobante, 
           i.tipo_venta, u.username AS usuario, r.nombre AS producto, i.fecha
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
    SELECT i.tipo_movimiento, i.cantidad, i.tipo_comprobante, i.numero_comprobante, 
           i.tipo_venta, u.username AS usuario, c.nombre AS producto, i.fecha
    FROM InventarioComestible i
    LEFT JOIN Usuarios u ON i.id_usuario = u.id_usuario
    LEFT JOIN ProductosComestibles c ON i.id_producto = c.id_comestible
    ORDER BY i.fecha DESC
  `);
  return result.recordset;
}

// =============================
// 📌 BUSCAR PRODUCTO POR ID O NOMBRE (LIKE)
// =============================
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
// =============================
// 📌 ELIMINAR ROPA Y SU INVENTARIO
// =============================
async function eliminarRopa(id_ropa) {
  const pool = await getPool();

  // Primero eliminar los movimientos del inventario asociados
  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .query(`
      DELETE FROM InventarioRopa WHERE id_producto = @id_ropa
    `);

  // Luego eliminar el producto
  await pool.request()
    .input("id_ropa", sql.NVarChar(7), id_ropa)
    .query(`
      DELETE FROM RopaDeportiva WHERE id_ropa = @id_ropa
    `);

  return { message: "🗑️ Producto de ropa y sus registros eliminados correctamente" };
}

// =============================
// 📌 ELIMINAR COMESTIBLE Y SU INVENTARIO
// =============================
async function eliminarComestible(id_comestible) {
  const pool = await getPool();

  // Primero eliminar los movimientos del inventario asociados
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .query(`
      DELETE FROM InventarioComestible WHERE id_producto = @id_comestible
    `);

  // Luego eliminar el producto
  await pool.request()
    .input("id_comestible", sql.NVarChar(7), id_comestible)
    .query(`
      DELETE FROM ProductosComestibles WHERE id_comestible = @id_comestible
    `);

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
  eliminarRopa,
  eliminarComestible,    
};
