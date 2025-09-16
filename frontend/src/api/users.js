const API_URL = "http://localhost:5000/api/users";

// Leer token del localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Crear usuario (solo admin)
export async function createUser(userData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify(userData),
  });
  return await res.json();
}

// Listar usuarios
export async function listUsers() {
  const res = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Actualizar usuario
export async function updateUser(id, userData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(userData)
  });
  return await res.json();
}

// Eliminar usuario
export async function deleteUser(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  return await res.json();
}
