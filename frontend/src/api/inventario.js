const API_URL = "http://localhost:5000/inventario";

// Registrar entrada (compra)
export async function registrarEntrada(data) {
  const response = await fetch(`${API_URL}/entrada`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Registrar salida (venta)
export async function registrarSalida(data) {
  const response = await fetch(`${API_URL}/salida`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Obtener lista de productos existentes
export async function obtenerProductos(tipoProducto) {
  const response = await fetch(`${API_URL}/productos?tipo=${tipoProducto}`);
  return response.json();
}
