const btnPreview = document.querySelector("#btnPreview");
const txtSuministro = document.querySelector("#txtSuministro");
const txtPreviewSuministro = document.querySelector("#txtPreviewSuministro");
const txtPreviewUbication = document.querySelector("#txtPreviewUbication");
btnPreview.addEventListener("click", () => {
  txtPreviewSuministro.value = txtSuministro.value;
});

const $form = document.querySelector("#form");

const $image = document.querySelector("#image");
const $file = document.querySelector("#file");
function renderImage(formData) {
  const file = formData.get("image");
  const image = URL.createObjectURL(file);
  $image.setAttribute("src", image);
}

const $suministro = document.querySelector("#txtSuministro");
function renderSuministro(formData) {
  const suministro = formData.get("suministro");
  $suministro.textContent = suministro;
}

$file.addEventListener("change", (event) => {
  const formData = new FormData($form);
  renderImage(formData);
});
async function setData(formularioData) {
  const formData = new FormData(formularioData.currentTarget);
  renderSuministro(formData);
  const response = await fetch("/upload/", {
    method: "POST",
    body: formData,
  });
  const data = await response;
  return data;
}
async function insertData(evento) {
  const data = await setData(evento);
  if (data.status == 200) {
    clearForm();
    alertify.success("Suministro saved");
  } else {
    alert("error");
    alertify.error("Error on upload image");
  }
}
function clearForm() {
  txtSuministro.value = "";
  $file.value = "";
}
$form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (
    txtSuministro.value.length > 0 &&
    $file.value.length > 0 &&
    latitud.value.length > 0 &&
    longitud.value.length > 0
  ) {
    insertData(event);
  } else {
    alertify.error("Error, formulario no rellenado.");
  }
});
