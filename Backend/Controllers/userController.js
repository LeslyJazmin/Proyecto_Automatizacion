const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  getUserByEmail,
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../Models/userModel");

// Generador de ID corto único
async function generateUniqueShortId(prefix) {
  let id;
  let exists = true;

  while (exists) {
    const random = Math.floor(1000 + Math.random() * 9000);
    id = `${prefix}${random}`;
    const user = await getUserById(id);
    exists = !!user; // si ya existe, repetir
  }

  return id;
}

// Crear usuario (primer admin si no existen)
async function createNewUser(req, res) {
  const { username, celular, email, password, rol, activo } = req.body;

  try {
    // Validar campos obligatorios
    if (!username || !email || !password || !rol) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

    const allUsers = await getAllUsers();
    const isFirstAdmin = allUsers.length === 0 && rol === "admin";

    if (!isFirstAdmin) {
      if (rol === "admin")
        return res.status(403).json({ message: "No se puede crear otro usuario administrador" });
      if (!req.user || req.user.rol !== "admin")
        return res.status(403).json({ message: "Solo el administrador puede crear nuevos usuarios" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id_usuario = await generateUniqueShortId(rol === "admin" ? "ADM" : "USR");

    const newUser = {
      id_usuario,
      username,
      celular,
      email,
      password_hash,
      rol,
      activo: activo ?? 1,
      fecha_creacion: new Date()
    };

    await createUser(newUser);

    let token = null;
    if (isFirstAdmin) {
      token = jwt.sign(
        { id: newUser.id_usuario, email: newUser.email, rol: newUser.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    }

    res.status(201).json({
      message: isFirstAdmin ? "Primer admin creado correctamente" : "Usuario creado correctamente",
      user: {
        id_usuario: newUser.id_usuario,
        username: newUser.username,
        email: newUser.email,
        rol: newUser.rol
      },
      ...(token && { token })
    });

  } catch (err) {
    console.error("❌ Error en createNewUser:", err.message);
    res.status(500).json({ message: "Error al crear usuario", error: err.message });
  }
}

// Listar todos los usuarios
async function listUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(Array.isArray(users) ? users : []); // garantiza que sea array
  } catch (err) {
    console.error("❌ Error en listUsers:", err.message);
    res.status(500).json({ message: "Error al listar usuarios", error: err.message });
  }
}

// Obtener usuario por ID
async function getUser(req, res) {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error en getUser:", err.message);
    res.status(500).json({ message: "Error al obtener usuario", error: err.message });
  }
}

// Actualizar usuario
async function updateUserData(req, res) {
  const { id } = req.params;
  const { username, celular, email, rol, activo } = req.body;

  try {
    await updateUser(id, { username, celular, email, rol, activo });
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error en updateUserData:", err.message);
    res.status(500).json({ message: "Error al actualizar usuario", error: err.message });
  }
}

// Eliminar usuario
async function deleteUserById(req, res) {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error en deleteUserById:", err.message);
    res.status(500).json({ message: "Error al eliminar usuario", error: err.message });
  }
}

module.exports = { createNewUser, listUsers, getUser, updateUserData, deleteUserById };
