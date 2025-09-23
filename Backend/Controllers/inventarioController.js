const Inventario = require("../Models/inventarioModel");

// Entrada: recibir datos completos de producto + inventario
exports.crearEntrada = async (req, res) => {
  try {
    const datos = req.body;
    await Inventario.registrarEntrada(datos.tipoProducto, datos);
    res.json({ message: "Entrada registrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar entrada" });
  }
};

// Salida: solo registrar movimiento, no se piden datos opcionales
exports.crearSalida = async (req, res) => {
  try {
    const datos = req.body;
    await Inventario.registrarSalida(datos.tipoProducto, datos);
    res.json({ message: "Salida registrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar salida" });
  }
};
