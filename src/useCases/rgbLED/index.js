const redPin = 13;
const greenPin = 12;
const bluePin = 18;
const greenLight = 23;

//TODO: need to inline the jquery color picker images in the view
function getViewsPath() {
    return 'rgbLED/views';
}

function initialize(gpioController) {

    function getColor() {
        const redPwm = gpioController.getPinPwm(redPin);
        const greenPwm = gpioController.getPinPwm(greenPin);
        const bluePwm = gpioController.getPinPwm(bluePin);

        return {
            red: 255 - redPwm,
            green: 255 - greenPwm,
            blue: 255 - bluePwm
        }
    }

    function setColor(redVal, greenVal, blueVal) {
        //TODO: sanitize these values and clamp to 0-255

        gpioController.setPinPwm(redPin, 255 - redVal)
        gpioController.setPinPwm(greenPin, 255 - greenVal);
        gpioController.setPinPwm(bluePin, 255 - blueVal);
    }

    return [
        {
            method: 'get',
            path: '/color',
            description: 'Gets the RGB value currently set',
            handler: (req, res) => {
                const rgb = getColor();

                res.format({
                    html: () => res.render('rgbColor', {color: rgb}),
                    json: () => res.json(rgb)
                })
            }
        },
        {
            method: 'put',
            path: '/color',
            description: 'Sets the RGB value using JSON {red:<val>, green:<val>, blue:<val>}',
            handler: (req, res) => {
                const body = req.body || {red: 0, green: 0, blue: 0};
                const red = body.red;
                const green = body.green;
                const blue = body.blue;

                setColor(red, green, blue);

                res.send(`setColor(${red}, ${green}, ${blue})`);
            }
        }
    ]
}


module.exports = {
    getViewsPath,
    initialize
}