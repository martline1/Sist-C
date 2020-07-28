const express = require ('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

//helper con algunas funciones

const helpers = require('./helpers');


// crar concexion a la BD
const db = require('./config/db');

//importar modelo
require('./models/Pacientes');
require('./models/Expedientes');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));



//crar ina app de expreess

const app = express();

app.use(express.static('public'));

// habilitar pug
app.set('view engine','pug');

//añadir carpeta vistas
app.set('views', path.join(__dirname, './views'));



//ásar vadump a la app

app.use((req,res, next)=>{
    res.locals.vardump = helpers.vardump;
    next();
});

//habiliar bodyparser para leer consola 
app.use(bodyParser.urlencoded({extended:true}));




app.use('/',routes());
//puerto para eschuchar

app.listen(3000);


