#!/usr/bin/node

const server = require('./src/server');

let defaultConfig = {
    port: 80,
    scheduleFile: './schedule.json'
}
let customConfig = {};
try {
    customConfig = require('./config.json');
} catch (error) {
    console.warn('Warning: missing config.json - using defaults')
}
const config = Object.assign(defaultConfig, customConfig);

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

const {Scheduler, FilePersistence} = require('./src/Scheduler.js');
const scheduler = Scheduler(FilePersistence(config.scheduleFile));

server.initialize(config.port, controller, useCases, scheduler);


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
