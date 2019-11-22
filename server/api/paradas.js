const mongo = require('../mongo.js');

module.exports = {
    name: 'paradas',
    execute: async function (args) {
        console.log('API Call: Paradas');
        const db = mongo.getDb();
        if (args.length === 0 || args[0] === '') {
            try {
                const paradas = await db.collection('paradas').find().toArray();
                console.log('API Response: Enviadas todas las paradas');
                return paradas;
            }

            catch (err) {
                console.log(err.stack);
                return { error: 'Ha ocurrido un error conectándose con la base de datos' }
            }
        }

        else {
            try {
                const nucleo = await db.collection('paradas').findOne({ _id: args[0] });

                if (nucleo === null) {
                    console.warn('API Error: La parada ' + args[0] + ' no existe');
                    return { error: 'La parada solicitada no existe' }
                }

                console.log('API Response: Enviada la parada ' + args[0]);
                return nucleo;
            }

            catch (err) {
                console.log(err.stack);
                return { error: 'Ha ocurrido un error conectándose con la base de datos' };
            }
        }
    }
}