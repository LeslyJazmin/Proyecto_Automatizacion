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

async function connectDB() {
    try {
        await sql.connect(config);
        console.log("✅ Conectado a SQL Server (Somee)");
    } catch (err) {
        console.error("❌ Error al conectar a SQL Server:", err);
    }
}

module.exports = { sql, connectDB };
