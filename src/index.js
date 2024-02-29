import express from 'express';
import consign from 'consign';
const bodyParser = require('body-parser');

// Importar para leer los valores de entorno
require('dotenv').config()

//console.log(process.env);

const app = express();

// Configurar body-parser para permitir payloads más grandes
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//cross access
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}
app.use(allowCrossDomain);

consign({
    cwd: __dirname
})
    //.include('libs/config.js')
    //.then('db.js')
    .include('libs/middlewares.js')
    //.then('routes')
    .then('routes/index.js')
    // En boot.js linea 7 y linea 12 estan comentadas
    .then('libs/boot.js')
    .into(app)


