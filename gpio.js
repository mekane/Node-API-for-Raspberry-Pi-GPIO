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

  if (gpioForPin)
    return {
      mode: gpioForPin.getMode(),
      level: gpioForPin.digitalRead(),
      pwm: gpioForPin.getPwmDutyCycle()
    };
  else
    return {};
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

  redPin.pwmWrite(255-redVal);
  greenPin.pwmWrite(255-greenVal);
  bluePin.pwmWrite(255-blueVal);
}

function mockGpio() {
  return {
    getMode: () => 'OUTPUT',
    digitalRead: () => 0,
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
  setColor
};
