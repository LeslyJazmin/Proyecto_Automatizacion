// 📂 Controllers/infoEmpresaController.js
const { getInfoEmpresa, updateInfoEmpresa } = require("../Models/infoEmpresaModel");

async function fetchInfoEmpresa(req, res) {
  try {
    const empresa = await getInfoEmpresa();
    if (!empresa) return res.status(404).json({ message: "No hay información de empresa registrada" });
    res.json(empresa);
  } catch (error) {
    console.error("❌ Error en fetchInfoEmpresa:", error.message);
    res.status(500).json({ message: "Error al obtener información de la empresa" });
  }
}

async function updateEmpresa(req, res) {
  try {
    if (req.user?.rol !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    // ✅ Construimos el objeto con los datos que llegaron + el admin que hizo el cambio
    const empresaData = { ...req.body, id_admin: req.user.id };

    // ✅ Llamamos al modelo que actualiza y nos devuelve la fila ya actualizada
    const empresaActualizada = await updateInfoEmpresa(empresaData);

    // ✅ Devolvemos el objeto actualizado, no solo un mensaje
    res.json(empresaActualizada);
  } catch (error) {
    console.error("❌ Error en updateEmpresa:", error.message);
    res.status(500).json({ message: "Error al actualizar información de la empresa" });
  }
}

module.exports = { fetchInfoEmpresa, updateEmpresa };
