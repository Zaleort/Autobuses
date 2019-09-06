const fs = require('fs');
const request = require('request-promise');
const cheerio = require('cheerio');

const bdPath = './bd.json';
const bd = require(bdPath);

module.exports = {
    getAllNucleos: function () {
        const urlNucleos = 'http://siu.ctal.es/es/horarios.php';

        request(urlNucleos, (error, response, html) => {
            if (!error) {
                const $ = cheerio.load(html);
                const nucleos = $('option', '#municipioLineas');
        
                nucleosObj = bd.nucleos || {};
        
                nucleos.each((i, elem) => {
                    const value = 'n' + i;
                    const name = $(elem).text();
        
                    if (name !== 'Todos' && name !== 'Vacio') {
                        if (!nucleosObj[value]) {
                            nucleosObj[value] = {};
                        }

                        nucleosObj[value].name = name.trim();
                    }
                })

                bd.nucleos = nucleosObj;
        
                fs.writeFile('./server/bd.json', JSON.stringify(bd, null, 4), (err) => {
                    if (err) throw err;
                    console.log('Núcleos Urbanos añadidos con éxito');
                });
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
    
                const lineas = bd.lineas || {};
    
                span.each((i, elem) => {
                    var name = $(elem).text().trim().replace('-', '');
                    var url = $(elem).parent('a').attr('href');
    
                    if (!lineas[name]) {  
                        lineas[name] = {};
                    }
    
                    lineas[name].name = name;
                    lineas[name].url = 'http://siu.ctal.es/es/' + url;
                })
    
                bd.lineas = lineas;
    
                fs.writeFile('./server/bd.json', JSON.stringify(bd, null, 4), (err) => {
                    if (err) throw err;
                    console.log('Líneas añadidas con éxito');
                });
            }
        })
    },
    
    getLineasTableInfo: async function (callback) {
        if (!bd.lineas) { return; }
    
        for (var key in bd.lineas) {
            await this.requestHorarios(key, bd.lineas[key].url);
        }

        callback;
    },
    
    requestHorarios: async function (id, url, callback) {
        console.log('Obteniendo información de la tabla de horarios para: ' + id);
        request(url, (error, response, html) => {
            if (error) { throw error; }
    
            const $ = cheerio.load(html);
            const tablas = $('.tabla_horario');
            const ida = $(tablas).get(0);
            const vuelta = $(tablas).get(1);
    
            console.log('Obteniendo núcleos ida');
            const nucleosIda = this.getNucleosLinea(ida);

            console.log('Obteniendo paradas ida');
            const paradasIda = this.getParadasLinea(ida);

            console.log('Obteniendo horarios ida');
            const horariosIda = this.getHorariosLinea(ida, paradasIda);
    
            if (vuelta) {
                // Fusiona arrays eliminando duplicados
                console.log('Obteniendo núcleos vuelta');
                const nucleosVuelta = this.getNucleosLinea(vuelta);

                console.log('Obteniendo núcleos vuelta');
                const paradasVuelta = this.getParadasLinea(vuelta);

                console.log('Obteniendo núcleos vuelta');
                const horariosVuelta = this.getHorariosLinea(vuelta, paradasVuelta);
    
                bd.lineas[id].nucleos = [...new Set([...nucleosIda, ...nucleosVuelta])];
                bd.lineas[id].paradas = [...new Set([...paradasIda, ...paradasVuelta])];
                bd.lineas[id].horarios = { 'ida': horariosIda, 'vuelta': horariosVuelta }
            } else {
                bd.lineas[id].nucleos = nucleosIda;
                bd.lineas[id].paradas = paradasIda;
                bd.lineas[id].horarios = { 'ida': horariosIda }
            }
    
            fs.writeFile('./server/bd.json', JSON.stringify(bd, null, 4), (err) => {
                if (err) throw err;
                console.log('Horarios añadidos con éxito');
            });

            callback;
        })
    },
    
    getNucleosLinea: function (tabla) {
        const $ = cheerio.load(tabla);
    
        const nucleosTabla = $('th', '#fila1');
        const nucleos = [];
    
        nucleosTabla.each((i, elem) => {
            for (var key in bd.nucleos) {
                if (bd.nucleos[key].name === $(elem).text()) {
                    nucleos.push(key);
                }
            }
        })
    
        console.log('Núcleos obtenidos');
        return nucleos;
    },
    
    // Como no hay forma de recoger todas las paradas desde una sola URL
    // desde aquí se consigue la información completa de las paradas
    // y las relativas para las líneas
    getParadasLinea: function (tabla) {
        const $ = cheerio.load(tabla);
    
        // Generación dinámica de IDs
        let index = bd.paradasIndex || 0;
    
        const paradasFila = $('tr').get(1);
        const paradasTabla = $('th', paradasFila);
    
        const paradas = bd.paradas || {};
        const paradasLinea = [];
    
        paradasTabla.each((i, elem) => {
            const name = $(elem).text();
            const zona = $(elem).css('background');
            let id;
    
            if (Object.keys(paradas).length !== 0) {
                for (var key in paradas) {
                    if (paradas[key].name === name) {
                        id = key;
                        break;
                    }
                }
            }
    
            if (!id) {
                id = 'p' + index;
                index++;
            }
    
            if (!paradas[id]) {
                paradas[id] = {}
            }
    
            paradas[id].name = name;
            paradasLinea.push(id);
        })
    
        bd.paradas = paradas;
        bd.paradasIndex = index;

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
    }
}
