const bdPath = '../bd.json';
const bd = require(bdPath);

module.exports = {
    name: 'paradas',
    execute: function (args) {
        if (args.length === 0 || args[0] === '') { return bd.paradas }
        if (!bd.paradas[args[0]]) { return { error: 'La parada solicitada no existe' } }

        return bd.paradas[args[0]];
    }
}