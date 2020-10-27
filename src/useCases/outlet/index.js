const leftLed = 14;
const leftOutlet = 24;

const rightLed = 15;
const rightOutlet = 23;

function getViewsPath() {
    return 'outlet/views';
}

function initialize(gpioController) {
    return [
        {
            method: 'get',
            path: '/outlet',
            description: 'Render the outlet control view',
            handler: function renderOutletControlView(req, res) {
                res.render('outlet');
            }
        },
        {
            method: 'get',
            path: '/outlets',
            handler: (req, res) => {
                const right = gpioController.getPinStatus(rightOutlet).level;
                const left = gpioController.getPinStatus(leftOutlet).level;
                res.json({
                    left,
                    right,
                })
            }
        },
        {
            method: 'put',
            path: '/leftOutletOff',
            handler: (req, res) => {
                console.log('Turn left outlet off')
                gpioController.setPinStatus(leftLed, 0);
                const s = gpioController.setPinStatus(leftOutlet, 0);
                res.json(s);
            }
        },
        {
            method: 'put',
            path: '/leftOutletOn',
            handler: (req, res) => {
                console.log('Turn left outlet on')
                gpioController.setPinStatus(leftLed, 1);
                const s = gpioController.setPinStatus(leftOutlet, 1);
                res.send(s);
            }
        },
        {
            method: 'put',
            path: '/rightOutletOff',
            handler: (req, res) => {
                console.log('Turn right outlet off')
                gpioController.setPinStatus(rightLed, 0);
                const s = gpioController.setPinStatus(rightOutlet, 0);
                res.json(s);
            }
        },
        {
            method: 'put',
            path: '/rightOutletOn',
            handler: (req, res) => {
                console.log('Turn right outlet on')
                gpioController.setPinStatus(rightLed, 1);
                const s = gpioController.setPinStatus(rightOutlet, 1);
                res.send(s);
            }
        }
    ]
}

module.exports = {
    getViewsPath,
    initialize
}