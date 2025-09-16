const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Somee no necesita SSL
        enableArithAbort: true
    }
};

let pool = null;

// Conectar a la base de datos
async function connectDB() {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log("✅ Conectado a SQL Server (Somee)");
        }
        return pool;
    } catch (err) {
        console.error("❌ Error al conectar a SQL Server:", err.message);
        throw err;
    }
}

// Obtener el pool conectado
function getPool() {
    if (!pool) throw new Error("⚠️ La base de datos no está conectada. Llama a connectDB() primero.");
    return pool;
}

module.exports = { sql, connectDB, getPool };
