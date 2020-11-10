const { Router } = require("express");
const router = Router();
const pool = require("../database");
const multer = require("multer");
const path = require("path");
const dirCloud = "./public/cloud/";
const fs = require("fs");
const convertSize = require("../models/index");

var mime = require("mime-types");
const storage = multer.diskStorage({
  destination: dirCloud,
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  var sql = "select * from suministro";
  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err.code);
    }
    if (req.session.auth) {
      res.render("index", {
        titulo: "Gallery",
        usuario: req.session.usuario,
        admin: req.session.admin,
        images: result,
      });
    } else {
      res.redirect("/login");
    }
  });
});
router.post("/add/user", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.session.auth == 1 && req.session.admin == 1) {
    const { username, password, name, type } = req.body;
    var sqlC = "select count(*) as cont from cuentas where username = ?";
    var sql =
      "INSERT INTO cuentas (`username`,`password`,`name`,`admin`) values (?,?,?,?)";
    pool.query(sqlC, [username], (error, result) => {
      if (error) {
        console.error(error);
      }
      const contador = result[0].cont;
      if (contador) {
        res.send(JSON.stringify({ responseText: "exist" }));
      } else {
        res.send(JSON.stringify({ responseText: "ok" }));
        pool.query(sql, [username, password, name, type], (err, resultado) => {
          if (err) {
            console.error(err);
          }
          console.log("usuario agregado");
        });
      }
    });
  } else {
    res.send(JSON.stringify({ responseText: "erro de conexion" }));
  }
});
router.get("/image/:id/delete", async (req, res) => {
  if (req.session.auth) {
    const { id } = req.params;
    var dir = path.join(__dirname, "../public/cloud/");
    var sql = "select filename from suministro where idSuministro = ?";
    var sql2 = "delete from suministro where idSuministro = ?";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
      }
      const filename = result[0].filename;
      fs.unlink(`${dir}/${filename}`, function (err) {
        if (err) throw err;
        pool.query(sql2, [id], (err, result) => {
          if (err) {
            console.error(err);
          }
          res.redirect("/");
        });
      });
    });
  } else {
    res.redirect("/");
  }
});
router.get("/login", (req, res) => {
  if (req.session.auth) {
    res.redirect("/");
  } else {
    res.render("login", {
      titulo: "Login",
    });
  }
});
router.post("/deleteall/users", async (req, res) => {
  if (req.session.auth == 1 && req.session.admin == 1) {
    var sql = "delete from cuentas where idcuentas != ?";
    pool.query(sql, [req.session.idUser], (err, result) => {
      if (err) {
        console.error(err);
      }
      res.status(200).send("borrado exitosamente");
    });
  } else {
    res.status(404).send("error");
  }
});
router.post("/deleteall/suministro", async (req, res) => {
  if (req.session.auth == 1 && req.session.admin == 1) {
    var sql = "select * from suministro";
    pool.query(sql, (err, result) => {
      if (err) {
        console.error(err);
      }
      const numbers = result.map((x) => {
        try {
          fs.unlinkSync(`public/cloud/${x.filename}`);
          console.log("file removed");
        } catch (err2) {
          console.error("file error");
        }
      });
      var sql2 = "truncate table suministro";
      pool.query(sql2, (err3, result2) => {
        if (err3) {
          console.error(err3);
        }
      });
    });
    res.status(200).send("borrado exitosamente");
  } else {
    res.status(404).send("error!");
  }
});

router.get("/suministro/:id", async (req, res) => {
  const { id } = req.params;
  if (req.session.auth) {
    pool.query(
      "select *, (select name from cuentas as b where b.idcuentas = idUsuario) as nameUser from suministro WHERE idSuministro = ?",
      [id],
      (err, result) => {
        if (err) {
          console.error(err);
        }
        if (result.length > 0) {
          res.render("edit", {
            titulo: "Suministro",
            usuario: req.session.usuario,
            admin: req.session.admin,
            suministro: result[0],
          });
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    res.redirect("/");
  }
});
router.get("/get/l/:name", async (req, res) => {
  const { name } = req.params;
  var sql = "select * from suministro where codeNumber = ?";
  if (req.session.auth) {
    pool.query(sql, [name], (err, result) => {
      if (err) {
        console.error(err);
      }
      res.send(result);
    });
  } else {
    res.send([0]);
  }
});
router.get("/add", (req, res) => {
  if (req.session.auth) {
    res.render("add", {
      titulo: " Add Image",
      usuario: req.session.usuario,
      admin: req.session.admin,
    });
  } else {
    res.redirect("/");
  }
});
router.get("/support", async (req, res) => {
  if (req.session.auth == 1 && req.session.admin == 1) {
    var sql = "select sum(size) as s from suministro";
    pool.query(sql, (err, result) => {
      if (err) {
        console.error(err);
      }
      let Siz = 0;
      if (result[0].s >= 0 && result[0].s != null) {
        Siz = result[0].s;
      }
      res.render("support/index", {
        titulo: "Support",
        memory: {
          storage: {
            used: 155415269376,
            rest: Siz,
          },
          convert: {
            used: convertSize(155415269376),
            rest: convertSize(Siz),
          },
        },
        usuario: req.session.usuario,
        admin: req.session.admin,
      });
    });
  } else {
    res.redirect("/");
  }
});

router.get("/search", (req, res) => {
  if (req.session.auth) {
    res.render("search", {
      titulo: " Search",
      usuario: req.session.usuario,
      admin: req.session.admin,
    });
  } else {
    res.redirect("/");
  }
});

router.post("/upload", upload.single("image"), async (req, res) => {
  if (req.session.auth) {
    const { originalname, mimetype, filename, size } = req.file;
    const { suministro, ubication, latitud, longitud } = req.body;
    var sql =
      "INSERT INTO suministro (`originalName`, `type`, `filename`, `size`, `codeNumber`, `ubication`, `idUsuario`, `latitude`, `longitud`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    pool.query(
      sql,
      [
        originalname,
        mime.extension(mimetype),
        filename,
        size,
        suministro,
        ubication,
        req.session.idUser,
        latitud,
        longitud,
      ],
      (err, result) => {
        if (err) {
          console.error(err.code);
        }
      }
    );
    res.status(200).send("hola mundo!");
  } else {
    res.status(204);
  }
});

router.post("/login", async (req, res) => {
  const { user, pass } = req.body;
  pool.query(
    "select * from cuentas WHERE username = ? and password = ?",
    [user, pass],
    (err, result) => {
      if (err) {
        console.error(err.code);
      }
      if (result.length > 0) {
        var usuarioInfo = result[0];
        req.session.idUser = usuarioInfo.idcuentas;
        req.session.auth = 1;
        req.session.usuario = usuarioInfo.name;
        req.session.admin = usuarioInfo.admin;
        res.send({
          status: 1,
          nombre: usuarioInfo.name,
        });
      } else {
        res.send({
          status: "Datos incorrectos",
        });
      }
    }
  );
});

router.get("/salir", (req, res) => {
  req.session.auth = null;
  req.session.nombre = null;
  res.redirect("/");
});
module.exports = router;
