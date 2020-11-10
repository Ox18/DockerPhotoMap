function iniciarMapa(lat1, lng1) {
  var cord = {
    lat: lat1,
    lng: lng1,
  };
  generarMapa(cord);
}
function generarMapa(coordenadas) {
  var mapa = new google.maps.Map(document.querySelector("#mapa"), {
    zoom: 16,
    center: new google.maps.LatLng(coordenadas.lat, coordenadas.lng),
  });
  marcador = new google.maps.Marker({
    map: mapa,
    draggable: true,
    position: new google.maps.LatLng(coordenadas.lat, coordenadas.lng),
  });
  marcador.addListener("dragend", function (event) {
    latitud.value = this.getPosition().lat();
    longitud.value = this.getPosition().lng();
  });
}
function setMap(a, b) {
  iniciarMapa(a, b);
}
