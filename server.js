#!/usr/bin/env node

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

//for accepts-content matching
const html = 'text/html';
const json = 'application/json';

const routes = [{
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
  },
  {
    method: 'get',
    path: '/color',
    description: 'Gets the RGB value currently set',
    handler: getColor
  },
  {
    method: 'put',
    path: '/color',
    description: 'Sets the RGB value using JSON {red:<val>, green:<val>, blue:<val>}',
    handler: setColor
  }
];

const gpio = require('./gpio');

initialConfiguration();
setupRouting();
startServer();


function getAllRouteDescriptions(req, res) {
  const routeInfo = routes.map(route => ({
    method: route.method,
    path: route.path,
    description: route.description
  }));

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

  res.format({
    html: () => (result ? 'OK' : 'Failed to set pin status'),
    json: () => res.json({result})
  });
}

function getColor(req, res) {
  const rgb = gpio.getColor();

  res.format({
    html: () => res.render('rgbColor', { color: rgb }),
    json: () => res.json(rgb)
  })
}

function setColor(req, res) {
  const body = req.body || {};
  const red = body.red || 0;
  const green = body.green || 0;
  const blue = body.blue || 0;

  gpio.setColor(red, green, blue);

  res.send(`setColor(${red}, ${green}, ${blue})`);
}



function initialConfiguration() {
  app.use(bodyParser.json());
  app.engine('mustache', require('mustache-express')());
  app.set('view engine', 'mustache')

  gpio.setColor(0, 0, 0);
}

function setupRouting() {
  routes.forEach(route => app[route.method](route.path, route.handler));
}

function startServer() {
  app.listen(port, () => console.log(`GPIO app listening on port ${port}!`));
}
