# Outlet

This use case is for controlling a setup with two relays hooked up via gpio to control two outlets.
There are also two LED's on gpio pins to include power indicators for the outlets.

The `index.js` file adds routes to turn on and off the left and right outlets, which are basically
just convenient api endpoints that wrap the right gpio pin operations.

The bash scripts in `scripts/` are for crontab to reference so it can do the appropriate thing at scheduled times.

## example contab:

# Weekday evenings: Turn the heater on at 8pm until 10pm
0 20 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/leftOutletOn.sh
0 22 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/leftOutletOff.sh

# Weekday evenings: Turn the fan on at 9pm until 7am the next morning (if the next day is also a week day)
0 20 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/rightOutletOn.sh
0  7 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/rightOutletOff.sh

# Weekday mornings: Turn the heater on at 6am until 7am
0  6 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/leftOutletOn.sh
0  7 * * 1-5 /home/pi/Node-API-for-Raspberry-Pi-GPIO/src/useCases/outlet/scripts/leftOutletOff.sh
