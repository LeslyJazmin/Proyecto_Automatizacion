const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Guardar comprobantes en carpeta específica y el resto en uploads
    const baseUploads = path.join(__dirname, "../uploads");
    const comprobanteDir = path.join(baseUploads, "comprobante");
    const dest = file.fieldname === "img_comp" ? comprobanteDir : baseUploads;
    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (e) {
      // ignore
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // nombre único
  }
});

// Validar tipos de archivo (ej: solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
