const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

let pool = null;

async function connectDB() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("✅ Conectado a SQL Server");
    }
    return pool;
  } catch (err) {
    console.error("❌ Error al conectar a SQL Server:", err.message);
    throw err;
  }
}

const poolPromise = connectDB(); // poolPromise igual funciona para modelos

module.exports = { sql, poolPromise, connectDB };
