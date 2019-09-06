const fs = require('fs')
const scrape = require('./getTableData.js');
const express = require('express');
const app = express();
const bdPath = './bd.json';
const bd = require(bdPath);

app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    console.log('API Call');
    res.json(bd.lineas);
});

app.use(express.static('/home/henrique/Documentos/Proyectos/Autobuses/dist/Autobuses'));
app.get('/api/lineas', (req, res, next) => {
    console.log('GET Request: Líneas');
    res.json(bd.lineas);
});

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

app.get('*', (req, res) => {
    res.sendFile('/home/henrique/Documentos/Proyectos/Autobuses/dist/Autobuses/index.html');
})

app.listen(3000, () => console.log('Escuchando en el puerto 3000'));