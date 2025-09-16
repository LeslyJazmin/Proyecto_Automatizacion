const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const { verifyToken, isAdmin } = require("../Middleware/authMiddleware");

// Todas estas rutas requieren token + ser admin
router.post("/", verifyToken, isAdmin, userController.createNewUser);
router.get("/", verifyToken, isAdmin, userController.listUsers);
router.get("/:id", verifyToken, isAdmin, userController.getUser);
router.put("/:id", verifyToken, isAdmin, userController.updateUserData);
router.delete("/:id", verifyToken, isAdmin, userController.deleteUserById);

module.exports = router;
