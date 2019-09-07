const bdPath = '../bd.json';
const bd = require(bdPath);

module.exports = {
    name: 'paradas',
    execute: function (args) {
        console.log('API Call: Paradas');
        if (args.length === 0 || args[0] === '') {
            console.log('API Response: Enviadas todas las paradas');
            return bd.paradas 
        }

        if (!bd.paradas[args[0]]) {
            console.warn('API Error: La parada ' + args[0] + ' no existe');
            return { error: 'La parada solicitada no existe' } 
        }

        console.log('API Response: Enviada la parada ' + args[0]);
        return bd.paradas[args[0]];
    }
}