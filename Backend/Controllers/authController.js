const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("../Models/userModel");

async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Validar que se envíen email y password
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos" });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        if (!user.activo) {
            return res.status(403).json({ message: "Usuario inactivo" });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        
        // Generar token
        const token = jwt.sign(
            { 
                id: user.id_usuario, 
                email: user.email, 
                rol: user.rol,
                username: user.username   // <-- AGREGA ESTO
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );      

        // Responder con datos esenciales
        res.json({
            message: "Login exitoso",
            token,
            user: {
                id_usuario: user.id_usuario,
                username: user.username,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (err) {
        // Removed console.error to reduce terminal output
        res.status(500).json({ message: "Error en login", error: err.message });
    }
}

module.exports = { login };
