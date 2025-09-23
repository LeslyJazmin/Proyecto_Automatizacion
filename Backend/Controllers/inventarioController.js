const { getPool, sql } = require("../config/db");
const Inventario = require("../Models/inventarioModel");

exports.crearEntrada = async (req, res) => {
  try {
    const datos = req.body; // { tipoProducto, producto, inventario }
    const pool = getPool(); // obtener pool ya conectado
    await Inventario.registrarEntrada(datos.tipoProducto, datos, pool);
    res.json({ message: "Entrada registrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar entrada" });
  }
};

exports.crearSalida = async (req, res) => {
  try {
    const datos = req.body; // { tipoProducto, id_producto, cantidad, id_usuario, id_inventario }
    const pool = getPool();
    await Inventario.registrarSalida(datos.tipoProducto, datos, pool);
    res.json({ message: "Salida registrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar salida" });
  }
};

// Obtener lista de ropa deportiva
exports.obtenerRopa = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query("SELECT * FROM RopaDeportiva");
    res.json(result.recordset || []);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
};

// Obtener lista de productos comestibles
exports.obtenerComestibles = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query("SELECT * FROM ProductosComestibles");
    res.json(result.recordset || []);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
};
