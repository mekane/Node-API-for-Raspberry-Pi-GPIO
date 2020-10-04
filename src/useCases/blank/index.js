/**
 * A use case is intended to be a self-contained module that can define some
 * server behavior to accomplish a specific set of behavior on top of the
 * generic GPIO foundation.
 *
 * It should be defined in its own directory in _src/useCases/_ in the index.js file.
 * It must export a single function named `initialize` that accepts an `app` parameter
 * and a `gpioController` parameter.
 *
 * App is the express instance used in the server, and is used to add routes.
 * gpioController is an instance of the GPIO Controller that will be used by
 * the server and allows control of the GPIO pins.
 */
function initialize(app, gpioController) {
    console.log('Debug: Initialize Blank use case');

    app.get('/example', (req, res) => {
        console.log('Debug: Handling /example route');
        gpioController.setPinStatus(17, 1);
        res.send('ok');
    })
}

module.exports = {
    initialize
}