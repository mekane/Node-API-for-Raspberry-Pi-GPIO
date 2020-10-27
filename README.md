# Node API for Raspberry Pi GPIO pins

The goal of this little projects is to enable a Raspberry Pi to expose a simple web api to get
and set the state of its GPIO pins. It is written in the Express library for Node.js

## Setup for Development

   * `npm install`
   * `npm start`

If you want verbose output for  debugging, run `npm debug` instead.

## Setup and Deploy on a Raspberry Pi

   * Raspbian
   * Install NPM and Node
   * Default checkout location assumed
   * 
   
### Install Node and NPM

### Set up Project

   * Double check permissions

### Set up Service

   * How to add
   * How to manage
sudo service nodeGpio restart
   * How to view logs

 sudo journalctl -u nodeGpio

 ### Set up cron
 
   * How to edit
   * How to troubleshoot
   
   
TODO: add control loop from smoker project, use it for a safety timer on the outlet control
