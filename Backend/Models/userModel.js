const { sql } = require("../config/db");

async function getUserByEmail(email) {
    try {
        const result = await sql.query`SELECT * FROM Usuarios WHERE email = ${email}`;
        return result.recordset[0];
    } catch (err) {
        console.error("Error en getUserByEmail:", err);
        return null;
    }
}

module.exports = { getUserByEmail };
