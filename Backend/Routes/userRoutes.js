// 📂 routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { login } = require("../Controllers/authController");
const userController = require("../Controllers/userController");
const { verifyToken, isAdmin } = require("../Middleware/authMiddleware");

// --- Rutas públicas ---
router.post("/login", login);
router.post("/register-admin", userController.createNewUser); // Primer admin

// --- Rutas protegidas ---
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user }); // Devuelve el usuario autenticado
});

// --- CRUD de usuarios (solo admin) ---
router.post("/users", verifyToken, isAdmin, userController.createNewUser);
router.get("/users", verifyToken, isAdmin, userController.listUsers);
router.get("/users/:id", verifyToken, isAdmin, userController.getUser);
router.put("/users/:id", verifyToken, isAdmin, userController.updateUserData);
router.delete("/users/:id", verifyToken, isAdmin, userController.deleteUserById);

module.exports = router;
