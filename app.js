// ---------- Datos de la ruta de esta tarde ----------
const stops = [
  { name: "Templo de Diana", lat: 38.9164509, lng: -6.3442129, num: "I" },
  { name: "Acueducto de los Milagros", lat: 38.9238379, lng: -6.347946, num: "II" },
  { name: "Puente Romano de Mérida", lat: 38.913754, lng: -6.3500785, num: "III" },
  { name: "Arco de Trajano", lat: 38.9178366, lng: -6.3464203, num: "IV" },
  { name: "Plaza de España", lat: 38.9164708, lng: -6.3464646, num: "V" }
];

// ---------- Mapa ----------
const map = L.map('map', { scrollWheelZoom: false }).setView([38.918, -6.347], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const brickIcon = (label) => L.divIcon({
  className: 'via-marker',
  html: `<div style="
      background:#7A2E2E;color:#ECE3D3;border:2px solid #C9A227;
      width:28px;height:28px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-family:'Cinzel',serif;font-weight:700;font-size:13px;">${label}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const latlngs = stops.map(s => [s.lat, s.lng]);

L.polyline(latlngs, { color: '#7A2E2E', weight: 4, opacity: 0.85, dashArray: '1,10', lineCap: 'round' }).addTo(map);

stops.forEach(s => {
  L.marker([s.lat, s.lng], { icon: brickIcon(s.num) })
    .addTo(map)
    .bindPopup(`<strong>${s.num}. ${s.name}</strong>`);
});

const bounds = L.latLngBounds(latlngs);
map.fitBounds(bounds, { padding: [30, 30] });

// ---------- Service worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// ---------- Botón de instalación ----------
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.add('show');
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.remove('show');
});

window.addEventListener('appinstalled', () => {
  installBtn.classList.remove('show');
});
