const latitud = document.querySelector("#latitud");
const longitud = document.querySelector("#longitud");
var options = {
  enableHighAccuracy: true,
  timeout: 6000,
  maximumAge: 0,
};
navigator.geolocation.getCurrentPosition(success, error, options);
function success(position) {
  var coordenadas = position.coords;
  latitud.value = coordenadas.latitude;
  longitud.value = coordenadas.longitude;
}
function error(error) {
  console.warn("ERROR(" + error.code + "): " + error.message);
}
