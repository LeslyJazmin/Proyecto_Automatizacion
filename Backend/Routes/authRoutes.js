const express = require("express");
const router = express.Router();

const { login } = require("../Controllers/authController");
const { 
    createNewUser, 
    listUsers, 
    getUser, 
    updateUserData, 
    deleteUserById 
} = require("../Controllers/userController");

const { verifyToken, isAdmin } = require("../Middleware/authMiddleware");

// --- Rutas públicas ---
router.post("/login", login);
router.post("/register-admin", createNewUser); // El controller maneja la lógica del primer admin

// --- Rutas protegidas (solo admin) ---
router.get("/me", verifyToken, (req, res) => {
    // Devuelve los datos del usuario autenticado (sin contraseña)
    res.json({ user: req.user });
});

router.post("/users", verifyToken, isAdmin, createNewUser);
router.get("/users", verifyToken, isAdmin, listUsers);
router.get("/users/:id", verifyToken, isAdmin, getUser);
router.put("/users/:id", verifyToken, isAdmin, updateUserData);
router.delete("/users/:id", verifyToken, isAdmin, deleteUserById);

module.exports = router;
