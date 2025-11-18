const sql = require("mssql");
const db = require("../config/db");

// Obtener usuario por email (para login o validación)
async function getUserByEmail(email) {
    const pool = db.getPool();
    const result = await pool
        .request()
        .input("email", sql.VarChar(50), email)
        .query("SELECT * FROM Usuarios WHERE email = @email");
    return result.recordset[0];
}

// Crear nuevo usuario
async function createUser(user) {
    const pool = db.getPool();
    await pool
        .request()
        .input("id_usuario", sql.NVarChar(7), user.id_usuario)
        .input("username", sql.NVarChar(50), user.username)
        .input("celular", sql.Char(9), user.celular)
        .input("email", sql.VarChar(50), user.email)
        .input("password_hash", sql.VarChar(255), user.password_hash)
        .input("rol", sql.VarChar(50), user.rol)
        .input("activo", sql.Bit, user.activo)
        .input("fecha_creacion", sql.DateTime, user.fecha_creacion)
        .query(`
            INSERT INTO Usuarios (id_usuario, username, celular, email, password_hash, rol, activo, fecha_creacion)
            VALUES (@id_usuario, @username, @celular, @email, @password_hash, @rol, @activo, @fecha_creacion)
        `);
}

// Listar todos los usuarios (sin exponer password_hash)
async function getAllUsers() {
    const pool = db.getPool();
    const result = await pool.request().query(`
        SELECT id_usuario, username, celular, email, rol, activo, fecha_creacion 
        FROM Usuarios
    `);
    return result.recordset;
}

// Obtener usuario por ID
async function getUserById(id) {
    const pool = db.getPool();
    const result = await pool
        .request()
        .input("id_usuario", sql.NVarChar(7), id)
        .query("SELECT * FROM Usuarios WHERE id_usuario = @id_usuario");
    return result.recordset[0];
}

// Actualizar usuario (ahora con activo)
async function updateUser(id, data) {
    const pool = db.getPool();
    const fields = [];
    const request = pool.request();
    request.input("id_usuario", sql.NVarChar(7), id);

    if (data.username !== undefined) {
        fields.push("username = @username");
        request.input("username", sql.NVarChar(50), data.username);
    }
    if (data.celular !== undefined) {
        fields.push("celular = @celular");
        request.input("celular", sql.Char(9), data.celular);
    }
    if (data.email !== undefined) {
        fields.push("email = @email");
        request.input("email", sql.VarChar(50), data.email);
    }

    // 🔹 Nuevo: permitir actualizar activo
    if (data.activo !== undefined) {
        fields.push("activo = @activo");
        request.input("activo", sql.Bit, data.activo);
    }

    if (fields.length === 0) {
        throw new Error("No hay campos válidos para actualizar");
    }

    const query = `
        UPDATE Usuarios
        SET ${fields.join(", ")}
        WHERE id_usuario = @id_usuario
    `;
    const result = await request.query(query);
    return result.rowsAffected[0];
}

// Eliminar usuario (devuelve filas afectadas)
async function deleteUser(id) {
    const pool = db.getPool();
    const result = await pool
        .request()
        .input("id_usuario", sql.NVarChar(7), id)
        .query("DELETE FROM Usuarios WHERE id_usuario = @id_usuario");
    return result.rowsAffected[0];
}

module.exports = {
    getUserByEmail,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
