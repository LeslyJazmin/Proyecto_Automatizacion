const express = require("express");
const cors = require("cors");

const userRoutes = require("./Routes/userRoutes");  
const empresaRoutes = require("./Routes/empresaRoutes"); 
const inventarioRoutes = require("./Routes/inventarioRoutes"); 
const { connectDB } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de prueba
app.get("/", (req, res) => {
    res.send("✅ API funcionando");
});

// Middleware global de errores
app.use((err, req, res, next) => {
    console.error("❌ Error en servidor:", err.stack);
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
});

// Iniciar servidor
async function startServer() {
    try {
        await connectDB(); // Espera a que se conecte
        console.log("✅ Conectado a la BD");

        // Montar rutas después de la conexión
        app.use("/api", userRoutes);
        app.use("/api/empresa", empresaRoutes); 
        app.use("/api/inventario", inventarioRoutes);

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
    } catch (error) {
        console.error("❌ No se pudo iniciar el servidor:", error.message);
    }
}

startServer();

module.exports = app;
