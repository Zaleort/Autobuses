const mongo = require('../mongo.js');

module.exports = {
    name: 'nucleos',
    execute: async function (args) {
        console.log('API Call: Núcleos');
        const db = mongo.getDb();

        if (args.length === 0 || args[0] === '') {
            try {
                const nucleos = await db.collection('nucleos').find().toArray();
                console.log('API Response: Enviados todos los núcleos');
                return nucleos;
            }

            catch (err) {
                console.log(err.stack);
                return { error: 'Ha ocurrido un error conectándose con la base de datos' }
            }
        }

        else {
            try {
                const nucleo = await db.collection('nucleos').findOne({ _id: args[0] });

                if (nucleo === null) {
                    console.warn('API Error: El núcleo ' + args[0] + ' no existe');
                    return { error: 'El núcleo solicitado no existe' }
                }

                console.log('API Response: Enviado el núcleo ' + args[0]);
                return nucleo;
            }

            catch (err) {
                console.log(err.stack);
                return { error: 'Ha ocurrido un error conectándose con la base de datos' };
            }
        }
    }
}