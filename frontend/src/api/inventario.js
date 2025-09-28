const API_URL = "http://localhost:5000/api/inventario"; // Ajusta si tienes otro dominio/backend

// 🟢 Crear entrada con FormData si hay imagen
export const crearEntrada = async (tipoProducto, producto, inventario, imagenFile) => {
  try {
    const formData = new FormData();
    formData.append("tipoProducto", tipoProducto);
    formData.append("producto", JSON.stringify(producto));
    formData.append("inventario", JSON.stringify(inventario));
    if (imagenFile) formData.append("imagen", imagenFile);

    const res = await fetch(`${API_URL}/entrada`, {
      method: "POST",
      body: formData, // 👈 importante (sin headers manuales)
    });

    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("🚨 Error en crearEntrada:", error);
    throw error;
  }
};

// 🔴 Crear salida
export const crearSalida = async (tipoProducto, datos) => {
  try {
    const payload = { tipoProducto, ...datos };

    const res = await fetch(`${API_URL}/salida`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("🚨 Error en crearSalida:", error);
    throw error;
  }
};

// 👕 Obtener ropa deportiva
export const obtenerRopa = async () => {
  try {
    const res = await fetch(`${API_URL}/ropa`);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("🚨 Error al obtener ropa:", error);
    return [];
  }
};

// 🍎 Obtener productos comestibles
export const obtenerComestibles = async () => {
  try {
    const res = await fetch(`${API_URL}/comestibles`);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("🚨 Error al obtener comestibles:", error);
    return [];
  }
};

// 🔍 Buscar ropa
export const buscarRopa = async (query) => {
  try {
    if (!query.trim()) return []; // evita peticiones vacías
    const res = await fetch(`${API_URL}/buscar-ropa?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("🚨 Error buscar ropa:", error);
    return [];
  }
};

// 🔍 Buscar comestibles
export const buscarComestibles = async (query) => {
  try {
    if (!query.trim()) return [];
    const res = await fetch(`${API_URL}/buscar-comestibles?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("🚨 Error buscar comestibles:", error);
    return [];
  }
};
