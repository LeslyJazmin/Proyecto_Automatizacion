const { sql } = require("../config/db");

class Inventario {
  /**
   * Registrar una entrada en inventario
   * @param {string} tipoProducto - "ropa" o "comestible"
   * @param {object} datos - { producto, inventario }
   * @param {object} pool - conexión SQL (ya creada en el controller)
   */
  static async registrarEntrada(tipoProducto, datos, pool) {
    let tablaProducto, tablaInventario, productoDB;

    if (tipoProducto === "ropa") {
      tablaProducto = "RopaDeportiva";
      tablaInventario = "InventarioRopa";
      productoDB = {
        id_ropa: datos.producto.id_producto,
        nombre: datos.producto.nombre,
        marca: datos.producto.marca || null,
        talla: datos.producto.talla || null,
        color: datos.producto.color || null,
        precio: parseFloat(datos.producto.precio),
        ubicacion: datos.producto.ubicacion || null, // ✅ Nuevo campo
        imagen: datos.producto.imagen || null,       // ✅ Nuevo campo
      };
    } else if (tipoProducto === "comestible") {
      tablaProducto = "ProductosComestibles";
      tablaInventario = "InventarioComestible";
      productoDB = {
        id_comestible: datos.producto.id_producto,
        nombre: datos.producto.nombre,
        marca: datos.producto.marca || null,
        sabor: datos.producto.sabor,
        peso: datos.producto.peso ? parseFloat(datos.producto.peso) : null,
        litros: datos.producto.litros ? parseFloat(datos.producto.litros) : null,
        precio: parseFloat(datos.producto.precio),
        ubicacion: datos.producto.ubicacion || null, // ✅ Nuevo campo
        imagen: datos.producto.imagen || null,       // ✅ Nuevo campo
      };
    } else throw new Error("Tipo de producto no válido");

    const transaction = pool.transaction();

    try {
      await transaction.begin();

      // Insertar producto
      const camposProducto = Object.keys(productoDB).join(",");
      const valoresProducto = Object.keys(productoDB).map(k => `@${k}`).join(",");
      let request = transaction.request();
      for (let key in productoDB) request.input(key, productoDB[key]);
      await request.query(`INSERT INTO ${tablaProducto} (${camposProducto}) VALUES (${valoresProducto})`);

      // Insertar inventario (movimiento)
      const inventarioDB = {
        id_inventario: datos.inventario.id_inventario,
        id_producto: datos.inventario.id_producto,
        cantidad: parseInt(datos.inventario.cantidad),
        tipo_movimiento: datos.inventario.tipo_movimiento, // "entrada"
        ruc_compra: datos.inventario.ruc_compra || null,
        tipo_venta: datos.inventario.tipo_venta || null,
        id_usuario: datos.inventario.id_usuario,
      };
      const camposInventario = Object.keys(inventarioDB).join(",");
      const valoresInventario = Object.keys(inventarioDB).map(k => `@${k}`).join(",");
      request = transaction.request();
      for (let key in inventarioDB) request.input(key, inventarioDB[key]);
      await request.query(`INSERT INTO ${tablaInventario} (${camposInventario}) VALUES (${valoresInventario})`);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Registrar salida de inventario
   * @param {string} tipoProducto - "ropa" o "comestible"
   * @param {object} datos - { id_producto, cantidad, id_usuario, id_inventario }
   * @param {object} pool - conexión SQL
   */
  static async registrarSalida(tipoProducto, datos, pool) {
    let tablaInventario;
    if (tipoProducto === "ropa") tablaInventario = "InventarioRopa";
    else if (tipoProducto === "comestible") tablaInventario = "InventarioComestible";
    else throw new Error("Tipo de producto no válido");

    await pool.request()
      .input("id_inventario", sql.NVarChar, datos.id_inventario)
      .input("id_producto", sql.NVarChar, datos.id_producto)
      .input("cantidad", sql.Int, parseInt(datos.cantidad))
      .input("tipo_movimiento", sql.NVarChar, "salida")
      .input("id_usuario", sql.NVarChar, datos.id_usuario)
      .query(`
        INSERT INTO ${tablaInventario} (id_inventario, id_producto, cantidad, tipo_movimiento, id_usuario)
        VALUES (@id_inventario, @id_producto, @cantidad, @tipo_movimiento, @id_usuario)
      `);
  }
}

module.exports = Inventario;
