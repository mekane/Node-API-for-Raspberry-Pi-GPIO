const express = require('express');
const app = express();
const port = 3000;

const routes = [
    {
        method: 'get',
        path: '/',
        description: 'Lists all available routes',
        handler: getAllRouteDescriptions
    },
    {
        method: 'get',
        path: '/pin',
        description: 'Lists all pins and their state',
        handler: getAllPins
    },
    {
        method: 'get',
        path: '/pin/:id',
        description: 'Returns the status of the specified pin',
        handler: getPin
    },
    {
        method: 'put',
        path: '/pin/:id',
        description: 'Sets the status of a pin to on or off',
        handler: setPin
    }
];

setupRouting();
startServer();


function getAllRouteDescriptions(req, res) {
    res.send( routes.map(route => `${route.method.toUpperCase()} ${route.path} –– ${route.description}`) );
}

function getAllPins(req, res) {
    res.send( '[all pins]' );
}

function getPin(req, res) {
    const pinId = req.params['id'];
    res.send( `Status for pin ${pinId}` );
}

function setPin(req, res) {
    const pinId = req.params['id'];
    const state = req.body.state;
    res.send( `Set pin ${pinId} to ${state}` );
}

function setupRouting() {
    routes.forEach(route => app[route.method](route.path, route.handler));
}

function startServer() {
    app.use(require('body-parser').json());
    app.listen(port, () => console.log(`GPIO app listening on port ${port}!`));
}

