#!/usr/bin/env node

const server = require('./src/server');

const {GpioController} = require('./src/GpioController');

const gpio = loadGpioModule();
const pins = {
    '14': gpio.OUTPUT,
    '15': gpio.OUTPUT,
    '23': gpio.OUTPUT,
    '24': gpio.OUTPUT
};
const controller = GpioController(gpio, pins);

const useCases = [
    //require('./src/useCases/example'),
    require('./src/useCases/outlet')
]

server.initialize(8080, controller, useCases);


function loadGpioModule() {
    function mockGpio() {
        return {
            getMode: () => 'OUTPUT',
            digitalRead: () => 0,
            digitalWrite: () => 0,
            getPwmDutyCycle: () => 0,
            pwmWrite: () => {
            }
        }
    }

    mockGpio.INPUT = 0;
    mockGpio.OUTPUT = 1;

    if (process.env['TEST'])
        return mockGpio;
    else
        return require('pigpio').Gpio;
}
