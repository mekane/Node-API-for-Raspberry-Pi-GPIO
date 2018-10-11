const Gpio = loadGpioModule();

const OutputMode = {
  mode: Gpio.OUTPUT
};

const pin = {
  '12': new Gpio(12, OutputMode),
  '13': new Gpio(13, OutputMode),
  '18': new Gpio(18, OutputMode)
};

redPin = pin['13'];
greenPin = pin['12'];
bluePin = pin['18'];

function getAllPinStatuses() {
  const result = {};
  const allPinIds = Object.keys(pin);

  allPinIds.forEach(id => result[id] = getPinStatus(id));

  return result;
}

function getPinStatus(pinId) {
  const gpioForPin = pin[pinId];

  return {
    mode: gpioForPin.getMode(),
    level: gpioForPin.digitalRead(),
    pwm: gpioForPin.getPwmDutyCycle()
  };
}

function getColor() {
  //get PWM duty cycles and convert to color codes
}

function setColor(redVal, greenVal, blueVal) {

}

function mockGpio() {
  return {
    getMode: () => 'OUTPUT',
    digitalRead: () => 0,
    getPwmDutyCycle: () => 0
  }
}
mockGpio.OUTPUT = 'output';

function loadGpioModule() {
  if (process.env['TEST'])
    return mockGpio;
  else
    return require('pigpio').Gpio;
}

module.exports = {
  getAllPinStatuses,
  getColor,
  getPinStatus,
  setColor
};
