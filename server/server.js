const fs = require('fs')
const scrape = require('./getTableData.js');
const express = require('express');
const app = express();
const bdPath = './bd.json';
const bd = require(bdPath);

app.get('/', (req, res) => {

});

app.get('/api/lineas', (req, res) => res.json(bd.lineas));
app.get('/api/lineas/:linea', (req, res) => {
    const id = req.params.linea;
    console.log(id);
    if (!bd.lineas[id]) {
        res.json({ error: 'No existe la línea especificada' });
        return;
    }

    res.json(bd.lineas[id]);
});

app.get('api/nucleos', (req, res) => res.json(bd.nucleos));
app.get('/api/nucleos/:nucleo', (req, res) => {
    const id = req.params.nucleo;
    console.log(id);
    if (!bd.nucleos[id]) {
        res.json({ error: 'No existe el núcleo especificado' });
        return;
    }

    res.json(bd.lineas[id]);
});

app.get('api/paradas', (req, res) => res.json(bd.paradas));
app.get('/api/paradas/:parada', (req, res) => {
    const id = req.params.parada;
    console.log(id);
    if (!bd.paradas[id]) {
        res.json({ error: 'No existe la parada especificada' });
        return;
    }

    res.json(bd.paradas[id]);
});

app.listen(3000, () => console.log('Escuchando en el puerto 3000'));