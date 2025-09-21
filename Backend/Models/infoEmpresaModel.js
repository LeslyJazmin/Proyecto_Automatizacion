// 📂 Models/infoEmpresaModel.js
const sql = require("mssql");
const dbConfig = require("../config/db"); // usa tu archivo de config

// Obtener información de la empresa (solo hay 1 registro)
async function getInfoEmpresa() {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request().query(`
    SELECT TOP (1)
      id_empresa, nombre, ruc, direccion, telefono, email, fecha_creacion, id_admin
    FROM [Automatizacion].[dbo].[InfoEmpresa]
  `);
  return result.recordset[0]; // devuelve un solo objeto
}

// Actualizar información de la empresa y devolver el registro actualizado
async function updateInfoEmpresa(data) {
  const pool = await sql.connect(dbConfig);

  await pool.request()
    .input("nombre", sql.NVarChar(100), data.nombre)
    .input("ruc", sql.Char(11), data.ruc)
    .input("direccion", sql.NVarChar(200), data.direccion)
    .input("telefono", sql.Char(9), data.telefono)
    .input("email", sql.VarChar(100), data.email)
    .input("id_admin", sql.NVarChar(7), data.id_admin)
    .query(`
      UPDATE [Automatizacion].[dbo].[InfoEmpresa]
      SET nombre = @nombre,
          ruc = @ruc,
          direccion = @direccion,
          telefono = @telefono,
          email = @email,
          id_admin = @id_admin
      WHERE id_empresa = '${data.id_empresa}'
    `);

  // ✅ Volvemos a consultar la fila actualizada para devolverla
  const result = await pool.request().query(`
    SELECT TOP (1)
      id_empresa, nombre, ruc, direccion, telefono, email, fecha_creacion, id_admin
    FROM [Automatizacion].[dbo].[InfoEmpresa]
  `);

  return result.recordset[0];
}

module.exports = { getInfoEmpresa, updateInfoEmpresa };
