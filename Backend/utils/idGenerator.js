// Generador de IDs únicos para los productos

function generarIdRopa() {
  const prefijo = "RD"; // Ropa Deportiva
  const timestamp = Date.now().toString().slice(-3); // Últimos 3 dígitos
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // 2 dígitos
  return `${prefijo}${timestamp}${random}`; // Total: 7 caracteres
}

function generarIdComestible() {
  const prefijo = "PC"; // Productos Comestibles
  const timestamp = Date.now().toString().slice(-3); // Últimos 3 dígitos
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // 2 dígitos
  return `${prefijo}${timestamp}${random}`; // Total: 7 caracteres
}

function generarIdInventario(tipo) {
  const prefijo = tipo || "INV"; // IR o IC
  const timestamp = Date.now().toString().slice(-3); // Últimos 3 dígitos
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // 2 dígitos
  return `${prefijo}${timestamp}${random}`; // Total: 7 caracteres
}

module.exports = {
  generarIdRopa,
  generarIdComestible,
  generarIdInventario
};