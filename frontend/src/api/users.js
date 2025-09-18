const API_URL = "http://localhost:5000/api/users";

// Obtener token de forma segura
function getToken() {
  return localStorage.getItem("token");
}

// Función auxiliar para crear headers con token
function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// Función auxiliar para manejar errores de fetch
async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
  return data;
}

// Crear usuario
export async function createUser(userData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

// Listar usuarios
export async function listUsers() {
  const res = await fetch(API_URL, { headers: getHeaders(false) });
  return handleResponse(res);
}

// Actualizar usuario
export async function updateUser(id, userData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

// Eliminar usuario
export async function deleteUser(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });
  return handleResponse(res);
}

// Obtener usuario por ID
export async function getUserById(id) {
  const res = await fetch(`${API_URL}/${id}`, { headers: getHeaders(false) });
  if (!res.ok) throw new Error("Usuario no encontrado");
  return res.json();
}
