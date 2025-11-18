// 📂 routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { login } = require("../Controllers/authController");
const userController = require("../Controllers/userController");
const { verifyToken, isAdmin, isTrabajador } = require("../Middleware/authMiddleware");

// --- Rutas públicas ---
router.post("/login", login);
router.post("/register-admin", userController.createNewUser); // Solo primer admin

// --- Rutas protegidas (token válido) ---
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user }); // Devuelve el usuario autenticado
});

// --- CRUD de usuarios (solo admin) ---
router.post("/users", verifyToken, isAdmin, userController.createNewUser);
router.get("/users", verifyToken, isAdmin, userController.listUsers);
router.get("/users/:id", verifyToken, isAdmin, userController.getUser);
router.put("/users/:id", verifyToken, isAdmin, userController.updateUserData);
router.delete("/users/:id", verifyToken, isAdmin, userController.deleteUserById);

// --- Rutas exclusivas del trabajador ---
router.get("/perfil", verifyToken, isTrabajador, (req, res) => {
  res.json({
    message: "Perfil del trabajador",
    user: req.user,
  });
});

// 🔧 Ejemplo: trabajador puede actualizar solo su propio perfil
router.put("/perfil", verifyToken, isTrabajador, (req, res) => {
  res.json({ message: "Perfil actualizado correctamente" });
});

module.exports = router;
