const fs = require('fs');
const request = require('request-promise');
const cheerio = require('cheerio');
const mongo = require (__dirname + '/mongo.js');
const assert = require('assert');

module.exports = {
    getAllNucleos: function () {
        const urlNucleos = 'http://siu.ctal.es/es/horarios.php';

        request(urlNucleos, (error, response, html) => {
            if (!error) {
                const $ = cheerio.load(html);
                const nucleos = $('option', '#municipioLineas');
        
                nucleosObj = [];
        
                nucleos.each((i, elem) => {
                    const _id = 'n' + i;
                    const name = $(elem).text();
        
                    if (name !== 'Todos' && name !== 'Vacio') {
                        nucleosObj.push({ _id, name });
                    }
                });

                const db = mongo.getDb();
                db.collection('nucleos').insertMany(nucleosObj, (err, r) => {
                    assert.equal(null, err);
                })
            }
        })
    },

    getAllLineas: function () {
        console.log('Obteniendo lista de líneas');
        const urlLineas = 'http://siu.ctal.es/es/lineas.php';
    
        request(urlLineas, (error, response, html) => {
            if (!error) {
                const $ = cheerio.load(html);
                const span = $('span', '.linea').filter((i, elem) => {
                    return $(elem).text().startsWith('M-');
                })
    
                const lineas = [];
    
                span.each((i, elem) => {
                    var name = $(elem).text().trim();
                    var _id = name.replace('-', '').toLocaleLowerCase();
                    var url = 'http://siu.ctal.es/es/' + $(elem).parent('a').attr('href');

                    lineas.push({ _id, name, url })
                })
                  
                const db = mongo.getDb();
                db.collection('lineas').insertMany(lineas, (err, r) => {
                    assert.equal(null, err);
                    console.log('Líneas añadidas con éxito');
                })
            }
        })
    },
    
    getLineasTableInfo: async function () {
        const db = mongo.getDb();

        try {
            const cursor = await db.collection('lineas').find();

            while (await cursor.hasNext()) {
                const linea = await cursor.next();
                
                if (linea === null) { return; } 
                this.requestHorarios(linea._id, linea.url);
            }
        }

        catch (err) {
            console.warn(err.stack)
        }
    },
    
    requestHorarios: async function (id, url) {
        console.log('Obteniendo información de la tabla de horarios para: ' + id);
        request(url, async (error, response, html) => {
            if (error) { throw error; }
    
            const $ = cheerio.load(html);
            const tablas = $('.tabla_horario');
            const ida = $(tablas).get(0);
            const vuelta = $(tablas).get(1);
    
            console.log('Obteniendo núcleos ida');
            const nucleosIda = await this.getNucleosLinea(ida);

            console.log('Obteniendo paradas ida');
            const paradasIda = await this.getParadasLinea(ida);

            console.log('Obteniendo número de saltos');
            const saltos = await this.getSaltos(paradasIda);

            console.log('Obteniendo horarios ida');
            const horariosIda = this.getHorariosLinea(ida, paradasIda);

            const db = mongo.getDb();
    
            if (vuelta) {
                console.log('Obteniendo núcleos vuelta');
                const nucleosVuelta = await this.getNucleosLinea(vuelta);

                console.log('Obteniendo paradas vuelta');
                const paradasVuelta = await this.getParadasLinea(vuelta);

                console.log('Obteniendo horarios vuelta');
                const horariosVuelta = this.getHorariosLinea(vuelta, paradasVuelta);
    
                horarios = { 'ida': horariosIda, 'vuelta': horariosVuelta }
                db.collection('lineas').updateOne({ _id: id }, 
                    { $set: { nucleosIda, paradasIda, nucleosVuelta, paradasVuelta, horarios, saltos }});
            } else {
                horarios = { 'ida': horariosIda }
                db.collection('lineas').updateOne({ _id: id }, 
                    { $set: { nucleosIda, paradasIda, horarios, saltos }});
            }
        })
    },
    
    getNucleosLinea: async function (tabla) {
        const $ = cheerio.load(tabla);
    
        const nucleosTabla = $('th', '#fila1');
        const nucleos = [];
        const nucleosNames = [];

        const db = mongo.getDb();
        nucleosTabla.each((i, elem) => {
            const name = $(elem).text();
            if (name === 'Frecuencia') { return; }
            nucleosNames.push(name);
        })


        try {
            for (var i = 0; i < nucleosNames.length; i++) {
                const doc = await db.collection('nucleos').findOne({ name: nucleosNames[i] });

                if (doc === null) {
                    console.log(nucleosNames[i]);
                    continue;
                }

                nucleos.push(doc._id);
            }
        } catch (err) {
            console.log(err.stack);
        }

        console.log('Núcleos obtenidos');
        return nucleos;
    },
    
    // Como no hay forma de recoger todas las paradas desde una sola URL
    // desde aquí se consigue la información completa de las paradas
    // y las relativas para las líneas
    getParadasLinea: async function (tabla) {
        const $ = cheerio.load(tabla);
    
        // Generación dinámica de IDs
        let _id;
    
        const paradasFila = $('tr').get(1);
        const paradasTabla = $('th', paradasFila);
        const paradasLinea = [];
        const paradas = [];
          
        const db = mongo.getDb();

        try {
            const doc = await db.collection('paradas').findOne({ _id: 0 });
            _id = 'p' + doc.index;

            paradasTabla.each((i, elem) => {
                const name = $(elem).text();
                const zona = this.getZona($(elem).css('background'));
                paradas.push({ name, zona });
            })

            for (var i = 0; i < paradas.length; i++) {
                const res = await db.collection('paradas').findOne({ name: paradas[i].name });   
                if (res != null && res.name) {
                    paradasLinea.push(res._id);
                } else {
                    db.collection('paradas').insertOne({ _id, name: paradas[i].name, zona: paradas[i].zona })
                    paradasLinea.push(_id);

                    const doc = await db.collection('paradas').findOneAndUpdate({ _id: 0 }, { $inc: { index: 1 } },
                        { returnOriginal: false });
                    _id = 'p' + doc.value.index;
                }
            }
        } catch (err) {
            console.log(err.stack);
        }

        console.log('Paradas obtenidas');
        return paradasLinea;
    },
    
    getHorariosLinea: function (tabla, paradas) {
        const $ = cheerio.load(tabla);
        const filas = $('tr');
        const horarios = {};
    
        filas.each((i, elem) => {
            if (i < 2) { return; }
            const data = $('td', elem);
    
            let frecuencia = $(data.get(paradas.length)).text();
            
            for (var j = 0; j < paradas.length; j++) {
                const hora = $(data.get(j)).text();
                const horario = { hora, frecuencia }
    
                if (!horarios[paradas[j]]) { 
                    horarios[paradas[j]] = [];
                }
    
                horarios[paradas[j]].push(horario);
            }
        })
    
        console.log('Horarios obtenidos');
        return horarios;
    },

    getZona: function (color) {
        switch (color) {
            case '#6db0ff': return 'A';
            case '#aaff85': return 'B';
            case '#da85ff': return 'C';
            case '#3cff8e': return 'D';
            case '#00da64': return 'E';
            case '#ff150c': return 'F';
            case '#ff8594': return 'G';
            case '#da8700': return 'H';
            case '#ffc124': return 'I';
            case '#e6f20c': return 'J';
            default: return '';
        }
    },

    getSaltos: async function (paradas) {
        let saltos = -1;
        let zonas = [];

        const db = mongo.getDb();

        try {
            for (var i = 0; i < paradas.length; i++) {
                const parada = await db.collection('paradas').findOne({ _id: paradas[i] });

                if (!zonas.some(z => z === parada.zona)) {
                    zonas.push(parada.zona);
                    saltos++;
                }
            }

            return saltos;
        }

        catch (err) {
            console.log(err.stack);
            return saltos;
        }
    }
}
