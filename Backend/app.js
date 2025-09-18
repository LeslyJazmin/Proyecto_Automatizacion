// 📂 app.js
const express = require("express");
const cors = require("cors");

const userRoutes = require("./Routes/userRoutes");  // rutas de usuarios + login
const { connectDB } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();

// ✅ Montamos todas las rutas bajo un solo prefijo
app.use("/api", userRoutes);

// Endpoint de prueba
app.get("/", (req, res) => {
    res.send("✅ API funcionando");
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
    console.error("❌ Error en servidor:", err.stack);
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

module.exports = app;
