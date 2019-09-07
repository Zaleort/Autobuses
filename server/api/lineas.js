const bdPath = '../bd.json';
const bd = require(bdPath);

module.exports = {
    name: 'lineas',
    execute: function (args) {
        // Petición de todas la líneas desde /api/lineas
        console.log('API Call: Líneas');
        if (args.length === 0 || args[0] === '') {
            const lineas = {};

            for (var l in bd.lineas) {
                lineas[l] = {
                    name: bd.lineas[l].name,
                    nucleos: bd.lineas[l].nucleos,
                    paradas: bd.lineas[l].paradas,
                }
            }

            console.log('API Response: Enviadas todas las líneas')
            return lineas;
        }

        // Petición de una línea concreta desde /api/lineas/:lineas
        if (!bd.lineas[args[0]]) { 
            console.warn('API Error: La línea ' + args[0] + ' no existe');
            return { error: 'La línea no existe' } 
        }

        console.log('API Response: Enviada la línea ' + args[0]);
        return bd.lineas[args[0]];
    }
}
