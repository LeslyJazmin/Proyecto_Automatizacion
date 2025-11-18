// 📂 src/api/empresa.js
const API_URL = "http://localhost:5000/api/empresa";

function getToken() {
  return sessionStorage.getItem("token");
}

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// ✅ Obtener información de la empresa
export async function getInfoEmpresa() {
  const res = await fetch(API_URL, { headers: getHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
  return data;
}

// ✅ Actualizar información de la empresa
export async function updateInfoEmpresa(body) {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
  return data; // <- el backend debe devolver la info actualizada o al menos el campo modificado
}
