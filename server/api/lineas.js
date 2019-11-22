const mongo = require('../mongo.js');

module.exports = {
    name: 'lineas',
    execute: async function (args) {
        // Petición de todas la líneas desde /api/lineas
        console.log('API Call: Líneas');
        const db = mongo.getDb();
        if (args.length === 0 || args[0] === '') {
            try {
                const lineas = await db.collection('lineas').find({}, { projection: { horarios: 0, url: 0 } }).toArray();
                console.log('API Response: Enviadas todas las líneas');
                return lineas;
            } 
            
            catch (err) {
                console.log(err.stack);
                return { error: 'Ha ocurrido un error al contactar con la base de datos' };
            }
        }

        // Petición de una línea concreta desde /api/lineas/:lineas
        else {
            try {
                const linea = await db.collection('lineas').findOne({ _id: args[0] }, { projection: { url: 0 } });

                if(linea === null) {
                    console.warn('API Error: La línea ' + args[0] + ' no existe');
                    return { error: 'La línea no existe' } 
                }

                return linea;
            }

            catch (err) {
                console.log(err.stack);
                return { error: 'Ha ocurrido un error al contactar con la base de datos' };
            }
        }
    }
}
