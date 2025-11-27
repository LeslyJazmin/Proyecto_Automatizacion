const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Función auxiliar para determinar el tipo de producto
function getProductType(req) {
  // Primero, intentar usar req.productType (establecido por middleware explícito)
  if (req.productType) {
    return req.productType;
  }
  
  // Si no está disponible, inferir de la ruta
  const fullPath = req.originalUrl || req.path || "";
  if (fullPath.includes("/ropa")) {
    return "ropa";
  } else if (fullPath.includes("/comestibles")) {
    return "comestibles";
  }
  return "otros";
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const baseUploads = path.join(__dirname, "../uploads");
    
    // Determinar tipo de producto de forma más confiable
    const productType = getProductType(req);

    // Determinar subcarpeta: imagen o comprobante
    const isComprobante = file.fieldname === "img_comp";
    const subfolder = isComprobante ? "comprobantes" : "imagenes";

    // Ruta final: uploads/ropa/imagenes/ o uploads/ropa/comprobantes/ etc
    const dest = path.join(baseUploads, productType, subfolder);
    
    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (e) {
      // ignore
    }
    
    // Removed logging to reduce terminal output
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const finalName = uniqueSuffix + path.extname(file.originalname);
    // Removed logging to reduce terminal output
    cb(null, finalName); // nombre único
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
