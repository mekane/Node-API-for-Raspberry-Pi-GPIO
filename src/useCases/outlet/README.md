# Outlet

This use case is for controlling a setup with two relays hooked up via gpio to control two outlets.
There are also two LED's on gpio pins to include power indicators for the outlets.

The `index.js` file adds routes to turn on and off the left and right outlets, which are basically
just convenient api endpoints that wrap the right gpio pin operations.

The bash scripts in `scripts/` are for crontab to reference so it can do the appropriate thing at scheduled times.

## example contab:

# Every Weekday: Turn on the heater (left outlet) at 8pm
0 20 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/leftOutletOn.sh

# Every Weekday: Turn off the heater at 10pm
0 22 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/leftOutletOff.sh


# Every Weekday: Turn on the fan (right outlet) at 9pm
0 20 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/rightOutletOn.sh

# Every Weekday: Turn off the fan at 7am
0 7 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/rightOutletOn.sh
