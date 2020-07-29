const express          = require ("express");
const path             = require("path");
const bodyParser       = require("body-parser");
const expressValidator = require("express-validator");

// Import Own Components
const routes  = require("./routes");
const helpers = require("./helpers");
const db      = require("./config/db");

const port = 3000;

//importar modelo
require("./models/Pacientes");
require("./models/Expedientes");

db.sync()
    .then(() => console.log("Conectado a la base de datos"))
    .catch(error => console.log(error));

const app = express();

app.listen(port, () => console.log(`[Server] Listening on port ${port}`));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true }));

// habilitar pug
app.set("view engine","pug");

//añadir carpeta vistas
app.set("views", path.join(__dirname, "./views"));

// ásar vadump a la app
app.use((req,res, next)=>{
    res.locals.vardump = helpers.vardump;
    next();
});


app.use("/", routes());
