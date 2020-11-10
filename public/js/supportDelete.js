const btnCleanAllSuminister = document.querySelector("#btnCleanAllSuminister"),
  btnCleanAllUsers = document.querySelector("#btnCleanAllUsers");
async function clearAPI(name) {
  const response = await fetch(`/deleteall/${name}/`, {
    method: "POST",
  });
  const data = await response;
  return data;
}
async function reApi(name) {
  const data = await clearAPI(name);
  if (data.status == 200) {
    alertify.success("cambio satisfactorio");
  } else {
    alertify.error("ocurrio un error.");
  }
}
btnCleanAllSuminister.addEventListener("click", () => {
  reApi("suministro");
});
btnCleanAllUsers.addEventListener("click", () => {
  reApi("users");
});
