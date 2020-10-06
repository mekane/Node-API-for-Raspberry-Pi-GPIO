#!/usr/bin/env node

const accessLogger = require('./accessLogger');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//for accepts-content matching
const html = 'text/html';
const json = 'application/json';

function initialize(port, gpio, useCases) {

    const baseRoutes = [
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

    const app = express();
    app.use(bodyParser.json());
    app.use(accessLogger);
    app.use(express.static('public'));
    app.engine('mustache', require('mustache-express')());
    app.set('view engine', 'mustache')

    setupRouting(baseRoutes);
    useCases.forEach(useCase => setupRouting(useCase.initialize(gpio)));

    setupUseCaseViews();

    startServer();

    function setupRouting(routes) {
        routes.forEach(route => app[route.method](route.path, route.handler));
    }

    function setupUseCaseViews() {
        const useCaseViewPaths = [app.get('views')];
        useCases.forEach(useCase => {
            if (typeof useCase.getViewsPath === 'function') {
                const viewPath = path.resolve('src/useCases', useCase.getViewsPath());
                console.log('  add view path ' + viewPath);
                useCaseViewPaths.push(viewPath)
            }
        })
        app.set('views', useCaseViewPaths);
    }

    function startServer() {
        app.listen(port, () => console.log(`GPIO app listening on port ${port}!`));
    }

    function getAllRouteDescriptions(req, res) {
        const routeInfo = baseRoutes.map(route => ({
            method: route.method,
            path: route.path,
            description: route.description
        }));
        //TODO: add use case routes too

        res.format({
            html: () => res.render('allRouteDescriptions', {
                routes: routeInfo
            }),
            json: () => res.json(routeInfo)
        });
    }

    function getAllPins(req, res) {
        const allPins = gpio.getAllPinStatuses();

        res.format({
            html: () => res.render('allPinsStatus', {
                pins: allPinStatusesForHtml()
            }),
            json: () => res.json(allPins)
        });

        function allPinStatusesForHtml() {
            return Object.keys(allPins).map(id => {
                const pin = allPins[id];
                pin['id'] = id;
                return pin;
            })
        }
    }

    function getPin(req, res) {
        const pinId = req.params['id'];

        if (typeof pinId === 'undefined' || !pinId)
            return;

        const pinStatus = gpio.getPinStatus(pinId);

        res.format({
            html: () => res.render('pinStatus', {
                id: pinId,
                pin: pinStatus
            }),
            json: () => res.json(pinStatus)
        });
    }

    function setPin(req, res) {
        const pinId = req.params['id'];
        const body = req.body || {};
        const newState = body.state;

        const result = gpio.setPinStatus(pinId, newState);

        res.send(result);
    }
}

module.exports = {
    initialize
}