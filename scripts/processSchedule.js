#! /usr/bin/node

// Init a Scheduler, get tasks to run, attempt to run them and remove any that are done
const path = require('path');
const fetch = require('node-fetch');
const {Scheduler, FilePersistence} = require('../src/Scheduler.js');
let defaultConfig = {
    port: 80,
    scheduleFile: './schedule.json'
}
let customConfig = {};
try {
    const configPath = path.resolve(__dirname, '../config.json');
    customConfig = require(configPath);
} catch (error) {
    console.warn('Warning: missing config.json - using defaults', error)
}
const config = Object.assign(defaultConfig, customConfig);

const apiHost = `http://localhost:${config.port}/`;

const scheduler = Scheduler(FilePersistence(config.scheduleFile));

const currentTime = Date.now();
logTime(currentTime);
processTasks(currentTime);


async function processTasks(currentTime) {
    const tasksToRun = scheduler.getTasksToRun(currentTime);
    const tasksToRemove = [];

    if (tasksToRun.length) {
        const tasks = tasksToRun.map(async function (task) {
            const result = await runTask(task);
            console.log(`  run ${apiHost + task.action.path}: ${result ? 'success' : 'fail'}`);
            if (result)
                tasksToRemove.push(task);
        });
        await Promise.all(tasks);
        console.log('Done running all tasks')

        tasksToRemove.forEach(task => scheduler.removeTask(task.time));
        console.log('removed ' + tasksToRemove.length + ' tasks that successfully ran')
    } else
        console.log('No Tasks To Run')
}

async function runTask(task) {
    const path = task.action.path;
    const response = await fetch(apiHost + path, {method: 'put'})
    try {
        checkStatus(response);
        return true;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
        return false;
    }
}

const checkStatus = response => {
    if (response.ok) {
        // response.status >= 200 && response.status < 300
        return response;
    } else {
        throw new Error(response);
    }
}

function pad(value) {
    const _ = value < 10 ? '0' : '';
    return `${_}${value}`;
}

function logTime(timeMs) {
    const time = new Date(timeMs);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const hours24 = time.getHours();
    const hours = hours24 > 12 ? hours24 - 12 : hours24;
    const minutes = time.getMinutes();
    const ampm = hours24 >= 12 ? 'pm' : 'am';

    console.log('');
    console.log(`==== Process Schedule ${pad(day)}-${pad(month)}-${year} ${pad(hours)}:${pad(minutes)}${ampm} ====`);
    //console.log('time: ' + currentTime)
}
