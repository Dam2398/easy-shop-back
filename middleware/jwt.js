const expressJwt = require('express-jwt');

function authJwt(){
    const secret = process.env.secret;
    return expressJwt({//autenticacion
        secret,
        algorithms: ['HS256'],//HS256 es un algoritmo para encriptar
        isRevoked: revoked
    }).unless({//unless funciona para quitar el middleware de autenticacion la ruta de login 
        path: [
            {url: /\/public\/uploads(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/product(.*)/, methods: ['GET','OPTIONS']},//ya que los porductos no se necesita autenticacion
            {url: /\/category(.*)/, methods: ['GET','OPTIONS']},///\/category(.*)/ es una expresion regular, para que reciba todas las url
            '/user/login',
            '/user/new'
        ]
    })
}

async function revoked(req, payload, done){//aqui van todos los roles, cuales estan rechazados y cuales permitidos
    if(!payload.isAdmin){
        done(null,true)//reotrna done is null || true poque es rechazado porque no admin
    }else{
        done();
    }
}

module.exports = authJwt;