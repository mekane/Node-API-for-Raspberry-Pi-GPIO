/**
 * A use case is intended to be a self-contained module that can define some
 * server behavior to accomplish a specific set of behavior on top of the
 * generic GPIO foundation.
 *
 * It should be defined in its own directory in _src/useCases/_ in the index.js file.
 * It _must_ export a function named `initialize` that accepts the`gpioController` parameter.
 * It _may_ export a function named `getViewsPath` that returns a string which is the
 * location of mustache templates to be rendered by routes in the use case. It should be relative
 * to the `src/useCases` directory.
 *
 * gpioController is an instance of the GPIO Controller that will be used by
 * the server and allows control of the GPIO pins.
 *
 * Initialize must return an array of route definitions that conform to this structure:
 * {
        method: 'put',
        path: '/pin/:id',
        description: 'route description',
        handler: aFunction
   }
 *
 * Handlers are just standard Express middleware functions that will get the request and response objects.
 * The server will add the Use Case's directory `/views/` to the path for rendering, so the use case can include
 * .mustache templates and render them with `response.render('templateName')`
 */
function getViewsPath() {
    return 'example/views';
}

function initialize(gpioController) {
    console.log('Debug: Initialize Blank use case');

    function exampleHandler(req, res) {
        console.log('Debug: Handling /example/2 route');
        gpioController.setPinStatus(17, 1);
        res.send('ok');
    }

    return [
        {
            method: 'get',
            path: '/example/1',
            description: 'An example route that set a pin status',
            handler: exampleHandler
        },
        {
            method: 'put',
            path: '/example/2',
            description: 'An example route that uses the PUT method and renders a view',
            handler: (req, res) => {
                console.log('Debug: Handling /example/2 route');
                gpioController.setPinStatus(17, 1);
                res.render('myView', {data: true});
            }
        }
    ];
}

module.exports = {
    getViewsPath,
    initialize
}