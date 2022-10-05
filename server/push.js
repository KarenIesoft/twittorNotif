const fs = require('fs');


const urlsafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid.json');

const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:kmairena@iesoft.net',
    vapid.publicKey,
    vapid.privateKey
);

let suscripciones = require('./subs-db.json');

//obtener key para las notificaicones
module.exports.getKey = () => {
    return urlsafeBase64.decode(vapid.publicKey); //codificar
};


//agregar suscripciones a un archivo json
module.exports.addSubscription = (suscripcion) => {

    suscripciones.push(suscripcion);
    fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones));
};

//enviar notificacion
module.exports.sendPush = (post) => {

    console.log('Mandando PUSHES');

    const notificacionesEnviadas = []; //array de promesas

    //limpiar suscripciones invalidas, que solo quede 1
    suscripciones.forEach((suscripcion, i) => { //recorre el for
        const pushProm = webpush.sendNotification(suscripcion, JSON.stringify(post)) //enviar notif
            .then(console.log('Notificacion enviada ')) //ok
            .catch(err => {
                console.log('Notificación falló'); //error
                if (err.statusCode === 410) { // GONE, 410: ya no existe
                    suscripciones[i].borrar = true; //borrarla
                }
            });
        notificacionesEnviadas.push(pushProm); //agregar al array de promesas
    });

    //esperar a que terminen todas las promesas
    Promise.all(notificacionesEnviadas).then(() => { //esperar a que todas las notificaciones termine, varias promesas
        suscripciones = suscripciones.filter(subs => !subs.borrar); //filtrar las que no estén borradas
        fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones)); //agregarlas al archivo
    });

};