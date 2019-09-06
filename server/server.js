const fs = require('fs')
const scrape = require('./getTableData.js');
const express = require('express');
const app = express();

const api = new Map();
const apiFiles = fs.readdirSync('./api');

for (let file of apiFiles) {
    const method = require(`./api/${file}`);
    api.set(method.name, method);
}

app.use('/api', (req, res, next) => {
    // Necesario para poder llamar a la API desde el servidor de desarrollo
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Separa los diferentes argumentos de la URL
    const url = req.url.split('/');
    if (url.length < 2 || url[1] === '') { 
        res.json({ error: 'URL inválida' })
        return;
    }

    // Busca el método de la API, si no existe devuelve un error
    const method = api.get(url[1]);
    if (!method) { 
        res.json({ error: 'La función no existe' })
        return;
    }

    const args = url.slice(2);
    console.log(args);

    // El método devuelve la respuesta al cliente
    res.json(method.execute(args));
});

app.use(express.static('/home/henrique/Documentos/Proyectos/Autobuses/dist/Autobuses'));
app.get('*', (req, res) => {
    res.sendFile('/home/henrique/Documentos/Proyectos/Autobuses/dist/Autobuses/index.html');
})

app.listen(3000, () => console.log('Escuchando en el puerto 3000'));
