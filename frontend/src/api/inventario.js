const API_URL = "http://localhost:5000/api/inventario"; // ajusta según tu backend

// Crear entrada
export const crearEntrada = async (tipoProducto, producto, inventario) => {
  try {
    const res = await fetch(`${API_URL}/entrada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipoProducto, producto, inventario })
    });
    return await res.json();
  } catch (error) {
    console.error("Error crear entrada:", error);
    throw error;
  }
};

// Crear salida
export const crearSalida = async (tipoProducto, datos) => {
  try {
    const res = await fetch(`${API_URL}/salida`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    return await res.json();
  } catch (error) {
    console.error("Error crear salida:", error);
    throw error;
  }
};

export const obtenerRopa = async () => {
  try {
    const res = await fetch(`${API_URL}/ropa`);
    return await res.json(); // siempre devuelve array
  } catch (error) {
    console.error("Error obtener ropa:", error);
    return [];
  }
};

export const obtenerComestibles = async () => {
  try {
    const res = await fetch(`${API_URL}/comestibles`);
    return await res.json(); // siempre devuelve array
  } catch (error) {
    console.error("Error obtener comestibles:", error);
    return [];
  }
};

