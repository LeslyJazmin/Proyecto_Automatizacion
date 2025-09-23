const express = require("express");
const cors = require("cors");

const userRoutes = require("./Routes/userRoutes");  
const empresaRoutes = require("./Routes/empresaRoutes"); 
const inventarioRoutes = require("./Routes/inventarioRoutes"); // ✅ NUEVO: rutas inventario
const { connectDB } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Montar todas las rutas
app.use("/api", userRoutes);
app.use("/api/empresa", empresaRoutes);
app.use("/api/inventario", inventarioRoutes); // ✅ NUEVO

// Endpoint de prueba
app.get("/", (req, res) => {
    res.send("✅ API funcionando");
});

// Middleware global de errores
app.use((err, req, res, next) => {
    console.error("❌ Error en servidor:", err.stack);
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

module.exports = app;
