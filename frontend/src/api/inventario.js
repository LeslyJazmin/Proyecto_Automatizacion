const API_BASE = "http://localhost:5000/api/inventario";

// Función auxiliar para headers con token
function getToken() {
  return localStorage.getItem("token");
}

function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// Manejo de respuesta
async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
  return data;
}

/* ---------------- ROPA ---------------- */

// Registrar entrada de ropa
export async function registrarEntradaRopa(data) {
  const isFormData = data instanceof FormData;

  const res = await fetch(`${API_BASE}/ropa/entrada`, {
    method: "POST",
    headers: isFormData ? getHeaders(false) : getHeaders(true), 
    body: isFormData ? data : JSON.stringify(data),
  });
  return handleResponse(res);
}

// Registrar salida de ropa
export async function registrarSalidaRopa(data) {
  const res = await fetch(`${API_BASE}/ropa/salida`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Listar ropa
export async function obtenerRopa() {
  const res = await fetch(`${API_BASE}/ropa`, {
    headers: getHeaders(false),
  });
  return handleResponse(res);
}

/* ---------------- COMESTIBLES ---------------- */

// Registrar entrada de comestible
export async function registrarEntradaComestible(data) {
  const isFormData = data instanceof FormData;

  const res = await fetch(`${API_BASE}/comestibles/entrada`, {
    method: "POST",
    headers: isFormData ? getHeaders(false) : getHeaders(true), 
    body: isFormData ? data : JSON.stringify(data),
  });
  return handleResponse(res);
}

// Registrar salida de comestible
export async function registrarSalidaComestible(data) {
  const res = await fetch(`${API_BASE}/comestibles/salida`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Listar comestibles
export async function obtenerComestibles() {
  const res = await fetch(`${API_BASE}/comestibles`, {
    headers: getHeaders(false),
  });
  return handleResponse(res);
}
