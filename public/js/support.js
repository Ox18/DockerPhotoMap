const inputNewUsername = document.querySelector("#inputNewUsername"),
  inputNewPassword = document.querySelector("#inputNewPassword"),
  inputNewName = document.querySelector("#inputNewName"),
  selectType = document.querySelector("#selectType");
const btnNewUser = document.querySelector("#btnNewUser");
function clearDataUser() {
  inputNewUsername.value = "";
  inputNewPassword.value = "";
  inputNewName.value = "";
}
async function setData() {
  var mor = {
    username: inputNewUsername.value,
    password: inputNewPassword.value,
    name: inputNewName.value,
    type: selectType.value,
  };
  const response = await fetch("/add/user/", {
    method: "POST",
    body: JSON.stringify(mor),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const result = data.responseText;
  if (result == "exist") {
    alertify.error("el usuario ya existe");
  } else if (result == "ok") {
    alertify.success("Usuario agregado");
    clearDataUser();
  } else {
    alertify.error(result);
  }
}
btnNewUser.addEventListener("click", () => {
  if (
    inputNewUsername.value.length > 0 &&
    inputNewPassword.value.length > 0 &&
    inputNewName.value.length > 0
  ) {
    setData();
  } else {
    alertify.error("datos no llenos");
  }
});

let ctx = document.getElementById("myChart").getContext("2d");
let labels = ["Memory Total 💿", "Memory Used 💾"];
let colorHex = ["#ff3d3d", "#ffce90"];

let myChart = new Chart(ctx, {
  type: "pie",
  data: {
    datasets: [
      {
        data: [2, 2],
        backgroundColor: colorHex,
      },
    ],
    labels: labels,
  },
  options: {
    responsive: true,
    legend: {
      position: "bottom",
    },
    plugins: {
      datalabels: {
        color: "#fff",
        anchor: "end",
        align: "start",
        offset: -10,
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 25,
        backgroundColor: (context) => {
          return context.dataset.backgroundColor;
        },
        font: {
          weight: "bold",
          size: "10",
        },
        formatter: (value) => {
          return value + " %";
        },
      },
    },
  },
});
