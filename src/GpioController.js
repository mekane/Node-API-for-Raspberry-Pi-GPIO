'use strict';

const pin = {};

/**
 *
 * @param GPIO - the gpio module to use for controlling the raspberry pi pins
 * @param pinsToEnable an object that maps pin numbers to modes. Example:
 * {
 *     '10': 'output',
 *     '11': 'input'
 * }
 */
function GpioController(GPIO, pinsToEnable) {
    const InputMode = {
        mode: GPIO.INPUT
    };

    const OutputMode = {
        mode: GPIO.OUTPUT
    };

    console.log('gpio controller - init pins', pinsToEnable)

    Object.keys(pinsToEnable).forEach(pinId => {
        const pinNumber = parseInt(pinId, 10);
        const pinValue = pinsToEnable[pinId];
        const mode = !!pinValue ? OutputMode : InputMode;

        if (!isNaN(pinNumber)) {
            pin[pinNumber] = new GPIO(pinNumber, mode);
            console.log(`  enable gpio pin ${pinNumber}: ${pinValue}`);
        }
    });

    function getAllPinStatuses() {
        const result = {};
        const allPinIds = Object.keys(pin);

        allPinIds.forEach(id => result[id] = getPinStatus(id));

        return result;
    }

    function getPinStatus(pinId) {
        const gpioForPin = pin[pinId];

        if (typeof gpioForPin === 'undefined')
            return {};

        const mode = gpioForPin.getMode();
        let level = 'unknown';
        let pwm = '-';

        try {
            level = gpioForPin.digitalRead();
        } catch (e) {
        }

        try {
            pwm = gpioForPin.getPwmDutyCycle()
        } catch (e) {
        }

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
        } else {
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
        } else {
            return false;
        }
    }

    return {
        getAllPinStatuses,
        getPinPwm,
        getPinStatus,
        setPinPwm,
        setPinStatus
    }
}

module.exports = {
    GpioController
}