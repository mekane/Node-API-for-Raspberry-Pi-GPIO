# Code Organization

This project is set up as a series of modules and an Express server which are initialized by
a main module (index.js). 

*accessLogger* - is a simple logging utility to record requests to the API and is imported 
directly by the Express server.

*GpioController* - is a wrapper around the `pigpio` api which provides some higher level functions
that are useful for the API, as well as enabling a test mode that doesn't do real gpio. An instance
of this module is initialized with a reference to the pigpio module or a test mock and then passed
into the Server module.

*Scheduler* - a stand-alone, optional module that provides a way to track tasks offline and compare
a timestamp to see if they are ready to be run. It can be initialized with any kind of persistence,
as long as it provides `putJson()` and `getJson()` methods. A file storage module is included. The
Scheduler is initialized with persistence and passed into the server to back the schedule routes.

*server* - a module that accepts the other components and provides a REST-style web api to read
and set the gpio pins of the device on which it's running. Out of the box it provides routes to
list pins, get the status of an individual pin, or to set the status of a pin. Behavior can be
expanded with use cases.

## Use Cases

Use cases are plugin-style modules that add extra routes to the Express server to provide more
detailed behavior based on the configuration of the raspberry pi device. Included are an example
use case that can be copied to make a new one, an "outlet" use case for a device that controls
outlets via relays, and one called "rgbLED" for using pwm to change the color of an rgb LED. 
These two use cases provide routes that are tailored for the specific features as well as their
own UI's to control the behavior via the API. 