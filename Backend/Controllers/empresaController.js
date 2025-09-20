const sql = require("mssql");

const dbConfig = {
  user: "sa",
  password: "Password123", // tu contraseña real de SQL Server
  server: "localhost",
  database: "Automatizacion",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// 📌 Controlador para obtener info de la empresa
exports.getInfoEmpresa = async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT TOP (1000)
        id_empresa, nombre, ruc, direccion, telefono, email, fecha_creacion, id_admin
      FROM [Automatizacion].[dbo].[InfoEmpresa]
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener info de la empresa:", error);
    res.status(500).json({ error: "Error al obtener información de la empresa" });
  }
};
