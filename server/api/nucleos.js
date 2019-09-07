const bdPath = '../bd.json';
const bd = require(bdPath);

module.exports = {
    name: 'nucleos',
    execute: function (args) {
        console.log('API Call: Núcleos');
        if (args.length === 0 || args[0] === '') {
            console.log('API Response: Enviados todos los núcleos');
            return bd.nucleos 
        }

        if (!bd.nucleos[args[0]]) { 
            console.warn('API Error: El núcleo ' + args[0] + ' no existe');
            return { error: 'El núcleo solicitado no existe' } 
        }

        console.log('API Response: Enviado el núcleo ' + args[0]);
        return bd.nucleos[args[0]];
    }
}