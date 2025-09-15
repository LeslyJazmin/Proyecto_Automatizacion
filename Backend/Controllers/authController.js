const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("../Models/userModel");

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

        if (!user.activo) return res.status(403).json({ message: "Usuario inactivo" });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: user.id_usuario, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Error en login", error: err.message });
    }
}

module.exports = { login };
