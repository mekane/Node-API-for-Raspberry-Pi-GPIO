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

function getPinPwm(pinId) {
  const gpioForPin = pin[pinId];
  return gpioForPin.getPwmDutyCycle()
}

function setPinPwm(pinId, newVal) {
  //TODO: sanitize these values and clamp to 0-255
  const gpioForPin = pin[pinId];

  if (gpioForPin /* && mode == 'OUTPUT' */) {
    gpioForPin.pwmWrite(newVal);
    return true;
  }
  else {
    return false;
  }
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
  getPinPwm,
  setPinPwm,
  getPinStatus,
  setPinStatus
};
