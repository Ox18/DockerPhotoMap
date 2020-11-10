const btnSearch = document.querySelector("#btnSearch");
const txtSearch = document.querySelector("#txtSearch");
const viewCards = document.querySelector("#view-cards");
const setDataCard = (img) => {
  return `<div class="card animated fadeInDown">
            <img
              src="cloud/${img.filename}"
              class="card-img-top"
              alt="${img.filename}"
            />
            <div class="card-body">
              <h5 class="card-title"># ${img.codeNumber}</h5>
              <p class="card-text"></p>
              <a
                href="suministro/${img.idSuministro}"
                class="btn btn-primary"
              >
                View
              </a>
              <button
                type="button"
                class="btn btn-dark"
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onclick="setMap('${img.latitude}','${img.longitud}')"
              >
                <svg
                  color="red"
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  class="bi bi-geo-alt"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                  />
                </svg>
              </button>
            </div>
          </div>`;
};
async function getData(a) {
  const response = await fetch(`/get/l/${a}/`);
  const data = await response.json();
  return data;
}
async function get() {
  var txt = "";
  if (txtSearch.value.length >= 0 || txtSearch.length != undefined) {
    const data = await getData(txtSearch.value);
    data.forEach((x) => {
      txt += setDataCard(x);
    });
    viewCards.innerHTML = txt;
  } else {
    viewCards.innerHTML = "";
  }
}
btnSearch.addEventListener("click", () => {
  get();
});
