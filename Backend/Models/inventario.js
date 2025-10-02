const { getPool, sql } = require("../config/db");

// =============================
// 📌 GENERAR ID de 7 caracteres
// =============================
function generarIdInventario(prefijo) {
  // Prefijo + números hasta completar 7 caracteres
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return prefijo + random; // Ejemplo: IR1234 o IC5678
}

// =============================
// 📌 REGISTRAR ENTRADA ROPA
// =============================
async function registrarEntradaRopa(data) {
  const pool = await getPool();
  const {
    id_ropa,
    nombre,
    marca,
    talla,
    color,
    precio,
    cantidad,
    tipo_comprobante,
    numero_comprobante,
    tipo_venta,
    id_usuario
  } = data;

  // 1. Insertar o actualizar ropa
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

  // 2. Insertar movimiento en InventarioRopa
  const idInventario = generarIdInventario("IR"); // ejemplo IR1234
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
// 📌 REGISTRAR ENTRADA COMESTIBLES
// =============================
async function registrarEntradaComestible(data) {
  const pool = await getPool();
  const {
    id_comestible,
    nombre,
    marca,
    sabor,
    peso,
    litros,
    precio,
    cantidad,
    tipo_comprobante,
    numero_comprobante,
    tipo_venta,
    id_usuario
  } = data;

  // 1. Insertar o actualizar producto comestible
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

  // 2. Insertar movimiento en InventarioComestible
  const idInventario = generarIdInventario("IC"); // ejemplo IC4321
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
// 📌 LISTAR PRODUCTOS
// =============================
async function listarRopa() {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM RopaDeportiva");
  return result.recordset;
}

async function listarComestibles() {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM ProductosComestibles");
  return result.recordset;
}

module.exports = {
  registrarEntradaRopa,
  registrarEntradaComestible,
  listarRopa,
  listarComestibles,
};
