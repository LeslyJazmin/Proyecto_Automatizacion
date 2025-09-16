const jwt = require("jsonwebtoken");

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
    req.user = decoded;
    next();

  } catch (err) {
    console.error("❌ Error de verificación de token:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado, inicia sesión nuevamente" });
    }

    res.status(401).json({ message: "Token inválido", error: err.message });
  }
}

function isAdmin(req, res, next) {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado, solo admin" });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
