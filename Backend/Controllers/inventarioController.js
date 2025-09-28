const { getPool } = require("../config/db");
const Inventario = require("../Models/inventarioModel");
const path = require("path");

// 📥 Registrar entrada (con imagen y transacción)
exports.crearEntrada = async (req, res) => {
  try {
    const { tipoProducto, producto, inventario } = req.body;
    const pool = getPool();

    // ✅ Validar imagen si existe
    let imagen = null;
    if (req.file) {
      const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      const ext = path.extname(req.file.originalname).toLowerCase();

      if (!validExtensions.includes(ext)) {
        return res.status(400).json({ error: "Formato de imagen no permitido" });
      }

      imagen = `/images/${req.file.filename}`;
    }

    // ✅ Pasar imagen junto a los datos
    const datos = {
      producto: { ...producto, imagen },
      inventario,
    };

    // ✅ Lógica de inserción (en transacción)
    await Inventario.registrarEntrada(tipoProducto, datos, pool);

    res.json({ message: "Entrada registrada correctamente" });
  } catch (error) {
    console.error("❌ Error en crearEntrada:", error);
    res.status(500).json({ error: "Error al registrar entrada" });
  }
};

// 📤 Registrar salida
exports.crearSalida = async (req, res) => {
  try {
    const datos = req.body;
    const pool = getPool();
    await Inventario.registrarSalida(datos.tipoProducto, datos, pool);

    res.json({ message: "Salida registrada correctamente" });
  } catch (error) {
    console.error("❌ Error en crearSalida:", error);
    res.status(500).json({ error: "Error al registrar salida" });
  }
};

// 👕 Obtener lista de ropa deportiva
exports.obtenerRopa = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query("SELECT * FROM RopaDeportiva");
    res.json(result.recordset || []);
  } catch (error) {
    console.error("❌ Error al obtener ropa:", error);
    res.status(500).json([]);
  }
};

// 🍎 Obtener lista de productos comestibles
exports.obtenerComestibles = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query("SELECT * FROM ProductosComestibles");
    res.json(result.recordset || []);
  } catch (error) {
    console.error("❌ Error al obtener comestibles:", error);
    res.status(500).json([]);
  }
};

// 🔍 Buscar ropa por ID, nombre o ubicación
exports.buscarRopa = async (req, res) => {
  try {
    const { query } = req.query;
    const pool = getPool();

    const result = await pool.request()
      .input("q", `%${query}%`)
      .query(`
        SELECT * FROM RopaDeportiva
        WHERE id_ropa LIKE @q OR nombre LIKE @q OR ubicacion LIKE @q
      `);

    res.json(result.recordset || []);
  } catch (error) {
    console.error("❌ Error al buscar ropa:", error);
    res.status(500).json([]);
  }
};

// 🔍 Buscar comestibles por ID, nombre o ubicación
exports.buscarComestibles = async (req, res) => {
  try {
    const { query } = req.query;
    const pool = getPool();

    const result = await pool.request()
      .input("q", `%${query}%`)
      .query(`
        SELECT * FROM ProductosComestibles
        WHERE id_comestible LIKE @q OR nombre LIKE @q OR ubicacion LIKE @q
      `);

    res.json(result.recordset || []);
  } catch (error) {
    console.error("❌ Error al buscar comestibles:", error);
    res.status(500).json([]);
  }
};
