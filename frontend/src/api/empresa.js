// 📂 src/api/empresa.js
const API_URL = "http://localhost:5000/api/empresa";

function getToken() {
  return localStorage.getItem("token");
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
