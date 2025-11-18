const jwt = require("jsonwebtoken");

// 🔒 Verifica que el token JWT sea válido
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .setHeader("WWW-Authenticate", "Bearer")
        .json({ message: "Token no proporcionado o formato inválido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Contiene id, email, rol

    next();

  } catch (err) {
    console.error("❌ Error de verificación de token:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado, inicia sesión nuevamente" });
    }

    res.status(401).json({ message: "Token inválido", error: err.message });
  }
}

// 🧑‍💼 Middleware: Solo permite acceso a administradores
function isAdmin(req, res, next) {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado, solo admin" });
  }
  next();
}

// 👷 Middleware: Permite trabajadores y usuarios regulares
function isTrabajador(req, res, next) {
  if (!req.user || !["trabajador", "user"].includes(req.user.rol)) {
    return res.status(403).json({ message: "Acceso denegado, solo trabajadores o usuarios" });
  }
  next();
}

module.exports = { verifyToken, isAdmin, isTrabajador };
