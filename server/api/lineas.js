const bdPath = '../bd.json';
const bd = require(bdPath);

module.exports = {
    name: 'lineas',
    execute: function (args) {
        // Petición de todas la líneas desde /api/lineas
        if (args.length === 0 || args[0] === '') {
            const lineas = {};

            for (var l in bd.lineas) {
                lineas[l] = {
                    name: bd.lineas[l].name,
                    nucleos: bd.lineas[l].nucleos,
                    paradas: bd.lineas[l].paradas,
                }
            }

            return lineas;
        }

        // Petición de una línea concreta desde /api/lineas/:lineas
        if (!bd.lineas[args[0]]) { return { error: 'La línea no existe' } }

        return bd.lineas[args[0]];
    }
}
