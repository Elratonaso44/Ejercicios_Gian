
const API_URL = "http://localhost:3000";

const form = document.getElementById("form-login");
const mensaje = document.getElementById("mensaje");
const tokenPre = document.getElementById("token");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  mensaje.textContent = "Ingresando...";
  tokenPre.textContent = "";

  try {
    // POST /auth/login con { username, password } -> { token }
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      mensaje.textContent = data.mensaje || "Error al ingresar";
      return;
    }

    // Guardamos el token para usarlo después en rutas protegidas:
    // fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    localStorage.setItem("token", data.token);

    mensaje.textContent = "Login exitoso. Token guardado en localStorage.";
    tokenPre.textContent = data.token;
  } catch (error) {
    mensaje.textContent = "No se pudo conectar con la API. ";
  }
});
