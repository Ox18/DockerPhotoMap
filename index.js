const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "sdnjasfgaskfujbasgufjkig",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(require("./routes/index"));

app.listen(80, () => {
  console.log("Corriendo en el puerto 80");
});
