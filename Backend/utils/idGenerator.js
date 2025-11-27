// Generador de IDs únicos para los productos

function generarIdRopa() {
  const prefijo = "RD"; // Ropa Deportiva
  const timestamp = Date.now().toString().slice(-5); // Últimos 5 dígitos del timestamp
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // Número aleatorio de 2 dígitos
  return `${prefijo}${timestamp}${random}`;
}

function generarIdComestible() {
  const prefijo = "PC"; // Productos Comestibles
  const timestamp = Date.now().toString().slice(-5); // Últimos 5 dígitos del timestamp
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // Número aleatorio de 2 dígitos
  return `${prefijo}${timestamp}${random}`;
}

function generarIdInventario(tipo) {
  const prefijo = tipo || "INV"; // IR para ropa, IC para comestibles
  const timestamp = Date.now().toString().slice(-5); // Últimos 5 dígitos del timestamp
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // Número aleatorio de 2 dígitos
  return `${prefijo}${timestamp}${random}`;
}

module.exports = {
  generarIdRopa,
  generarIdComestible,
  generarIdInventario
};