// Papagayos Digital — prototipo estático para GitHub Pages
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));
}

// Ubicaciones heredadas de la web anterior. Categorías propuestas para organizar el mapa;
// revisar coordenadas y clasificación antes de la publicación definitiva.
const lugares = [
  {nombre:"Oficina de Turismo",lat:-32.67593912959237,lon:-64.9827573475263,categoria:"servicios"},
  {nombre:"Centro de Salud",lat:-32.67443869375519,lon:-64.98917874386407,categoria:"servicios"},
  {nombre:"Cuartel de Bomberos",lat:-32.674775098481895,lon:-64.99223512095541,categoria:"servicios"},
  {nombre:"Municipalidad",lat:-32.675435315762094,lon:-64.9905628812799,categoria:"servicios"},
  {nombre:"Camping Municipal",lat:-32.676357593243154,lon:-64.98015725138869,categoria:"turismo"},
  {nombre:"Sendero Principal",lat:-32.68166593499375,lon:-64.96792188822933,categoria:"turismo"},
  {nombre:"Capilla San Pedro",lat:-32.67490349001535,lon:-64.98845772047662,categoria:"espacios"},
  {nombre:"Plaza Sarmiento",lat:-32.67512361961328,lon:-64.98894588252935,categoria:"espacios"},
  {nombre:"Policía",lat:-32.67545456383126,lon:-64.9904955544179,categoria:"servicios"},
  {nombre:"Acceso al arroyo",lat:-32.67871522849654,lon:-64.98240534153598,categoria:"turismo"},
  {nombre:"SUM Municipal",lat:-32.67411402758061,lon:-64.98945150465131,categoria:"espacios"},
  {nombre:"Campo Deportivo Club Papagayos",lat:-32.677929942273124,lon:-64.98046943122368,categoria:"espacios"},
  {nombre:"Cajero automático Banco Nación",lat:-32.675425026952176,lon:-64.99048077667592,categoria:"servicios"},
  {nombre:"Plaza Integradora Infantil",lat:-32.674590524061394,lon:-64.98962522756847,categoria:"espacios"},
  {nombre:"Cementerio de Papagayos",lat:-32.67845912124752,lon:-65.00025442728698,categoria:"espacios"},
  {nombre:"Campo de Jineteadas",lat:-32.67793985969311,lon:-65.00630280860547,categoria:"turismo"}
];

let map;
let markerLayers = [];
if (window.L && document.getElementById("map")) {
  map = L.map("map", {scrollWheelZoom:false}).setView([-32.6759, -64.9845], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  function renderMarkers(filter = "todos") {
    markerLayers.forEach(layer => map.removeLayer(layer));
    markerLayers = [];
    lugares.filter(lugar => filter === "todos" || lugar.categoria === filter).forEach(lugar => {
      const marker = L.marker([lugar.lat, lugar.lon]).bindPopup(
        `<strong>${lugar.nombre}</strong><br><small>Ubicación heredada del sitio anterior; dato pendiente de revisión.</small>`
      ).addTo(map);
      markerLayers.push(marker);
    });
  }
  renderMarkers();
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      renderMarkers(button.dataset.filter);
    });
  });
}

// Asistente de demostración basado en respuestas locales; no es IA ni consulta internet.
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const responses = [
  {keys:["naturaleza","arroyo","sendero","palmera","paisaje","sierras"],text:"Podés explorar la información sobre el arroyo, las sierras, las palmeras Caranday y el sendero registrado en el mapa. Verificá las condiciones locales antes de iniciar una actividad."},
  {keys:["fiesta","festival","evento","san pedro","caranday"],text:"El sitio menciona la Fiesta Patronal de San Pedro Apóstol (29 de junio) y el Festival de la Palmera Caranday (a comienzos de febrero). Confirmá las fechas de la próxima edición con los canales locales."},
  {keys:["mapa","ubicación","ubicacion","llegar","orient"],text:"En la sección Mapa podés filtrar los puntos por Turismo, Servicios o Espacios públicos. Seleccioná un marcador para ver su nombre. Las ubicaciones todavía deben validarse."},
  {keys:["alojamiento","dormir","hotel","hosped"],text:"La sección Servicios está preparada para incorporar fichas de alojamientos. La lista de prestadores y sus datos de contacto todavía debe completarse y verificarse."},
  {keys:["comer","gastronom","comida","chivo","empanada"],text:"La gastronomía local mencionada en el sitio incluye chivo al asador, lechón, empanadas y locro. Las fichas de establecimientos gastronómicos se incorporarán tras validar los datos."},
  {keys:["emergencia","bombero","policía","policia","salud","médico","medico","farmacia"],text:"Este prototipo aún no dispone de una lista validada de teléfonos de emergencia. No queremos publicar números sin confirmar. Ante una urgencia, contactá directamente a los servicios oficiales locales."},
  {keys:["hola","buenas","buenos días","buenos dias"],text:"¡Hola! Puedo orientarte sobre naturaleza, fiestas, mapa y los servicios previstos para Papagayos."}
];
function addMessage(text, role) {
  if (!chatLog) return;
  const p = document.createElement("p");
  p.className = `chat-message ${role === "user" ? "user-message" : "bot-message"}`;
  p.textContent = text;
  chatLog.appendChild(p);
  chatLog.scrollTop = chatLog.scrollHeight;
}
function answerQuestion(question) {
  const q = question.toLocaleLowerCase("es");
  const match = responses.find(item => item.keys.some(key => q.includes(key)));
  return match ? match.text : "Todavía no tengo una respuesta verificada para esa consulta. Podés explorar el mapa o comunicarte con los canales de Turismo publicados en esta página.";
}
function sendQuestion(question) {
  const clean = question.trim();
  if (!clean) return;
  addMessage(clean, "user");
  addMessage(answerQuestion(clean), "bot");
}
if (chatForm && chatInput) {
  chatForm.addEventListener("submit", event => {
    event.preventDefault();
    sendQuestion(chatInput.value);
    chatInput.value = "";
  });
  document.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => sendQuestion(button.dataset.question)));
}
