# Node API for Raspberry Pi GPIO pins

The goal of this little projects is to enable a Raspberry Pi to expose a simple web api to get
and set the state of its GPIO pins. It is written in the Express library for Node.js

## Setup for Development

   * `npm install`
   * `npm start`

If you want verbose output for  debugging, run `npm debug` instead.

## Setup and Deploy on a Raspberry Pi

   * Assumes a default Raspberry Pi OS setup on the pi
   * You need to install NPM and Node. Note that the Debian repositories that Raspberry Pi OS uses don't generally
     provide a very recent version of Node. You can `sudo apt-get install npm` and take whatever version it gives you,
     or follow a community guide to install a later version from a custom apt repository.
   * Most of the source and documentation assumes that the project is cloned into `/home/pi/`.
   * Double check that the `index.js` file in the root of the project and any scripts in the `scripts/` directory of any
     uses cases you plan to use are executable.

### Set up Service

A definition file is included to run the Node API as a Linux service. This way it will automatically recover from errors
and will start automatically when the system boots up. This is nice in case the raspberry pi gets unplugged.

   * To install the service you need to copy the `nodeGpio.service` file to `/etc/systemd/system/`. Please see the
     [Raspbian documentation](https://www.raspberrypi.org/documentation/linux/usage/systemd.md) for more details.
   * If the project was not cloned to `/home/pi/Node-API-for-Raspberry-Pi-GPIO` you will need to adjust the path (in
     two places) in the .service file)
   * To stop, start or restart the service use the `service` command: `sudo service nodeGpio restart`
   * To view the service logs use `sudo journalctl -u nodeGpio`

### Set up cron

Cron jobs can combine very well with the service to automate whatever devices and tasks it is controlling. To edit the
cron table, use `crontab -e` which will open a special editor. See the README file in src/useCases/outlet/ for an
example cron setup.
 
Use `cat /var/log/syslog | grep cron` to see output from cron-related logs.

## Scheduler

The api now includes a built-in schedule system. It is used by posting to /schedule with
a number of minutes and an api path. The scheduler will recognize when the task is ready to run.
There is a script in scripts/ called processSchedule that is meant to be combined with a
cron job to run frequently (once a minute is good) to check for and process scheduled tasks.

`* * * * * node /home/pi/Node-API-for-Raspberry-Pi-GPIO/scripts/processSchedule.js`
