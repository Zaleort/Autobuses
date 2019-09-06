const bdPath = '../bd.json';
const bd = require(bdPath);

module.exports = {
    name: 'nucleos',
    execute: function (args) {
        if (args.length === 0 || args[0] === '') { return bd.nucleos }
        if (!bd.nucleos[args[0]]) { return { error: 'El núcleo solicitado no existe' } }

        return bd.nucleos[args[0]];
    }
}