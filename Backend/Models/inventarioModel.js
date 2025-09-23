const { poolPromise, sql } = require("../config/db");

// Registrar producto si no existe (entrada)
async function registrarProductoSiNoExiste(tipoProducto, datosProducto) {
  const pool = await poolPromise;

  if (tipoProducto === "ropa") {
    const existe = await pool.request()
      .input("id_ropa", sql.NVarChar(7), datosProducto.id_producto)
      .query("SELECT * FROM RopaDeportiva WHERE id_ropa = @id_ropa");

    if (existe.recordset.length === 0) {
      await pool.request()
        .input("id_ropa", sql.NVarChar(7), datosProducto.id_producto)
        .input("nombre", sql.NVarChar(20), datosProducto.nombre)
        .input("marca", sql.NVarChar(20), datosProducto.marca)
        .input("talla", sql.NVarChar(8), datosProducto.talla)
        .input("color", sql.NVarChar(20), datosProducto.color)
        .input("precio", sql.Decimal(10,2), datosProducto.precio)
        // Campos opcionales
        .input("ubicacion", sql.NVarChar(50), datosProducto.ubicacion || null)
        .input("imagen", sql.NVarChar(255), datosProducto.imagen || null)
        .query(`INSERT INTO RopaDeportiva 
          (id_ropa,nombre,marca,talla,color,precio,ubicacion,imagen) 
          VALUES (@id_ropa,@nombre,@marca,@talla,@color,@precio,@ubicacion,@imagen)`);
    }
  } else if (tipoProducto === "comestible") {
    const existe = await pool.request()
      .input("id_comestible", sql.NVarChar(7), datosProducto.id_producto)
      .query("SELECT * FROM ProductosComestibles WHERE id_comestible = @id_comestible");

    if (existe.recordset.length === 0) {
      await pool.request()
        .input("id_comestible", sql.NVarChar(7), datosProducto.id_producto)
        .input("nombre", sql.NVarChar(50), datosProducto.nombre)
        .input("marca", sql.NVarChar(20), datosProducto.marca)
        .input("sabor", sql.NVarChar(20), datosProducto.sabor)
        .input("peso", sql.Decimal(10,2), datosProducto.peso)
        .input("litros", sql.Decimal(10,2), datosProducto.litros)
        .input("precio", sql.Decimal(10,2), datosProducto.precio)
        // Campos opcionales
        .input("ubicacion", sql.NVarChar(50), datosProducto.ubicacion || null)
        .input("imagen", sql.NVarChar(255), datosProducto.imagen || null)
        .query(`INSERT INTO ProductosComestibles 
          (id_comestible,nombre,marca,sabor,peso,litros,precio,ubicacion,imagen) 
          VALUES (@id_comestible,@nombre,@marca,@sabor,@peso,@litros,@precio,@ubicacion,@imagen)`);
    }
  }
}

// Registrar entrada (compra)
async function registrarEntrada(tipoProducto, datos) {
  const pool = await poolPromise;

  // Registrar producto si no existe
  await registrarProductoSiNoExiste(tipoProducto, datos);

  const tabla = tipoProducto === "ropa" ? "InventarioRopa" : "InventarioComestible";
  const query = `
    INSERT INTO ${tabla} 
    (id_inventario,id_producto,cantidad,tipo_movimiento,ruc_compra,id_usuario)
    VALUES (@id_inventario,@id_producto,@cantidad,'entrada',@ruc_compra,@id_usuario)
  `;

  await pool.request()
    .input("id_inventario", sql.NVarChar(7), datos.id_inventario)
    .input("id_producto", sql.NVarChar(7), datos.id_producto)
    .input("cantidad", sql.Int, datos.cantidad)
    .input("ruc_compra", sql.VarChar(15), datos.ruc_compra)
    .input("id_usuario", sql.NVarChar(7), datos.id_usuario)
    .query(query);
}

// Registrar salida (venta)
async function registrarSalida(tipoProducto, datos) {
  const pool = await poolPromise;
  const tabla = tipoProducto === "ropa" ? "InventarioRopa" : "InventarioComestible";

  const query = `
    INSERT INTO ${tabla} 
    (id_inventario,id_producto,cantidad,tipo_movimiento,tipo_venta,id_usuario)
    VALUES (@id_inventario,@id_producto,@cantidad,'salida',@tipo_venta,@id_usuario)
  `;

  await pool.request()
    .input("id_inventario", sql.NVarChar(7), datos.id_inventario)
    .input("id_producto", sql.NVarChar(7), datos.id_producto)
    .input("cantidad", sql.Int, datos.cantidad)
    .input("tipo_venta", sql.NVarChar(10), datos.tipo_venta)
    .input("id_usuario", sql.NVarChar(7), datos.id_usuario)
    .query(query);
}

module.exports = { registrarEntrada, registrarSalida };
