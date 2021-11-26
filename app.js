const expres = require('express');
const app = expres();
const morgan = require('morgan');
const conectarDB =require('./config/db');
const routes = require('./routes/index');
const cors = require('cors');
const authJwt = require('./middleware/jwt');
const errorHandler = require("./middleware/error-handler")

require('dotenv/config');
const PORT = 3000

app.use(cors());
app.options('*',cors());

//MIddleware
app.use(expres.json());
app.use(morgan('tiny'));
app.use(authJwt());//Validacion del token || dentro de la funcion se declara que en la ruta login no se pida el token
app.use(errorHandler);
app.use('/public/uploads', expres.static(__dirname + '/public/uploads'));//direccion estaticas
//que siempre permanecen igual




//Connection DB
conectarDB();

app.use('/', routes)

app.listen(PORT, ()=>{
    console.log(`Server running in port ${PORT}`);
});
