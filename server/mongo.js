// @TODO Conexión segura con usuario
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'autobuses';
let db;
const client = new MongoClient(url, { useUnifiedTopology: true });

module.exports = {
    connect: function (callback) {
        client.connect((err) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log('Conectado a la base de datos');
            db = client.db(dbName);
            return callback(client);
        });
    },

    getDb: function () {
        return db;
    }
}