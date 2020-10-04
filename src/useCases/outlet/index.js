const leftLed = 15;
const leftOutlet = 24;

const rightLed = 14;
const rightOutlet = 23;

function initialize(app, gpioController) {

    const views = app.get('views')
    const newViews = [].concat(views).concat('src/useCases/outlet/views')
    app.set('views', newViews);

    app.get('/outlet', (req, res) => {
        res.render('outlet');
    });

    app.get('/outlets', (req, res) => {
        const right = gpioController.getPinStatus(rightOutlet).level;
        const left = gpioController.getPinStatus(leftOutlet).level;
        res.json({
            left,
            right
        })
    })

    app.put('/leftOutletOff', (req, res) => {
        console.log('Turn left outlet off')
        gpioController.setPinStatus(leftLed, 0);
        const s = gpioController.setPinStatus(leftOutlet, 0);
        res.json(s);
    })

    app.put('/leftOutletOn', (req, res) => {
        console.log('Turn left outlet on')
        gpioController.setPinStatus(leftLed, 1);
        const s = gpioController.setPinStatus(leftOutlet, 1);
        res.send(s);
    })


    app.put('/rightOutletOff', (req, res) => {
        console.log('Turn right outlet off')
        gpioController.setPinStatus(rightLed, 0);
        const s = gpioController.setPinStatus(rightOutlet, 0);
        res.json(s);
    })

    app.put('/rightOutletOn', (req, res) => {
        console.log('Turn right outlet on')
        gpioController.setPinStatus(rightLed, 1);
        const s = gpioController.setPinStatus(rightOutlet, 1);
        res.send(s);
    })
}

module.exports = {
    initialize
}