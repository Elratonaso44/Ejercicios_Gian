// POST /profesores/alta tal como está en la API (pide token Bearer).
// Body esperado: { nombre, apellido, edad, materia }
const API_URL = "http://localhost:3000";

const form = document.getElementById("form-crear");
const mensaje = document.getElementById("mensaje");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    mensaje.textContent = "No hay token. Logueate primero en login.html.";
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const edadInput = document.getElementById("edad").value;
  const materia = document.getElementById("materia").value;

  mensaje.textContent = "Creando...";
  resultado.textContent = "";

  try {
    const res = await fetch(`${API_URL}/profesores/alta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre,
        apellido,
        // Si el input viene vacío mandamos null, si no número
        edad: edadInput === "" ? null : Number(edadInput),
        materia,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // 401 = token faltante/expirado, 400 = validación (nombre/apellido)
      mensaje.textContent = data.mensaje || "Error al crear";
      resultado.textContent = JSON.stringify(data, null, 2);
      return;
    }

    mensaje.textContent = "Profesor creado.";
    resultado.textContent = JSON.stringify(data, null, 2);
    form.reset();
  } catch (error) {
    mensaje.textContent = "No se pudo conectar con la API. ¿Está corriendo npm run dev?";
  }
});
