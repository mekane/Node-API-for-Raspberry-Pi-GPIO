'use strict';

const Gpio = loadGpioModule();

const OutputMode = {
  mode: Gpio.OUTPUT
};

const pin = {
  '12': new Gpio(12, OutputMode),
  '13': new Gpio(13, OutputMode),
  '18': new Gpio(18, OutputMode),
  '23': new Gpio(23, OutputMode)
};

const redPin = pin['13'];
const greenPin = pin['12'];
const bluePin = pin['18'];

function getAllPinStatuses() {
  const result = {};
  const allPinIds = Object.keys(pin);

  allPinIds.forEach(id => result[id] = getPinStatus(id));

  return result;
}

function getPinStatus(pinId) {
  const gpioForPin = pin[pinId];

  const mode = gpioForPin.getMode();
  let level = 'unknown';
  let pwm = '-';

  try {
    level = gpioForPin.digitalRead();
  } catch (e) {}

  try {
    pwm = gpioForPin.getPwmDutyCycle()
  } catch (e) {}

  if (gpioForPin)
    return {
      mode,
      level,
      pwm
    };
  else
    return {};
}

function setPinStatus(pinId, newState) {
  const gpioForPin = pin[pinId];
  const newLevel = !!newState;

  if (gpioForPin /* && mode == 'OUTPUT' */) {
    gpioForPin.digitalWrite(newLevel);
    return true;
  }
  else {
    return false;
  }
}

function getColor() {
  const redPwm = redPin.getPwmDutyCycle();
  const greenPwm = greenPin.getPwmDutyCycle();
  const bluePwm = bluePin.getPwmDutyCycle();

  return {
    red: 255 - redPwm,
    green: 255 - greenPwm,
    blue: 255 - bluePwm
  }
}

function setColor(redVal, greenVal, blueVal) {
  //TODO: sanitize these values and clamp to 0-255

  redPin.pwmWrite(255 - redVal);
  greenPin.pwmWrite(255 - greenVal);
  bluePin.pwmWrite(255 - blueVal);
}

function mockGpio() {
  return {
    getMode: () => 'OUTPUT',
    digitalRead: () => 0,
    digitalWrite: () => 0,
    getPwmDutyCycle: () => 0,
    pwmWrite: () => {}
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
  setColor,
  setPinStatus
};
