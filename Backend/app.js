const express = require("express");
const cors = require("cors");

const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const { connectDB } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Endpoint de prueba para verificar que el servidor está corriendo
app.get("/", (req, res) => {
    res.send("✅ API funcionando");
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error("❌ Error en servidor:", err.stack);
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

module.exports = app;
