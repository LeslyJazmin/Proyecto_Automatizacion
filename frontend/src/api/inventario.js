const API_BASE = "http://localhost:5000/api/inventario";

// 🔐 Obtener token desde sessionStorage
function getToken() {
  return sessionStorage.getItem("token");
}

// 🧾 Encabezados con o sin JSON
function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// ⚙️ Manejo de respuesta estándar
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
  const res = await fetch(`${API_BASE}/salida-ropa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
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
  const res = await fetch(`${API_BASE}/salida-comestible`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Listar comestibles
export async function obtenerComestibles() {
  const res = await fetch(`${API_BASE}/comestibles`, {
    headers: getHeaders(false),
  });
  return handleResponse(res);
}

/* ---------------- MOVIMIENTOS ---------------- */

// ✅ LISTAR MOVIMIENTOS DE ROPA
export async function obtenerMovimientosRopa() {
  const res = await fetch(`${API_BASE}/movimientos/ropa`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("Error al obtener movimientos de ropa:", errText);
    throw new Error("No se pudieron obtener los movimientos de ropa");
  }
  return await res.json();
}

// ✅ LISTAR MOVIMIENTOS DE COMESTIBLES
export async function obtenerMovimientosComestibles() {
  const res = await fetch(`${API_BASE}/movimientos/comestibles`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("Error al obtener movimientos de comestibles:", errText);
    throw new Error("No se pudieron obtener los movimientos de comestibles");
  }
  return await res.json();
}

/* ---------------- BÚSQUEDAS ---------------- */

export async function buscarRopa(query) {
  const res = await fetch(`${API_BASE}/ropa/buscar?q=${encodeURIComponent(query)}`);
  return await res.json();
}

export async function buscarComestibles(query) {
  const res = await fetch(`${API_BASE}/comestibles/buscar?q=${encodeURIComponent(query)}`);
  return await res.json();
}

/* ---------------- ELIMINAR ---------------- */

export async function eliminarComestible(id) {
  const cleanId = String(id).trim();
  const res = await fetch(`${API_BASE}/comestible/${cleanId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function eliminarRopa(id) {
  const cleanId = String(id).trim();
  const res = await fetch(`${API_BASE}/ropa/${cleanId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

/* ---------------- ACTUALIZACIONES ---------------- */

// Registrar entrada de ropa existente
export async function registrarEntradaRopaExistente(data) {
  const res = await fetch(`${API_BASE}/ropa/entrada-existente`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Registrar entrada de comestible existente
export async function registrarEntradaComestibleExistente(data) {
  const res = await fetch(`${API_BASE}/comestibles/entrada-existente`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Actualizar ropa
export async function actualizarRopa(datosActualizados) {
  const formData = new FormData();
  for (const key in datosActualizados) {
    const value = datosActualizados[key] ?? "";
    formData.append(key, value);
  }
  const res = await fetch(`${API_BASE}/ropa/actualizar`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse(res);
}

// Actualizar comestible
export async function actualizarComestible(datosActualizados) {
  const formData = new FormData();
  if (datosActualizados.peso === "" || datosActualizados.peso === undefined)
    delete datosActualizados.peso;
  if (datosActualizados.litros === "" || datosActualizados.litros === undefined)
    delete datosActualizados.litros;

  for (const key in datosActualizados) {
    if (datosActualizados[key] !== undefined && datosActualizados[key] !== null) {
      formData.append(key, datosActualizados[key]);
    }
  }

  const res = await fetch(`${API_BASE}/comestibles/actualizar`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse(res);
}
