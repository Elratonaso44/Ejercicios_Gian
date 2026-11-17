const mensaje = document.querySelector("#mensaje");
const acceso = document.querySelector("#acceso");
const usuario = document.querySelector("#usuario");
const salir = document.querySelector("#salir");
let sesion = null;
let clientes = [];
let dispositivos = [];
let tipos = [];
let reparaciones = [];

const pedir = async (url, opciones = {}) => {
  const respuesta = await fetch(url, opciones);
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.mensaje || "Ocurrió un error");
  return datos;
};
const enviar = (metodo, datos) => ({ method: metodo, headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
const mostrarError = (error) => { mensaje.textContent = error.message || "No se pudo conectar al servidor"; };
const opciones = (selector, lista, texto) => {
  const select = document.querySelector(selector);
  select.replaceChildren();
  const inicial = document.createElement("option");
  inicial.value = "";
  inicial.textContent = "Seleccioná una opción";
  select.append(inicial);
  lista.forEach((item) => {
    const opcion = document.createElement("option");
    opcion.value = item.id;
    opcion.textContent = texto(item);
    select.append(opcion);
  });
};
const cargar = async () => {
  try {
    [clientes, dispositivos, tipos, reparaciones] = await Promise.all([
      pedir("/api/clientes"), pedir("/api/dispositivos"), pedir("/api/tipos-falla"), pedir("/api/reparaciones")
    ]);
    clientes = clientes.data; dispositivos = dispositivos.data; tipos = tipos.data; reparaciones = reparaciones.data;
    opciones('#form-dispositivos [name="cliente_id"]', clientes, (item) => item.nombre);
    opciones('#form-reparaciones [name="dispositivo_id"]', dispositivos, (item) => `${item.nombre} - ${item.marca} (${item.cliente})`);
    opciones('#form-reparaciones [name="tipo_falla_id"]', tipos, (item) => item.nombre);
    dibujar("clientes", clientes, ["nombre", "telefono"]);
    dibujar("dispositivos", dispositivos, ["nombre", "marca", "cliente"]);
    dibujar("reparaciones", reparaciones, ["dispositivo", "tipo_falla", "descripcion", "estado", "usuario"]);
  } catch (error) { mostrarError(error); }
};
const dibujar = (nombre, datos, campos) => {
  const lista = document.querySelector(`#lista-${nombre}`);
  lista.replaceChildren();
  datos.forEach((dato) => {
    const fila = document.createElement("tr");
    campos.forEach((campo) => { const celda = document.createElement("td"); celda.textContent = dato[campo]; fila.append(celda); });
    const acciones = document.createElement("td");
    if (sesion) {
      const editar = document.createElement("button"); editar.textContent = "Editar";
      editar.addEventListener("click", () => {
        const form = document.querySelector(`#form-${nombre}`);
        for (const campo of form.elements) if (campo.name && dato[campo.name] !== undefined) campo.value = dato[campo.name];
        form.scrollIntoView({ behavior: "smooth" });
      });
      const borrar = document.createElement("button"); borrar.textContent = "Borrar"; borrar.className = "borrar";
      borrar.addEventListener("click", async () => {
        if (!confirm("¿Querés borrar este registro?")) return;
        try { await pedir(`/api/${nombre}/${dato.id}`, { method: "DELETE" }); mensaje.textContent = "Registro eliminado"; await cargar(); } catch (error) { mostrarError(error); }
      });
      acciones.append(editar, borrar);
    } else { acciones.textContent = "Iniciá sesión para modificar"; }
    fila.append(acciones); lista.append(fila);
  });
};
const actualizarSesion = async () => {
  sesion = (await pedir("/api/auth/sesion")).data;
  acceso.hidden = Boolean(sesion); salir.hidden = !sesion;
  usuario.textContent = sesion ? `Hola, ${sesion.nombre}` : "";
  document.querySelectorAll(".editor").forEach((form) => { form.hidden = !sesion; form.reset(); });
  await cargar();
};
document.querySelectorAll("nav button").forEach((boton) => boton.addEventListener("click", () => {
  document.querySelectorAll(".seccion").forEach((seccion) => { seccion.hidden = seccion.id !== boton.dataset.seccion; });
}));
document.querySelectorAll(".cancelar").forEach((boton) => boton.addEventListener("click", () => boton.closest("form").reset()));
document.querySelector("#registro").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  try { await pedir("/api/auth/registro", enviar("POST", Object.fromEntries(new FormData(evento.target)))); evento.target.reset(); mensaje.textContent = "Cuenta creada. Iniciá sesión."; } catch (error) { mostrarError(error); }
});
document.querySelector("#login").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  try { await pedir("/api/auth/login", enviar("POST", Object.fromEntries(new FormData(evento.target)))); evento.target.reset(); mensaje.textContent = "Sesión iniciada"; await actualizarSesion(); } catch (error) { mostrarError(error); }
});
salir.addEventListener("click", async () => {
  try { await pedir("/api/auth/salir", { method: "POST" }); mensaje.textContent = "Sesión cerrada"; await actualizarSesion(); } catch (error) { mostrarError(error); }
});
document.querySelectorAll(".editor").forEach((form) => form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  const id = datos.id; delete datos.id;
  const nombre = form.id.replace("form-", "");
  try { await pedir(`/api/${nombre}${id ? `/${id}` : ""}`, enviar(id ? "PUT" : "POST", datos)); form.reset(); mensaje.textContent = "Registro guardado"; await cargar(); } catch (error) { mostrarError(error); }
}));
actualizarSesion().catch(mostrarError);
